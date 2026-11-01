using MapApp.Api.Dtos;
using MapApp.Api.Mapping;
using MapApp.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MapApp.Api.Controllers;

[ApiController]
[Route("api/polygons")]
[Produces("application/json")]
public class PolygonsController(IPolygonService polygonService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<PolygonDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<PolygonDto>>> GetAll(CancellationToken ct)
    {
        var polygons = await polygonService.GetAllAsync(ct);
        return Ok(polygons.Select(p => p.ToDto()));
    }

    [HttpPost]
    [ProducesResponseType<PolygonDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PolygonDto>> Create(CreatePolygonRequest request, CancellationToken ct)
    {
        var polygon = await polygonService.CreateAsync(request.Name, request.Geometry.ToRing(), ct);
        return Created($"/api/polygons/{polygon.Id}", polygon.ToDto());
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        await polygonService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAll(CancellationToken ct)
    {
        await polygonService.DeleteAllAsync(ct);
        return NoContent();
    }
}
