'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, WeatherData, GearRecommendation, Spot } from '@/types';
import { loadProfile, clearProfile } from '@/lib/storage';
import { fetchWeather, fetchRecommendation, fetchAiRecommendation } from '@/lib/api';
import SpotSelector from '@/components/SpotSelector';
import WeatherCard from '@/components/WeatherCard';
import RecommendationCard from '@/components/RecommendationCard';
import AiRecommendationCard from '@/components/AiRecommendationCard';

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentSpot, setCurrentSpot] = useState<Spot | null>(null);
  const [forecastTime, setForecastTime] = useState<string | undefined>(undefined);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [recommendation, setRecommendation] = useState<GearRecommendation | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<GearRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      router.push('/onboarding');
    } else {
      setProfile(p);
    }
  }, [router]);

  const handleSpotSelect = async (spot: Spot, ft?: string) => {
    if (!profile) return;
    setCurrentSpot(spot);
    setForecastTime(ft);
    setWeather(null);
    setRecommendation(null);
    setAiRecommendation(null);
    setError(null);
    setAiError(null);
    setLoading(true);
    try {
      const w = await fetchWeather(spot.lat, spot.lon, ft);
      setWeather(w);
      const r = await fetchRecommendation(profile, w);
      setRecommendation(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAiRecommendation = async () => {
    if (!profile || !weather || !currentSpot) return;
    setAiRecommendation(null);
    setAiError(null);
    setAiLoading(true);
    try {
      const r = await fetchAiRecommendation(profile, weather, currentSpot.name);
      setAiRecommendation(r);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'AI recommendation failed');
    } finally {
      setAiLoading(false);
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
          <WeatherCard weather={weather} spotName={currentSpot.name} forecastTime={forecastTime} />
        )}

        {recommendation && (
          <RecommendationCard recommendation={recommendation} />
        )}

        {recommendation && !aiRecommendation && (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleAiRecommendation}
              disabled={aiLoading}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
            >
              {aiLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Asking AI…
                </>
              ) : (
                <>
                  <span>✦</span>
                  Ask AI (Gemini)
                </>
              )}
            </button>
            {aiError && (
              <p className="text-xs text-red-500">{aiError}</p>
            )}
          </div>
        )}

        {aiRecommendation && (
          <AiRecommendationCard recommendation={aiRecommendation} />
        )}
      </main>
    </div>
  );
}
