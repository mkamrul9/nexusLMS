# Use the official .NET 8.0 SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["AssignmentSubmissionSystem.API/AssignmentSubmissionSystem.API.csproj", "AssignmentSubmissionSystem.API/"]
COPY ["AssignmentSubmissionSystem.Application/AssignmentSubmissionSystem.Application.csproj", "AssignmentSubmissionSystem.Application/"]
COPY ["AssignmentSubmissionSystem.Domain/AssignmentSubmissionSystem.Domain.csproj", "AssignmentSubmissionSystem.Domain/"]
COPY ["AssignmentSubmissionSystem.Infrastructure/AssignmentSubmissionSystem.Infrastructure.csproj", "AssignmentSubmissionSystem.Infrastructure/"]

RUN dotnet restore "AssignmentSubmissionSystem.API/AssignmentSubmissionSystem.API.csproj"

# Copy the remaining source code
COPY . .
WORKDIR "/src/AssignmentSubmissionSystem.API"

# Build and publish the app
RUN dotnet publish "AssignmentSubmissionSystem.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Use the official ASP.NET Core runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Expose port 80/8080 (Render expects web services to listen on HTTP)
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AssignmentSubmissionSystem.API.dll"]
