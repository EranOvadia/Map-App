import { MapContainer, TileLayer } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { useMapContext } from '../../state/MapContext'
import { FocusController } from './FocusController'

const DEFAULT_CENTER: LatLngTuple = [32.0853, 34.7818]
const DEFAULT_ZOOM = 13

const MODE_HINTS: Record<string, string> = {
  drawPolygon: 'Click to add vertices. Click the first vertex to close the polygon. Esc to cancel.',
  addObject: 'Click on the map to place objects. Press Add again to stop.',
}

export function MapView() {
  const { mode } = useMapContext().state

  return (
    <div className={`map-view map-view--${mode}`}>
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} className="map-view__map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FocusController />
      </MapContainer>
      {MODE_HINTS[mode] && <div className="map-view__hint">{MODE_HINTS[mode]}</div>}
    </div>
  )
}
