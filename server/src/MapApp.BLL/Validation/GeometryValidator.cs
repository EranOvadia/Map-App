using MapApp.BLL.Exceptions;
using MapApp.BLL.Models;
using MongoDB.Bson;

namespace MapApp.BLL.Validation;

public static class GeometryValidator
{
    public static void ValidatePoint(GeoPoint point)
    {
        if (!double.IsFinite(point.Longitude) || point.Longitude < -180 || point.Longitude > 180)
            throw new ValidationException($"Longitude {point.Longitude} is out of range [-180, 180].");

        if (!double.IsFinite(point.Latitude) || point.Latitude < -90 || point.Latitude > 90)
            throw new ValidationException($"Latitude {point.Latitude} is out of range [-90, 90].");
    }

    /// <summary>
    /// Validates a polygon outer ring and returns it closed (first == last), with consecutive
    /// duplicate vertices removed.
    /// </summary>
    public static IReadOnlyList<GeoPoint> NormalizeRing(IReadOnlyList<GeoPoint>? ring)
    {
        if (ring is null || ring.Count == 0)
            throw new ValidationException("Polygon must have coordinates.");

        var vertices = new List<GeoPoint>(ring.Count + 1);
        foreach (var point in ring)
        {
            ValidatePoint(point);
            if (vertices.Count == 0 || vertices[^1] != point)
                vertices.Add(point);
        }

        // Work on the open ring, then close it.
        if (vertices.Count > 1 && vertices[0] == vertices[^1])
            vertices.RemoveAt(vertices.Count - 1);

        if (vertices.Distinct().Count() < 3)
            throw new ValidationException("Polygon must have at least 3 distinct vertices.");

        if (HasSelfIntersection(vertices))
            throw new ValidationException("Polygon edges must not intersect each other.");

        vertices.Add(vertices[0]);
        return vertices;
    }

    public static void ValidateMapObject(MapObject mapObject)
    {
        ValidatePoint(mapObject.Location);

        if (!MapSymbols.IsValid(mapObject.Symbol))
            throw new ValidationException($"Symbol must be one of: {string.Join(", ", MapSymbols.All)}.");
    }

    public static void ValidateId(string? id)
    {
        if (string.IsNullOrWhiteSpace(id) || !ObjectId.TryParse(id, out _))
            throw new ValidationException($"'{id}' is not a valid id.");
    }

    /// <summary>Planar check for crossing non-adjacent edges of an open ring.</summary>
    private static bool HasSelfIntersection(IReadOnlyList<GeoPoint> openRing)
    {
        var n = openRing.Count;
        for (var i = 0; i < n; i++)
        {
            var a1 = openRing[i];
            var a2 = openRing[(i + 1) % n];
            for (var j = i + 1; j < n; j++)
            {
                // Skip edges that share a vertex.
                if (j == i || (j + 1) % n == i || (i + 1) % n == j) continue;

                var b1 = openRing[j];
                var b2 = openRing[(j + 1) % n];
                if (SegmentsIntersect(a1, a2, b1, b2)) return true;
            }
        }
        return false;
    }

    private static bool SegmentsIntersect(GeoPoint p1, GeoPoint p2, GeoPoint q1, GeoPoint q2)
    {
        var d1 = Cross(q1, q2, p1);
        var d2 = Cross(q1, q2, p2);
        var d3 = Cross(p1, p2, q1);
        var d4 = Cross(p1, p2, q2);

        if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)))
            return true;

        return (d1 == 0 && OnSegment(q1, q2, p1)) || (d2 == 0 && OnSegment(q1, q2, p2))
            || (d3 == 0 && OnSegment(p1, p2, q1)) || (d4 == 0 && OnSegment(p1, p2, q2));
    }

    private static double Cross(GeoPoint a, GeoPoint b, GeoPoint c) =>
        (b.Longitude - a.Longitude) * (c.Latitude - a.Latitude) - (b.Latitude - a.Latitude) * (c.Longitude - a.Longitude);

    private static bool OnSegment(GeoPoint a, GeoPoint b, GeoPoint p) =>
        Math.Min(a.Longitude, b.Longitude) <= p.Longitude && p.Longitude <= Math.Max(a.Longitude, b.Longitude)
        && Math.Min(a.Latitude, b.Latitude) <= p.Latitude && p.Latitude <= Math.Max(a.Latitude, b.Latitude);
}
