import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { Position } from '../../types/geo'
import type { MapPolygon } from '../../types/polygon'
import { toLatLngs } from '../../utils/geoConvert'
import { setMode } from '../sharedActions'

export const MIN_POLYGON_VERTICES = 3

/** Client-only polygon state. Saved polygons live in the RTK Query cache (api/mapApi). */
interface PolygonsState {
  /** Vertices of the polygon currently being drawn ([lon, lat]). */
  draftVertices: Position[]
  unsaved: MapPolygon[]
  selectedIds: string[]
}

const initialState: PolygonsState = {
  draftVertices: [],
  unsaved: [],
  selectedIds: [],
}

const polygonsSlice = createSlice({
  name: 'polygons',
  initialState,
  reducers: {
    addDraftVertex(state, action: PayloadAction<Position>) {
      state.draftVertices.push(action.payload)
    },
    completeDraft: {
      reducer(state, action: PayloadAction<{ id: string }>) {
        if (state.draftVertices.length < MIN_POLYGON_VERTICES) return
        // Unnamed until the user types a name; an empty name gets a server default.
        state.unsaved.push({
          id: action.payload.id,
          name: '',
          ring: state.draftVertices,
          latLngs: toLatLngs(state.draftVertices),
          isSaved: false,
        })
        state.draftVertices = []
      },
      prepare: () => ({ payload: { id: `polygon-${nanoid()}` } }),
    },
    cancelDraft(state) {
      state.draftVertices = []
    },
    renamePolygon(state, action: PayloadAction<{ id: string; name: string }>) {
      const polygon = state.unsaved.find((p) => p.id === action.payload.id)
      if (polygon) polygon.name = action.payload.name
    },
    removeUnsavedPolygons(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload)
      state.unsaved = state.unsaved.filter((p) => !ids.has(p.id))
      state.selectedIds = state.selectedIds.filter((id) => !ids.has(id))
    },
    togglePolygonSelection(state, action: PayloadAction<string>) {
      const id = action.payload
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((x) => x !== id)
        : [...state.selectedIds, id]
    },
    deselectPolygons(state, action: PayloadAction<string[]>) {
      const ids = new Set(action.payload)
      state.selectedIds = state.selectedIds.filter((id) => !ids.has(id))
    },
  },
  extraReducers: (builder) => {
    // Leaving draw mode discards an unfinished polygon.
    builder.addCase(setMode, (state, action) => {
      if (action.payload !== 'drawPolygon') state.draftVertices = []
    })
  },
})

export const {
  addDraftVertex,
  completeDraft,
  cancelDraft,
  renamePolygon,
  removeUnsavedPolygons,
  togglePolygonSelection,
  deselectPolygons,
} = polygonsSlice.actions
export default polygonsSlice.reducer
