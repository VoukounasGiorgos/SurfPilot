import { GearRecommendation, PowerRating } from '@/types';

interface RecommendationCardProps {
  recommendation: GearRecommendation;
}

const powerConfig: Record<PowerRating, { label: string; color: string; bg: string }> = {
  Underpowered: { label: 'Underpowered', color: 'text-amber-700',  bg: 'bg-amber-100'  },
  Optimal:      { label: 'Optimal',      color: 'text-green-700',  bg: 'bg-green-100'  },
  Overpowered:  { label: 'Overpowered',  color: 'text-red-700',    bg: 'bg-red-100'    },
};

export default function RecommendationCard({ recommendation: r }: RecommendationCardProps) {
  const power = powerConfig[r.powerRating];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Gear Recommendation</h2>

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

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-center">
        <div>
          <p className="text-2xl font-bold text-slate-700">{r.boardVolumeLiters} L</p>
          <p className="text-xs text-slate-400 mt-1">Board Volume</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-700">{r.finLengthCm} cm</p>
          <p className="text-xs text-slate-400 mt-1">Fin Length</p>
        </div>
      </div>
    </div>
  );
}
