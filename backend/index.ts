import 'dotenv/config'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'
import {
  CompanionInput,
  containsPersonalInfo,
  generateCompanionReply,
  parseCompanionInput,
  privacyReply
} from './companion.js'
import { connectDatabase, databaseConnected } from './db.js'
import { ParentAccount, ParentAccountDocument } from './models.js'
import {
  authenticate,
  clearSessionCookie,
  createSession,
  destroySession,
  hashPassword,
  isReauthenticated,
  loadAccountForLogin,
  publicAccount,
  reauthenticate,
  setSessionCookie,
  verifyPassword
} from './security.js'
import { sanitizeKid, sanitizeKidPatch, sanitizeLegacyKids } from './kids.js'

const host = process.env.API_HOST ?? '127.0.0.1'
const port = Number(process.env.API_PORT ?? 3001)
const allowedOrigin = process.env.WEB_ORIGIN ?? 'http://127.0.0.1:5173'
const rateLimits = new Map<string, { count: number; resetAt: number }>()

class HttpError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code)
  }
}

function sendJson(response: ServerResponse, status: number, payload: Record<string, unknown>) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  })
  response.end(JSON.stringify(payload))
}

function applyCors(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Vary', 'Origin')
  const origin = request.headers.origin
  if (origin && origin !== allowedOrigin) return false
  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', allowedOrigin)
    response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  }
  return true
}

async function readJson(request: IncomingMessage) {
  const chunks: Buffer[] = []
  let length = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    length += buffer.length
    if (length > 1_000_000) throw new HttpError(413, 'REQUEST_TOO_LARGE')
    chunks.push(buffer)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
  } catch {
    throw new HttpError(400, 'INVALID_JSON')
  }
}

function requireJson(request: IncomingMessage) {
  if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'JSON_REQUIRED')
  }
}

function allowRequest(key: string, maximum = 10) {
  const now = Date.now()
  for (const [entry, limit] of rateLimits) {
    if (limit.resetAt <= now) rateLimits.delete(entry)
  }
  const current = rateLimits.get(key)
  if (!current || current.resetAt <= now) {
    if (rateLimits.size >= 10_000) return false
    rateLimits.set(key, { count: 1, resetAt: now + 60_000 })
    return true
  }
  if (current.count >= maximum) return false
  current.count += 1
  return true
}

function getClientIp(request: IncomingMessage) {
  return request.socket.remoteAddress ?? 'unknown'
}

function stringField(value: unknown, maximum: number) {
  return typeof value === 'string' && value.trim().length <= maximum ? value.trim() : ''
}

function validateCredentials(body: unknown) {
  if (!body || typeof body !== 'object') throw new HttpError(400, 'INVALID_REQUEST')
  const record = body as Record<string, unknown>
  const email = stringField(record.email, 254).toLowerCase()
  const password = typeof record.password === 'string' ? record.password : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 128) {
    throw new HttpError(400, 'INVALID_CREDENTIALS')
  }
  return { record, email, password }
}

async function connectOrFail() {
  try {
    await connectDatabase()
  } catch {
    throw new HttpError(503, 'DATABASE_UNAVAILABLE')
  }
}

async function requireAuth(request: IncomingMessage, response: ServerResponse) {
  const result = await authenticate(request)
  if (!result) {
    sendJson(response, 401, { code: 'UNAUTHENTICATED' })
    return null
  }
  return result
}

function findKid(account: ParentAccountDocument, kidId: string) {
  return account.kids.find((kid) => kid.id === kidId)
}

function aiAvailable() {
  return process.env.ENABLE_CHILD_AI === 'true' && Boolean(process.env.OPENAI_API_KEY)
}

