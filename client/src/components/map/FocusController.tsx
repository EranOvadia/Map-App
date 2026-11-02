import { useEffect } from 'react'
import { latLngBounds } from 'leaflet'
import { useMap } from 'react-leaflet'
import { useAppSelector } from '../../store/hooks'
import { toLatLng, toLatLngs } from '../../utils/geoConvert'

const POINT_ZOOM = 15

/** Moves the map whenever ui.focus changes (e.g. a Map Data row was clicked). */
export function FocusController() {
  const map = useMap()
  const focus = useAppSelector((state) => state.ui.focus)

  useEffect(() => {
    if (!focus) return
    if (focus.kind === 'point') {
      map.flyTo(toLatLng(focus.position), Math.max(map.getZoom(), POINT_ZOOM))
    } else if (focus.positions.length > 0) {
      map.flyToBounds(latLngBounds(toLatLngs(focus.positions)), { padding: [40, 40], maxZoom: 17 })
    }
  }, [focus, map])

  return null
}
