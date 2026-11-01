/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import type { MapAction } from './actions'
import { initialMapState, mapReducer, type MapState } from './mapReducer'

interface MapContextValue {
  state: MapState
  dispatch: Dispatch<MapAction>
}

const MapContext = createContext<MapContextValue | null>(null)

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mapReducer, initialMapState)
  return <MapContext.Provider value={{ state, dispatch }}>{children}</MapContext.Provider>
}

export function useMapContext(): MapContextValue {
  const context = useContext(MapContext)
  if (!context) throw new Error('useMapContext must be used inside <MapProvider>')
  return context
}
