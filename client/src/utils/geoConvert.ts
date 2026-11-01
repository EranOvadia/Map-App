import type { LatLngTuple } from 'leaflet'
import type { Position } from '../types/geo'

// The only place that converts between GeoJSON [lon, lat] and Leaflet [lat, lon].

export const toLatLng = ([lon, lat]: Position): LatLngTuple => [lat, lon]

export const toPosition = (latlng: { lat: number; lng: number }): Position => [latlng.lng, latlng.lat]

export const toLatLngs = (ring: Position[]): LatLngTuple[] => ring.map(toLatLng)

const samePosition = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1]

/** Returns the ring closed (first === last), as GeoJSON requires. */
export function closeRing(ring: Position[]): Position[] {
  if (ring.length === 0) return ring
  return samePosition(ring[0], ring[ring.length - 1]) ? ring : [...ring, ring[0]]
}

/** Returns the ring without its closing position. */
export function openRing(ring: Position[]): Position[] {
  if (ring.length > 1 && samePosition(ring[0], ring[ring.length - 1])) return ring.slice(0, -1)
  return ring
}

/** Area-weighted centroid of an open ring (planar); falls back to the vertex average. */
export function centroid(ring: Position[]): Position {
  const pts = openRing(ring)
  let area = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % pts.length]
    const cross = x1 * y2 - x2 * y1
    area += cross
    cx += (x1 + x2) * cross
    cy += (y1 + y2) * cross
  }
  if (Math.abs(area) < 1e-12) {
    const sum = pts.reduce<Position>((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0])
    return [sum[0] / pts.length, sum[1] / pts.length]
  }
  return [cx / (3 * area), cy / (3 * area)]
}

export const formatCoord = (value: number) => value.toFixed(6)
