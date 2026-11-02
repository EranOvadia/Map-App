import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setStatus } from '../../store/slices/uiSlice'

const AUTO_HIDE_MS = 4000

export function StatusBar() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.ui.status)

  // Errors stay until dismissed; info/success messages fade out.
  useEffect(() => {
    if (!status || status.kind === 'error') return
    const timer = setTimeout(() => dispatch(setStatus(null)), AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [status, dispatch])

  if (!status) return null

  return (
    <div className={`status status--${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>
      <span>{status.text}</span>
      <button type="button" className="status__close" aria-label="Dismiss" onClick={() => dispatch(setStatus(null))}>
        ×
      </button>
    </div>
  )
}
