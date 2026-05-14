namespace Portfolio.Application.Contact;

public sealed record ContactMessage(
    string Name,
    string Email,
    string Subject,
    string Message);

