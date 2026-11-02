using System.Text.Json.Serialization;
using DotNetEnv;
using MapApp.Api.Middleware;
using MapApp.BLL;
using MapApp.DAL;

const string ClientCorsPolicy = "Client";

var builder = WebApplication.CreateBuilder(args);

// Local settings (e.g. MongoDB credentials) live in a gitignored .env next to appsettings.json,
// using ASP.NET's "Section__Key" names (MongoDb__ConnectionString). Load it into environment
// variables, without overriding ones already set, then re-add the environment provider so these
// values take precedence over appsettings.json.
Env.NoClobber().Load(Path.Combine(builder.Environment.ContentRootPath, ".env"));
builder.Configuration.AddEnvironmentVariables();

builder.Services
    .AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddOpenApi();

builder.Services.AddDal(builder.Configuration);
builder.Services.AddBll();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy(ClientCorsPolicy, policy =>
    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(o => o.SwaggerEndpoint("/openapi/v1.json", "MapApp API v1"));
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors(ClientCorsPolicy);
app.MapControllers();

app.Run();
