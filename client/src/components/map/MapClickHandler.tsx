import { useMapEvents } from 'react-leaflet'
import { usePolygonDrawing } from '../../hooks/usePolygonDrawing'
import { useMapContext } from '../../state/MapContext'
import { toPosition } from '../../utils/geoConvert'

/** Routes map clicks according to the current mode. */
export function MapClickHandler() {
  const { state, dispatch } = useMapContext()
  const { addVertex } = usePolygonDrawing()

  useMapEvents({
    click(e) {
      const position = toPosition(e.latlng)
      if (state.mode === 'drawPolygon') addVertex(position)
      else if (state.mode === 'addObject') dispatch({ type: 'ADD_OBJECT', position })
    },
  })

  return null
}
