using MapApp.BLL.Models;
using MapApp.DAL.Entities;
using MongoDB.Driver.GeoJsonObjectModel;

namespace MapApp.BLL.Mapping;

/// <summary>Maps between BLL models and DAL (GeoJSON) entities.</summary>
public static class EntityMapper
{
    public static Polygon ToModel(this PolygonEntity entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        CreatedAt = entity.CreatedAt,
        Ring = entity.Geometry.Coordinates.Exterior.Positions.Select(ToGeoPoint).ToList()
    };

    public static PolygonEntity ToEntity(this Polygon model) => new()
    {
        Id = model.Id,
        Name = model.Name,
        CreatedAt = model.CreatedAt,
        Geometry = GeoJson.Polygon(model.Ring.Select(ToCoordinates).ToArray())
    };

    public static MapObject ToModel(this MapObjectEntity entity) => new()
    {
        Id = entity.Id,
        Name = entity.Name,
        // A document without a symbol (only possible before the migration ran) is a marker.
        Symbol = string.IsNullOrWhiteSpace(entity.Symbol) ? MapSymbols.Marker : entity.Symbol,
        CreatedAt = entity.CreatedAt,
        Location = ToGeoPoint(entity.Location.Coordinates)
    };

    public static MapObjectEntity ToEntity(this MapObject model) => new()
    {
        Id = model.Id,
        Name = model.Name,
        Symbol = model.Symbol.ToLowerInvariant(),
        CreatedAt = model.CreatedAt,
        Location = GeoJson.Point(ToCoordinates(model.Location))
    };

    private static GeoPoint ToGeoPoint(GeoJson2DGeographicCoordinates c) => new(c.Longitude, c.Latitude);

    private static GeoJson2DGeographicCoordinates ToCoordinates(GeoPoint p) => new(p.Longitude, p.Latitude);
}
