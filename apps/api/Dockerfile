FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY Portfolio.slnx ./
COPY src/Portfolio.Api/Portfolio.Api.csproj src/Portfolio.Api/
COPY src/Portfolio.Application/Portfolio.Application.csproj src/Portfolio.Application/
COPY src/Portfolio.Domain/Portfolio.Domain.csproj src/Portfolio.Domain/
COPY src/Portfolio.Infrastructure/Portfolio.Infrastructure.csproj src/Portfolio.Infrastructure/
COPY tests/Portfolio.Api.Tests/Portfolio.Api.Tests.csproj tests/Portfolio.Api.Tests/
COPY tests/Portfolio.Application.Tests/Portfolio.Application.Tests.csproj tests/Portfolio.Application.Tests/
RUN dotnet restore Portfolio.slnx
COPY . .
RUN dotnet publish src/Portfolio.Api/Portfolio.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS development
WORKDIR /src
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 8080
CMD ["dotnet", "watch", "--project", "src/Portfolio.Api/Portfolio.Api.csproj", "run", "--urls", "http://0.0.0.0:8080"]

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
