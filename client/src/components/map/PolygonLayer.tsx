import type { PathOptions } from 'leaflet'
import { Polygon, Tooltip } from 'react-leaflet'
import { useMapContext } from '../../state/MapContext'
import type { MapPolygon } from '../../types/polygon'
import { toLatLngs } from '../../utils/geoConvert'
import { displayName } from '../../utils/names'

function styleFor(polygon: MapPolygon, selected: boolean): PathOptions {
  if (selected) return { color: '#dc2626', weight: 4, fillOpacity: 0.3 }
  if (!polygon.isSaved) return { color: '#f59e0b', weight: 3, dashArray: '8 6', fillOpacity: 0.2 }
  return { color: '#2563eb', weight: 2, fillOpacity: 0.2 }
}

export function PolygonLayer() {
  const { state, dispatch } = useMapContext()

  return (
    <>
      {state.polygons.map((polygon) => {
        const selected = state.selectedPolygonIds.includes(polygon.id)
        return (
          <Polygon
            key={polygon.id}
            positions={toLatLngs(polygon.ring)}
            pathOptions={styleFor(polygon, selected)}
            eventHandlers={{
              click: () => {
                // In draw/add modes the click falls through to the map instead.
                if (state.mode === 'idle') dispatch({ type: 'TOGGLE_POLYGON_SELECTION', id: polygon.id })
              },
            }}
          >
            <Tooltip sticky>
              {displayName(polygon.name, 'Unnamed polygon')}
              {!polygon.isSaved && ' (unsaved)'}
            </Tooltip>
          </Polygon>
        )
      })}
    </>
  )
}
