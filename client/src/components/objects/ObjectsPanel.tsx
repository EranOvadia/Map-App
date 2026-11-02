import { useMapObjects } from '../../hooks/useMapObjects'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { removeUnsavedObjects, renameObject, setNextSymbol } from '../../store/slices/objectsSlice'
import { setMode } from '../../store/sharedActions'
import { STATE_COLORS, shapeSvg } from '../../utils/symbols'
import { UnsavedNameList } from '../common/UnsavedNameList'
import { Panel } from '../layout/Panel'
import { SymbolPicker } from './SymbolPicker'

export function ObjectsPanel() {
  const dispatch = useAppDispatch()
  const isAdding = useAppSelector((state) => state.ui.mode === 'addObject')
  const nextSymbol = useAppSelector((state) => state.objects.nextSymbol)
  const objects = useMapObjects()

  const toggleAdding = () => dispatch(setMode(isAdding ? 'idle' : 'addObject'))

  return (
    <Panel
      title="Objects"
      className="panel--objects"
      meta={`${objects.savedCount} saved · ${objects.unsavedCount} unsaved · ${objects.selectedCount} selected`}
    >
      <SymbolPicker value={nextSymbol} onChange={(symbol) => dispatch(setNextSymbol(symbol))} />
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
      <UnsavedNameList
        items={objects.unsaved.map((o) => ({
          id: o.id,
          name: o.name,
          icon: (
            <span
              // Static SVG generated from constants in utils/symbols.
              dangerouslySetInnerHTML={{ __html: shapeSvg(o.symbol, STATE_COLORS.unsaved, 16) }}
            />
          ),
        }))}
        placeholder="Object name (optional)"
        disabled={objects.busy}
        onRename={(id, name) => dispatch(renameObject({ id, name }))}
        onDiscard={(id) => dispatch(removeUnsavedObjects([id]))}
      />
      <p className="muted">
        {isAdding
          ? 'Click on the map to place the selected object type.'
          : 'Pick a type, press Add, then click the map. Click an object to select it.'}
      </p>
    </Panel>
  )
}
