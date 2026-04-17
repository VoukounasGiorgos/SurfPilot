using System.Text.Json.Serialization;
using Backend.Models;

namespace Backend.Services;

public class MetNorwayService(HttpClient httpClient)
{
    private const double MsToKnots = 1.94384;

    public async Task<WeatherReading> GetWeatherAsync(double lat, double lon)
    {
        var url = $"https://api.met.no/weatherapi/locationforecast/2.0/compact?lat={lat}&lon={lon}";
        var response = await httpClient.GetFromJsonAsync<MetResponse>(url);

        var details = response?.Properties?.Timeseries?.FirstOrDefault()?.Data?.Instant?.Details
            ?? throw new InvalidOperationException("Failed to fetch weather from MET Norway");

        return new WeatherReading(
            "MET Norway",
            Math.Round(details.WindSpeed * MsToKnots, 1),
            Math.Round(details.WindGust * MsToKnots, 1),
            details.WindDirection
        );
    }
}

internal class MetResponse
{
    [JsonPropertyName("properties")]
    public MetProperties? Properties { get; set; }
}

internal class MetProperties
{
    [JsonPropertyName("timeseries")]
    public MetTimeseries[]? Timeseries { get; set; }
}

internal class MetTimeseries
{
    [JsonPropertyName("data")]
    public MetData? Data { get; set; }
}

internal class MetData
{
    [JsonPropertyName("instant")]
    public MetInstant? Instant { get; set; }
}

internal class MetInstant
{
    [JsonPropertyName("details")]
    public MetDetails? Details { get; set; }
}

internal class MetDetails
{
    [JsonPropertyName("wind_speed")]
    public double WindSpeed { get; set; }

    [JsonPropertyName("wind_speed_of_gust")]
    public double WindGust { get; set; }

    [JsonPropertyName("wind_from_direction")]
    public double WindDirection { get; set; }
}
