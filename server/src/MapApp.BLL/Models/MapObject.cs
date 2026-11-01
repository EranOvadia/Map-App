namespace MapApp.BLL.Models;

public class MapObject
{
    public string? Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public MapObjectType Type { get; set; }

    /// <summary>Symbol key (see <see cref="Validation.GeometryValidator.AllowedSymbols"/>) when Type is Symbol.</summary>
    public string? Symbol { get; set; }

    public GeoPoint Location { get; set; }
    public DateTime CreatedAt { get; set; }
}
