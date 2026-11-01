import type { PointGeometry, Position } from './geo'

export type MapObjectType = 'Marker' | 'Symbol'

export const SYMBOL_KINDS = ['star', 'triangle', 'square', 'circle'] as const
export type SymbolKind = (typeof SYMBOL_KINDS)[number]

/** Object as returned by the API. */
export interface MapObjectDto {
  id: string
  name: string
  type: MapObjectType
  symbol: SymbolKind | null
  createdAt: string
  geometry: PointGeometry
}

export interface SaveMapObjectItem {
  name?: string | null
  type: MapObjectType
  symbol: SymbolKind | null
  geometry: PointGeometry
}

/** What the next placed object will look like. */
export interface ObjectTemplate {
  type: MapObjectType
  symbol: SymbolKind | null
}

/** Object as held in client state. */
export interface MapObjectItem {
  /** Server id when saved, temporary client id otherwise. */
  id: string
  name: string
  type: MapObjectType
  symbol: SymbolKind | null
  /** GeoJSON [lon, lat]. */
  position: Position
  isSaved: boolean
}
