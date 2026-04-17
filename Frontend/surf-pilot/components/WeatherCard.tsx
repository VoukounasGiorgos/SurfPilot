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
  const sourceCount = weather.sources?.length ?? 0;

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold opacity-90">Wind Conditions</h2>
        <span className="text-sm opacity-75">{spotName}</span>
      </div>
      {sourceCount > 1 && (
        <p className="text-xs opacity-60 mb-4">Μέσος όρος {sourceCount} πηγών</p>
      )}
      {sourceCount <= 1 && <div className="mb-4" />}

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

      {weather.sources && weather.sources.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20 space-y-1.5">
          {weather.sources.map(src => (
            <div key={src.source} className="flex items-center justify-between text-xs opacity-70">
              <span className="font-medium">{src.source}</span>
              <span>
                {src.windSpeedKnots.toFixed(1)} kn &nbsp;/&nbsp; {src.windGustKnots.toFixed(1)} kn gusts &nbsp;/&nbsp; {degreesToCardinal(src.windDirection)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
