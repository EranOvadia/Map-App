import type { PolygonGeometry, Position } from './geo'

/** Polygon as returned by the API. */
export interface PolygonDto {
  id: string
  name: string
  createdAt: string
  geometry: PolygonGeometry
}

export interface CreatePolygonRequest {
  name?: string | null
  geometry: PolygonGeometry
}

/** Polygon as held in client state. */
export interface MapPolygon {
  /** Server id when saved, temporary client id otherwise. */
  id: string
  name: string
  /** Open outer ring in GeoJSON [lon, lat] order. */
  ring: Position[]
  isSaved: boolean
}
