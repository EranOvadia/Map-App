import type { MapObjectDto, SaveMapObjectItem } from '../types/mapObject'
import { httpClient } from './httpClient'

const BASE = '/api/objects'

export const objectsApi = {
  getAll: () => httpClient.get<MapObjectDto[]>(BASE),
  saveMany: (objects: SaveMapObjectItem[]) => httpClient.post<MapObjectDto[]>(BASE, { objects }),
  deleteById: (id: string) => httpClient.delete(`${BASE}/${encodeURIComponent(id)}`),
  deleteMany: (ids: string[]) =>
    httpClient.delete(`${BASE}?ids=${ids.map(encodeURIComponent).join(',')}`),
}
