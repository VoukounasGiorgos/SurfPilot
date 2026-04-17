namespace Backend.Models;

public enum ExperienceLevel { Beginner, Intermediate, Advanced }

public record UserProfile(double WeightKg, ExperienceLevel Experience);
