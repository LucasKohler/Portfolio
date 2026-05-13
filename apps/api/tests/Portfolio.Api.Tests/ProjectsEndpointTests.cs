using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Portfolio.Api.Tests;

public sealed class ProjectsEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ProjectsEndpointTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetProjects_ReturnsInitialProjectSummaries()
    {
        using var response = await _client.GetAsync("/api/projects");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var document = await JsonDocument.ParseAsync(stream);

        var projects = document.RootElement;
        Assert.Equal(JsonValueKind.Array, projects.ValueKind);
        Assert.Equal(6, projects.GetArrayLength());

        var portfolioProject = projects.EnumerateArray()
            .Single(project => project.GetProperty("slug").GetString() == "portfolio-platform");

        Assert.Equal("Portfolio Platform", portfolioProject.GetProperty("title").GetString());
        Assert.Equal("In Progress", portfolioProject.GetProperty("status").GetString());
        Assert.True(portfolioProject.GetProperty("featured").GetBoolean());
        Assert.False(portfolioProject.TryGetProperty("overview", out _));
    }

    [Fact]
    public async Task GetProjectBySlug_ReturnsProjectDetail()
    {
        using var response = await _client.GetAsync("/api/projects/portfolio-platform");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var document = await JsonDocument.ParseAsync(stream);

        var project = document.RootElement;
        Assert.Equal("portfolio-platform", project.GetProperty("slug").GetString());
        Assert.Equal("Portfolio Platform", project.GetProperty("title").GetString());
        Assert.Equal("In Progress", project.GetProperty("status").GetString());
        Assert.True(project.GetProperty("technicalHighlights").GetArrayLength() > 0);
        Assert.True(project.GetProperty("nextSteps").GetArrayLength() > 0);
    }

    [Fact]
    public async Task GetProjectBySlug_WhenSlugDoesNotExist_ReturnsNotFound()
    {
        using var response = await _client.GetAsync("/api/projects/not-a-real-project");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
