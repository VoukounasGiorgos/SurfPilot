namespace Backend.Models;

public record WeatherData(
    double WindSpeedKnots,
    double WindGustKnots,
    double WindDirection,
    WeatherReading[]? Sources = null
);
