using MapApp.Api.Dtos;
using MapApp.BLL.Exceptions;
using MapApp.BLL.Models;

namespace MapApp.Api.Mapping;

/// <summary>Maps between API DTOs (GeoJSON) and BLL models.</summary>
public static class DtoMappingExtensions
{
    public static PolygonDto ToDto(this Polygon model) => new()
    {
        Id = model.Id ?? string.Empty,
        Name = model.Name,
        CreatedAt = model.CreatedAt,
        Geometry = new PolygonGeometryDto
        {
            Coordinates = [model.Ring.Select(p => new[] { p.Longitude, p.Latitude }).ToArray()]
        }
    };

    public static MapObjectDto ToDto(this MapObject model) => new()
    {
        Id = model.Id ?? string.Empty,
        Name = model.Name,
        Type = model.Type,
        Symbol = model.Symbol,
        CreatedAt = model.CreatedAt,
        Geometry = new PointGeometryDto { Coordinates = [model.Location.Longitude, model.Location.Latitude] }
    };

    public static IReadOnlyList<GeoPoint> ToRing(this PolygonGeometryDto geometry)
    {
        if (!string.Equals(geometry.Type, "Polygon", StringComparison.Ordinal))
            throw new ValidationException("Geometry type must be 'Polygon'.");

        if (geometry.Coordinates is not { Length: > 0 })
            throw new ValidationException("Polygon must have an outer ring.");

        return geometry.Coordinates[0].Select(ToGeoPoint).ToList();
    }

    public static MapObject ToModel(this SaveMapObjectItem item)
    {
        if (!string.Equals(item.Geometry.Type, "Point", StringComparison.Ordinal))
            throw new ValidationException("Geometry type must be 'Point'.");

        return new MapObject
        {
            Name = item.Name ?? string.Empty,
            Type = item.Type,
            Symbol = item.Symbol,
            Location = ToGeoPoint(item.Geometry.Coordinates)
        };
    }

    private static GeoPoint ToGeoPoint(double[]? position)
    {
        if (position is not { Length: >= 2 })
            throw new ValidationException("Each position must be [longitude, latitude].");

        return new GeoPoint(position[0], position[1]);
    }
}
