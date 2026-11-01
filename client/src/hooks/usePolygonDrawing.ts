import { useCallback } from 'react'
import { useMapContext } from '../state/MapContext'
import type { Position } from '../types/geo'

export const MIN_POLYGON_VERTICES = 3

/** Draft-polygon operations for drawing mode. */
export function usePolygonDrawing() {
  const { state, dispatch } = useMapContext()
  const isDrawing = state.mode === 'drawPolygon'
  const vertices = state.draftVertices

  const addVertex = useCallback(
    (position: Position) => dispatch({ type: 'ADD_DRAFT_VERTEX', position }),
    [dispatch],
  )

  const complete = useCallback(() => dispatch({ type: 'COMPLETE_DRAFT' }), [dispatch])

  const cancel = useCallback(() => dispatch({ type: 'CANCEL_DRAFT' }), [dispatch])

  return {
    isDrawing,
    vertices,
    canClose: vertices.length >= MIN_POLYGON_VERTICES,
    addVertex,
    complete,
    cancel,
  }
}
