using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Contact;
using Portfolio.Application.Projects;

namespace Portfolio.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IContactSubmissionService, ContactSubmissionService>();
        services.AddScoped<IProjectQueryService, ProjectQueryService>();

        return services;
    }
}
