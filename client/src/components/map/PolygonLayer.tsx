import { useMemo } from 'react'
import type { PathOptions } from 'leaflet'
import { Polygon, Tooltip } from 'react-leaflet'
import { useSavedPolygons } from '../../hooks/useSavedData'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { togglePolygonSelection } from '../../store/slices/polygonsSlice'
import type { MapPolygon } from '../../types/polygon'
import { displayName } from '../../utils/names'

// One object per visual state, created once. Each lists every property we vary, because
// Leaflet's setStyle() merges into the previous options: a property left out (e.g. dashArray)
// would keep its old value. Stable references also mean react-leaflet only calls setStyle()
// on a polygon whose state actually changed.
const POLYGON_STYLES = {
  saved: { color: '#2563eb', fillColor: '#2563eb', weight: 2, dashArray: undefined, fillOpacity: 0.2 },
  unsaved: { color: '#f59e0b', fillColor: '#f59e0b', weight: 3, dashArray: '8 6', fillOpacity: 0.2 },
  selected: { color: '#dc2626', fillColor: '#dc2626', weight: 4, dashArray: undefined, fillOpacity: 0.3 },
} satisfies Record<string, PathOptions>

function styleFor(polygon: MapPolygon, selected: boolean): PathOptions {
  if (selected) return POLYGON_STYLES.selected
  return polygon.isSaved ? POLYGON_STYLES.saved : POLYGON_STYLES.unsaved
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
            // Stored, not converted here: a new array each render would make react-leaflet
            // call setLatLngs() and redraw every polygon.
            positions={polygon.latLngs}
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
