import { useMemo } from 'react'
import { Marker, Tooltip } from 'react-leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import { useSavedObjects } from '../../hooks/useSavedData'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { moveObject, toggleObjectSelection } from '../../store/slices/objectsSlice'
import { toLatLng, toPosition } from '../../utils/geoConvert'
import { displayName } from '../../utils/names'
import { objectIcon } from '../../utils/symbols'

export function ObjectsLayer() {
  const dispatch = useAppDispatch()
  const saved = useSavedObjects()
  const unsaved = useAppSelector((state) => state.objects.unsaved)
  const selectedIds = useAppSelector((state) => state.objects.selectedIds)
  const mode = useAppSelector((state) => state.ui.mode)
  const objects = useMemo(() => [...saved, ...unsaved], [saved, unsaved])

  return (
    <>
      {objects.map((object) => {
        const selected = selectedIds.includes(object.id)
        const visualState = selected ? 'selected' : object.isSaved ? 'saved' : 'unsaved'
        return (
          <Marker
            key={object.id}
            position={toLatLng(object.position)}
            icon={objectIcon(object.symbol, visualState)}
            // Only unsaved objects can be repositioned before saving.
            draggable={!object.isSaved}
            eventHandlers={{
              click: () => {
                if (mode !== 'drawPolygon') dispatch(toggleObjectSelection(object.id))
              },
              dragend: (e) => {
                const latlng = (e.target as LeafletMarker).getLatLng()
                dispatch(moveObject({ id: object.id, position: toPosition(latlng) }))
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
