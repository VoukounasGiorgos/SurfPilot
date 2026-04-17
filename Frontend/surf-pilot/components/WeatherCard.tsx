import { WeatherData } from '@/types';

interface WeatherCardProps {
  weather: WeatherData;
  spotName: string;
}

function degreesToCardinal(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function WeatherCard({ weather, spotName }: WeatherCardProps) {
  return (
    <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold opacity-90">Wind Conditions</h2>
        <span className="text-sm opacity-75">{spotName}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-4xl font-bold">{weather.windSpeedKnots.toFixed(1)}</p>
          <p className="text-xs opacity-75 mt-1">Wind (kn)</p>
        </div>
        <div>
          <p className="text-4xl font-bold">{weather.windGustKnots.toFixed(1)}</p>
          <p className="text-xs opacity-75 mt-1">Gusts (kn)</p>
        </div>
        <div>
          <p className="text-4xl font-bold">{degreesToCardinal(weather.windDirection)}</p>
          <p className="text-xs opacity-75 mt-1">{weather.windDirection.toFixed(0)}°</p>
        </div>
      </div>
    </div>
  );
}
