const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  let message = `Request failed (${response.status} ${response.statusText})`
  try {
    const problem = (await response.json()) as ProblemDetails
    const fieldErrors = problem.errors ? Object.values(problem.errors).flat().join(' ') : ''
    message = problem.detail || fieldErrors || problem.title || message
  } catch {
    // Body was not JSON; keep the generic message.
  }
  return new ApiError(response.status, message)
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Is the API running?')
  }

  if (!response.ok) throw await toApiError(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export const httpClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  delete: (path: string) => request<void>('DELETE', path),
}

export const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error))
