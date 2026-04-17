'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExperienceLevel } from '@/types';
import { saveProfile } from '@/lib/storage';

const levels: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: 'Beginner',     label: 'Beginner',     desc: 'Still learning, prefer control and stability' },
  { value: 'Intermediate', label: 'Intermediate', desc: 'Comfortable in most conditions' },
  { value: 'Advanced',     label: 'Advanced',     desc: 'High-power setups, challenging conditions' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);

  const canSubmit = experience !== null && weight !== '' && parseFloat(weight) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !experience) return;
    saveProfile({ weightKg: parseFloat(weight), experience });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-700">SurfPilot</h1>
          <p className="text-slate-500 mt-2">Set up your rider profile for personalized gear recommendations.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Weight (kg)
            </label>
            <input
              type="number"
              min="30"
              max="200"
              placeholder="e.g. 75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Experience Level
            </label>
            <div className="space-y-2">
              {levels.map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setExperience(value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors ${
                    experience === value
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-800'
                      : 'border-slate-200 text-slate-700 hover:border-cyan-300'
                  }`}
                >
                  <p className="font-semibold">{label}</p>
                  <p className="text-xs opacity-60 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl py-3 transition-colors"
          >
            Start Windsurfing
          </button>
        </form>
      </div>
    </div>
  );
}
