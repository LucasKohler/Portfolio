using Portfolio.Application.Contact;

namespace Portfolio.Api.Endpoints;

public static class ContactEndpoints
{
    public static RouteGroupBuilder MapContactEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/contact")
            .WithTags("Contact");

        group.MapPost("/", async (
            ContactRequestDto request,
            IContactSubmissionService contactSubmission,
            CancellationToken cancellationToken) =>
        {
            var result = await contactSubmission.SubmitAsync(request, cancellationToken);

            return result.IsValid
                ? Results.Accepted(value: result.Response)
                : Results.ValidationProblem(result.Errors);
        })
        .WithName("SubmitContact")
        .WithSummary("Validates a contact request without sending email.")
        .WithDescription("Email delivery is intentionally not configured yet. This endpoint validates the request and returns an honest placeholder response.")
        .Accepts<ContactRequestDto>("application/json")
        .Produces<ContactResponseDto>(StatusCodes.Status202Accepted)
        .ProducesValidationProblem(StatusCodes.Status400BadRequest);

        return group;
    }
}

