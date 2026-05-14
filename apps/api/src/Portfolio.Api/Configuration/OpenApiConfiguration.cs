using Scalar.AspNetCore;

namespace Portfolio.Api.Configuration;

public static class OpenApiConfiguration
{
    public static IServiceCollection AddPortfolioOpenApi(this IServiceCollection services)
    {
        services.AddOpenApi();

        return services;
    }

    public static WebApplication MapPortfolioOpenApi(this WebApplication app)
    {
        app.MapOpenApi();

        app.MapScalarApiReference(options =>
        {
            options.Title = "Portfolio API";
        });

        return app;
    }
}
