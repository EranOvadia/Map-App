import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Position } from '../../types/geo'
import type { MapFocus, MapMode, StatusMessage } from '../../types/ui'
import { setMode } from '../sharedActions'
import { cancelDraft, completeDraft } from './polygonsSlice'

interface UiState {
  mode: MapMode
  status: StatusMessage | null
  focus: MapFocus | null
}

const initialState: UiState = {
  mode: 'idle',
  status: null,
  focus: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<StatusMessage | null>) {
      state.status = action.payload
    },
    focusPoint(state, action: PayloadAction<Position>) {
      state.focus = { kind: 'point', position: action.payload, key: (state.focus?.key ?? 0) + 1 }
    },
    focusBounds(state, action: PayloadAction<Position[]>) {
      state.focus = { kind: 'bounds', positions: action.payload, key: (state.focus?.key ?? 0) + 1 }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setMode, (state, action) => {
        state.mode = action.payload
      })
      // Finishing or cancelling a polygon leaves drawing mode.
      .addCase(completeDraft, (state) => {
        state.mode = 'idle'
      })
      .addCase(cancelDraft, (state) => {
        state.mode = 'idle'
      })
  },
})

export const { setStatus, focusPoint, focusBounds } = uiSlice.actions
export default uiSlice.reducer
