using MapApp.DAL.Context;
using MapApp.DAL.Entities;
using MapApp.DAL.Interfaces;
using MongoDB.Driver;

namespace MapApp.DAL.Repositories;

public class PolygonRepository(IMongoDbContext context) : IPolygonRepository
{
    private readonly IMongoCollection<PolygonEntity> _collection = context.Polygons;

    public async Task<IReadOnlyList<PolygonEntity>> GetAllAsync(CancellationToken ct = default) =>
        await _collection.Find(FilterDefinition<PolygonEntity>.Empty)
            .SortBy(p => p.CreatedAt)
            .ToListAsync(ct);

    public Task<long> CountAsync(CancellationToken ct = default) =>
        _collection.CountDocumentsAsync(FilterDefinition<PolygonEntity>.Empty, cancellationToken: ct);

    public async Task<PolygonEntity> InsertAsync(PolygonEntity entity, CancellationToken ct = default)
    {
        await _collection.InsertOneAsync(entity, cancellationToken: ct);
        return entity;
    }

    public async Task<bool> DeleteByIdAsync(string id, CancellationToken ct = default)
    {
        var result = await _collection.DeleteOneAsync(p => p.Id == id, ct);
        return result.DeletedCount > 0;
    }

    public async Task<long> DeleteAllAsync(CancellationToken ct = default)
    {
        var result = await _collection.DeleteManyAsync(FilterDefinition<PolygonEntity>.Empty, ct);
        return result.DeletedCount;
    }
}
