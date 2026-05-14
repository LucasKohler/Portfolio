namespace Portfolio.Application.Projects;

public interface IProjectQueryService
{
    Task<IReadOnlyCollection<ProjectSummaryDto>> GetProjectsAsync(CancellationToken cancellationToken);

    Task<ProjectDetailDto?> GetProjectBySlugAsync(string slug, CancellationToken cancellationToken);
}
