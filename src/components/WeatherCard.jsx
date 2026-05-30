export default function WeatherCard({ data }) {
  const { city, country, temp, feels_like, humidity, wind, description, emoji, visibility } = data;

  return (
    <div className="weather-card">
      <div className="card-top">
        <div className="card-location">
          <h2 className="card-city">{city}</h2>
          <span className="card-country">{country}</span>
        </div>
        <span className="card-emoji">{emoji}</span>
      </div>

      <div className="card-temp">
        {temp}°<span className="temp-unit">C</span>
      </div>
      <p className="card-desc">{description}</p>

      <div className="card-stats">
        <div className="stat">
          <span className="stat-icon">💧</span>
          <span className="stat-value">{humidity}%</span>
          <span className="stat-label">Humidity</span>
        </div>
        <div className="stat">
          <span className="stat-icon">💨</span>
          <span className="stat-value">{wind} km/h</span>
          <span className="stat-label">Wind</span>
        </div>
        <div className="stat">
          <span className="stat-icon">🌡</span>
          <span className="stat-value">{feels_like}°C</span>
          <span className="stat-label">Feels like</span>
        </div>
        <div className="stat">
          <span className="stat-icon">👁</span>
          <span className="stat-value">{visibility} km</span>
          <span className="stat-label">Visibility</span>
        </div>
      </div>
    </div>
  );
}
