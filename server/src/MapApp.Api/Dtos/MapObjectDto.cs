using MapApp.BLL.Models;

namespace MapApp.Api.Dtos;

public class MapObjectDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public MapObjectType Type { get; set; }
    public string? Symbol { get; set; }
    public DateTime CreatedAt { get; set; }
    public PointGeometryDto Geometry { get; set; } = new();
}
