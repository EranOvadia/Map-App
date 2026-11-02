import type { ReactNode } from 'react'

export const MAX_NAME_LENGTH = 100

export interface UnsavedNameItem {
  id: string
  name: string
  /** Small visual shown before the input (e.g. the object's symbol). */
  icon?: ReactNode
}

interface UnsavedNameListProps {
  items: UnsavedNameItem[]
  /** Placeholder for an empty name; empty names get a default from the server. */
  placeholder: string
  onRename: (id: string, name: string) => void
  onDiscard: (id: string) => void
  disabled?: boolean
}

/** Lets the user name items before they are saved. */
export function UnsavedNameList({ items, placeholder, onRename, onDiscard, disabled }: UnsavedNameListProps) {
  if (items.length === 0) return null

  return (
    <ul className="name-list">
      {items.map((item) => (
        <li key={item.id} className="name-list__item">
          {item.icon && <span className="name-list__icon">{item.icon}</span>}
          <input
            className="name-list__input"
            type="text"
            value={item.name}
            placeholder={placeholder}
            maxLength={MAX_NAME_LENGTH}
            aria-label="Name"
            disabled={disabled}
            // Newly added items mount here, so focus lets the user type the name right away.
            autoFocus
            onChange={(e) => onRename(item.id, e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
          <button
            type="button"
            className="name-list__discard"
            aria-label="Discard unsaved item"
            title="Discard"
            disabled={disabled}
            onClick={() => onDiscard(item.id)}
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}
