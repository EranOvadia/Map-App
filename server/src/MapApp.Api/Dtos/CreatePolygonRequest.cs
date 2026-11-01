using System.ComponentModel.DataAnnotations;

namespace MapApp.Api.Dtos;

public class CreatePolygonRequest
{
    [StringLength(100)]
    public string? Name { get; set; }

    [Required]
    public PolygonGeometryDto Geometry { get; set; } = null!;
}
