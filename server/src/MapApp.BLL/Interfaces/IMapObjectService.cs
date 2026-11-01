using MapApp.BLL.Models;

namespace MapApp.BLL.Interfaces;

public interface IMapObjectService
{
    Task<IReadOnlyList<MapObject>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<MapObject>> SaveManyAsync(IReadOnlyList<MapObject> objects, CancellationToken ct = default);
    Task DeleteAsync(string id, CancellationToken ct = default);
    Task<long> DeleteManyAsync(IReadOnlyCollection<string> ids, CancellationToken ct = default);
}
