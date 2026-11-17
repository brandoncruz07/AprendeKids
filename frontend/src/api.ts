export class ApiError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code)
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    ...init,
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers
    }
  })

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new ApiError(response.status, 'INVALID_RESPONSE')
  }
  if (!response.ok) {
    const code = payload && typeof payload === 'object' && 'code' in payload
      && typeof payload.code === 'string'
      ? payload.code
      : 'REQUEST_FAILED'
    throw new ApiError(response.status, code)
  }
  return payload as T
}
