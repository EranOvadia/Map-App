import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

interface ProblemDetails {
  title?: string
  detail?: string
  errors?: Record<string, string[]>
}

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === 'object' && error !== null && 'status' in error

/** Turns an RTK Query error (usually a server ProblemDetails) into a readable message. */
export function apiErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    if (error.status === 'FETCH_ERROR') return 'Cannot reach the server. Is the API running?'
    if (error.status === 'PARSING_ERROR') return `Request failed (${error.originalStatus})`
    if (typeof error.status === 'number') {
      const problem = error.data as ProblemDetails | undefined
      const fieldErrors = problem?.errors ? Object.values(problem.errors).flat().join(' ') : ''
      return problem?.detail || fieldErrors || problem?.title || `Request failed (${error.status})`
    }
    return String(error.status)
  }
  if (error instanceof Error) return error.message
  return String(error)
}
