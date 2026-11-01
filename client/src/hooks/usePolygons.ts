import { useCallback, useState } from 'react'
import { errorMessage } from '../api/httpClient'
import { polygonsApi } from '../api/polygonsApi'
import { useMapContext } from '../state/MapContext'
import type { MapPolygon, PolygonDto } from '../types/polygon'
import { closeRing, openRing } from '../utils/geoConvert'

const fromDto = (dto: PolygonDto): MapPolygon => ({
  id: dto.id,
  name: dto.name,
  ring: openRing(dto.geometry.coordinates[0] ?? []),
  isSaved: true,
})

/** Polygon CRUD against the API; keeps client state in sync. */
export function usePolygons() {
  const { state, dispatch } = useMapContext()
  const [busy, setBusy] = useState(false)

  const setError = useCallback(
    (prefix: string, error: unknown) =>
      dispatch({ type: 'SET_STATUS', status: { kind: 'error', text: `${prefix}: ${errorMessage(error)}` } }),
    [dispatch],
  )

  const reload = useCallback(async () => {
    try {
      const dtos = await polygonsApi.getAll()
      dispatch({ type: 'SET_SAVED_POLYGONS', polygons: dtos.map(fromDto) })
    } catch (error) {
      setError('Loading polygons failed', error)
    }
  }, [dispatch, setError])

  const unsaved = state.polygons.filter((p) => !p.isSaved)
  const selected = state.polygons.filter((p) => state.selectedPolygonIds.includes(p.id))

  const saveUnsaved = async () => {
    if (unsaved.length === 0) return
    setBusy(true)
    let savedCount = 0
    try {
      // One POST per polygon; stop at the first failure so the rest stay on the map unsaved.
      for (const polygon of unsaved) {
        await polygonsApi.create({ geometry: { type: 'Polygon', coordinates: [closeRing(polygon.ring)] } })
        dispatch({ type: 'REMOVE_POLYGONS', ids: [polygon.id] })
        savedCount++
      }
      dispatch({ type: 'SET_STATUS', status: { kind: 'success', text: `Saved ${savedCount} polygon(s).` } })
    } catch (error) {
      setError(`Saved ${savedCount} of ${unsaved.length} polygon(s)`, error)
    } finally {
      await reload()
      setBusy(false)
    }
  }

  const deleteSelected = async () => {
    if (selected.length === 0) return
    setBusy(true)
    const savedIds = selected.filter((p) => p.isSaved).map((p) => p.id)
    const unsavedIds = selected.filter((p) => !p.isSaved).map((p) => p.id)
    try {
      dispatch({ type: 'REMOVE_POLYGONS', ids: unsavedIds })
      await Promise.all(savedIds.map((id) => polygonsApi.deleteById(id)))
      dispatch({ type: 'REMOVE_POLYGONS', ids: savedIds })
      dispatch({ type: 'SET_STATUS', status: { kind: 'success', text: `Deleted ${selected.length} polygon(s).` } })
    } catch (error) {
      setError('Deleting polygons failed', error)
    } finally {
      await reload()
      setBusy(false)
    }
  }

  const deleteAll = async () => {
    setBusy(true)
    try {
      await polygonsApi.deleteAll()
      dispatch({ type: 'REMOVE_POLYGONS', ids: state.polygons.map((p) => p.id) })
      dispatch({ type: 'SET_STATUS', status: { kind: 'success', text: 'Deleted all polygons.' } })
    } catch (error) {
      setError('Deleting all polygons failed', error)
    } finally {
      await reload()
      setBusy(false)
    }
  }

  return {
    busy,
    savedCount: state.polygons.length - unsaved.length,
    unsavedCount: unsaved.length,
    selectedCount: selected.length,
    totalCount: state.polygons.length,
    reload,
    saveUnsaved,
    deleteSelected,
    deleteAll,
  }
}
