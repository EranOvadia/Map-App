using MapApp.BLL.Exceptions;
using MapApp.BLL.Interfaces;
using MapApp.BLL.Mapping;
using MapApp.BLL.Models;
using MapApp.BLL.Validation;
using MapApp.DAL.Interfaces;
using MongoDB.Driver;

namespace MapApp.BLL.Services;

public class PolygonService(IPolygonRepository repository, TimeProvider timeProvider) : IPolygonService
{
    // MongoDB error code for a document whose geometry can't be indexed by 2dsphere.
    private const int CannotExtractGeoKeysCode = 16755;

    public async Task<IReadOnlyList<Polygon>> GetAllAsync(CancellationToken ct = default)
    {
        var entities = await repository.GetAllAsync(ct);
        return entities.Select(e => e.ToModel()).ToList();
    }

    public async Task<Polygon> CreateAsync(string? name, IReadOnlyList<GeoPoint> ring, CancellationToken ct = default)
    {
        var polygon = new Polygon
        {
            Ring = GeometryValidator.NormalizeRing(ring),
            Name = string.IsNullOrWhiteSpace(name)
                ? $"Polygon {await repository.CountAsync(ct) + 1}"
                : name.Trim(),
            CreatedAt = timeProvider.GetUtcNow().UtcDateTime
        };

        try
        {
            var saved = await repository.InsertAsync(polygon.ToEntity(), ct);
            return saved.ToModel();
        }
        catch (MongoWriteException ex) when (ex.WriteError?.Code == CannotExtractGeoKeysCode)
        {
            throw new ValidationException($"Invalid polygon geometry: {ex.WriteError.Message}");
        }
    }

    public async Task DeleteAsync(string id, CancellationToken ct = default)
    {
        GeometryValidator.ValidateId(id);

        if (!await repository.DeleteByIdAsync(id, ct))
            throw new NotFoundException($"Polygon '{id}' was not found.");
    }

    public Task<long> DeleteAllAsync(CancellationToken ct = default) => repository.DeleteAllAsync(ct);
}
