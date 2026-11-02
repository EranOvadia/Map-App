import { Marker, Tooltip } from 'react-leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import { useMapContext } from '../../state/MapContext'
import { toLatLng, toPosition } from '../../utils/geoConvert'
import { objectIcon } from '../../utils/symbols'
import { displayName } from '../../utils/names'

export function ObjectsLayer() {
  const { state, dispatch } = useMapContext()

  return (
    <>
      {state.objects.map((object) => {
        const selected = state.selectedObjectIds.includes(object.id)
        const visualState = selected ? 'selected' : object.isSaved ? 'saved' : 'unsaved'
        return (
          <Marker
            key={object.id}
            position={toLatLng(object.position)}
            icon={objectIcon(object.type, object.symbol, visualState)}
            // Only unsaved objects can be repositioned before saving.
            draggable={!object.isSaved}
            eventHandlers={{
              click: () => {
                if (state.mode !== 'drawPolygon') dispatch({ type: 'TOGGLE_OBJECT_SELECTION', id: object.id })
              },
              dragend: (e) => {
                const latlng = (e.target as LeafletMarker).getLatLng()
                dispatch({ type: 'MOVE_OBJECT', id: object.id, position: toPosition(latlng) })
              },
            }}
          >
            <Tooltip direction="top">
              {displayName(object.name, 'Unnamed object')}
              {!object.isSaved && ' (unsaved, drag to move)'}
            </Tooltip>
          </Marker>
        )
      })}
    </>
  )
}
