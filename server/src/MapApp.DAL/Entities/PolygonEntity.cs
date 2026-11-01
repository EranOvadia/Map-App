using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace MapApp.DAL.Entities;

public class PolygonEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    /// <summary>GeoJSON Polygon, coordinates stored as [lon, lat].</summary>
    public GeoJsonPolygon<GeoJson2DGeographicCoordinates> Geometry { get; set; } = null!;
}
