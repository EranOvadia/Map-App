using MapApp.BLL.Models;

namespace MapApp.BLL.Interfaces;

public interface IPolygonService
{
    Task<IReadOnlyList<Polygon>> GetAllAsync(CancellationToken ct = default);
    Task<Polygon> CreateAsync(string? name, IReadOnlyList<GeoPoint> ring, CancellationToken ct = default);
    Task DeleteAsync(string id, CancellationToken ct = default);
    Task<long> DeleteAllAsync(CancellationToken ct = default);
}
