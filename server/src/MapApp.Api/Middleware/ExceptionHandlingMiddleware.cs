using MapApp.BLL.Exceptions;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace MapApp.Api.Middleware;

/// <summary>Converts exceptions thrown by lower layers into RFC 7807 ProblemDetails responses.</summary>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex) when (!context.Response.HasStarted)
        {
            var (status, title) = ex switch
            {
                ValidationException => (StatusCodes.Status400BadRequest, "Validation failed"),
                NotFoundException => (StatusCodes.Status404NotFound, "Not found"),
                TimeoutException or MongoConnectionException =>
                    (StatusCodes.Status503ServiceUnavailable, "Database unavailable"),
                OperationCanceledException when context.RequestAborted.IsCancellationRequested =>
                    (499, "Request cancelled"),
                _ => (StatusCodes.Status500InternalServerError, "Unexpected server error")
            };

            if (status >= 500)
                logger.LogError(ex, "Request {Method} {Path} failed", context.Request.Method, context.Request.Path);

            var problem = new ProblemDetails
            {
                Status = status,
                Title = title,
                Detail = status switch
                {
                    StatusCodes.Status500InternalServerError => "An unexpected error occurred.",
                    StatusCodes.Status503ServiceUnavailable => "Could not reach MongoDB. Check that it is running and that MongoDb:ConnectionString is correct.",
                    _ => ex.Message
                },
                Instance = context.Request.Path
            };

            context.Response.StatusCode = status;
            await context.Response.WriteAsJsonAsync(problem, (System.Text.Json.JsonSerializerOptions?)null,
                "application/problem+json");
        }
    }
}
