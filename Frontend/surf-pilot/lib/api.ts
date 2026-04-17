import { WeatherData, GearRecommendation, UserProfile } from '@/types';

const API_BASE = 'http://localhost:5163';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(`${API_BASE}/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || 'Failed to fetch weather');
  }
  return res.json();
}

export async function fetchRecommendation(
  profile: UserProfile,
  weather: WeatherData
): Promise<GearRecommendation> {
  const res = await fetch(`${API_BASE}/api/recommendation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userProfile: profile, weatherData: weather }),
  });
  if (!res.ok) throw new Error('Failed to calculate recommendation');
  return res.json();
}
