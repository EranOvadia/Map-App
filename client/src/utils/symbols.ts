import { divIcon, type DivIcon, type PointTuple } from 'leaflet'
import type { MapObjectType, SymbolKind } from '../types/mapObject'

export type ObjectVisualState = 'saved' | 'unsaved' | 'selected'

export const STATE_COLORS: Record<ObjectVisualState, string> = {
  saved: '#2563eb',
  unsaved: '#f59e0b',
  selected: '#dc2626',
}

export const SYMBOL_LABELS: Record<SymbolKind, string> = {
  star: 'Star',
  triangle: 'Triangle',
  square: 'Square',
  circle: 'Circle',
}

type ShapeKey = SymbolKind | 'pin'

// Shapes drawn in a 24x24 viewBox.
const SHAPES: Record<ShapeKey, (fill: string) => string> = {
  pin: (fill) =>
    `<path d="M12 1.5C7.9 1.5 4.6 4.8 4.6 8.9c0 5.6 7.4 13.6 7.4 13.6s7.4-8 7.4-13.6c0-4.1-3.3-7.4-7.4-7.4z" fill="${fill}" stroke="#fff" stroke-width="1.5"/>` +
    '<circle cx="12" cy="9" r="2.8" fill="#fff"/>',
  star: (fill) =>
    `<polygon points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6" fill="${fill}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`,
  triangle: (fill) =>
    `<polygon points="12,3 22,20.5 2,20.5" fill="${fill}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>`,
  square: (fill) => `<rect x="4" y="4" width="16" height="16" rx="2" fill="${fill}" stroke="#fff" stroke-width="1.5"/>`,
  circle: (fill) => `<circle cx="12" cy="12" r="9" fill="${fill}" stroke="#fff" stroke-width="1.5"/>`,
}

const shapeFor = (type: MapObjectType, symbol: SymbolKind | null): ShapeKey =>
  type === 'Symbol' && symbol ? symbol : 'pin'

/** Inline SVG markup for a shape (static strings only, safe to inject). */
export function shapeSvg(type: MapObjectType, symbol: SymbolKind | null, color: string, size = 20): string {
  const shape = shapeFor(type, symbol)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">${SHAPES[shape](color)}</svg>`
}

const iconCache = new Map<string, DivIcon>()

export function objectIcon(type: MapObjectType, symbol: SymbolKind | null, state: ObjectVisualState): DivIcon {
  const shape = shapeFor(type, symbol)
  const key = `${shape}-${state}`
  const cached = iconCache.get(key)
  if (cached) return cached

  const size = shape === 'pin' ? 34 : 28
  // A pin points at its bottom tip; symbols are centred on the location.
  const anchor: PointTuple = shape === 'pin' ? [size / 2, size - 2] : [size / 2, size / 2]
  const icon = divIcon({
    html: shapeSvg(type, symbol, STATE_COLORS[state], size),
    className: `object-icon object-icon--${state}`,
    iconSize: [size, size],
    iconAnchor: anchor,
    tooltipAnchor: [0, -anchor[1]],
  })
  iconCache.set(key, icon)
  return icon
}
