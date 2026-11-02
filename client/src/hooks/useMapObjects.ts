import { useEffect, useState } from 'react'
import { apiErrorMessage } from '../api/apiError'
import { useDeleteObjectsMutation, useGetObjectsQuery, useSaveObjectsMutation } from '../api/mapApi'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { deselectObjects, removeUnsavedObjects } from '../store/slices/objectsSlice'
import { setStatus } from '../store/slices/uiSlice'
import type { MapObjectItem } from '../types/mapObject'
import { nameForApi } from '../utils/names'

const NO_OBJECTS: MapObjectItem[] = []

/** Object save/delete actions and counts for the Objects panel. */
export function useMapObjects() {
  const dispatch = useAppDispatch()
  const { data: saved = NO_OBJECTS, error: loadError } = useGetObjectsQuery()
  const unsaved = useAppSelector((state) => state.objects.unsaved)
  const selectedIds = useAppSelector((state) => state.objects.selectedIds)
  const [saveObjects] = useSaveObjectsMutation()
  const [deleteObjects] = useDeleteObjectsMutation()
  const [busy, setBusy] = useState(false)

  const success = (text: string) => dispatch(setStatus({ kind: 'success', text }))
  const failure = (prefix: string, error: unknown) =>
    dispatch(setStatus({ kind: 'error', text: `${prefix}: ${apiErrorMessage(error)}` }))

  useEffect(() => {
    if (loadError)
      dispatch(setStatus({ kind: 'error', text: `Loading objects failed: ${apiErrorMessage(loadError)}` }))
  }, [loadError, dispatch])

  const selectedSaved = saved.filter((o) => selectedIds.includes(o.id))
  const selectedUnsaved = unsaved.filter((o) => selectedIds.includes(o.id))
  const selectedCount = selectedSaved.length + selectedUnsaved.length

  /** Sends all unsaved objects in a single POST. */
  const saveUnsaved = async () => {
    if (unsaved.length === 0) return
    setBusy(true)
    try {
      const result = await saveObjects(
        unsaved.map((o) => ({
          name: nameForApi(o.name),
          type: o.type,
          symbol: o.symbol,
          geometry: { type: 'Point', coordinates: o.position },
        })),
      ).unwrap()
      dispatch(removeUnsavedObjects(unsaved.map((o) => o.id)))
      success(`Saved ${result.length} object(s).`)
    } catch (error) {
      failure('Saving objects failed', error)
    } finally {
      setBusy(false)
    }
  }

  const deleteSelected = async () => {
    if (selectedCount === 0) return
    setBusy(true)
    try {
      dispatch(removeUnsavedObjects(selectedUnsaved.map((o) => o.id)))
      const savedIds = selectedSaved.map((o) => o.id)
      if (savedIds.length > 0) await deleteObjects(savedIds).unwrap()
      dispatch(deselectObjects(savedIds))
      success(`Deleted ${selectedCount} object(s).`)
    } catch (error) {
      failure('Deleting objects failed', error)
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
    saveUnsaved,
    deleteSelected,
  }
}
