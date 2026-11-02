using System.ComponentModel.DataAnnotations;

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

    /// <summary>"marker", "star", "triangle", "square", "circle" or "jeep".</summary>
    [Required]
    public string Symbol { get; set; } = string.Empty;

    [Required]
    public PointGeometryDto Geometry { get; set; } = null!;
}
