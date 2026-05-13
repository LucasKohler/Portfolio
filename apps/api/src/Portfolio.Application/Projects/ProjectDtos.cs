namespace Portfolio.Application.Projects;

public sealed record ProjectSummaryDto(
    string Slug,
    string Title,
    string Description,
    string Summary,
    IReadOnlyCollection<string> Category,
    string Status,
    IReadOnlyCollection<string> Stack,
    bool Featured,
    string? RepositoryUrl,
    string? LiveUrl);

public sealed record ProjectDetailDto(
    string Slug,
    string Title,
    string Description,
    string Summary,
    IReadOnlyCollection<string> Category,
    string Status,
    IReadOnlyCollection<string> Stack,
    bool Featured,
    string? RepositoryUrl,
    string? LiveUrl,
    string Overview,
    string Purpose,
    IReadOnlyCollection<string> TechnicalHighlights,
    string ImplementationNotes,
    IReadOnlyCollection<string> NextSteps);
