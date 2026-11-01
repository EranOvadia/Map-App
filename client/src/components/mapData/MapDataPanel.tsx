import { useMapContext } from '../../state/MapContext'
import type { MapObjectItem } from '../../types/mapObject'
import type { MapPolygon } from '../../types/polygon'
import { Panel } from '../layout/Panel'
import { MapDataTable } from './MapDataTable'

/** Table of everything saved in the database; clicking a row selects it and moves the map to it. */
export function MapDataPanel() {
  const { state, dispatch } = useMapContext()
  const polygons = state.polygons.filter((p) => p.isSaved)
  const objects = state.objects.filter((o) => o.isSaved)

  const onPolygonClick = (polygon: MapPolygon) => {
    dispatch({ type: 'TOGGLE_POLYGON_SELECTION', id: polygon.id })
    dispatch({ type: 'FOCUS_BOUNDS', positions: polygon.ring })
  }

  const onObjectClick = (object: MapObjectItem) => {
    dispatch({ type: 'TOGGLE_OBJECT_SELECTION', id: object.id })
    dispatch({ type: 'FOCUS_POINT', position: object.position })
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
          selectedPolygonIds={state.selectedPolygonIds}
          selectedObjectIds={state.selectedObjectIds}
          onPolygonClick={onPolygonClick}
          onObjectClick={onObjectClick}
        />
      )}
    </Panel>
  )
}
