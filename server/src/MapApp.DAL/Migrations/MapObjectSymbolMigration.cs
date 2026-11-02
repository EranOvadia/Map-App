using MapApp.DAL.Context;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;

namespace MapApp.DAL.Migrations;

/// <summary>
/// One-time, idempotent migration run on startup: map objects used to store
/// <c>type: "Marker" | "Symbol"</c> plus a nullable <c>symbol</c>. They now store only
/// <c>symbol</c>, where a marker is <c>symbol: "marker"</c>.
/// </summary>
public class MapObjectSymbolMigration(IMongoDbContext context, ILogger<MapObjectSymbolMigration> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Untyped view: the old "type" field no longer exists on MapObjectEntity.
        var collection = context.MapObjects.Database
            .GetCollection<BsonDocument>(context.MapObjects.CollectionNamespace.CollectionName);
        var filter = Builders<BsonDocument>.Filter;
        var update = Builders<BsonDocument>.Update;

        try
        {
            var markers = await collection.UpdateManyAsync(
                filter.Eq("type", "Marker"),
                update.Set("symbol", "marker").Unset("type"),
                cancellationToken: cancellationToken);

            var symbols = await collection.UpdateManyAsync(
                filter.Exists("type"),
                update.Unset("type"),
                cancellationToken: cancellationToken);

            var migrated = markers.ModifiedCount + symbols.ModifiedCount;
            if (migrated > 0)
                logger.LogInformation("Migrated {Count} map object(s) to the single 'symbol' field", migrated);
        }
        catch (Exception ex)
        {
            // Same policy as the index initializer: don't block startup if Mongo is unreachable.
            logger.LogWarning(ex, "Could not run the map object symbol migration");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
