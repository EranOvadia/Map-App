import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Position } from '../../types/geo'
import type { MapObjectItem, ObjectTemplate } from '../../types/mapObject'

/** Client-only object state. Saved objects live in the RTK Query cache (api/mapApi). */
interface ObjectsState {
  unsaved: MapObjectItem[]
  selectedIds: string[]
  /** What the next placed object will look like. */
  template: ObjectTemplate
}

const initialState: ObjectsState = {
  unsaved: [],
  selectedIds: [],
  template: { type: 'Marker', symbol: null },
}

const objectsSlice = createSlice({
  name: 'objects',
  initialState,
  reducers: {
    setObjectTemplate(state, action: PayloadAction<ObjectTemplate>) {
      state.template = action.payload
    },
    addObject: {
      reducer(state, action: PayloadAction<{ id: string; position: Position }>) {
        const { type, symbol } = state.template
        state.unsaved.push({
          id: action.payload.id,
          name: '',
          type,
          symbol: type === 'Symbol' ? symbol : null,
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
  setObjectTemplate,
  addObject,
  moveObject,
  renameObject,
  removeUnsavedObjects,
  toggleObjectSelection,
  deselectObjects,
} = objectsSlice.actions
export default objectsSlice.reducer
