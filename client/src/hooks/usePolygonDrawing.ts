import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { addDraftVertex, cancelDraft, completeDraft, MIN_POLYGON_VERTICES } from '../store/slices/polygonsSlice'
import type { Position } from '../types/geo'

/** Draft-polygon operations for drawing mode. */
export function usePolygonDrawing() {
  const dispatch = useAppDispatch()
  const isDrawing = useAppSelector((state) => state.ui.mode === 'drawPolygon')
  const vertices = useAppSelector((state) => state.polygons.draftVertices)

  const addVertex = useCallback((position: Position) => dispatch(addDraftVertex(position)), [dispatch])

  const complete = useCallback(() => dispatch(completeDraft()), [dispatch])

  const cancel = useCallback(() => dispatch(cancelDraft()), [dispatch])

  return {
    isDrawing,
    vertices,
    canClose: vertices.length >= MIN_POLYGON_VERTICES,
    addVertex,
    complete,
    cancel,
  }
}
