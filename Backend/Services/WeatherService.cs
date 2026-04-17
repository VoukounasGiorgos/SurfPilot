using System.Text.Json.Serialization;
using Backend.Models;

namespace Backend.Services;

public class WeatherService(HttpClient httpClient)
{
    public async Task<WeatherReading> GetWeatherAsync(double lat, double lon)
    {
        var url = $"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=kn";
        var response = await httpClient.GetFromJsonAsync<OpenMeteoResponse>(url);

        if (response?.Current == null)
            throw new InvalidOperationException("Failed to fetch weather data from Open-Meteo");

        return new WeatherReading(
            "Open-Meteo",
            response.Current.WindSpeed10m,
            response.Current.WindGusts10m,
            response.Current.WindDirection10m
        );
    }
}

internal class OpenMeteoResponse
{
    [JsonPropertyName("current")]
    public OpenMeteoCurrent? Current { get; set; }
}

internal class OpenMeteoCurrent
{
    [JsonPropertyName("wind_speed_10m")]
    public double WindSpeed10m { get; set; }

    [JsonPropertyName("wind_gusts_10m")]
    public double WindGusts10m { get; set; }

    [JsonPropertyName("wind_direction_10m")]
    public double WindDirection10m { get; set; }
}
