using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationController(RecommendationService recommendationService) : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] RecommendationRequest request)
    {
        var recommendation = recommendationService.Calculate(request.UserProfile, request.WeatherData);
        return Ok(recommendation);
    }
}
