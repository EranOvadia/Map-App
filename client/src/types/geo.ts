/** GeoJSON position: [longitude, latitude]. */
export type Position = [number, number]

export interface PointGeometry {
  type: 'Point'
  coordinates: Position
}

export interface PolygonGeometry {
  type: 'Polygon'
  /** Rings; the first is the outer ring and is closed (first === last). */
  coordinates: Position[][]
}
