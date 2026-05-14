namespace Portfolio.Domain.Projects;

public sealed class Project
{
    public Project(
        string slug,
        string title,
        string description,
        string summary,
        IReadOnlyCollection<ProjectCategory> category,
        ProjectStatus status,
        IReadOnlyCollection<string> stack,
        bool featured,
        string? repositoryUrl,
        string? liveUrl,
        string overview,
        string purpose,
        IReadOnlyCollection<string> technicalHighlights,
        string implementationNotes,
        IReadOnlyCollection<string> nextSteps)
    {
        Slug = slug;
        Title = title;
        Description = description;
        Summary = summary;
        Category = category;
        Status = status;
        Stack = stack;
        Featured = featured;
        RepositoryUrl = repositoryUrl;
        LiveUrl = liveUrl;
        Overview = overview;
        Purpose = purpose;
        TechnicalHighlights = technicalHighlights;
        ImplementationNotes = implementationNotes;
        NextSteps = nextSteps;
    }

    public string Slug { get; }
    public string Title { get; }
    public string Description { get; }
    public string Summary { get; }
    public IReadOnlyCollection<ProjectCategory> Category { get; }
    public ProjectStatus Status { get; }
    public IReadOnlyCollection<string> Stack { get; }
    public bool Featured { get; }
    public string? RepositoryUrl { get; }
    public string? LiveUrl { get; }
    public string Overview { get; }
    public string Purpose { get; }
    public IReadOnlyCollection<string> TechnicalHighlights { get; }
    public string ImplementationNotes { get; }
    public IReadOnlyCollection<string> NextSteps { get; }
}
