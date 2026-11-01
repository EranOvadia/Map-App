import { Panel } from './components/layout/Panel'
import { StatusBar } from './components/layout/StatusBar'
import { MapView } from './components/map/MapView'
import { MapProvider } from './state/MapContext'
import './App.css'

function App() {
  return (
    <MapProvider>
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
            <Panel title="Polygon" className="panel--polygons">
              <p className="muted">Polygon management</p>
            </Panel>
            <Panel title="Objects" className="panel--objects">
              <p className="muted">Object management</p>
            </Panel>
            <Panel title="Map Data" className="panel--map-data">
              <p className="muted">Saved data</p>
            </Panel>
          </aside>
        </main>
      </div>
    </MapProvider>
  )
}

export default App
