import type { Position } from '../types/geo'
import type { MapObjectItem, ObjectTemplate } from '../types/mapObject'
import type { MapPolygon } from '../types/polygon'

export type MapMode = 'idle' | 'drawPolygon' | 'addObject'

export type StatusKind = 'info' | 'success' | 'error'

export interface StatusMessage {
  kind: StatusKind
  text: string
}

/** A request for the map to move; `key` changes on every request so repeats still fire. */
export type MapFocus =
  | { kind: 'point'; position: Position; key: number }
  | { kind: 'bounds'; positions: Position[]; key: number }

export type MapAction =
  | { type: 'SET_MODE'; mode: MapMode }
  | { type: 'SET_STATUS'; status: StatusMessage | null }
  // Polygons
  | { type: 'ADD_DRAFT_VERTEX'; position: Position }
  | { type: 'CANCEL_DRAFT' }
  | { type: 'COMPLETE_DRAFT' }
  | { type: 'SET_SAVED_POLYGONS'; polygons: MapPolygon[] }
  | { type: 'REMOVE_POLYGONS'; ids: string[] }
  | { type: 'TOGGLE_POLYGON_SELECTION'; id: string }
  // Objects
  | { type: 'SET_OBJECT_TEMPLATE'; template: ObjectTemplate }
  | { type: 'ADD_OBJECT'; position: Position }
  | { type: 'MOVE_OBJECT'; id: string; position: Position }
  | { type: 'SET_SAVED_OBJECTS'; objects: MapObjectItem[] }
  | { type: 'REMOVE_OBJECTS'; ids: string[] }
  | { type: 'TOGGLE_OBJECT_SELECTION'; id: string }
  // Map
  | { type: 'FOCUS_POINT'; position: Position }
  | { type: 'FOCUS_BOUNDS'; positions: Position[] }
