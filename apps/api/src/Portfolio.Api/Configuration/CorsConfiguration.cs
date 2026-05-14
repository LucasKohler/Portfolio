namespace Portfolio.Api.Configuration;

public static class CorsConfiguration
{
    public const string PolicyName = "PortfolioCors";

    public static IServiceCollection AddPortfolioCors(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var allowedOrigins = configuration
            .GetSection("Portfolio:Cors:AllowedOrigins")
            .Get<string[]>() ?? ["http://localhost:3000"];

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy
                    .WithOrigins(allowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });

        return services;
    }

    public static WebApplication UsePortfolioCors(this WebApplication app)
    {
        app.UseCors(PolicyName);

        return app;
    }
}
