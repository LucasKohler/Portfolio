using Portfolio.Api.Configuration;
using Portfolio.Api.Endpoints;
using Portfolio.Application;
using Portfolio.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplication()
    .AddInfrastructure()
    .AddPortfolioCors(builder.Configuration)
    .AddPortfolioOpenApi();

var app = builder.Build();

app.UsePortfolioCors();

app.MapGet("/", () => Results.Ok(new
{
    service = "portfolio-api",
    status = "ok"
}))
.WithName("GetApiRoot")
.WithTags("System");

app.MapPortfolioOpenApi();
app.MapHealthEndpoints();
app.MapProjectEndpoints();
app.MapContactEndpoints();

app.Run();

public partial class Program;
