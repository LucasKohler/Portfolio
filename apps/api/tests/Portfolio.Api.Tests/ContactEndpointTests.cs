using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Portfolio.Api.Tests;

public sealed class ContactEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ContactEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostContact_WhenPayloadIsValid_ReturnsHonestAcceptedResponse()
    {
        using var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "Lucas Kohler Marques",
            email = "lucas@example.com",
            subject = "Project discussion",
            message = "I would like to discuss a software engineering opportunity."
        });

        Assert.Equal(HttpStatusCode.Accepted, response.StatusCode);

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var document = await JsonDocument.ParseAsync(stream);

        var root = document.RootElement;
        Assert.Equal("validated", root.GetProperty("status").GetString());
        Assert.False(root.GetProperty("emailDeliveryConfigured").GetBoolean());
        Assert.Contains("no message was sent or stored", root.GetProperty("message").GetString());
    }

    [Fact]
    public async Task PostContact_WhenPayloadIsMissingRequiredFields_ReturnsValidationProblem()
    {
        using var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "",
            email = "",
            subject = "",
            message = ""
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var document = await JsonDocument.ParseAsync(stream);

        var errors = document.RootElement.GetProperty("errors");
        Assert.True(errors.TryGetProperty("Name", out _));
        Assert.True(errors.TryGetProperty("Email", out _));
        Assert.True(errors.TryGetProperty("Subject", out _));
        Assert.True(errors.TryGetProperty("Message", out _));
    }

    [Fact]
    public async Task PostContact_WhenEmailIsInvalid_ReturnsValidationProblem()
    {
        using var response = await _client.PostAsJsonAsync("/api/contact", new
        {
            name = "Lucas Kohler Marques",
            email = "not-an-email",
            subject = "Project discussion",
            message = "I would like to discuss a software engineering opportunity."
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var document = await JsonDocument.ParseAsync(stream);

        var errors = document.RootElement.GetProperty("errors");
        Assert.True(errors.TryGetProperty("Email", out _));
    }
}

