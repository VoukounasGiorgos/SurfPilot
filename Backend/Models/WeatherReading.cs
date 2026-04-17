namespace Backend.Models;

public record WeatherReading(string Source, double WindSpeedKnots, double WindGustKnots, double WindDirection);
