using Portfolio.Application.Projects;

namespace Portfolio.Api.Endpoints;

public static class ProjectsEndpoints
{
    public static RouteGroupBuilder MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/projects")
            .WithTags("Projects");

        group.MapGet("/", async (
            IProjectQueryService projects,
            CancellationToken cancellationToken) =>
        {
            var result = await projects.GetProjectsAsync(cancellationToken);

            return Results.Ok(result);
        })
        .WithName("GetProjects")
        .WithSummary("Gets project summaries.")
        .Produces<IReadOnlyCollection<ProjectSummaryDto>>(StatusCodes.Status200OK);

        group.MapGet("/{slug}", async (
            string slug,
            IProjectQueryService projects,
            CancellationToken cancellationToken) =>
        {
            var result = await projects.GetProjectBySlugAsync(slug, cancellationToken);

            return result is null
                ? Results.Problem(
                    title: "Project not found",
                    detail: $"No project was found for slug '{slug}'.",
                    statusCode: StatusCodes.Status404NotFound)
                : Results.Ok(result);
        })
        .WithName("GetProjectBySlug")
        .WithSummary("Gets project detail by slug.")
        .Produces<ProjectDetailDto>(StatusCodes.Status200OK)
        .ProducesProblem(StatusCodes.Status404NotFound);

        return group;
    }
}
