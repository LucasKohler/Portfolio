using Portfolio.Application.Contact;

namespace Portfolio.Infrastructure.Contact;

public sealed class DisabledContactDeliveryService : IContactDeliveryService
{
    public bool IsConfigured => false;

    public Task SendAsync(ContactMessage message, CancellationToken cancellationToken)
    {
        throw new InvalidOperationException("Contact email delivery is not configured.");
    }
}

