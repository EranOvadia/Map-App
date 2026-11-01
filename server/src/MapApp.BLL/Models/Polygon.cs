namespace MapApp.BLL.Models;

public class Polygon
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    /// <summary>Outer ring. Closed (first == last) once it has passed validation.</summary>
    public IReadOnlyList<GeoPoint> Ring { get; set; } = [];
}
