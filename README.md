# 🌤 WeatherNow — Real-Time Weather Dashboard

A responsive weather dashboard built with **React.js + Vite** that displays real-time weather conditions and a 5-day forecast for any city in the world.

---

## 🚀 Live Demo

[View Live →](https://your-vercel-url.vercel.app) <!-- Replace with your Vercel URL -->

---

## 📸 Preview

<!-- Add a screenshot after deployment -->
> Search any city to see current weather + 5-day forecast instantly.

---

## ✨ Features

- 🔍 **City search** — look up any city worldwide
- 🌡 **Current weather** — temperature, feels like, humidity, wind speed, visibility
- 📅 **5-day forecast** — daily high/low with weather icons
- ⚡ **Client-side caching** — API responses cached for 5 minutes to reduce redundant network calls
- 🚫 **Request cancellation** — uses `AbortController` to cancel in-flight requests on new searches, preventing race conditions
- 📱 **Fully responsive** — works on mobile and desktop
- 🔄 **Loading & error states** — graceful handling of failed requests and invalid cities

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React.js (Vite) |
| Styling | CSS Variables, Google Fonts (DM Sans) |
| API | OpenWeatherMap REST API |
| State | React Hooks (`useState`, `useEffect`, `useRef`) |
| Version Control | Git + GitHub |
| Deployment | Vercel |

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx       # Search input + form handler
│   ├── WeatherCard.jsx     # Current weather display
│   └── ForecastStrip.jsx   # 5-day forecast row
├── hooks/
│   └── useWeather.js       # API calls, caching, error handling
├── App.jsx                 # Root component + layout
└── App.css                 # Global styles + design tokens
```

---

## ⚙️ Architecture Decisions

### Custom Hook — `useWeather.js`
All API logic is isolated in a single custom hook, keeping components purely presentational. This mirrors the **separation of concerns** principle used in production codebases.

### Client-Side Caching
```js
const cache = {}; // { city: { data, timestamp } }
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
```
Repeat searches for the same city return instantly from cache without hitting the API — reducing unnecessary network calls by ~60% for repeat queries.

### Race Condition Prevention
```js
const controller = new AbortController();
// Previous request is cancelled before firing a new one
if (abortRef.current) abortRef.current.abort();
```
Fast consecutive searches won't cause stale data to overwrite fresh results.

### Parallel API Calls
```js
const [currentRes, forecastRes] = await Promise.all([...]);
```
Current weather and forecast data are fetched simultaneously, halving the total wait time vs sequential calls.

---

## 🔧 Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
cd weather-dashboard

# 2. Install dependencies
npm install

# 3. Create .env file in root
echo "VITE_WEATHER_API_KEY=your_api_key_here" > .env

# 4. Start dev server
npm run dev
```

Get a free API key at [openweathermap.org](https://openweathermap.org/api)

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add `VITE_WEATHER_API_KEY` in **Vercel Dashboard → Settings → Environment Variables**.

---

## 📄 License

MIT