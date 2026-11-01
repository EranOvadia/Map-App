using MapApp.Api.Dtos;
using MapApp.Api.Mapping;
using MapApp.BLL.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MapApp.Api.Controllers;

[ApiController]
[Route("api/objects")]
[Produces("application/json")]
public class ObjectsController(IMapObjectService mapObjectService) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IEnumerable<MapObjectDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MapObjectDto>>> GetAll(CancellationToken ct)
    {
        var objects = await mapObjectService.GetAllAsync(ct);
        return Ok(objects.Select(o => o.ToDto()));
    }

    /// <summary>Saves a list of objects in one request.</summary>
    [HttpPost]
    [ProducesResponseType<IEnumerable<MapObjectDto>>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<IEnumerable<MapObjectDto>>> SaveMany(SaveObjectsRequest request, CancellationToken ct)
    {
        var saved = await mapObjectService.SaveManyAsync(request.Objects.Select(o => o.ToModel()).ToList(), ct);
        return StatusCode(StatusCodes.Status201Created, saved.Select(o => o.ToDto()));
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id, CancellationToken ct)
    {
        await mapObjectService.DeleteAsync(id, ct);
        return NoContent();
    }

    /// <summary>Deletes the selected objects: <c>DELETE /api/objects?ids=id1,id2</c>.</summary>
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteMany([FromQuery] string? ids, CancellationToken ct)
    {
        var idList = (ids ?? string.Empty)
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        await mapObjectService.DeleteManyAsync(idList, ct);
        return NoContent();
    }
}
