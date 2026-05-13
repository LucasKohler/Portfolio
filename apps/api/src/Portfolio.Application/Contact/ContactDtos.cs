namespace Portfolio.Application.Contact;

public sealed record ContactRequestDto(
    string? Name,
    string? Email,
    string? Subject,
    string? Message);

public sealed record ContactResponseDto(
    string Status,
    string Message,
    bool EmailDeliveryConfigured);

