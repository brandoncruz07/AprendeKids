import { describe, expect, it } from 'vitest'
import {
  CompanionInput,
  containsPersonalInfo,
  generateCompanionReply,
  parseCompanionInput,
  safetyReply
} from './companion'

const input: CompanionInput = {
  kidId: 'kid-1',
  message: 'Can you suggest a word game?',
  language: 'en',
  ageBand: '5-6',
  worldId: 'letters',
  activity: 'word'
}

function response(payload: unknown) {
  return new Response(JSON.stringify(payload), { status: 200 })
}

describe('companion API safeguards', () => {
  it('accepts only validated fields and rejects oversized messages', () => {
    expect(parseCompanionInput({ ...input, childName: 'not sent' })).toEqual(input)
    expect(parseCompanionInput({ ...input, message: 'x'.repeat(201) })).toBeNull()
    expect(parseCompanionInput({ ...input, language: 'unknown' })).toBeNull()
  })

  it('detects common personal details before forwarding a message', () => {
    expect(containsPersonalInfo('My email is child@example.com')).toBe(true)
    expect(containsPersonalInfo('Me llamo Ana')).toBe(true)
    expect(containsPersonalInfo('Can we play a memory game?')).toBe(false)
  })

  it('uses moderation, disables response storage, and moderates the reply', async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []
    const fetcher: typeof fetch = async (url, init) => {
      const requestUrl = String(url)
      calls.push({ url: requestUrl, init })
      if (requestUrl.endsWith('/moderations')) return response({ results: [{ flagged: false }] })
      return response({
        output: [{
          type: 'message',
          content: [{ type: 'output_text', text: 'Let’s build a word with letter cards!' }]
        }]
      })
    }

    const reply = await generateCompanionReply(input, {
      apiKey: 'test-key',
      model: 'test-model',
      fetcher
    })

    expect(reply).toContain('letter cards')
    expect(calls.map((call) => call.url.split('/').pop())).toEqual(['moderations', 'responses', 'moderations'])
    expect(JSON.parse(String(calls[1].init?.body))).toMatchObject({ store: false, model: 'test-model' })
  })

  it('does not generate a reply when moderation flags the child message', async () => {
    let responseCalls = 0
    const fetcher: typeof fetch = async () => {
      responseCalls += 1
      return response({ results: [{ flagged: true }] })
    }

    const reply = await generateCompanionReply(input, {
      apiKey: 'test-key',
      model: 'test-model',
      fetcher
    })

    expect(reply).toBe(safetyReply('en'))
    expect(responseCalls).toBe(1)
  })
})
