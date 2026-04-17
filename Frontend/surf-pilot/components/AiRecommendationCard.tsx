import { GearRecommendation, PowerRating } from '@/types';

interface AiRecommendationCardProps {
  recommendation: GearRecommendation;
}

const powerConfig: Record<PowerRating, { label: string; color: string; bg: string }> = {
  Underpowered: { label: 'Underpowered', color: 'text-amber-700', bg: 'bg-amber-100' },
  Optimal:      { label: 'Optimal',      color: 'text-green-700', bg: 'bg-green-100' },
  Overpowered:  { label: 'Overpowered',  color: 'text-red-700',   bg: 'bg-red-100'   },
};

export default function AiRecommendationCard({ recommendation: r }: AiRecommendationCardProps) {
  const power = powerConfig[r.powerRating];

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-violet-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700">
          AI · Gemini 2.5 Flash
        </span>
        <h2 className="text-lg font-semibold text-slate-800">AI Recommendation</h2>
      </div>

      <div className="text-center mb-5">
        <p className="text-8xl font-bold text-slate-900 leading-none">{r.recommendedSailSize}</p>
        <p className="text-2xl text-slate-400 mt-1">m²</p>
        <p className="text-sm text-slate-400 mt-2">Range: {r.sailMin} – {r.sailMax} m²</p>
      </div>

      <div className="flex justify-center mb-5">
        <span className={`px-5 py-1.5 rounded-full text-sm font-semibold ${power.bg} ${power.color}`}>
          {power.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-center mb-4">
        <div>
          <p className="text-2xl font-bold text-slate-700">{r.boardVolumeLiters} L</p>
          <p className="text-xs text-slate-400 mt-1">Board Volume</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-700">{r.finLengthCm} cm</p>
          <p className="text-xs text-slate-400 mt-1">Fin Length</p>
        </div>
      </div>

      {r.reasoning && (
        <div className="bg-violet-50 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-violet-600 mb-1">AI Reasoning</p>
          <p className="text-sm text-slate-600 leading-relaxed">{r.reasoning}</p>
        </div>
      )}
    </div>
  );
}
