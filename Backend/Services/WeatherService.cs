using System.Text.Json.Serialization;
using Backend.Models;

namespace Backend.Services;

public class WeatherService(HttpClient httpClient)
{
    public async Task<WeatherReading> GetWeatherAsync(double lat, double lon, DateTime? forecastTime = null)
    {
        if (forecastTime.HasValue)
        {
            var date = forecastTime.Value.ToString("yyyy-MM-dd");
            var url  = $"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}" +
                       $"&hourly=wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=kn" +
                       $"&start_date={date}&end_date={date}&timezone=auto";

            var res = await httpClient.GetFromJsonAsync<OpenMeteoHourlyResponse>(url);
            var hourly = res?.Hourly ?? throw new InvalidOperationException("No hourly data from Open-Meteo");

            var targetKey = forecastTime.Value.ToString("yyyy-MM-ddTHH:00");
            var idx = hourly.Time?.IndexOf(targetKey) ?? -1;
            if (idx < 0) idx = 0;

            return new WeatherReading(
                "Open-Meteo",
                hourly.WindSpeed10m![idx],
                hourly.WindGusts10m![idx],
                hourly.WindDirection10m![idx]
            );
        }
        else
        {
            var url = $"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}" +
                      $"&current=wind_speed_10m,wind_gusts_10m,wind_direction_10m&wind_speed_unit=kn";

            var res = await httpClient.GetFromJsonAsync<OpenMeteoCurrentResponse>(url);
            var current = res?.Current ?? throw new InvalidOperationException("Failed to fetch weather from Open-Meteo");

            return new WeatherReading("Open-Meteo", current.WindSpeed10m, current.WindGusts10m, current.WindDirection10m);
        }
    }
}

internal class OpenMeteoCurrentResponse
{
    [JsonPropertyName("current")]
    public OpenMeteoCurrent? Current { get; set; }
}

internal class OpenMeteoCurrent
{
    [JsonPropertyName("wind_speed_10m")]    public double WindSpeed10m { get; set; }
    [JsonPropertyName("wind_gusts_10m")]    public double WindGusts10m { get; set; }
    [JsonPropertyName("wind_direction_10m")] public double WindDirection10m { get; set; }
}

internal class OpenMeteoHourlyResponse
{
    [JsonPropertyName("hourly")]
    public OpenMeteoHourly? Hourly { get; set; }
}

internal class OpenMeteoHourly
{
    [JsonPropertyName("time")]              public List<string>? Time { get; set; }
    [JsonPropertyName("wind_speed_10m")]    public List<double>? WindSpeed10m { get; set; }
    [JsonPropertyName("wind_gusts_10m")]    public List<double>? WindGusts10m { get; set; }
    [JsonPropertyName("wind_direction_10m")] public List<double>? WindDirection10m { get; set; }
}
