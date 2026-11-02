import { Fragment, useState } from 'react'
import type { MapObjectItem } from '../../types/mapObject'
import type { MapPolygon } from '../../types/polygon'
import { cachedCentroid, formatCoord } from '../../utils/geoConvert'
import { STATE_COLORS, shapeSvg } from '../../utils/symbols'

interface MapDataTableProps {
  polygons: MapPolygon[]
  objects: MapObjectItem[]
  selectedPolygonIds: string[]
  selectedObjectIds: string[]
  onPolygonClick: (polygon: MapPolygon) => void
  onObjectClick: (object: MapObjectItem) => void
}

export function MapDataTable({
  polygons,
  objects,
  selectedPolygonIds,
  selectedObjectIds,
  onPolygonClick,
  onObjectClick,
}: MapDataTableProps) {
  const [expanded, setExpanded] = useState<string[]>([])

  const toggleExpanded = (id: string) =>
    setExpanded((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Object</th>
          <th className="num">Lat</th>
          <th className="num">Lon</th>
        </tr>
      </thead>
      <tbody>
        {polygons.map((polygon) => {
          const [lon, lat] = cachedCentroid(polygon.ring)
          const isExpanded = expanded.includes(polygon.id)
          const selected = selectedPolygonIds.includes(polygon.id)
          return (
            <Fragment key={polygon.id}>
              <tr
                className={`data-table__row ${selected ? 'data-table__row--selected' : ''}`}
                onClick={() => onPolygonClick(polygon)}
              >
                <td>
                  <button
                    type="button"
                    className="data-table__expand"
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Hide vertices' : 'Show vertices'}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpanded(polygon.id)
                    }}
                  >
                    {isExpanded ? '▾' : '▸'}
                  </button>
                  {polygon.name} <span className="muted">({polygon.ring.length} pts)</span>
                </td>
                <td className="num" title="Centroid">{formatCoord(lat)}</td>
                <td className="num" title="Centroid">{formatCoord(lon)}</td>
              </tr>
              {isExpanded &&
                polygon.ring.map(([vLon, vLat], i) => (
                  <tr key={i} className="data-table__subrow">
                    <td>Vertex {i + 1}</td>
                    <td className="num">{formatCoord(vLat)}</td>
                    <td className="num">{formatCoord(vLon)}</td>
                  </tr>
                ))}
            </Fragment>
          )
        })}
        {objects.map((object) => {
          const [lon, lat] = object.position
          const selected = selectedObjectIds.includes(object.id)
          return (
            <tr
              key={object.id}
              className={`data-table__row ${selected ? 'data-table__row--selected' : ''}`}
              onClick={() => onObjectClick(object)}
            >
              <td>
                <span
                  className="data-table__icon"
                  // Static SVG generated from constants in utils/symbols.
                  dangerouslySetInnerHTML={{
                    __html: shapeSvg(object.symbol, selected ? STATE_COLORS.selected : STATE_COLORS.saved, 14),
                  }}
                />
                {object.name}
              </td>
              <td className="num">{formatCoord(lat)}</td>
              <td className="num">{formatCoord(lon)}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
