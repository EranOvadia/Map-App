import { StatusBar } from './components/layout/StatusBar'
import { MapDataPanel } from './components/mapData/MapDataPanel'
import { MapView } from './components/map/MapView'
import { ObjectsPanel } from './components/objects/ObjectsPanel'
import { PolygonPanel } from './components/polygons/PolygonPanel'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Map App</h1>
        <StatusBar />
      </header>
      <main className="app__layout">
        <div className="app__map">
          <MapView />
        </div>
        <aside className="app__sidebar">
          <PolygonPanel />
          <ObjectsPanel />
          <MapDataPanel />
        </aside>
      </main>
    </div>
  )
}

export default App
