import { usePolygons } from '../../hooks/usePolygons'
import { usePolygonDrawing } from '../../hooks/usePolygonDrawing'
import { useAppDispatch } from '../../store/hooks'
import { removeUnsavedPolygons, renamePolygon } from '../../store/slices/polygonsSlice'
import { setMode } from '../../store/sharedActions'
import { UnsavedNameList } from '../common/UnsavedNameList'
import { Panel } from '../layout/Panel'

export function PolygonPanel() {
  const dispatch = useAppDispatch()
  const { isDrawing, vertices } = usePolygonDrawing()
  const polygons = usePolygons()

  const toggleDrawing = () => dispatch(setMode(isDrawing ? 'idle' : 'drawPolygon'))

  const confirmDeleteAll = () => {
    if (window.confirm('Delete ALL polygons from the map and the database?')) polygons.deleteAll()
  }

  return (
    <Panel
      title="Polygon"
      className="panel--polygons"
      meta={`${polygons.savedCount} saved · ${polygons.unsavedCount} unsaved · ${polygons.selectedCount} selected`}
    >
      <div className="button-row">
        <button
          type="button"
          className={`btn ${isDrawing ? 'btn--active' : ''}`}
          onClick={toggleDrawing}
          disabled={polygons.busy}
        >
          {isDrawing ? 'Cancel drawing' : 'Add'}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={polygons.saveUnsaved}
          disabled={polygons.busy || polygons.unsavedCount === 0}
        >
          Save{polygons.unsavedCount > 0 && ` (${polygons.unsavedCount})`}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={polygons.deleteSelected}
          disabled={polygons.busy || polygons.selectedCount === 0}
        >
          Delete selected
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={confirmDeleteAll}
          disabled={polygons.busy || polygons.totalCount === 0}
        >
          Delete all
        </button>
      </div>
      <UnsavedNameList
        items={polygons.unsaved}
        placeholder="Polygon name (optional)"
        disabled={polygons.busy}
        onRename={(id, name) => dispatch(renamePolygon({ id, name }))}
        onDiscard={(id) => dispatch(removeUnsavedPolygons([id]))}
      />
      <p className="muted">
        {isDrawing
          ? `Drawing: ${vertices.length} vertex(es). Click the first vertex to close (min. 3).`
          : 'Click a polygon on the map to select it.'}
      </p>
    </Panel>
  )
}
