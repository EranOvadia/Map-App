using MapApp.DAL.Entities;
using MongoDB.Driver;

namespace MapApp.DAL.Context;

public interface IMongoDbContext
{
    IMongoCollection<PolygonEntity> Polygons { get; }
    IMongoCollection<MapObjectEntity> MapObjects { get; }
}
