export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type PowerRating = 'Underpowered' | 'Optimal' | 'Overpowered';

export interface UserProfile {
  weightKg: number;
  experience: ExperienceLevel;
}

export interface WeatherData {
  windSpeedKnots: number;
  windGustKnots: number;
  windDirection: number;
}

export interface GearRecommendation {
  recommendedSailSize: number;
  sailMin: number;
  sailMax: number;
  powerRating: PowerRating;
  boardVolumeLiters: number;
  finLengthCm: number;
}

export interface Spot {
  name: string;
  lat: number;
  lon: number;
}
