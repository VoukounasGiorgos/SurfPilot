using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Backend.Models;

namespace Backend.Services;

public class LlmRecommendationService(HttpClient httpClient, IConfiguration config)
{
    public async Task<GearRecommendation> GetRecommendationAsync(RecommendationRequest request)
    {
        var apiKey = config["Gemini:ApiKey"]
            ?? throw new InvalidOperationException("Gemini API key not configured. Add Gemini:ApiKey to appsettings.json");

        var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

        var payload = new
        {
            contents = new[]
            {
                new
                {
                    role  = "user",
                    parts = new[] { new { text = BuildPrompt(request) } }
                }
            },
            systemInstruction = new
            {
                parts = new[] { new { text = "You are an expert windsurf gear advisor. Always respond with valid JSON only, no extra text." } }
            },
            generationConfig = new
            {
                temperature      = 0.3,
                responseMimeType = "application/json"
            }
        };

        using var req = new HttpRequestMessage(HttpMethod.Post, url);
        req.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        var res  = await httpClient.SendAsync(req);
        var body = await res.Content.ReadAsStringAsync();

        if (!res.IsSuccessStatusCode)
            throw new InvalidOperationException($"Gemini error: {body}");

        var geminiRes = JsonSerializer.Deserialize<GeminiNativeResponse>(body)
            ?? throw new InvalidOperationException("Failed to parse Gemini response");

        var content = geminiRes.Candidates?.FirstOrDefault()?.Content?.Parts?.FirstOrDefault()?.Text
            ?? throw new InvalidOperationException("Empty response from Gemini");

        var dto = JsonSerializer.Deserialize<LlmRecommendationDto>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        }) ?? throw new InvalidOperationException("Failed to parse Gemini recommendation JSON");

        return new GearRecommendation(
            dto.RecommendedSailSize,
            dto.SailMin,
            dto.SailMax,
            Enum.Parse<PowerRating>(dto.PowerRating, ignoreCase: true),
            dto.BoardVolumeLiters,
            dto.FinLengthCm,
            dto.Reasoning
        );
    }

    private static string BuildPrompt(RecommendationRequest r)
    {
        var w    = r.WeatherData;
        var p    = r.UserProfile;
        var spot = r.SpotName ?? "Unknown spot";

        var sources = w.Sources is { Length: > 0 }
            ? string.Join("\n", w.Sources.Select(s =>
                $"  - {s.Source}: {s.WindSpeedKnots} kn wind / {s.WindGustKnots} kn gusts"))
            : "  - Single source";

        return $$"""
            Rider: {{p.WeightKg}} kg, {{p.Experience}} level
            Spot: {{spot}}
            Wind (averaged): {{w.WindSpeedKnots}} kn, gusts {{w.WindGustKnots}} kn, direction {{w.WindDirection}}°
            Sources:
            {{sources}}

            Recommend windsurf gear. Respond ONLY with this JSON:
            {
              "recommendedSailSize": <number>,
              "sailMin": <number>,
              "sailMax": <number>,
              "powerRating": "<Underpowered|Optimal|Overpowered>",
              "boardVolumeLiters": <number>,
              "finLengthCm": <number>,
              "reasoning": "<1-2 sentence explanation>"
            }
            """;
    }
}

internal class GeminiNativeResponse
{
    [JsonPropertyName("candidates")]
    public GeminiCandidate[]? Candidates { get; set; }
}

internal class GeminiCandidate
{
    [JsonPropertyName("content")]
    public GeminiContent? Content { get; set; }
}

internal class GeminiContent
{
    [JsonPropertyName("parts")]
    public GeminiPart[]? Parts { get; set; }
}

internal class GeminiPart
{
    [JsonPropertyName("text")]
    public string? Text { get; set; }
}

internal class LlmRecommendationDto
{
    public double RecommendedSailSize { get; set; }
    public double SailMin             { get; set; }
    public double SailMax             { get; set; }
    public string PowerRating         { get; set; } = "Optimal";
    public double BoardVolumeLiters   { get; set; }
    public int    FinLengthCm         { get; set; }
    public string Reasoning           { get; set; } = "";
}
