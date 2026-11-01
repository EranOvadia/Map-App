using MapApp.DAL.Context;
using MapApp.DAL.Entities;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace MapApp.DAL.Indexes;

/// <summary>Creates the 2dsphere geo indexes on startup (idempotent).</summary>
public class MongoIndexInitializer(IMongoDbContext context, ILogger<MongoIndexInitializer> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await context.Polygons.Indexes.CreateOneAsync(
                new CreateIndexModel<PolygonEntity>(Builders<PolygonEntity>.IndexKeys.Geo2DSphere(p => p.Geometry)),
                cancellationToken: cancellationToken);

            await context.MapObjects.Indexes.CreateOneAsync(
                new CreateIndexModel<MapObjectEntity>(Builders<MapObjectEntity>.IndexKeys.Geo2DSphere(o => o.Location)),
                cancellationToken: cancellationToken);

            logger.LogInformation("MongoDB 2dsphere indexes ensured");
        }
        catch (Exception ex)
        {
            // Startup continues if Mongo is unreachable; requests will surface the error.
            logger.LogWarning(ex, "Could not create MongoDB indexes. Is MongoDB running and the connection string correct?");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
