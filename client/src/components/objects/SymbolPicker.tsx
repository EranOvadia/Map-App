import { SYMBOL_KINDS, type SymbolKind } from '../../types/mapObject'
import { STATE_COLORS, SYMBOL_LABELS, shapeSvg } from '../../utils/symbols'

interface SymbolPickerProps {
  value: SymbolKind
  onChange: (symbol: SymbolKind) => void
  disabled?: boolean
}

/** Chooses the symbol of the next placed object. */
export function SymbolPicker({ value, onChange, disabled }: SymbolPickerProps) {
  return (
    <div className="symbol-picker" role="radiogroup" aria-label="Object symbol">
      {SYMBOL_KINDS.map((symbol) => {
        const active = symbol === value
        return (
          <button
            key={symbol}
            type="button"
            role="radio"
            aria-checked={active}
            title={SYMBOL_LABELS[symbol]}
            className={`symbol-picker__option ${active ? 'symbol-picker__option--active' : ''}`}
            onClick={() => onChange(symbol)}
            disabled={disabled}
          >
            <span
              className="symbol-picker__icon"
              // Static SVG generated from constants in utils/symbols.
              dangerouslySetInnerHTML={{ __html: shapeSvg(symbol, STATE_COLORS.saved, 18) }}
            />
            <span className="symbol-picker__label">{SYMBOL_LABELS[symbol]}</span>
          </button>
        )
      })}
    </div>
  )
}
