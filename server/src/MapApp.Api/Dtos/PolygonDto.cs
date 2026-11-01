namespace MapApp.Api.Dtos;

public class PolygonDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public PolygonGeometryDto Geometry { get; set; } = new();
}
