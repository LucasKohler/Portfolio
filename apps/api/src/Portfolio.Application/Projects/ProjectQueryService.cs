using Portfolio.Domain.Projects;

namespace Portfolio.Application.Projects;

public sealed class ProjectQueryService : IProjectQueryService
{
    private readonly IProjectRepository _repository;

    public ProjectQueryService(IProjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyCollection<ProjectSummaryDto>> GetProjectsAsync(
        CancellationToken cancellationToken)
    {
        var projects = await _repository.ListAsync(cancellationToken);

        return projects
            .Select(ProjectMappings.ToSummaryDto)
            .ToArray();
    }

    public async Task<ProjectDetailDto?> GetProjectBySlugAsync(
        string slug,
        CancellationToken cancellationToken)
    {
        var project = await _repository.GetBySlugAsync(slug, cancellationToken);

        return project is null ? null : ProjectMappings.ToDetailDto(project);
    }
}

internal static class ProjectMappings
{
    public static ProjectSummaryDto ToSummaryDto(Project project)
    {
        return new ProjectSummaryDto(
            project.Slug,
            project.Title,
            project.Description,
            project.Summary,
            project.Category.Select(ToLabel).ToArray(),
            ToLabel(project.Status),
            project.Stack,
            project.Featured,
            project.RepositoryUrl,
            project.LiveUrl);
    }

    public static ProjectDetailDto ToDetailDto(Project project)
    {
        return new ProjectDetailDto(
            project.Slug,
            project.Title,
            project.Description,
            project.Summary,
            project.Category.Select(ToLabel).ToArray(),
            ToLabel(project.Status),
            project.Stack,
            project.Featured,
            project.RepositoryUrl,
            project.LiveUrl,
            project.Overview,
            project.Purpose,
            project.TechnicalHighlights,
            project.ImplementationNotes,
            project.NextSteps);
    }

    private static string ToLabel(ProjectStatus status)
    {
        return status switch
        {
            ProjectStatus.InProgress => "In Progress",
            ProjectStatus.CaseStudy => "Case Study",
            ProjectStatus.Draft => "Draft",
            ProjectStatus.PrivateRepository => "Private Repository",
            ProjectStatus.LiveDemo => "Live Demo",
            ProjectStatus.ComingSoon => "Coming Soon",
            _ => throw new ArgumentOutOfRangeException(nameof(status), status, null)
        };
    }

    private static string ToLabel(ProjectCategory category)
    {
        return category switch
        {
            ProjectCategory.Fullstack => "Fullstack",
            ProjectCategory.Frontend => "Frontend",
            ProjectCategory.Backend => "Backend",
            ProjectCategory.Data => "Data",
            ProjectCategory.AIWorkflow => "AI Workflow",
            ProjectCategory.Architecture => "Architecture",
            ProjectCategory.Performance => "Performance",
            ProjectCategory.Portfolio => "Portfolio",
            _ => throw new ArgumentOutOfRangeException(nameof(category), category, null)
        };
    }
}
