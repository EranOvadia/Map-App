import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  /** Short text on the right side of the header (e.g. counts). */
  meta?: ReactNode
  className?: string
  children: ReactNode
}

export function Panel({ title, meta, className, children }: PanelProps) {
  return (
    <section className={`panel ${className ?? ''}`}>
      <header className="panel__header">
        <h2 className="panel__title">{title}</h2>
        {meta && <span className="panel__meta">{meta}</span>}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  )
}
