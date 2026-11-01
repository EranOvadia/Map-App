using MapApp.DAL.Entities;

namespace MapApp.DAL.Interfaces;

public interface IPolygonRepository
{
    Task<IReadOnlyList<PolygonEntity>> GetAllAsync(CancellationToken ct = default);
    Task<long> CountAsync(CancellationToken ct = default);
    Task<PolygonEntity> InsertAsync(PolygonEntity entity, CancellationToken ct = default);
    Task<bool> DeleteByIdAsync(string id, CancellationToken ct = default);
    Task<long> DeleteAllAsync(CancellationToken ct = default);
}
