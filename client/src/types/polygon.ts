import type { LatLngTuple } from 'leaflet'
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
  /**
   * The same ring in Leaflet [lat, lon] order, converted once when the polygon enters the app.
   * Its reference stays stable, so react-leaflet skips setLatLngs() on unrelated re-renders.
   */
  latLngs: LatLngTuple[]
  isSaved: boolean
}
