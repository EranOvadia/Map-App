import { createAction } from '@reduxjs/toolkit'
import type { MapMode } from '../types/ui'

// Actions handled by more than one slice live here to avoid import cycles between slices.

/** Switches the map interaction mode (handled by ui; polygons drops an unfinished draft). */
export const setMode = createAction<MapMode>('ui/setMode')
