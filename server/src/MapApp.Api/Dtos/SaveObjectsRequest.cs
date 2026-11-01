using System.ComponentModel.DataAnnotations;
using MapApp.BLL.Models;

namespace MapApp.Api.Dtos;

public class SaveObjectsRequest
{
    [Required, MinLength(1)]
    public List<SaveMapObjectItem> Objects { get; set; } = [];
}

public class SaveMapObjectItem
{
    [StringLength(100)]
    public string? Name { get; set; }

    public MapObjectType Type { get; set; } = MapObjectType.Marker;

    public string? Symbol { get; set; }

    [Required]
    public PointGeometryDto Geometry { get; set; } = null!;
}
