using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController(WeatherService openMeteoService, MetNorwayService metNorwayService, MarineService marineService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] double lat, [FromQuery] double lon, [FromQuery] string? forecastTime = null)
    {
        DateTime? dt = forecastTime != null ? DateTime.Parse(forecastTime) : null;

        var weatherTask = Task.WhenAll(
            SafeFetch(() => openMeteoService.GetWeatherAsync(lat, lon, dt)),
            SafeFetch(() => metNorwayService.GetWeatherAsync(lat, lon, dt))
        );
        var waveTask = marineService.GetWavesAsync(lat, lon, dt);

        var weatherResults = await weatherTask;
        var waves = await waveTask;

        var readings = weatherResults.Where(r => r != null).Cast<WeatherReading>().ToArray();

        if (readings.Length == 0)
            return BadRequest(new { error = "All weather sources failed to respond" });

        var avgSpeed = Math.Round(readings.Average(r => r.WindSpeedKnots), 1);
        var avgGust  = Math.Round(readings.Average(r => r.WindGustKnots), 1);
        var avgDir   = Math.Round(CircularMean(readings.Select(r => r.WindDirection)), 1);

        var weatherCode = readings.Select(r => r.WeatherCode).FirstOrDefault(c => c.HasValue);
        var (condition, conditionIcon) = WmoToCondition(weatherCode);

        return Ok(new WeatherData(avgSpeed, avgGust, avgDir, readings, condition, conditionIcon, waves.WaveHeightM, waves.WavePeriodS));
    }

    private static async Task<WeatherReading?> SafeFetch(Func<Task<WeatherReading>> fetch)
    {
        try { return await fetch(); }
        catch { return null; }
    }

    private static double CircularMean(IEnumerable<double> degrees)
    {
        var rads = degrees.Select(d => d * Math.PI / 180).ToList();
        var mean = Math.Atan2(rads.Average(Math.Sin), rads.Average(Math.Cos)) * 180 / Math.PI;
        return mean < 0 ? mean + 360 : mean;
    }

    private static (string? Condition, string? Icon) WmoToCondition(int? code) => code switch
    {
        0                          => ("Clear sky",      "☀️"),
        1                          => ("Mainly clear",   "🌤️"),
        2                          => ("Partly cloudy",  "⛅"),
        3                          => ("Overcast",       "☁️"),
        45 or 48                   => ("Foggy",          "🌫️"),
        51 or 53 or 55             => ("Drizzle",        "🌦️"),
        56 or 57                   => ("Freezing drizzle","🌧️"),
        61 or 63 or 65             => ("Rain",           "🌧️"),
        66 or 67                   => ("Freezing rain",  "🌧️"),
        71 or 73 or 75 or 77       => ("Snow",           "❄️"),
        80 or 81 or 82             => ("Showers",        "🌦️"),
        85 or 86                   => ("Snow showers",   "❄️"),
        95                         => ("Thunderstorm",   "⛈️"),
        96 or 99                   => ("Thunderstorm",   "⛈️"),
        _                          => (null,             null),
    };
}
