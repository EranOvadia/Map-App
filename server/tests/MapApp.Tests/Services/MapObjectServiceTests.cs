using MapApp.BLL.Exceptions;
using MapApp.BLL.Models;
using MapApp.BLL.Services;
using MapApp.DAL.Entities;
using MapApp.DAL.Interfaces;
using Moq;

namespace MapApp.Tests.Services;

public class MapObjectServiceTests
{
    private const string ValidId = "65f1a2b3c4d5e6f708192a3b";

    private readonly Mock<IMapObjectRepository> _repository = new();
    private readonly MapObjectService _service;

    public MapObjectServiceTests()
    {
        _repository
            .Setup(r => r.InsertManyAsync(It.IsAny<IReadOnlyList<MapObjectEntity>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((IReadOnlyList<MapObjectEntity> e, CancellationToken _) => e);

        _service = new MapObjectService(_repository.Object, TimeProvider.System);
    }

    [Fact]
    public async Task SaveManyAsync_AssignsDefaultNamesAndStoresGeoJsonPoints()
    {
        _repository.Setup(r => r.CountAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);
        var input = new List<MapObject>
        {
            new() { Type = MapObjectType.Marker, Location = new GeoPoint(34.78, 32.08) },
            new() { Type = MapObjectType.Symbol, Symbol = "Star", Location = new GeoPoint(34.79, 32.09) }
        };

        var result = await _service.SaveManyAsync(input);

        Assert.Equal(["Object 2", "Object 3"], result.Select(o => o.Name));
        Assert.Equal("star", result[1].Symbol);
        _repository.Verify(r => r.InsertManyAsync(
            It.Is<IReadOnlyList<MapObjectEntity>>(l =>
                l.Count == 2
                && l[0].Location.Coordinates.Longitude == 34.78
                && l[0].Location.Coordinates.Latitude == 32.08
                && l[0].Symbol == null),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SaveManyAsync_KeepsChosenNames_AndDefaultsOnlyBlankOnes()
    {
        _repository.Setup(r => r.CountAsync(It.IsAny<CancellationToken>())).ReturnsAsync(0);
        var input = new List<MapObject>
        {
            new() { Name = "  Gate A  ", Type = MapObjectType.Marker, Location = new GeoPoint(34.78, 32.08) },
            new() { Name = " ", Type = MapObjectType.Marker, Location = new GeoPoint(34.79, 32.09) }
        };

        var result = await _service.SaveManyAsync(input);

        Assert.Equal(["Gate A", "Object 1"], result.Select(o => o.Name));
    }

    [Fact]
    public async Task SaveManyAsync_Empty_Throws()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.SaveManyAsync([]));
    }

    [Fact]
    public async Task SaveManyAsync_InvalidObject_ThrowsAndDoesNotInsert()
    {
        var input = new List<MapObject> { new() { Type = MapObjectType.Marker, Location = new GeoPoint(200, 0) } };

        await Assert.ThrowsAsync<ValidationException>(() => _service.SaveManyAsync(input));
        _repository.Verify(r => r.InsertManyAsync(It.IsAny<IReadOnlyList<MapObjectEntity>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DeleteManyAsync_InvalidId_Throws()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.DeleteManyAsync([ValidId, "bad"]));
    }

    [Fact]
    public async Task DeleteManyAsync_DeduplicatesIds()
    {
        _repository.Setup(r => r.DeleteManyAsync(It.IsAny<IReadOnlyCollection<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);

        var deleted = await _service.DeleteManyAsync([ValidId, ValidId]);

        Assert.Equal(1, deleted);
        _repository.Verify(r => r.DeleteManyAsync(
            It.Is<IReadOnlyCollection<string>>(ids => ids.Count == 1), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_Missing_ThrowsNotFound()
    {
        _repository.Setup(r => r.DeleteByIdAsync(ValidId, It.IsAny<CancellationToken>())).ReturnsAsync(false);

        await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteAsync(ValidId));
    }
}
