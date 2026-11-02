import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { MapObjectDto, MapObjectItem, SaveMapObjectItem } from '../types/mapObject'
import type { CreatePolygonRequest, MapPolygon, PolygonDto } from '../types/polygon'
import { openRing, toLatLngs } from '../utils/geoConvert'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

function polygonFromDto(dto: PolygonDto): MapPolygon {
  const ring = openRing(dto.geometry.coordinates[0] ?? [])
  return { id: dto.id, name: dto.name, ring, latLngs: toLatLngs(ring), isSaved: true }
}

const objectFromDto = (dto: MapObjectDto): MapObjectItem => ({
  id: dto.id,
  name: dto.name,
  symbol: dto.symbol,
  position: dto.geometry.coordinates,
  isSaved: true,
})

/**
 * REST API for saved polygons and objects. The query cache is the client's copy of the
 * database: mutations invalidate their tag, which refetches the matching list.
 */
export const mapApi = createApi({
  reducerPath: 'mapApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api` }),
  tagTypes: ['Polygon', 'MapObject'],
  endpoints: (build) => ({
    // Polygons
    getPolygons: build.query<MapPolygon[], void>({
      query: () => 'polygons',
      transformResponse: (dtos: PolygonDto[]) => dtos.map(polygonFromDto),
      providesTags: ['Polygon'],
    }),
    createPolygon: build.mutation<PolygonDto, CreatePolygonRequest>({
      query: (body) => ({ url: 'polygons', method: 'POST', body }),
      invalidatesTags: ['Polygon'],
    }),
    deletePolygon: build.mutation<void, string>({
      query: (id) => ({ url: `polygons/${encodeURIComponent(id)}`, method: 'DELETE' }),
      invalidatesTags: ['Polygon'],
    }),
    deleteAllPolygons: build.mutation<void, void>({
      query: () => ({ url: 'polygons', method: 'DELETE' }),
      invalidatesTags: ['Polygon'],
    }),

    // Objects
    getObjects: build.query<MapObjectItem[], void>({
      query: () => 'objects',
      transformResponse: (dtos: MapObjectDto[]) => dtos.map(objectFromDto),
      providesTags: ['MapObject'],
    }),
    saveObjects: build.mutation<MapObjectDto[], SaveMapObjectItem[]>({
      query: (objects) => ({ url: 'objects', method: 'POST', body: { objects } }),
      invalidatesTags: ['MapObject'],
    }),
    deleteObjects: build.mutation<void, string[]>({
      query: (ids) => ({ url: 'objects', method: 'DELETE', params: { ids: ids.join(',') } }),
      invalidatesTags: ['MapObject'],
    }),
  }),
})

export const {
  useGetPolygonsQuery,
  useCreatePolygonMutation,
  useDeletePolygonMutation,
  useDeleteAllPolygonsMutation,
  useGetObjectsQuery,
  useSaveObjectsMutation,
  useDeleteObjectsMutation,
} = mapApi
