using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationController(
    RecommendationService recommendationService,
    LlmRecommendationService llmRecommendationService) : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] RecommendationRequest request)
    {
        var recommendation = recommendationService.Calculate(request.UserProfile, request.WeatherData);
        return Ok(recommendation);
    }

    [HttpPost("ai")]
    public async Task<IActionResult> PostAi([FromBody] RecommendationRequest request)
    {
        try
        {
            var recommendation = await llmRecommendationService.GetRecommendationAsync(request);
            return Ok(recommendation);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
