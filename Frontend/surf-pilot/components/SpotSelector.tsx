'use client';

import { useState } from 'react';
import { Spot } from '@/types';
import { PRESET_SPOTS } from '@/lib/spots';

interface SpotSelectorProps {
  onSelect: (spot: Spot, forecastTime?: string) => void;
  loading: boolean;
}

function nowLocalISO() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function maxLocalISO() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 16);
}

export default function SpotSelector({ onSelect, loading }: SpotSelectorProps) {
  const [selected, setSelected] = useState<Spot | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');
  const [forecastTime, setForecastTime] = useState('');

  const canSubmit = useCustom
    ? customLat !== '' && customLon !== '' && !isNaN(parseFloat(customLat)) && !isNaN(parseFloat(customLon))
    : selected !== null;

  const handleSubmit = () => {
    const spot = useCustom
      ? { name: 'Custom Location', lat: parseFloat(customLat), lon: parseFloat(customLon) }
      : selected!;
    onSelect(spot, forecastTime || undefined);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Select Spot</h2>

      {!useCustom ? (
        <div className="space-y-3">
          <select
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={selected?.name ?? ''}
            onChange={(e) => setSelected(PRESET_SPOTS.find(s => s.name === e.target.value) ?? null)}
          >
            <option value="">— Choose a popular spot —</option>
            {PRESET_SPOTS.map(spot => (
              <option key={spot.name} value={spot.name}>{spot.name}</option>
            ))}
          </select>
          <button type="button" onClick={() => setUseCustom(true)} className="text-sm text-cyan-600 hover:text-cyan-700 underline">
            Enter custom coordinates instead
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <input type="number" placeholder="Latitude"  value={customLat} onChange={(e) => setCustomLat(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            <input type="number" placeholder="Longitude" value={customLon} onChange={(e) => setCustomLon(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <button type="button" onClick={() => { setUseCustom(false); setCustomLat(''); setCustomLon(''); }}
            className="text-sm text-cyan-600 hover:text-cyan-700 underline">
            Choose from popular spots instead
          </button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          Forecast time <span className="font-normal text-slate-400">(αφήστε κενό για τώρα)</span>
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="datetime-local"
            value={forecastTime}
            min={nowLocalISO()}
            max={maxLocalISO()}
            onChange={(e) => setForecastTime(e.target.value)}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {forecastTime && (
            <button type="button" onClick={() => setForecastTime('')}
              className="text-xs text-slate-400 hover:text-slate-600 underline whitespace-nowrap">
              Τώρα
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl py-3 transition-colors"
      >
        {loading ? 'Fetching conditions…' : 'Get Forecast'}
      </button>
    </div>
  );
}