async function handleCompanion(input: CompanionInput, request: IncomingMessage, response: ServerResponse) {
  const auth = await requireAuth(request, response)
  if (!auth) return
  const kid = findKid(auth.account, input.kidId)
  if (!kid) {
    sendJson(response, 404, { code: 'PROFILE_NOT_FOUND' })
    return
  }
  if (!kid.aiEnabled) {
    sendJson(response, 403, { code: 'PROFILE_AI_DISABLED' })
    return
  }
  const apiKey = process.env.OPENAI_API_KEY
  if (process.env.ENABLE_CHILD_AI !== 'true' || !apiKey) {
    sendJson(response, 503, { code: 'AI_UNAVAILABLE' })
    return
  }
  if (containsPersonalInfo(input.message)) {
    sendJson(response, 200, { reply: privacyReply(input.language) })
    return
  }
  if (!allowRequest(`ai:${auth.account.id}`, 20)) {
    sendJson(response, 429, { code: 'RATE_LIMITED' })
    return
  }

  try {
    const reply = await generateCompanionReply(input, {
      apiKey,
      model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini'
    })
    sendJson(response, 200, { reply })
  } catch (error) {
    const status = error && typeof error === 'object' && 'status' in error
      ? Number((error as { status: unknown }).status)
      : 0
    console.error(`Companion provider request failed (status ${status || 'network'}).`)
    sendJson(response, 502, { code: 'AI_UNAVAILABLE' })
  }
}

