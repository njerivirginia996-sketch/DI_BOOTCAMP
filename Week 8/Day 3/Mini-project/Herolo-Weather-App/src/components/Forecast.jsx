function Forecast({ days = [] }) {
	if (!days.length) return null

	return (
		<section className="forecast-section">
			<div className="section-heading">
				<div><p className="eyebrow">THE NEXT FEW DAYS</p><h2>Five-day outlook</h2></div>
				<span className="section-aside">HIGH / LOW · °C</span>
			</div>
			<div className="forecast-list">
				{days.map((day, index) => {
					const weekday = index === 0 ? 'Today' : new Intl.DateTimeFormat('en', { weekday: 'short' }).format(new Date(`${day.date}T12:00:00`))
					const symbol = day.weatherCode >= 51 ? '☂' : day.weatherCode >= 45 ? '☁' : '☀'
					return (
						<article className="forecast-day" key={day.date}>
							<span className="forecast-weekday">{weekday}</span>
							<span className="forecast-symbol" aria-hidden="true">{symbol}</span>
							<span className="forecast-description">{day.description}</span>
							<span className="forecast-temperatures"><strong>{day.high}°</strong><span>{day.low}°</span></span>
							<span className="forecast-rain">{day.precipitation ?? 0}% rain</span>
						</article>
					)
				})}
			</div>
		</section>
	)
}

export default Forecast
