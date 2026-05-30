const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatDay(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return DAYS[d.getDay()];
}

export default function ForecastStrip({ days }) {
  return (
    <div className="forecast-section">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-strip">
        {days.map((day) => (
          <div className="forecast-card" key={day.date}>
            <span className="f-day">{formatDay(day.date)}</span>
            <span className="f-emoji">{day.emoji}</span>
            <span className="f-high">{day.temp_max}°</span>
            <span className="f-low">{day.temp_min}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
