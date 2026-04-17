using Backend.Models;

namespace Backend.Services;

public class RecommendationService
{
    public GearRecommendation Calculate(UserProfile profile, WeatherData weather)
    {
        double wind = weather.WindSpeedKnots;

        var (baseMin, baseMax) = wind switch
        {
            < 10 => (7.5, 9.0),
            < 15 => (6.0, 7.5),
            < 20 => (5.0, 6.0),
            < 25 => (4.0, 5.0),
            < 30 => (3.5, 4.5),
            _    => (3.0, 4.0)
        };

        double adj = 0;
        adj += profile.WeightKg switch { < 70 => -0.5, > 80 => 0.5, _ => 0 };
        adj += profile.Experience switch
        {
            ExperienceLevel.Beginner => -0.5,
            ExperienceLevel.Advanced =>  0.5,
            _ => 0
        };

        double sailMin = Math.Round(baseMin + adj, 1);
        double sailMax = Math.Round(baseMax + adj, 1);
        double recommended = Math.Round((sailMin + sailMax) / 2.0, 1);

        var power = wind switch
        {
            < 10 => PowerRating.Underpowered,
            > 28 => PowerRating.Overpowered,
            _    => PowerRating.Optimal
        };

        double boardVolume = Math.Round(profile.WeightKg + profile.Experience switch
        {
            ExperienceLevel.Beginner     => 35,
            ExperienceLevel.Intermediate => 15,
            ExperienceLevel.Advanced     => -5,
            _ => 15
        });

        int finLength = recommended switch
        {
            < 4.0 => 23,
            < 5.0 => 29,
            < 6.0 => 35,
            _     => 43
        };

        return new GearRecommendation(recommended, sailMin, sailMax, power, boardVolume, finLength);
    }
}
