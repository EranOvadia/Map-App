import { useMapEvents } from 'react-leaflet'
import { usePolygonDrawing } from '../../hooks/usePolygonDrawing'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { addObject } from '../../store/slices/objectsSlice'
import { toPosition } from '../../utils/geoConvert'

/** Routes map clicks according to the current mode. */
export function MapClickHandler() {
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state.ui.mode)
  const { addVertex } = usePolygonDrawing()

  useMapEvents({
    click(e) {
      const position = toPosition(e.latlng)
      if (mode === 'drawPolygon') addVertex(position)
      else if (mode === 'addObject') dispatch(addObject(position))
    },
  })

  return null
}
