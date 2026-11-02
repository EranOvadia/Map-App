import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Position } from '../../types/geo'
import type { MapObjectItem, SymbolKind } from '../../types/mapObject'

/** Client-only object state. Saved objects live in the RTK Query cache (api/mapApi). */
interface ObjectsState {
  unsaved: MapObjectItem[]
  selectedIds: string[]
  /** Symbol of the next placed object. */
  nextSymbol: SymbolKind
}

const initialState: ObjectsState = {
  unsaved: [],
  selectedIds: [],
  nextSymbol: 'marker',
}

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    setNextSymbol(state, action: PayloadAction<SymbolKind>) {
      state.nextSymbol = action.payload
    },
    addObject: {
      reducer(state, action: PayloadAction<{ id: string; position: Position }>) {
        state.unsaved.push({
          id: action.payload.id,
          name: '',
          symbol: state.nextSymbol,
          position: action.payload.position,
          isSaved: false,
        })
      },
      prepare: (position: Position) => ({ payload: { id: `object-${nanoid()}`, position } }),
    },
    moveObject(state, action: PayloadAction<{ id: string; position: Position }>) {
      const object = state.unsaved.find((o) => o.id === action.payload.id)
      if (object) object.position = action.payload.position
    },
    renameObject(state, action: PayloadAction<{ id: string; name: string }>) {
      const object = state.unsaved.find((o) => o.id === action.payload.id)
      if (object) object.name = action.payload.name
    },
    removeUnsavedObjects(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload)
      state.unsaved = state.unsaved.filter((o) => !ids.has(o.id))
      state.selectedIds = state.selectedIds.filter((id) => !ids.has(id))
    },
    toggleObjectSelection(state, action: PayloadAction<string>) {
      const id = action.payload
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id]
    },
    deselectObjects(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload)
      state.selectedIds = state.selectedIds.filter((id) => !ids.has(id))
    },
  },
})

export const {
  setNextSymbol,
  addObject,
  moveObject,
  renameObject,
  removeUnsavedObjects,
  toggleObjectSelection,
  deselectObjects,
} = objectsSlice.actions
export default objectsSlice.reducer
