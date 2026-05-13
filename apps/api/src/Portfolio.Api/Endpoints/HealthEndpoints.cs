namespace Portfolio.Api.Endpoints;

public static class HealthEndpoints
{
    public static RouteGroupBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api")
            .WithTags("Health");

        group
            .MapGet("/health", () => Results.Ok(new HealthResponse("ok", "portfolio-api")))
            .WithName("GetHealth")
            .WithSummary("Checks whether the Portfolio API is running.")
            .Produces<HealthResponse>(StatusCodes.Status200OK);

        return group;
    }
}

public sealed record HealthResponse(string Status, string Service);
