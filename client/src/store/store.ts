import { configureStore } from '@reduxjs/toolkit'
import { mapApi } from '../api/mapApi'
import objectsReducer from './slices/objectsSlice'
import polygonsReducer from './slices/polygonsSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    polygons: polygonsReducer,
    objects: objectsReducer,
    [mapApi.reducerPath]: mapApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(mapApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
