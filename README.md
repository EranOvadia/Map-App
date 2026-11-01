# Map App

Interactive map application for drawing polygons and placing objects (markers / custom symbols),
persisted as GeoJSON in MongoDB.

- `client/` — React + TypeScript + React-Leaflet (Vite)
- `server/` — ASP.NET Core (.NET 10) REST API, layered as Api → BLL → DAL, MongoDB storage

## UI

| Panel | Location | What it does |
|---|---|---|
| **Map** | left | Interactive map (OpenStreetMap tiles). |
| **Polygon** | top right | **Add**: drawing mode — click to add vertices, click the first vertex to close (Esc cancels). **Save**: POSTs unsaved polygons. **Delete selected / Delete all**: DELETE from map and DB. |
| **Objects** | middle right | Pick *Marker* or a custom symbol (star, triangle, square, circle). **Add**: click the map to place (unsaved objects can be dragged). **Save**: POSTs the list of unsaved objects. **Delete selected**: DELETE from map and DB. |
| **Map Data** | bottom right | Table of saved data: Object / Type / Lat / Lon. Polygons show their centroid and expand to list vertices. Click a row to select it and fly to it. |

Click a polygon or object on the map to select it. Colours: blue = saved, orange = unsaved, red = selected.

## Prerequisites

- .NET SDK 10
- Node.js 20+ / npm
- A running MongoDB (e.g. your Docker container on `localhost:27017`)

## Configuration

MongoDB connection — `server/src/MapApp.Api/appsettings.json`:

```json
"MongoDb": {
  "ConnectionString": "mongodb://localhost:27017",
  "DatabaseName": "MapAppDb"
}
```

Adjust the connection string to match your container's port / credentials
(e.g. `mongodb://user:pass@localhost:27017/?authSource=admin`).

The client calls `/api` on its own origin; in development Vite proxies it to `API_PROXY_TARGET`
(`client/.env`, default `http://localhost:5110`). CORS for `http://localhost:5173` is also allowed
by the server (`Cors:AllowedOrigins`) if you set `VITE_API_BASE_URL` to call the API directly.

## Running

```bash
dotnet run --project server/src/MapApp.Api --launch-profile http
```

API on http://localhost:5110 — Swagger UI at http://localhost:5110/swagger.

```bash
cd client && npm install && npm run dev
```

Client on http://localhost:5173.

## Tests

```bash
dotnet test server/MapApp.slnx
```

## REST API

| Method | Route | Body | Result |
|---|---|---|---|
| GET | `/api/polygons` | — | `PolygonDto[]` |
| POST | `/api/polygons` | `{ name?, geometry: { type: "Polygon", coordinates: [[[lon,lat], ...]] } }` | `201 PolygonDto` |
| DELETE | `/api/polygons/{id}` | — | `204` / `404` |
| DELETE | `/api/polygons` | — (all) | `204` |
| GET | `/api/objects` | — | `MapObjectDto[]` |
| POST | `/api/objects` | `{ objects: [{ name?, type: "Marker"\|"Symbol", symbol?, geometry: { type: "Point", coordinates: [lon,lat] } }] }` | `201 MapObjectDto[]` |
| DELETE | `/api/objects/{id}` | — | `204` / `404` |
| DELETE | `/api/objects?ids=id1,id2` | — (selected) | `204` |

Errors are RFC 7807 `ProblemDetails` (400 validation, 404 not found, 503 database unavailable).

## MongoDB documents (GeoJSON)

Collection `polygons` (2dsphere index on `geometry`):

```json
{ "_id": ObjectId, "name": "Polygon 1", "createdAt": ISODate,
  "geometry": { "type": "Polygon", "coordinates": [[[34.78,32.08],[34.80,32.08],[34.79,32.10],[34.78,32.08]]] } }
```

Collection `mapObjects` (2dsphere index on `location`):

```json
{ "_id": ObjectId, "name": "Object 1", "type": "Symbol", "symbol": "star", "createdAt": ISODate,
  "location": { "type": "Point", "coordinates": [34.78, 32.08] } }
```

## Project structure

```
server/
  src/MapApp.Api/   Controllers, Dtos, Mapping, Middleware, Program.cs, appsettings.json
  src/MapApp.BLL/   Interfaces, Services, Models, Validation, Mapping, Exceptions
  src/MapApp.DAL/   Configuration, Context, Entities, Interfaces, Repositories, Indexes
  tests/MapApp.Tests/
client/src/
  api/              httpClient, polygonsApi, objectsApi
  components/       layout, map, polygons, objects, mapData
  hooks/            usePolygons, usePolygonDrawing, useMapObjects
  state/            MapContext, mapReducer, actions
  types/            GeoJSON, polygon and object types
  utils/            geoConvert ([lon,lat] <-> Leaflet), symbols (SVG icons)
```