async function handleRequest(request: IncomingMessage, response: ServerResponse) {
  if (!applyCors(request, response)) {
    sendJson(response, 403, { code: 'ORIGIN_NOT_ALLOWED' })
    return
  }
  if (request.method === 'OPTIONS') {
    response.writeHead(204)
    response.end()
    return
  }

  const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
  if (request.method === 'GET' && url.pathname === '/api/health') {
    let dbAvailable = databaseConnected()
    if (!dbAvailable && process.env.MONGODB_URI) {
      try {
        await connectDatabase()
        dbAvailable = true
      } catch {
        dbAvailable = false
      }
    }
    sendJson(response, 200, { ok: true, dbAvailable, aiAvailable: dbAvailable && aiAvailable() })
    return
  }

  if (request.method === 'POST' && (url.pathname === '/api/auth/register' || url.pathname === '/api/auth/login')) {
    requireJson(request)
    if (!allowRequest(`auth:${getClientIp(request)}`, 8)) {
      throw new HttpError(429, 'RATE_LIMITED')
    }
    const { record, email, password } = validateCredentials(await readJson(request))
    await connectOrFail()

    if (url.pathname === '/api/auth/register') {
      const name = stringField(record.name, 60)
      if (name.length < 2 || record.guardianConsent !== true) {
        throw new HttpError(400, 'GUARDIAN_CONSENT_REQUIRED')
      }
      const legacyKids = record.legacyKids === undefined ? [] : sanitizeLegacyKids(record.legacyKids)
      if (!legacyKids) throw new HttpError(400, 'INVALID_LEGACY_DATA')
      const existing = await ParentAccount.exists({ email })
      if (existing) throw new HttpError(409, 'ACCOUNT_EXISTS')
      const account = await ParentAccount.create({
        name,
        email,
        passwordHash: await hashPassword(password),
        kids: legacyKids,
        legacyImported: legacyKids.length > 0,
        guardianConsentAt: new Date()
      })
      setSessionCookie(response, await createSession(account.id))
      sendJson(response, 201, { account: publicAccount(account), migrated: legacyKids.length > 0 })
      return
    }

    const account = await loadAccountForLogin(email)
    if (!account || !(await verifyPassword(account, password))) {
      throw new HttpError(401, 'INVALID_CREDENTIALS')
    }
    let migrated = false
    if (record.importLegacy === true && !account.legacyImported && account.kids.length === 0) {
      const legacyKids = sanitizeLegacyKids(record.legacyKids)
      if (!legacyKids) throw new HttpError(400, 'INVALID_LEGACY_DATA')
      account.kids = legacyKids
      account.legacyImported = legacyKids.length > 0
      if (legacyKids.length > 0) {
        await account.save()
        migrated = true
      }
    }
    setSessionCookie(response, await createSession(account.id))
    sendJson(response, 200, { account: publicAccount(account), migrated })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/logout') {
    if (process.env.MONGODB_URI) {
      await connectOrFail()
      await destroySession(request)
    }
    clearSessionCookie(response)
    sendJson(response, 200, { ok: true })
    return
  }

  await connectOrFail()

  if (request.method === 'GET' && url.pathname === '/api/auth/me') {
    const auth = await requireAuth(request, response)
    if (auth) sendJson(response, 200, { account: publicAccount(auth.account) })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/auth/reauth') {
    requireJson(request)
    const auth = await requireAuth(request, response)
    if (!auth) return
    const body = await readJson(request)
    const password = body && typeof body === 'object' && typeof (body as Record<string, unknown>).password === 'string'
      ? (body as Record<string, string>).password
      : ''
    if (!(await verifyPassword(auth.account, password))) {
      throw new HttpError(401, 'INVALID_CREDENTIALS')
    }
    await reauthenticate(auth.session)
    sendJson(response, 200, { ok: true })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/kids') {
    requireJson(request)
    const auth = await requireAuth(request, response)
    if (!auth) return
    const kid = sanitizeKid(await readJson(request))
    if (!kid || auth.account.kids.some((existing) => existing.id === kid.id)) {
      throw new HttpError(400, 'INVALID_PROFILE')
    }
    auth.account.kids.push(kid)
    await auth.account.save()
    sendJson(response, 201, { account: publicAccount(auth.account) })
    return
  }

  const kidPath = url.pathname.match(/^\/api\/kids\/([\w-]{1,64})$/)
  if (request.method === 'PATCH' && kidPath) {
    requireJson(request)
    const auth = await requireAuth(request, response)
    if (!auth) return
    const index = auth.account.kids.findIndex((kid) => kid.id === kidPath[1])
    if (index < 0) throw new HttpError(404, 'PROFILE_NOT_FOUND')
    const kid = sanitizeKidPatch(await readJson(request), auth.account.kids[index])
    if (!kid) throw new HttpError(400, 'INVALID_PROFILE')
    auth.account.kids[index] = kid
    await auth.account.save()
    sendJson(response, 200, { account: publicAccount(auth.account) })
    return
  }

  const aiPath = url.pathname.match(/^\/api\/kids\/([\w-]{1,64})\/ai$/)
  if (request.method === 'PATCH' && aiPath) {
    requireJson(request)
    const auth = await requireAuth(request, response)
    if (!auth) return
    if (!isReauthenticated(auth.session)) throw new HttpError(403, 'REAUTH_REQUIRED')
    const body = await readJson(request)
    if (!body || typeof body !== 'object' || typeof (body as Record<string, unknown>).enabled !== 'boolean') {
      throw new HttpError(400, 'INVALID_REQUEST')
    }
    const kid = findKid(auth.account, aiPath[1])
    if (!kid) throw new HttpError(404, 'PROFILE_NOT_FOUND')
    const enabled = (body as { enabled: boolean }).enabled
    if (enabled && !aiAvailable()) throw new HttpError(503, 'AI_UNAVAILABLE')
    kid.aiEnabled = enabled
    await auth.account.save()
    sendJson(response, 200, { account: publicAccount(auth.account) })
    return
  }

  if (request.method === 'POST' && url.pathname === '/api/companion') {
    requireJson(request)
    const input = parseCompanionInput(await readJson(request))
    if (!input) throw new HttpError(400, 'INVALID_REQUEST')
    await handleCompanion(input, request, response)
    return
  }

  sendJson(response, 404, { code: 'NOT_FOUND' })
}

const server = createServer((request, response) => {
  void handleRequest(request, response).catch((error: unknown) => {
    if (error instanceof HttpError) {
      sendJson(response, error.status, { code: error.code })
      return
    }
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      sendJson(response, 409, { code: 'ACCOUNT_EXISTS' })
      return
    }
    console.error('AprendeKids API request failed.')
    sendJson(response, 500, { code: 'INTERNAL_ERROR' })
  })
})

server.listen(port, host, () => {
  console.log(`AprendeKids API listening on http://${host}:${port}`)
})
