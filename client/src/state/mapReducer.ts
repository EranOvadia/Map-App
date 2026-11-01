import type { Position } from '../types/geo'
import type { MapObjectItem, ObjectTemplate } from '../types/mapObject'
import type { MapPolygon } from '../types/polygon'
import type { MapAction, MapFocus, MapMode, StatusMessage } from './actions'

export interface MapState {
  mode: MapMode
  polygons: MapPolygon[]
  objects: MapObjectItem[]
  /** Vertices of the polygon currently being drawn ([lon, lat]). */
  draftVertices: Position[]
  selectedPolygonIds: string[]
  selectedObjectIds: string[]
  objectTemplate: ObjectTemplate
  status: StatusMessage | null
  focus: MapFocus | null
}

export const initialMapState: MapState = {
  mode: 'idle',
  polygons: [],
  objects: [],
  draftVertices: [],
  selectedPolygonIds: [],
  selectedObjectIds: [],
  objectTemplate: { type: 'Marker', symbol: null },
  status: null,
  focus: null,
}

let tempIdCounter = 0
const nextTempId = (prefix: string) => `${prefix}-${++tempIdCounter}`

const toggle = (ids: string[], id: string) =>
  ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]

/** Replaces the saved items with `saved`, keeping unsaved ones, and drops stale selections. */
function mergeSaved<T extends { id: string; isSaved: boolean }>(current: T[], saved: T[], selected: string[]) {
  const items = [...saved, ...current.filter((x) => !x.isSaved)]
  const ids = new Set(items.map((x) => x.id))
  return { items, selected: selected.filter((id) => ids.has(id)) }
}

export function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SET_MODE':
      // Leaving draw mode discards an unfinished polygon.
      return { ...state, mode: action.mode, draftVertices: action.mode === 'drawPolygon' ? state.draftVertices : [] }

    case 'SET_STATUS':
      return { ...state, status: action.status }

    case 'ADD_DRAFT_VERTEX':
      return { ...state, draftVertices: [...state.draftVertices, action.position] }

    case 'CANCEL_DRAFT':
      return { ...state, draftVertices: [], mode: 'idle' }

    case 'COMPLETE_DRAFT': {
      if (state.draftVertices.length < 3) return state
      const unsavedCount = state.polygons.filter((p) => !p.isSaved).length
      const polygon: MapPolygon = {
        id: nextTempId('polygon'),
        name: `New polygon ${unsavedCount + 1}`,
        ring: state.draftVertices,
        isSaved: false,
      }
      return { ...state, polygons: [...state.polygons, polygon], draftVertices: [], mode: 'idle' }
    }

    case 'SET_SAVED_POLYGONS': {
      const { items, selected } = mergeSaved(state.polygons, action.polygons, state.selectedPolygonIds)
      return { ...state, polygons: items, selectedPolygonIds: selected }
    }

    case 'REMOVE_POLYGONS': {
      const ids = new Set(action.ids)
      return {
        ...state,
        polygons: state.polygons.filter((p) => !ids.has(p.id)),
        selectedPolygonIds: state.selectedPolygonIds.filter((id) => !ids.has(id)),
      }
    }

    case 'TOGGLE_POLYGON_SELECTION':
      return { ...state, selectedPolygonIds: toggle(state.selectedPolygonIds, action.id) }

    case 'SET_OBJECT_TEMPLATE':
      return { ...state, objectTemplate: action.template }

    case 'ADD_OBJECT': {
      const unsavedCount = state.objects.filter((o) => !o.isSaved).length
      const object: MapObjectItem = {
        id: nextTempId('object'),
        name: `New object ${unsavedCount + 1}`,
        type: state.objectTemplate.type,
        symbol: state.objectTemplate.type === 'Symbol' ? state.objectTemplate.symbol : null,
        position: action.position,
        isSaved: false,
      }
      return { ...state, objects: [...state.objects, object] }
    }

    case 'MOVE_OBJECT':
      return {
        ...state,
        objects: state.objects.map((o) => (o.id === action.id && !o.isSaved ? { ...o, position: action.position } : o)),
      }

    case 'SET_SAVED_OBJECTS': {
      const { items, selected } = mergeSaved(state.objects, action.objects, state.selectedObjectIds)
      return { ...state, objects: items, selectedObjectIds: selected }
    }

    case 'REMOVE_OBJECTS': {
      const ids = new Set(action.ids)
      return {
        ...state,
        objects: state.objects.filter((o) => !ids.has(o.id)),
        selectedObjectIds: state.selectedObjectIds.filter((id) => !ids.has(id)),
      }
    }

    case 'TOGGLE_OBJECT_SELECTION':
      return { ...state, selectedObjectIds: toggle(state.selectedObjectIds, action.id) }

    case 'FOCUS_POINT':
      return { ...state, focus: { kind: 'point', position: action.position, key: (state.focus?.key ?? 0) + 1 } }

    case 'FOCUS_BOUNDS':
      return { ...state, focus: { kind: 'bounds', positions: action.positions, key: (state.focus?.key ?? 0) + 1 } }

    default:
      return state
  }
}
