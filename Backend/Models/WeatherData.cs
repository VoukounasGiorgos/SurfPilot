namespace Backend.Models;

public record WeatherData(
    double WindSpeedKnots,
    double WindGustKnots,
    double WindDirection,
    WeatherReading[]? Sources = null,
    string? Condition = null,
    string? ConditionIcon = null,
    double? WaveHeightM = null,
    double? WavePeriodS = null
);
