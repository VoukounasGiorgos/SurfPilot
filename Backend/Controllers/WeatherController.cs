using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController(WeatherService openMeteoService, MetNorwayService metNorwayService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] double lat, [FromQuery] double lon)
    {
        var results = await Task.WhenAll(
            SafeFetch(() => openMeteoService.GetWeatherAsync(lat, lon)),
            SafeFetch(() => metNorwayService.GetWeatherAsync(lat, lon))
        );

        var readings = results.Where(r => r != null).Cast<WeatherReading>().ToArray();

        if (readings.Length == 0)
            return BadRequest(new { error = "All weather sources failed to respond" });

        var avgSpeed = Math.Round(readings.Average(r => r.WindSpeedKnots), 1);
        var avgGust  = Math.Round(readings.Average(r => r.WindGustKnots), 1);
        var avgDir   = Math.Round(CircularMean(readings.Select(r => r.WindDirection)), 1);

        return Ok(new WeatherData(avgSpeed, avgGust, avgDir, readings));
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
}
