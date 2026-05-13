using System.Net.Mail;

namespace Portfolio.Application.Contact;

public sealed class ContactSubmissionService : IContactSubmissionService
{
    private const int MaxNameLength = 120;
    private const int MaxEmailLength = 254;
    private const int MaxSubjectLength = 160;
    private const int MaxMessageLength = 4_000;
    private readonly IContactDeliveryService _deliveryService;

    public ContactSubmissionService(IContactDeliveryService deliveryService)
    {
        _deliveryService = deliveryService;
    }

    public Task<ContactSubmissionResult> SubmitAsync(
        ContactRequestDto request,
        CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var errors = Validate(request);

        if (errors.Count > 0)
        {
            return Task.FromResult(ContactSubmissionResult.Invalid(errors));
        }

        if (!_deliveryService.IsConfigured)
        {
            return Task.FromResult(ContactSubmissionResult.Validated());
        }

        var message = new ContactMessage(
            request.Name!.Trim(),
            request.Email!.Trim(),
            request.Subject!.Trim(),
            request.Message!.Trim());

        return SendConfiguredMessageAsync(message, cancellationToken);
    }

    private async Task<ContactSubmissionResult> SendConfiguredMessageAsync(
        ContactMessage message,
        CancellationToken cancellationToken)
    {
        await _deliveryService.SendAsync(message, cancellationToken);

        return ContactSubmissionResult.Delivered();
    }

    private static Dictionary<string, string[]> Validate(ContactRequestDto request)
    {
        var errors = new Dictionary<string, string[]>();

        ValidateRequiredText(errors, nameof(request.Name), request.Name, MaxNameLength);
        ValidateRequiredText(errors, nameof(request.Email), request.Email, MaxEmailLength);
        ValidateRequiredText(errors, nameof(request.Subject), request.Subject, MaxSubjectLength);
        ValidateRequiredText(errors, nameof(request.Message), request.Message, MaxMessageLength);

        if (!string.IsNullOrWhiteSpace(request.Email) && !IsValidEmail(request.Email))
        {
            errors[nameof(request.Email)] =
            [
                "Email must be a valid email address."
            ];
        }

        return errors;
    }

    private static void ValidateRequiredText(
        IDictionary<string, string[]> errors,
        string field,
        string? value,
        int maxLength)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            errors[field] =
            [
                $"{field} is required."
            ];

            return;
        }

        if (value.Trim().Length > maxLength)
        {
            errors[field] =
            [
                $"{field} must be {maxLength} characters or fewer."
            ];
        }
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var address = new MailAddress(email);

            return string.Equals(address.Address, email.Trim(), StringComparison.OrdinalIgnoreCase);
        }
        catch (FormatException)
        {
            return false;
        }
    }
}

