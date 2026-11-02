import { useSavedObjects, useSavedPolygons } from '../../hooks/useSavedData'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleObjectSelection } from '../../store/slices/objectsSlice'
import { togglePolygonSelection } from '../../store/slices/polygonsSlice'
import { focusBounds, focusPoint } from '../../store/slices/uiSlice'
import type { MapObjectItem } from '../../types/mapObject'
import type { MapPolygon } from '../../types/polygon'
import { Panel } from '../layout/Panel'
import { MapDataTable } from './MapDataTable'

/**
 * Table of everything saved in the database; clicking a row selects it and moves the map to it.
 * Re-renders only when the saved lists or the selections change.
 */
export function MapDataPanel() {
  const dispatch = useAppDispatch()
  const polygons = useSavedPolygons()
  const objects = useSavedObjects()
  const selectedPolygonIds = useAppSelector((state) => state.polygons.selectedIds)
  const selectedObjectIds = useAppSelector((state) => state.objects.selectedIds)

  const onPolygonClick = (polygon: MapPolygon) => {
    dispatch(togglePolygonSelection(polygon.id))
    dispatch(focusBounds(polygon.ring))
  }

  const onObjectClick = (object: MapObjectItem) => {
    dispatch(toggleObjectSelection(object.id))
    dispatch(focusPoint(object.position))
  }

  const isEmpty = polygons.length === 0 && objects.length === 0

  return (
    <Panel
      title="Map Data"
      className="panel--map-data"
      meta={`${polygons.length} polygon(s) · ${objects.length} object(s)`}
    >
      {isEmpty ? (
        <p className="muted">Nothing saved yet. Saved polygons and objects appear here.</p>
      ) : (
        <MapDataTable
          polygons={polygons}
          objects={objects}
          selectedPolygonIds={selectedPolygonIds}
          selectedObjectIds={selectedObjectIds}
          onPolygonClick={onPolygonClick}
          onObjectClick={onObjectClick}
        />
      )}
    </Panel>
  )
}
