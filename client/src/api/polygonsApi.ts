import type { CreatePolygonRequest, PolygonDto } from '../types/polygon'
import { httpClient } from './httpClient'

const BASE = '/api/polygons'

export const polygonsApi = {
  getAll: () => httpClient.get<PolygonDto[]>(BASE),
  create: (request: CreatePolygonRequest) => httpClient.post<PolygonDto>(BASE, request),
  deleteById: (id: string) => httpClient.delete(`${BASE}/${encodeURIComponent(id)}`),
  deleteAll: () => httpClient.delete(BASE),
}
