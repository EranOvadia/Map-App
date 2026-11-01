using MapApp.DAL.Entities;

namespace MapApp.DAL.Interfaces;

public interface IMapObjectRepository
{
    Task<IReadOnlyList<MapObjectEntity>> GetAllAsync(CancellationToken ct = default);
    Task<long> CountAsync(CancellationToken ct = default);
    Task<IReadOnlyList<MapObjectEntity>> InsertManyAsync(IReadOnlyList<MapObjectEntity> entities, CancellationToken ct = default);
    Task<bool> DeleteByIdAsync(string id, CancellationToken ct = default);
    Task<long> DeleteManyAsync(IReadOnlyCollection<string> ids, CancellationToken ct = default);
}
