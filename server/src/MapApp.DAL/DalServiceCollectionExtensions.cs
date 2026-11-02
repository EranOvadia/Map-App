using MapApp.DAL.Configuration;
using MapApp.DAL.Context;
using MapApp.DAL.Indexes;
using MapApp.DAL.Interfaces;
using MapApp.DAL.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MapApp.DAL;

public static class DalServiceCollectionExtensions
{
    public static IServiceCollection AddDal(this IServiceCollection services, IConfiguration configuration)
    {
        // Fail at startup with a clear message instead of on the first request.
        services.AddOptions<MongoDbSettings>()
            .Bind(configuration.GetSection(MongoDbSettings.SectionName))
            .Validate(s => !string.IsNullOrWhiteSpace(s.ConnectionString),
                "MongoDb:ConnectionString is not set. Copy server/src/MapApp.Api/.env.example to .env and fill it in.")
            .Validate(s => !string.IsNullOrWhiteSpace(s.DatabaseName), "MongoDb:DatabaseName is not set.")
            .ValidateOnStart();

        services.AddSingleton<IMongoClient>(sp =>
        {
            var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
            var clientSettings = MongoClientSettings.FromConnectionString(settings.ConnectionString);
            clientSettings.ServerSelectionTimeout = TimeSpan.FromSeconds(5);
            return new MongoClient(clientSettings);
        });
        services.AddSingleton<IMongoDbContext, MongoDbContext>();

        services.AddScoped<IPolygonRepository, PolygonRepository>();
        services.AddScoped<IMapObjectRepository, MapObjectRepository>();

        services.AddHostedService<MongoIndexInitializer>();

        return services;
    }
}
