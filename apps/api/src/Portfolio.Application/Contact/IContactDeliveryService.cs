namespace Portfolio.Application.Contact;

public interface IContactDeliveryService
{
    bool IsConfigured { get; }

    Task SendAsync(ContactMessage message, CancellationToken cancellationToken);
}

