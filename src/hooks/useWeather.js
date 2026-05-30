import { useState, useEffect, useRef } from "react";

// No API key needed — Open-Meteo is completely free
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const cache = {};

function isFresh(entry) {
  return entry && Date.now() - entry.timestamp < CACHE_TTL;
}

// Map Open-Meteo WMO weather codes to description + icon emoji
function interpretCode(code) {
  if (code === 0) return { description: "clear sky", emoji: "☀️" };
  if (code <= 2) return { description: "partly cloudy", emoji: "⛅" };
  if (code === 3) return { description: "overcast", emoji: "☁️" };
  if (code <= 49) return { description: "foggy", emoji: "🌫️" };
  if (code <= 59) return { description: "drizzle", emoji: "🌦️" };
  if (code <= 69) return { description: "rain", emoji: "🌧️" };
  if (code <= 79) return { description: "snow", emoji: "❄️" };
  if (code <= 84) return { description: "rain showers", emoji: "🌦️" };
  if (code <= 94) return { description: "thunderstorm", emoji: "⛈️" };
  return { description: "stormy", emoji: "🌩️" };
}

export default function useWeather(city) {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!city) return;

    const key = city.trim().toLowerCase();

    // Return cached result if fresh
    if (isFresh(cache[key])) {
      const { currentData, forecastData } = cache[key].data;
      setCurrent(currentData);
      setForecast(forecastData);
      setError(null);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    async function fetchWeather() {
      try {
        // Step 1: City name → coordinates
        const geoRes = await fetch(
          `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
          { signal: controller.signal }
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("City not found. Please try another city.");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Fetch current + forecast in parallel
        const [weatherRes] = await Promise.all([
          fetch(
            `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,visibility,weather_code` +
            `&daily=temperature_2m_max,temperature_2m_min,weather_code` +
            `&timezone=auto&forecast_days=6`,
            { signal: controller.signal }
          ),
        ]);

        const weather = await weatherRes.json();
        const c = weather.current;
        const d = weather.daily;

        const { description, emoji } = interpretCode(c.weather_code);

        const currentData = {
          city: name,
          country,
          temp: Math.round(c.temperature_2m),
          feels_like: Math.round(c.apparent_temperature),
          humidity: c.relative_humidity_2m,
          wind: Math.round(c.wind_speed_10m),
          description,
          emoji,
          visibility: c.visibility ? (c.visibility / 1000).toFixed(1) : "N/A",
        };

        // Next 5 days (skip index 0 = today)
        const forecastData = d.time.slice(1, 6).map((date, i) => {
          const { description: desc, emoji: em } = interpretCode(d.weather_code[i + 1]);
          return {
            date,
            temp_max: Math.round(d.temperature_2m_max[i + 1]),
            temp_min: Math.round(d.temperature_2m_min[i + 1]),
            emoji: em,
            description: desc,
          };
        });

        cache[key] = { data: { currentData, forecastData }, timestamp: Date.now() };
        setCurrent(currentData);
        setForecast(forecastData);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Something went wrong. Please try again.");
        setCurrent(null);
        setForecast([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    return () => controller.abort();
  }, [city]);

  return { current, forecast, loading, error };
}