import { useEffect, useRef, useState } from 'react'
import SearchBar from '../components/SearchBar'
import WeatherCard from '../components/WeatherCard'
import WeatherDetails from '../components/WeatherDetails'
import Forecast from '../components/Forecast'
import { getWeatherByCity } from '../services/weatherApi'

function WeatherPage({ favorites, onToggleFavorite }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const requestId = useRef(0)

  const loadWeather = async (city) => {
    const currentRequest = ++requestId.current
    setLoading(true)
    setError('')

    try {
      const nextWeather = await getWeatherByCity(city)
      if (currentRequest === requestId.current) setWeather(nextWeather)
    } catch (requestError) {
      if (currentRequest === requestId.current) setError(requestError.message)
    } finally {
      if (currentRequest === requestId.current) setLoading(false)
    }
  };

  useEffect(() => { loadWeather('Tel Aviv') }, [])
  const isFavorite = weather && favorites.some((item) => item.id === weather.id)

  return (
    <div className="weather-page">
      <section className="intro-row">
        <div><p className="eyebrow">YOUR WINDOW TO THE WORLD</p><h1>Weather, in the moment.</h1></div>
        <SearchBar onSearch={loadWeather} disabled={loading} />
      </section>
      {error && <p className="error-message" role="alert">{error}</p>}
      {loading && <div className="loading-state" role="status"><span className="loading-dot" /> Gathering the latest forecast...</div>}
      {weather && !loading && (
        <>
          <WeatherCard weather={weather} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
          <WeatherDetails weather={weather} />
          <Forecast days={weather.forecast} />
          <p className="data-credit">Weather data by Open-Meteo</p>
        </>
      )}
      {!weather && !loading && !error && <p className="empty-message">Search for a city to see its weather.</p>}
    </div>
  )
}

export default WeatherPage