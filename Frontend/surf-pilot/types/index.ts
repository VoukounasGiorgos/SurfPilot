export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type PowerRating = 'Underpowered' | 'Optimal' | 'Overpowered';

export interface UserProfile {
  weightKg: number;
  experience: ExperienceLevel;
}

export interface WeatherSource {
  source: string;
  windSpeedKnots: number;
  windGustKnots: number;
  windDirection: number;
}

export interface WeatherData {
  windSpeedKnots: number;
  windGustKnots: number;
  windDirection: number;
  sources?: WeatherSource[];
  condition?: string;
  conditionIcon?: string;
  waveHeightM?: number;
  wavePeriodS?: number;
}

export interface GearRecommendation {
  recommendedSailSize: number;
  sailMin: number;
  sailMax: number;
  powerRating: PowerRating;
  boardVolumeLiters: number;
  finLengthCm: number;
  reasoning?: string;
}

export interface Spot {
  name: string;
  lat: number;
  lon: number;
}
