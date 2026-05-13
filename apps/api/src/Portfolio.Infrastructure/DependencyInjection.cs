using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Contact;
using Portfolio.Application.Projects;
using Portfolio.Infrastructure.Contact;
using Portfolio.Infrastructure.Projects;

namespace Portfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IContactDeliveryService, DisabledContactDeliveryService>();
        services.AddScoped<IProjectRepository, JsonProjectRepository>();

        return services;
    }
}
