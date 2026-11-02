import { useMemo } from 'react'
import type { PathOptions } from 'leaflet'
import { Polygon, Tooltip } from 'react-leaflet'
import { useSavedPolygons } from '../../hooks/useSavedData'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { togglePolygonSelection } from '../../store/slices/polygonsSlice'
import type { MapPolygon } from '../../types/polygon'
import { toLatLngs } from '../../utils/geoConvert'
import { displayName } from '../../utils/names'

function styleFor(polygon: MapPolygon, selected: boolean): PathOptions {
  if (selected) return { color: '#dc2626', weight: 4, fillOpacity: 0.3 }
  if (!polygon.isSaved) return { color: '#f59e0b', weight: 3, dashArray: '8 6', fillOpacity: 0.2 }
  return { color: '#2563eb', weight: 2, fillOpacity: 0.2 }
}

export function PolygonLayer() {
  const dispatch = useAppDispatch()
  const saved = useSavedPolygons()
  const unsaved = useAppSelector((state) => state.polygons.unsaved)
  const selectedIds = useAppSelector((state) => state.polygons.selectedIds)
  const mode = useAppSelector((state) => state.ui.mode)
  const polygons = useMemo(() => [...saved, ...unsaved], [saved, unsaved])

  return (
    <>
      {polygons.map((polygon) => {
        const selected = selectedIds.includes(polygon.id)
        return (
          <Polygon
            key={polygon.id}
            positions={toLatLngs(polygon.ring)}
            pathOptions={styleFor(polygon, selected)}
            eventHandlers={{
              click: () => {
                // In draw/add modes the click falls through to the map instead.
                if (mode === 'idle') dispatch(togglePolygonSelection(polygon.id))
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
