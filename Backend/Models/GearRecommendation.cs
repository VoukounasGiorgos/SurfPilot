namespace Backend.Models;

public enum PowerRating { Underpowered, Optimal, Overpowered }

public record GearRecommendation(
    double RecommendedSailSize,
    double SailMin,
    double SailMax,
    PowerRating PowerRating,
    double BoardVolumeLiters,
    int FinLengthCm
);
