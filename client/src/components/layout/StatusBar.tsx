import { useEffect } from 'react'
import { useMapContext } from '../../state/MapContext'

const AUTO_HIDE_MS = 4000

export function StatusBar() {
  const { state, dispatch } = useMapContext()
  const { status } = state

  // Errors stay until dismissed; info/success messages fade out.
  useEffect(() => {
    if (!status || status.kind === 'error') return
    const timer = setTimeout(() => dispatch({ type: 'SET_STATUS', status: null }), AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [status, dispatch])

  if (!status) return null

  return (
    <div className={`status status--${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>
      <span>{status.text}</span>
      <button
        type="button"
        className="status__close"
        aria-label="Dismiss"
        onClick={() => dispatch({ type: 'SET_STATUS', status: null })}
      >
        ×
      </button>
    </div>
  )
}
