using MapApp.BLL.Interfaces;
using MapApp.BLL.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace MapApp.BLL;

public static class BllServiceCollectionExtensions
{
    public static IServiceCollection AddBll(this IServiceCollection services)
    {
        services.TryAddSingleton(TimeProvider.System);
        services.AddScoped<IPolygonService, PolygonService>();
        services.AddScoped<IMapObjectService, MapObjectService>();

        return services;
    }
}
