const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const weatherDescriptions = {
	0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
	45: 'Foggy', 48: 'Rime fog', 51: 'Light drizzle', 53: 'Drizzle',
	55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
	61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain',
	67: 'Heavy freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
	77: 'Snow grains', 80: 'Rain showers', 81: 'Rain showers', 82: 'Heavy showers',
	85: 'Snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
	96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail',
}

function describeWeather(code) {
	return weatherDescriptions[code] ?? 'Conditions unavailable'
}

async function fetchJson(url) {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error('Weather data is unavailable right now. Please try again.')
	}
	return response.json()
}

export async function getWeatherByCity(cityName) {
	const geocodingUrl = new URL(GEOCODING_URL)
	geocodingUrl.search = new URLSearchParams({ name: cityName, count: '1', language: 'en', format: 'json' })
	const geocoding = await fetchJson(geocodingUrl)
	const location = geocoding.results?.[0]

	if (!location) {
		throw new Error(`We couldn't find "${cityName}". Check the spelling and try again.`)
	}

	const forecastUrl = new URL(FORECAST_URL)
	forecastUrl.search = new URLSearchParams({
		latitude: String(location.latitude),
		longitude: String(location.longitude),
		current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
		daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
		timezone: 'auto',
		forecast_days: '5',
	})
	const data = await fetchJson(forecastUrl)

	return {
		id: `${location.latitude},${location.longitude}`,
		city: location.name,
		country: location.country,
		region: location.admin1,
		temperature: Math.round(data.current.temperature_2m),
		description: describeWeather(data.current.weather_code),
		weatherCode: data.current.weather_code,
		isDay: Boolean(data.current.is_day),
		feelsLike: Math.round(data.current.apparent_temperature),
		humidity: data.current.relative_humidity_2m,
		wind: Math.round(data.current.wind_speed_10m),
		forecast: data.daily.time.map((date, index) => ({
			date,
			description: describeWeather(data.daily.weather_code[index]),
			weatherCode: data.daily.weather_code[index],
			high: Math.round(data.daily.temperature_2m_max[index]),
			low: Math.round(data.daily.temperature_2m_min[index]),
			precipitation: data.daily.precipitation_probability_max[index],
		})),
	}
}
