import { clearToken, getToken } from './token.ts'

export const API_PREFIX = '/api'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type Method = 'GET' | 'POST' | 'DELETE'

interface RequestOptions {
  method?: Method
  body?: unknown
}

interface ValidationIssue {
  loc: (string | number)[]
  msg: string
}

async function request(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<Response> {
  const token = getToken()
  const headers = new Headers()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (body !== undefined) headers.set('Content-Type', 'application/json')

  let response: Response
  try {
    response = await fetch(API_PREFIX + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'The server is unreachable. Check your connection and try again.')
  }

  if (response.status === 401 && token) {
    clearToken()
    window.location.replace('/login')
  }

  if (!response.ok) {
    throw new ApiError(response.status, await errorMessage(response))
  }
  return response
}

async function errorMessage(response: Response): Promise<string> {
  const data = await response.json().catch(() => null)
  const detail = data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return (detail as ValidationIssue[]).map((issue) => `${issue.loc.at(-1)}: ${issue.msg}`).join('; ')
  }
  return `Request failed with status ${response.status}.`
}

export async function apiFetch<T>(path: string, options?: RequestOptions): Promise<T> {
  const response = await request(path, options)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function apiBlob(path: string): Promise<Blob> {
  const response = await request(path)
  return response.blob()
}
