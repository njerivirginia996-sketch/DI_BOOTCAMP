import FavoriteButton from './FavoriteButton'

function WeatherCard({ weather, isFavorite, onToggleFavorite }) {
  if (!weather) {
    return null;
  }

  return (
    <section className={`current-weather${weather.isDay ? ' is-day' : ' is-night'}`} aria-label="Current weather">
      <div className="current-copy">
        <p className="eyebrow">CURRENT CONDITIONS</p>
        <h1>{weather.city}</h1>
        <p className="location-line">{[weather.region, weather.country].filter(Boolean).join(', ')}</p>
        <p className="condition-line">{weather.description}</p>
        <div className="temperature-line"><span className="current-temperature">{weather.temperature}°</span><span className="temperature-unit">C</span></div>
        <FavoriteButton isFavorite={isFavorite} onClick={() => onToggleFavorite(weather)} />
      </div>
      <div className={`weather-orb code-${weather.weatherCode}`} aria-hidden="true">
        <span>{weather.weatherCode >= 51 ? '☂' : weather.weatherCode >= 45 ? '☁' : '☀'}</span>
      </div>
      <div className="hero-caption">{weather.isDay ? 'DAYLIGHT' : 'AFTER DARK'} <span>LOCAL TIME</span></div>
    </section>
  );
}

export default WeatherCard;