namespace Portfolio.Application.Contact;

public sealed class ContactSubmissionResult
{
    private ContactSubmissionResult(
        bool isValid,
        ContactResponseDto? response,
        IReadOnlyDictionary<string, string[]> errors)
    {
        IsValid = isValid;
        Response = response;
        Errors = errors;
    }

    public bool IsValid { get; }

    public ContactResponseDto? Response { get; }

    public IReadOnlyDictionary<string, string[]> Errors { get; }

    public static ContactSubmissionResult Validated()
    {
        return new ContactSubmissionResult(
            true,
            new ContactResponseDto(
                "validated",
                "The contact request was validated. Email delivery is not configured yet, so no message was sent or stored.",
            false),
            new Dictionary<string, string[]>());
    }

    public static ContactSubmissionResult Delivered()
    {
        return new ContactSubmissionResult(
            true,
            new ContactResponseDto(
                "delivered",
                "The contact request was delivered through the configured email provider.",
                true),
            new Dictionary<string, string[]>());
    }

    public static ContactSubmissionResult Invalid(IReadOnlyDictionary<string, string[]> errors)
    {
        return new ContactSubmissionResult(false, null, errors);
    }
}

