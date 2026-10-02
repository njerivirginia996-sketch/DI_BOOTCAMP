const axios = require('axios')
const chalk = require('chalk')

const weatherDescriptions = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

async function displayWeather(city) {
  const locationResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
    params: { name: city, count: 1, language: 'en', format: 'json' },
    timeout: 10000,
  })

  const location = locationResponse.data.results?.[0]
  if (!location) {
    throw new Error(`No location found for "${city}".`)
  }

  const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
    params: {
      latitude: location.latitude,
      longitude: location.longitude,
      current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
      timezone: 'auto',
    },
    timeout: 10000,
  })

  const current = weatherResponse.data.current
  const description = weatherDescriptions[current.weather_code] ?? 'Unknown conditions'
  const place = [location.name, location.admin1, location.country].filter(Boolean).join(', ')

  console.log(chalk.bold.cyan(`\nWeather for ${place}`))
  console.log(chalk.yellow(`Conditions: ${description}`))
  console.log(`Temperature: ${current.temperature_2m} ${weatherResponse.data.current_units.temperature_2m}`)
  console.log(`Feels like: ${current.apparent_temperature} ${weatherResponse.data.current_units.apparent_temperature}`)
  console.log(`Humidity: ${current.relative_humidity_2m}${weatherResponse.data.current_units.relative_humidity_2m}`)
  console.log(`Wind: ${current.wind_speed_10m} ${weatherResponse.data.current_units.wind_speed_10m}`)
}

module.exports = displayWeather