import type { Position } from './geo'

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
