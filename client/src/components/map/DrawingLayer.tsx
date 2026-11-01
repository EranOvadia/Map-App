import { useEffect, useState } from 'react'
import type { LatLngTuple } from 'leaflet'
import { CircleMarker, Polyline, Tooltip, useMapEvents } from 'react-leaflet'
import { usePolygonDrawing } from '../../hooks/usePolygonDrawing'
import { toLatLng, toLatLngs } from '../../utils/geoConvert'

const DRAFT_COLOR = '#f59e0b'

/** Renders the polygon being drawn: edges, vertices, a rubber-band line and the closable start point. */
export function DrawingLayer() {
  const { isDrawing, vertices, canClose, complete, cancel } = usePolygonDrawing()
  const [cursor, setCursor] = useState<LatLngTuple | null>(null)

  useMapEvents({
    mousemove: (e) => isDrawing && setCursor([e.latlng.lat, e.latlng.lng]),
    mouseout: () => setCursor(null),
  })

  useEffect(() => {
    if (!isDrawing) return
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && cancel()
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isDrawing, cancel])

  if (!isDrawing || vertices.length === 0) return null

  const latLngs = toLatLngs(vertices)
  const last = latLngs[latLngs.length - 1]

  return (
    <>
      <Polyline positions={latLngs} pathOptions={{ color: DRAFT_COLOR, weight: 3 }} interactive={false} />
      {cursor && (
        <Polyline
          positions={[last, cursor]}
          pathOptions={{ color: DRAFT_COLOR, weight: 2, dashArray: '6 6' }}
          interactive={false}
        />
      )}
      {latLngs.slice(1).map((latLng, i) => (
        <CircleMarker
          key={i}
          center={latLng}
          radius={4}
          pathOptions={{ color: DRAFT_COLOR, fillColor: '#fff', fillOpacity: 1, weight: 2 }}
          interactive={false}
        />
      ))}
      {/* The start vertex closes the polygon; it must not bubble the click to the map (would add a vertex). */}
      <CircleMarker
        center={toLatLng(vertices[0])}
        radius={canClose ? 9 : 6}
        bubblingMouseEvents={false}
        pathOptions={{
          color: DRAFT_COLOR,
          fillColor: canClose ? DRAFT_COLOR : '#fff',
          fillOpacity: canClose ? 0.6 : 1,
          weight: 3,
        }}
        eventHandlers={{ click: () => canClose && complete() }}
      >
        {canClose && <Tooltip direction="top">Click to close polygon</Tooltip>}
      </CircleMarker>
    </>
  )
}
