using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WeatherController(WeatherService weatherService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] double lat, [FromQuery] double lon)
    {
        try
        {
            var weather = await weatherService.GetWeatherAsync(lat, lon);
            return Ok(weather);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
