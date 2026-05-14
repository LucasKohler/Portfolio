using Portfolio.Domain.Projects;

namespace Portfolio.Application.Projects;

public interface IProjectRepository
{
    Task<IReadOnlyCollection<Project>> ListAsync(CancellationToken cancellationToken);

    Task<Project?> GetBySlugAsync(string slug, CancellationToken cancellationToken);
}
