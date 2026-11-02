import { useEffect, useState } from 'react'
import { apiErrorMessage } from '../api/apiError'
import {
  useCreatePolygonMutation,
  useDeleteAllPolygonsMutation,
  useDeletePolygonMutation,
  useGetPolygonsQuery,
} from '../api/mapApi'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { deselectPolygons, removeUnsavedPolygons } from '../store/slices/polygonsSlice'
import { setStatus } from '../store/slices/uiSlice'
import type { MapPolygon } from '../types/polygon'
import { closeRing } from '../utils/geoConvert'
import { nameForApi } from '../utils/names'

const NO_POLYGONS: MapPolygon[] = []

/** Polygon save/delete actions and counts for the Polygon panel. */
export function usePolygons() {
  const dispatch = useAppDispatch()
  const { data: saved = NO_POLYGONS, error: loadError } = useGetPolygonsQuery()
  const unsaved = useAppSelector((state) => state.polygons.unsaved)
  const selectedIds = useAppSelector((state) => state.polygons.selectedIds)
  const [createPolygon] = useCreatePolygonMutation()
  const [deletePolygon] = useDeletePolygonMutation()
  const [deleteAllPolygons] = useDeleteAllPolygonsMutation()
  const [busy, setBusy] = useState(false)

  const success = (text: string) => dispatch(setStatus({ kind: 'success', text }))
  const failure = (prefix: string, error: unknown) =>
    dispatch(setStatus({ kind: 'error', text: `${prefix}: ${apiErrorMessage(error)}` }))

  useEffect(() => {
    if (loadError)
      dispatch(setStatus({ kind: 'error', text: `Loading polygons failed: ${apiErrorMessage(loadError)}` }))
  }, [loadError, dispatch])

  const selectedSaved = saved.filter((p) => selectedIds.includes(p.id))
  const selectedUnsaved = unsaved.filter((p) => selectedIds.includes(p.id))
  const selectedCount = selectedSaved.length + selectedUnsaved.length

  const saveUnsaved = async () => {
    if (unsaved.length === 0) return
    setBusy(true)
    let savedCount = 0
    try {
      // One POST per polygon; stop at the first failure so the rest stay on the map unsaved.
      for (const polygon of unsaved) {
        await createPolygon({
          name: nameForApi(polygon.name),
          geometry: { type: 'Polygon', coordinates: [closeRing(polygon.ring)] },
        }).unwrap()
        dispatch(removeUnsavedPolygons([polygon.id]))
        savedCount++
      }
      success(`Saved ${savedCount} polygon(s).`)
    } catch (error) {
      failure(`Saved ${savedCount} of ${unsaved.length} polygon(s)`, error)
    } finally {
      setBusy(false)
    }
  }

  const deleteSelected = async () => {
    if (selectedCount === 0) return
    setBusy(true)
    try {
      // Unsaved polygons only exist on the client.
      dispatch(removeUnsavedPolygons(selectedUnsaved.map((p) => p.id)))
      const savedIds = selectedSaved.map((p) => p.id)
      await Promise.all(savedIds.map((id) => deletePolygon(id).unwrap()))
      dispatch(deselectPolygons(savedIds))
      success(`Deleted ${selectedCount} polygon(s).`)
    } catch (error) {
      failure('Deleting polygons failed', error)
    } finally {
      setBusy(false)
    }
  }

  const deleteAll = async () => {
    setBusy(true)
    try {
      await deleteAllPolygons().unwrap()
      dispatch(removeUnsavedPolygons(unsaved.map((p) => p.id)))
      dispatch(deselectPolygons(saved.map((p) => p.id)))
      success('Deleted all polygons.')
    } catch (error) {
      failure('Deleting all polygons failed', error)
    } finally {
      setBusy(false)
    }
  }

  return {
    busy,
    unsaved,
    savedCount: saved.length,
    unsavedCount: unsaved.length,
    selectedCount,
    totalCount: saved.length + unsaved.length,
    saveUnsaved,
    deleteSelected,
    deleteAll,
  }
}
