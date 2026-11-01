using MapApp.BLL.Exceptions;
using MapApp.BLL.Models;
using MapApp.BLL.Validation;

namespace MapApp.Tests.Validation;

public class GeometryValidatorTests
{
    private static readonly GeoPoint A = new(34.78, 32.08);
    private static readonly GeoPoint B = new(34.80, 32.08);
    private static readonly GeoPoint C = new(34.79, 32.10);

    [Fact]
    public void NormalizeRing_OpenRing_ClosesIt()
    {
        var ring = GeometryValidator.NormalizeRing([A, B, C]);

        Assert.Equal([A, B, C, A], ring);
    }

    [Fact]
    public void NormalizeRing_AlreadyClosed_KeepsSingleClosingPoint()
    {
        var ring = GeometryValidator.NormalizeRing([A, B, C, A]);

        Assert.Equal([A, B, C, A], ring);
    }

    [Fact]
    public void NormalizeRing_RemovesConsecutiveDuplicates()
    {
        var ring = GeometryValidator.NormalizeRing([A, A, B, B, C]);

        Assert.Equal([A, B, C, A], ring);
    }

    [Fact]
    public void NormalizeRing_LessThanThreeDistinctVertices_Throws()
    {
        Assert.Throws<ValidationException>(() => GeometryValidator.NormalizeRing([A, B, A]));
    }

    [Fact]
    public void NormalizeRing_Empty_Throws()
    {
        Assert.Throws<ValidationException>(() => GeometryValidator.NormalizeRing([]));
    }

    [Fact]
    public void NormalizeRing_SelfIntersecting_Throws()
    {
        // "Bow tie": edges (0,0)-(1,1) and (1,0)-(0,1) cross.
        GeoPoint[] bowTie = [new(0, 0), new(1, 1), new(1, 0), new(0, 1)];

        Assert.Throws<ValidationException>(() => GeometryValidator.NormalizeRing(bowTie));
    }

    [Fact]
    public void NormalizeRing_ConvexQuad_IsValid()
    {
        GeoPoint[] square = [new(0, 0), new(1, 0), new(1, 1), new(0, 1)];

        var ring = GeometryValidator.NormalizeRing(square);

        Assert.Equal(5, ring.Count);
    }

    [Theory]
    [InlineData(181, 0)]
    [InlineData(-181, 0)]
    [InlineData(0, 91)]
    [InlineData(0, -91)]
    [InlineData(double.NaN, 0)]
    public void ValidatePoint_OutOfRange_Throws(double lon, double lat)
    {
        Assert.Throws<ValidationException>(() => GeometryValidator.ValidatePoint(new GeoPoint(lon, lat)));
    }

    [Fact]
    public void ValidateMapObject_SymbolWithoutKnownSymbol_Throws()
    {
        var obj = new MapObject { Type = MapObjectType.Symbol, Symbol = "dragon", Location = A };

        Assert.Throws<ValidationException>(() => GeometryValidator.ValidateMapObject(obj));
    }

    [Fact]
    public void ValidateMapObject_MarkerWithoutSymbol_IsValid()
    {
        var obj = new MapObject { Type = MapObjectType.Marker, Location = A };

        GeometryValidator.ValidateMapObject(obj);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("not-an-id")]
    public void ValidateId_Invalid_Throws(string? id)
    {
        Assert.Throws<ValidationException>(() => GeometryValidator.ValidateId(id));
    }
}
