import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { IncomingMessage, ServerResponse } from 'node:http'
import { ParentAccount, ParentAccountDocument, Session, SessionDocument } from './models.js'

export const SESSION_COOKIE = 'ak_session'
export const SESSION_DURATION_SECONDS = 7 * 24 * 60 * 60

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function sessionToken(request: IncomingMessage) {
  const cookies = request.headers.cookie?.split(';') ?? []
  const sessionCookie = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`))
  if (!sessionCookie) return null
  const value = sessionCookie.slice(SESSION_COOKIE.length + 1)
  try {
    return decodeURIComponent(value) || null
  } catch {
    return null
  }
}

export function setSessionCookie(response: ServerResponse, token: string) {
  const secure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true'
  response.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    `Max-Age=${SESSION_DURATION_SECONDS}`,
    ...(secure ? ['Secure'] : [])
  ].join('; '))
}

export function clearSessionCookie(response: ServerResponse) {
  const secure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true'
  response.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=`,
    'HttpOnly',
    'SameSite=Lax',
    'Path=/',
    'Max-Age=0',
    ...(secure ? ['Secure'] : [])
  ].join('; '))
}

export async function createSession(accountId: string) {
  const token = randomBytes(32).toString('base64url')
  await Session.create({
    accountId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_DURATION_SECONDS * 1000)
  })
  return token
}

export async function destroySession(request: IncomingMessage) {
  const token = sessionToken(request)
  if (token) await Session.deleteOne({ tokenHash: hashToken(token) })
}

export async function authenticate(request: IncomingMessage) {
  const token = sessionToken(request)
  if (!token) return null
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() }
  })
  if (!session) return null
  const account = await ParentAccount.findById(session.accountId).select('+passwordHash')
  if (!account) {
    await Session.deleteOne({ _id: session._id })
    return null
  }
  return { account, session }
}

export async function verifyPassword(account: ParentAccountDocument, password: string) {
  return bcrypt.compare(password, account.passwordHash)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function reauthenticate(session: SessionDocument) {
  session.reauthUntil = new Date(Date.now() + 5 * 60 * 1000)
  await session.save()
}

export function isReauthenticated(session: SessionDocument) {
  return Boolean(session.reauthUntil && session.reauthUntil.getTime() > Date.now())
}

export function publicAccount(account: ParentAccountDocument) {
  return {
    id: account._id.toString(),
    name: account.name,
    email: account.email,
    kids: account.kids.map((kid) => ({
      id: kid.id,
      name: kid.name,
      age: kid.age,
      char: kid.char,
      stars: kid.stars,
      coins: kid.coins,
      acc: kid.acc,
      bgs: kid.bgs,
      eqAcc: kid.eqAcc,
      bg: kid.bg,
      attempts: kid.attempts,
      completedLevels: kid.completedLevels,
      aiEnabled: kid.aiEnabled,
      voiceEnabled: kid.voiceEnabled,
      speechRate: kid.speechRate
    }))
  }
}

export async function loadAccountForLogin(email: string) {
  return ParentAccount.findOne({ email }).select('+passwordHash')
}
