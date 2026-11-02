using MapApp.BLL.Exceptions;
using MapApp.BLL.Models;
using MapApp.BLL.Services;
using MapApp.DAL.Entities;
using MapApp.DAL.Interfaces;
using Moq;

namespace MapApp.Tests.Services;

public class PolygonServiceTests
{
    private const string ValidId = "65f1a2b3c4d5e6f708192a3b";

    private readonly Mock<IPolygonRepository> _repository = new();
    private readonly PolygonService _service;

    private static readonly GeoPoint[] Triangle = [new(34.78, 32.08), new(34.80, 32.08), new(34.79, 32.10)];

    public PolygonServiceTests()
    {
        _repository
            .Setup(r => r.InsertAsync(It.IsAny<PolygonEntity>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((PolygonEntity e, CancellationToken _) =>
            {
                e.Id = ValidId;
                return e;
            });

        _service = new PolygonService(_repository.Object, TimeProvider.System);
    }

    [Fact]
    public async Task CreateAsync_StoresClosedGeoJsonRing_InLonLatOrder()
    {
        PolygonEntity? stored = null;
        _repository
            .Setup(r => r.InsertAsync(It.IsAny<PolygonEntity>(), It.IsAny<CancellationToken>()))
            .Callback((PolygonEntity e, CancellationToken _) => stored = e)
            .ReturnsAsync((PolygonEntity e, CancellationToken _) => e);

        await _service.CreateAsync("Area", Triangle);

        Assert.NotNull(stored);
        var positions = stored!.Geometry.Coordinates.Exterior.Positions.ToList();
        Assert.Equal(4, positions.Count);
        Assert.Equal(34.78, positions[0].Longitude);
        Assert.Equal(32.08, positions[0].Latitude);
        Assert.Equal(positions[0], positions[^1]);
    }

    [Fact]
    public async Task CreateAsync_WithoutName_UsesDefaultNumberedName()
    {
        _repository.Setup(r => r.CountAsync(It.IsAny<CancellationToken>())).ReturnsAsync(2);

        var result = await _service.CreateAsync(null, Triangle);

        Assert.Equal("Polygon 3", result.Name);
        Assert.Equal(ValidId, result.Id);
    }

    [Fact]
    public async Task CreateAsync_WithName_KeepsTrimmedChosenName()
    {
        var result = await _service.CreateAsync("  North field  ", Triangle);

        Assert.Equal("North field", result.Name);
        _repository.Verify(r => r.CountAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_InvalidRing_ThrowsAndDoesNotInsert()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.CreateAsync("x", [new(0, 0), new(1, 1)]));

        _repository.Verify(r => r.InsertAsync(It.IsAny<PolygonEntity>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_Missing_ThrowsNotFound()
    {
        _repository.Setup(r => r.DeleteByIdAsync(ValidId, It.IsAny<CancellationToken>())).ReturnsAsync(false);

        await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteAsync(ValidId));
    }

    [Fact]
    public async Task DeleteAsync_InvalidId_ThrowsValidation()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.DeleteAsync("bad"));
    }

    [Fact]
    public async Task DeleteAllAsync_ReturnsDeletedCount()
    {
        _repository.Setup(r => r.DeleteAllAsync(It.IsAny<CancellationToken>())).ReturnsAsync(5);

        Assert.Equal(5, await _service.DeleteAllAsync());
    }
}
