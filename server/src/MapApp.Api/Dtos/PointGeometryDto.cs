namespace MapApp.Api.Dtos;

/// <summary>GeoJSON Point geometry: <c>{ "type": "Point", "coordinates": [lon, lat] }</c>.</summary>
public class PointGeometryDto
{
    public string Type { get; set; } = "Point";
    public double[] Coordinates { get; set; } = [];
}
