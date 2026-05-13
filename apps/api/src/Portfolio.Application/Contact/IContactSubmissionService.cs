namespace Portfolio.Application.Contact;

public interface IContactSubmissionService
{
    Task<ContactSubmissionResult> SubmitAsync(
        ContactRequestDto request,
        CancellationToken cancellationToken);
}

