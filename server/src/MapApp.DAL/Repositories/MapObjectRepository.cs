using MapApp.DAL.Context;
using MapApp.DAL.Entities;
using MapApp.DAL.Interfaces;
using MongoDB.Driver;

namespace MapApp.DAL.Repositories;

public class MapObjectRepository(IMongoDbContext context) : IMapObjectRepository
{
    private readonly IMongoCollection<MapObjectEntity> _collection = context.MapObjects;

    public async Task<IReadOnlyList<MapObjectEntity>> GetAllAsync(CancellationToken ct = default) =>
        await _collection.Find(FilterDefinition<MapObjectEntity>.Empty)
            .SortBy(o => o.CreatedAt)
            .ToListAsync(ct);

    public Task<long> CountAsync(CancellationToken ct = default) =>
        _collection.CountDocumentsAsync(FilterDefinition<MapObjectEntity>.Empty, cancellationToken: ct);

    public async Task<IReadOnlyList<MapObjectEntity>> InsertManyAsync(
        IReadOnlyList<MapObjectEntity> entities, CancellationToken ct = default)
    {
        if (entities.Count == 0) return entities;

        await _collection.InsertManyAsync(entities, cancellationToken: ct);
        return entities;
    }

    public async Task<bool> DeleteByIdAsync(string id, CancellationToken ct = default)
    {
        var result = await _collection.DeleteOneAsync(o => o.Id == id, ct);
        return result.DeletedCount > 0;
    }

    public async Task<long> DeleteManyAsync(IReadOnlyCollection<string> ids, CancellationToken ct = default)
    {
        if (ids.Count == 0) return 0;

        var filter = Builders<MapObjectEntity>.Filter.In(o => o.Id, ids);
        var result = await _collection.DeleteManyAsync(filter, ct);
        return result.DeletedCount;
    }
}
