using MapApp.BLL.Exceptions;
using MapApp.BLL.Interfaces;
using MapApp.BLL.Mapping;
using MapApp.BLL.Models;
using MapApp.BLL.Validation;
using MapApp.DAL.Interfaces;

namespace MapApp.BLL.Services;

public class MapObjectService(IMapObjectRepository repository, TimeProvider timeProvider) : IMapObjectService
{
    public async Task<IReadOnlyList<MapObject>> GetAllAsync(CancellationToken ct = default)
    {
        var entities = await repository.GetAllAsync(ct);
        return entities.Select(e => e.ToModel()).ToList();
    }

    public async Task<IReadOnlyList<MapObject>> SaveManyAsync(IReadOnlyList<MapObject> objects, CancellationToken ct = default)
    {
        if (objects is null || objects.Count == 0)
            throw new ValidationException("At least one object is required.");

        foreach (var mapObject in objects)
            GeometryValidator.ValidateMapObject(mapObject);

        var now = timeProvider.GetUtcNow().UtcDateTime;
        var nextNumber = await repository.CountAsync(ct) + 1;

        var entities = objects.Select(o =>
        {
            o.Id = null;
            o.CreatedAt = now;
            o.Name = string.IsNullOrWhiteSpace(o.Name) ? $"Object {nextNumber++}" : o.Name.Trim();
            return o.ToEntity();
        }).ToList();

        var saved = await repository.InsertManyAsync(entities, ct);
        return saved.Select(e => e.ToModel()).ToList();
    }

    public async Task DeleteAsync(string id, CancellationToken ct = default)
    {
        GeometryValidator.ValidateId(id);

        if (!await repository.DeleteByIdAsync(id, ct))
            throw new NotFoundException($"Object '{id}' was not found.");
    }

    public async Task<long> DeleteManyAsync(IReadOnlyCollection<string> ids, CancellationToken ct = default)
    {
        if (ids is null || ids.Count == 0)
            throw new ValidationException("At least one id is required.");

        foreach (var id in ids)
            GeometryValidator.ValidateId(id);

        return await repository.DeleteManyAsync(ids.Distinct().ToList(), ct);
    }
}
