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
        services.Configure<MongoDbSettings>(configuration.GetSection(MongoDbSettings.SectionName));

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
