using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;

namespace MapApp.DAL.Entities;

public class MapObjectEntity
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = string.Empty;

    /// <summary>How the object is drawn: "marker", "star", "triangle", "square", "circle" or "jeep".</summary>
    public string Symbol { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    /// <summary>GeoJSON Point, coordinates stored as [lon, lat].</summary>
    public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; set; } = null!;
}
