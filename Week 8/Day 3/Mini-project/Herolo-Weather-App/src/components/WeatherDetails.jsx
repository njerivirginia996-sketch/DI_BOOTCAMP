function WeatherDetails({ weather }) {
  if (!weather) {
    return null;
  }

  return (
    <section className="details-strip" aria-label="Weather details">
      <div className="detail-item"><span>Feels like</span><strong>{weather.feelsLike}°</strong></div>
      <div className="detail-item"><span>Humidity</span><strong>{weather.humidity}%</strong></div>
      <div className="detail-item"><span>Wind</span><strong>{weather.wind} <small>km/h</small></strong></div>
    </section>
  );
}

export default WeatherDetails;