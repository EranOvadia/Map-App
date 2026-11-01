import { SYMBOL_KINDS, type ObjectTemplate } from '../../types/mapObject'
import { STATE_COLORS, SYMBOL_LABELS, shapeSvg } from '../../utils/symbols'

interface SymbolPickerProps {
  value: ObjectTemplate
  onChange: (template: ObjectTemplate) => void
  disabled?: boolean
}

const OPTIONS: Array<ObjectTemplate & { label: string }> = [
  { type: 'Marker', symbol: null, label: 'Marker' },
  ...SYMBOL_KINDS.map((symbol) => ({ type: 'Symbol' as const, symbol, label: SYMBOL_LABELS[symbol] })),
]

const isSame = (a: ObjectTemplate, b: ObjectTemplate) => a.type === b.type && a.symbol === b.symbol

/** Chooses what the next placed object looks like: a marker or a custom symbol. */
export function SymbolPicker({ value, onChange, disabled }: SymbolPickerProps) {
  return (
    <div className="symbol-picker" role="radiogroup" aria-label="Object type">
      {OPTIONS.map((option) => {
        const active = isSame(option, value)
        return (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.label}
            className={`symbol-picker__option ${active ? 'symbol-picker__option--active' : ''}`}
            onClick={() => onChange({ type: option.type, symbol: option.symbol })}
            disabled={disabled}
          >
            <span
              className="symbol-picker__icon"
              // Static SVG generated from constants in utils/symbols.
              dangerouslySetInnerHTML={{ __html: shapeSvg(option.type, option.symbol, STATE_COLORS.saved, 18) }}
            />
            <span className="symbol-picker__label">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
