import { useEffect } from 'react'
import { useMapObjects } from '../../hooks/useMapObjects'
import { useMapContext } from '../../state/MapContext'
import { Panel } from '../layout/Panel'
import { SymbolPicker } from './SymbolPicker'

export function ObjectsPanel() {
  const { state, dispatch } = useMapContext()
  const objects = useMapObjects()
  const { reload } = objects
  const isAdding = state.mode === 'addObject'

  useEffect(() => {
    reload()
  }, [reload])

  const toggleAdding = () => dispatch({ type: 'SET_MODE', mode: isAdding ? 'idle' : 'addObject' })

  return (
    <Panel
      title="Objects"
      className="panel--objects"
      meta={`${objects.savedCount} saved · ${objects.unsavedCount} unsaved · ${objects.selectedCount} selected`}
    >
      <SymbolPicker
        value={state.objectTemplate}
        onChange={(template) => dispatch({ type: 'SET_OBJECT_TEMPLATE', template })}
      />
      <div className="button-row">
        <button
          type="button"
          className={`btn ${isAdding ? 'btn--active' : ''}`}
          onClick={toggleAdding}
          disabled={objects.busy}
        >
          {isAdding ? 'Stop adding' : 'Add'}
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={objects.saveUnsaved}
          disabled={objects.busy || objects.unsavedCount === 0}
        >
          Save{objects.unsavedCount > 0 && ` (${objects.unsavedCount})`}
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={objects.deleteSelected}
          disabled={objects.busy || objects.selectedCount === 0}
        >
          Delete selected
        </button>
      </div>
      <p className="muted">
        {isAdding
          ? 'Click on the map to place the selected object type.'
          : 'Pick a type, press Add, then click the map. Click an object to select it.'}
      </p>
    </Panel>
  )
}
