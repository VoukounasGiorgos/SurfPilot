'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, WeatherData, GearRecommendation, Spot } from '@/types';
import { loadProfile, clearProfile } from '@/lib/storage';
import { fetchWeather, fetchRecommendation } from '@/lib/api';
import SpotSelector from '@/components/SpotSelector';
import WeatherCard from '@/components/WeatherCard';
import RecommendationCard from '@/components/RecommendationCard';

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentSpot, setCurrentSpot] = useState<Spot | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<GearRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.push('/onboarding');
    } else {
      setProfile(p);
    }
  }, [router]);

  const handleSpotSelect = async (spot: Spot) => {
    if (!profile) return;
    setCurrentSpot(spot);
    setWeather(null);
    setRecommendation(null);
    setError(null);
    setLoading(true);
    try {
      const w = await fetchWeather(spot.lat, spot.lon);
      setWeather(w);
      const r = await fetchRecommendation(profile, w);
      setRecommendation(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-100">
      <header className="bg-white border-b border-slate-100 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-cyan-700">SurfPilot</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              {profile.weightKg} kg · {profile.experience}
            </span>
            <button
              onClick={() => { clearProfile(); router.push('/onboarding'); }}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        <SpotSelector onSelect={handleSpotSelect} loading={loading} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {weather && currentSpot && (
          <WeatherCard weather={weather} spotName={currentSpot.name} />
        )}

        {recommendation && (
          <RecommendationCard recommendation={recommendation} />
        )}
      </main>
    </div>
  );
}
