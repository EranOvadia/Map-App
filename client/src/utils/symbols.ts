import { divIcon, type DivIcon, type PointTuple } from 'leaflet'
import type { SymbolKind } from '../types/mapObject'

export type ObjectVisualState = 'saved' | 'unsaved' | 'selected'

export const STATE_COLORS: Record<ObjectVisualState, string> = {
  saved: '#2563eb',
  unsaved: '#f59e0b',
  selected: '#dc2626',
}

export const SYMBOL_LABELS: Record<SymbolKind, string> = {
  marker: 'Marker',
  star: 'Star',
  triangle: 'Triangle',
  square: 'Square',
  circle: 'Circle',
  jeep: 'Jeep',
}

const OUTLINE = 'stroke="#fff" stroke-width="1.5" stroke-linejoin="round"'

// Shapes drawn in a 24x24 viewBox, filled with the state colour.
const SHAPES: Record<SymbolKind, (fill: string) => string> = {
  marker: (fill) =>
    `<path d="M12 1.5C7.9 1.5 4.6 4.8 4.6 8.9c0 5.6 7.4 13.6 7.4 13.6s7.4-8 7.4-13.6c0-4.1-3.3-7.4-7.4-7.4z" fill="${fill}" ${OUTLINE}/>` +
    '<circle cx="12" cy="9" r="2.8" fill="#fff"/>',
  star: (fill) =>
    `<polygon points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6" fill="${fill}" ${OUTLINE}/>`,
  triangle: (fill) => `<polygon points="12,3 22,20.5 2,20.5" fill="${fill}" ${OUTLINE}/>`,
  square: (fill) => `<rect x="4" y="4" width="16" height="16" rx="2" fill="${fill}" ${OUTLINE}/>`,
  circle: (fill) => `<circle cx="12" cy="12" r="9" fill="${fill}" ${OUTLINE}/>`,
  // Side view: body with a raised cabin, windshield, spare wheel at the back, two wheels.
  jeep: (fill) =>
    `<path d="M2.5 16V11.2c0-.7.5-1.2 1.2-1.2h3l2-3.6c.2-.3.5-.5.9-.5h5.2c.4 0 .8.3.9.7L16.8 10h3.5c.7 0 1.2.5 1.2 1.2V16z" fill="${fill}" ${OUTLINE}/>` +
    '<path d="M9.9 7.3h4.6l.9 2.7H8.4z" fill="#fff" opacity=".9"/>' +
    `<rect x="21" y="10.6" width="1.8" height="4.2" rx=".9" fill="#1f2937" ${OUTLINE}/>` +
    `<circle cx="7" cy="16.3" r="2.6" fill="#1f2937" ${OUTLINE}/><circle cx="7" cy="16.3" r=".9" fill="#fff"/>` +
    `<circle cx="17" cy="16.3" r="2.6" fill="#1f2937" ${OUTLINE}/><circle cx="17" cy="16.3" r=".9" fill="#fff"/>`,
}

/** Inline SVG markup for a symbol (static strings only, safe to inject). */
export function shapeSvg(symbol: SymbolKind, color: string, size = 20): string {
  const draw = SHAPES[symbol] ?? SHAPES.marker
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${draw(color)}</svg>`
}

const iconCache = new Map<string, DivIcon>()

export function objectIcon(symbol: SymbolKind, state: ObjectVisualState): DivIcon {
  const key = `${symbol}-${state}`
  const cached = iconCache.get(key)
  if (cached) return cached

  const isPin = symbol === 'marker'
  const size = isPin ? 34 : symbol === 'jeep' ? 32 : 28
  // A pin points at its bottom tip; other symbols are centred on the location.
  const anchor: PointTuple = isPin ? [size / 2, size - 2] : [size / 2, size / 2]
  const icon = divIcon({
    html: shapeSvg(symbol, STATE_COLORS[state], size),
    className: `object-icon object-icon--${state}`,
    iconSize: [size, size],
    iconAnchor: anchor,
    tooltipAnchor: [0, -anchor[1]],
  })
  iconCache.set(key, icon)
  return icon
}
