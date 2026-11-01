import { useCallback, useState } from 'react'
import { errorMessage } from '../api/httpClient'
import { objectsApi } from '../api/objectsApi'
import { useMapContext } from '../state/MapContext'
import type { MapObjectDto, MapObjectItem } from '../types/mapObject'

const fromDto = (dto: MapObjectDto): MapObjectItem => ({
  id: dto.id,
  name: dto.name,
  type: dto.type,
  symbol: dto.symbol,
  position: dto.geometry.coordinates,
  isSaved: true,
})

/** Map object CRUD against the API; keeps client state in sync. */
export function useMapObjects() {
  const { state, dispatch } = useMapContext()
  const [busy, setBusy] = useState(false)

  const setError = useCallback(
    (prefix: string, error: unknown) =>
      dispatch({ type: 'SET_STATUS', status: { kind: 'error', text: `${prefix}: ${errorMessage(error)}` } }),
    [dispatch],
  )

  const reload = useCallback(async () => {
    try {
      const dtos = await objectsApi.getAll()
      dispatch({ type: 'SET_SAVED_OBJECTS', objects: dtos.map(fromDto) })
    } catch (error) {
      setError('Loading objects failed', error)
    }
  }, [dispatch, setError])

  const unsaved = state.objects.filter((o) => !o.isSaved)
  const selected = state.objects.filter((o) => state.selectedObjectIds.includes(o.id))

  /** Sends all unsaved objects in a single POST. */
  const saveUnsaved = async () => {
    if (unsaved.length === 0) return
    setBusy(true)
    try {
      const saved = await objectsApi.saveMany(
        unsaved.map((o) => ({
          type: o.type,
          symbol: o.symbol,
          geometry: { type: 'Point', coordinates: o.position },
        })),
      )
      dispatch({ type: 'REMOVE_OBJECTS', ids: unsaved.map((o) => o.id) })
      dispatch({ type: 'SET_STATUS', status: { kind: 'success', text: `Saved ${saved.length} object(s).` } })
    } catch (error) {
      setError('Saving objects failed', error)
    } finally {
      await reload()
      setBusy(false)
    }
  }

  const deleteSelected = async () => {
    if (selected.length === 0) return
    setBusy(true)
    const savedIds = selected.filter((o) => o.isSaved).map((o) => o.id)
    const unsavedIds = selected.filter((o) => !o.isSaved).map((o) => o.id)
    try {
      dispatch({ type: 'REMOVE_OBJECTS', ids: unsavedIds })
      if (savedIds.length > 0) await objectsApi.deleteMany(savedIds)
      dispatch({ type: 'REMOVE_OBJECTS', ids: savedIds })
      dispatch({ type: 'SET_STATUS', status: { kind: 'success', text: `Deleted ${selected.length} object(s).` } })
    } catch (error) {
      setError('Deleting objects failed', error)
    } finally {
      await reload()
      setBusy(false)
    }
  }

  return {
    busy,
    savedCount: state.objects.length - unsaved.length,
    unsavedCount: unsaved.length,
    selectedCount: selected.length,
    reload,
    saveUnsaved,
    deleteSelected,
  }
}
