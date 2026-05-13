using System.Text.Json;
using Portfolio.Application.Projects;
using Portfolio.Domain.Projects;

namespace Portfolio.Infrastructure.Projects;

public sealed class JsonProjectRepository : IProjectRepository
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web);
    private readonly string _dataPath;

    public JsonProjectRepository()
    {
        _dataPath = Path.Combine(AppContext.BaseDirectory, "Data", "projects.json");
    }

    public async Task<IReadOnlyCollection<Project>> ListAsync(CancellationToken cancellationToken)
    {
        if (!File.Exists(_dataPath))
        {
            throw new FileNotFoundException("Project data file was not found.", _dataPath);
        }

        await using var stream = File.OpenRead(_dataPath);
        var records = await JsonSerializer.DeserializeAsync<ProjectRecord[]>(
            stream,
            SerializerOptions,
            cancellationToken);

        return records?
            .Select(ToDomain)
            .ToArray() ?? [];
    }

    public async Task<Project?> GetBySlugAsync(string slug, CancellationToken cancellationToken)
    {
        var projects = await ListAsync(cancellationToken);

        return projects.FirstOrDefault(project =>
            string.Equals(project.Slug, slug, StringComparison.OrdinalIgnoreCase));
    }

    private static Project ToDomain(ProjectRecord record)
    {
        return new Project(
            record.Slug,
            record.Title,
            record.Description,
            record.Summary,
            record.Category.Select(ParseCategory).ToArray(),
            ParseStatus(record.Status),
            record.Stack,
            record.Featured,
            string.IsNullOrWhiteSpace(record.RepositoryUrl) ? null : record.RepositoryUrl,
            string.IsNullOrWhiteSpace(record.LiveUrl) ? null : record.LiveUrl,
            record.Overview,
            record.Purpose,
            record.TechnicalHighlights,
            record.ImplementationNotes,
            record.NextSteps);
    }

    private static ProjectStatus ParseStatus(string value)
    {
        return value.Trim() switch
        {
            "In Progress" => ProjectStatus.InProgress,
            "Case Study" => ProjectStatus.CaseStudy,
            "Draft" => ProjectStatus.Draft,
            "Private Repository" => ProjectStatus.PrivateRepository,
            "Live Demo" => ProjectStatus.LiveDemo,
            "Coming Soon" => ProjectStatus.ComingSoon,
            _ => throw new InvalidDataException($"Unsupported project status '{value}'.")
        };
    }

    private static ProjectCategory ParseCategory(string value)
    {
        return value.Trim() switch
        {
            "Fullstack" => ProjectCategory.Fullstack,
            "Frontend" => ProjectCategory.Frontend,
            "Backend" => ProjectCategory.Backend,
            "Data" => ProjectCategory.Data,
            "AI Workflow" => ProjectCategory.AIWorkflow,
            "Architecture" => ProjectCategory.Architecture,
            "Performance" => ProjectCategory.Performance,
            "Portfolio" => ProjectCategory.Portfolio,
            _ => throw new InvalidDataException($"Unsupported project category '{value}'.")
        };
    }
}

internal sealed record ProjectRecord(
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
