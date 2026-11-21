# SurfPilot 🏄‍♂️

**AI-powered windsurf gear advisor.** Pick a spot, and SurfPilot pulls live wind and wave forecasts from multiple weather providers, then recommends the right sail size, board volume and fin length for your weight and skill level — using both a rule-based engine and Google Gemini.

<!-- Add screenshots here, e.g.:
![Home screen](docs/screenshot-home.png)
![AI recommendation](docs/screenshot-ai.png)
-->

## Features

- **Multi-source forecasts** — combines Open-Meteo and MET Norway wind data (averaged, with a circular mean for wind direction) plus wave height and period from Open-Meteo Marine.
- **Fault tolerant** — weather sources are queried in parallel; if one provider fails, the others still return a result.
- **Two recommendation engines**
  - **Rule-based:** deterministic sail / board / fin sizing from wind speed, rider weight and experience.
  - **AI (Gemini 2.5 Flash):** a structured prompt with rider profile, spot and per-source wind readings; the model returns strict JSON that is validated and mapped to a typed response, with a short explanation of its reasoning.
- **Forecast mode** — get a recommendation for a future date and hour, not just current conditions.
- **Rider onboarding** — weight and experience level saved locally in the browser.
- **Preset spots** — Chios, Tarifa, Maui, Dahab, Rhodes, Fuerteventura, Cape Town and more.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Backend | C#, .NET 10, ASP.NET Core Web API, typed `HttpClient`s, OpenAPI |
| AI | Google Gemini 2.5 Flash (REST, JSON response mode) |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Data sources | Open-Meteo, Open-Meteo Marine, MET Norway (api.met.no) |

## Architecture

```
Next.js frontend ──► ASP.NET Core API
                       ├── GET  /api/weather            ──► Open-Meteo + MET Norway (parallel) + Open-Meteo Marine
                       ├── POST /api/recommendation      ──► Rule-based engine
                       └── POST /api/recommendation/ai   ──► Google Gemini 2.5 Flash
```

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- A free [Google Gemini API key](https://aistudio.google.com/apikey) (only needed for AI recommendations)

### 1. Backend

```bash
cd Backend
dotnet user-secrets init
dotnet user-secrets set "Gemini:ApiKey" "<your-api-key>"
dotnet run
```

The API runs on `http://localhost:5163`.

### 2. Frontend

```bash
cd Frontend/surf-pilot
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/weather?lat={lat}&lon={lon}&forecastTime={iso-date}` | Averaged wind, gusts, direction and waves for a location (`forecastTime` optional) |
| POST | `/api/recommendation` | Rule-based gear recommendation |
| POST | `/api/recommendation/ai` | AI gear recommendation with reasoning |

Example request body for both recommendation endpoints:

```json
{
  "userProfile": { "weightKg": 75, "experience": "Intermediate" },
  "weatherData": { "windSpeedKnots": 18, "windGustKnots": 24, "windDirection": 350 },
  "spotName": "Tarifa, Spain"
}
```

## Author

**George Voukounas** — Full-Stack Software Engineer (.NET / Angular)
[LinkedIn](https://www.linkedin.com/in/giorgos-voukounas-324b6a1ba/) · [GitHub](https://github.com/VoukounasGiorgos)
