namespace Backend.Models;

public record RecommendationRequest(UserProfile UserProfile, WeatherData WeatherData, string? SpotName = null);
