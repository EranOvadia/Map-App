using MapApp.DAL.Configuration;
using MapApp.DAL.Entities;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace MapApp.DAL.Context;

public class MongoDbContext : IMongoDbContext
{
    static MongoDbContext()
    {
        var conventions = new ConventionPack
        {
            new CamelCaseElementNameConvention(),
            new IgnoreExtraElementsConvention(true)
        };
        ConventionRegistry.Register("MapAppConventions", conventions,
            t => t.Namespace == typeof(PolygonEntity).Namespace);
    }

    public MongoDbContext(IMongoClient client, IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var database = client.GetDatabase(settings.DatabaseName);

        Polygons = database.GetCollection<PolygonEntity>(settings.PolygonsCollectionName);
        MapObjects = database.GetCollection<MapObjectEntity>(settings.MapObjectsCollectionName);
    }

    public IMongoCollection<PolygonEntity> Polygons { get; }
    public IMongoCollection<MapObjectEntity> MapObjects { get; }
}
