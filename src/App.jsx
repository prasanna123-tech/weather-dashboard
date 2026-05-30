import { useState } from "react";
import useWeather from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastStrip from "./components/ForecastStrip";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("");
  const { current, forecast, loading, error } = useWeather(city);

  return (
    <div className="app">
      <div className="app-inner">
        <header className="app-header">
          <h1 className="app-title">
            <span className="title-icon">☁</span> WeatherNow
          </h1>
          <p className="app-subtitle">Real-time weather for any city in the world</p>
        </header>

        <SearchBar onSearch={setCity} />

        {loading && (
          <div className="status-box">
            <div className="spinner" />
            <p>Fetching weather data…</p>
          </div>
        )}

        {error && !loading && (
          <div className="status-box error">
            <span className="error-icon">⚠</span>
            <p>{error}</p>
          </div>
        )}

        {current && !loading && (
          <>
            <WeatherCard data={current} />
            {forecast.length > 0 && <ForecastStrip days={forecast} />}
          </>
        )}

        {!city && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🌍</div>
            <p>Search for a city to see the weather</p>
          </div>
        )}
      </div>
    </div>
  );
}
