namespace MapApp.Api.Dtos;

public class MapObjectDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    /// <summary>"marker", "star", "triangle", "square", "circle" or "jeep".</summary>
    public string Symbol { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
    public PointGeometryDto Geometry { get; set; } = new();
}
