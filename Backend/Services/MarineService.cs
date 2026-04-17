using System.Text.Json.Serialization;

namespace Backend.Services;

public class MarineService(HttpClient httpClient)
{
    public async Task<(double? WaveHeightM, double? WavePeriodS)> GetWavesAsync(double lat, double lon, DateTime? forecastTime = null)
    {
        try
        {
            if (forecastTime.HasValue)
            {
                var date = forecastTime.Value.ToString("yyyy-MM-dd");
                var url = $"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}" +
                          $"&hourly=wave_height,wave_period&start_date={date}&end_date={date}&timezone=auto";

                var res = await httpClient.GetFromJsonAsync<MarineHourlyResponse>(url);
                var hourly = res?.Hourly;
                if (hourly?.Time == null) return (null, null);

                var targetKey = forecastTime.Value.ToString("yyyy-MM-ddTHH:00");
                var idx = hourly.Time.IndexOf(targetKey);
                if (idx < 0) idx = 0;

                var height = hourly.WaveHeight?.Count > idx ? (double?)hourly.WaveHeight[idx] : null;
                var period = hourly.WavePeriod?.Count > idx ? (double?)hourly.WavePeriod[idx] : null;
                return (height, period);
            }
            else
            {
                var url = $"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}" +
                          $"&current=wave_height,wave_period";

                var res = await httpClient.GetFromJsonAsync<MarineCurrentResponse>(url);
                var current = res?.Current;
                return (current?.WaveHeight, current?.WavePeriod);
            }
        }
        catch
        {
            return (null, null);
        }
    }
}

internal class MarineCurrentResponse
{
    [JsonPropertyName("current")]
    public MarineCurrent? Current { get; set; }
}

internal class MarineCurrent
{
    [JsonPropertyName("wave_height")] public double? WaveHeight { get; set; }
    [JsonPropertyName("wave_period")] public double? WavePeriod { get; set; }
}

internal class MarineHourlyResponse
{
    [JsonPropertyName("hourly")]
    public MarineHourly? Hourly { get; set; }
}

internal class MarineHourly
{
    [JsonPropertyName("time")]        public List<string>? Time { get; set; }
    [JsonPropertyName("wave_height")] public List<double>? WaveHeight { get; set; }
    [JsonPropertyName("wave_period")] public List<double>? WavePeriod { get; set; }
}
