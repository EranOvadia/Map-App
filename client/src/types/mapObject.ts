import type { PointGeometry, Position } from './geo'

/** How an object is drawn. "marker" is the classic map pin. Must match the server's MapSymbols. */
export const SYMBOL_KINDS = ['marker', 'star', 'triangle', 'square', 'circle', 'jeep'] as const
export type SymbolKind = (typeof SYMBOL_KINDS)[number]

/** Object as returned by the API. */
export interface MapObjectDto {
  id: string
  name: string
  symbol: SymbolKind
  createdAt: string
  geometry: PointGeometry
}

export interface SaveMapObjectItem {
  name?: string | null
  symbol: SymbolKind
  geometry: PointGeometry
}

/** Object as held in client state. */
export interface MapObjectItem {
  /** Server id when saved, temporary client id otherwise. */
  id: string
  name: string
  symbol: SymbolKind
  /** GeoJSON [lon, lat]. */
  position: Position
  isSaved: boolean
}
