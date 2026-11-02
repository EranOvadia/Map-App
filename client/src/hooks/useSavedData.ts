import { useGetObjectsQuery, useGetPolygonsQuery } from '../api/mapApi'
import type { MapObjectItem } from '../types/mapObject'
import type { MapPolygon } from '../types/polygon'

// Stable empty arrays so consumers don't see a "new" value while loading.
const NO_POLYGONS: MapPolygon[] = []
const NO_OBJECTS: MapObjectItem[] = []

/**
 * Saved polygons from the query cache. `selectFromResult` keeps only `data`, so the caller
 * re-renders when the list changes, not on every loading/fetching flag change.
 */
export const useSavedPolygons = () =>
  useGetPolygonsQuery(undefined, { selectFromResult: ({ data }) => ({ data: data ?? NO_POLYGONS }) }).data

export const useSavedObjects = () =>
  useGetObjectsQuery(undefined, { selectFromResult: ({ data }) => ({ data: data ?? NO_OBJECTS }) }).data
