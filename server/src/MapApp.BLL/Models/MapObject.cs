namespace MapApp.BLL.Models;

public class MapObject
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;

    /// <summary>How the object is drawn; one of <see cref="MapSymbols.All"/>.</summary>
    public string Symbol { get; set; } = MapSymbols.Marker;

    public GeoPoint Location { get; set; }
    public DateTime CreatedAt { get; set; }
}
