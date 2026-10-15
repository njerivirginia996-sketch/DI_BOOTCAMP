import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import FavoritesPage from './pages/FavoritesPage'
import WeatherPage from './pages/WeatherPage'
import { getFavorites, saveFavorites } from './utils/localStorage'
import './App.css'

function App() {
  const [favorites, setFavorites] = useState(getFavorites)

  const toggleFavorite = (weather) => {
    setFavorites((currentFavorites) => {
      const isSaved = currentFavorites.some((item) => item.id === weather.id)
      const nextFavorites = isSaved
        ? currentFavorites.filter((item) => item.id !== weather.id)
        : [...currentFavorites, weather]

      saveFavorites(nextFavorites)
      return nextFavorites
    })
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar favoriteCount={favorites.length} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<WeatherPage favorites={favorites} onToggleFavorite={toggleFavorite} />} />
            <Route path="/favorites" element={<FavoritesPage favorites={favorites} onRemoveFavorite={toggleFavorite} />} />
          </Routes>
        </main>
        <footer className="site-footer">Weather, wherever you are.</footer>
      </div>
    </BrowserRouter>
  )
}

export default App
