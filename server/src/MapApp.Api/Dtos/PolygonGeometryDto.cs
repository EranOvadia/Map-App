namespace MapApp.Api.Dtos;

/// <summary>
/// GeoJSON Polygon geometry: <c>{ "type": "Polygon", "coordinates": [[[lon, lat], ...]] }</c>.
/// Only the first (outer) ring is used.
/// </summary>
public class PolygonGeometryDto
{
    public string Type { get; set; } = "Polygon";
    public double[][][] Coordinates { get; set; } = [];
}
