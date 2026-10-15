import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import SearchResults from './pages/SearchResults.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/mountain" replace />} />
          <Route path="/mountain" element={<Home category="mountain" />} />
          <Route path="/beaches" element={<Home category="beaches" />} />
          <Route path="/birds" element={<Home category="birds" />} />
          <Route path="/food" element={<Home category="food" />} />
          <Route path="/search/:query" element={<SearchResults />} />
          <Route path="*" element={<Navigate to="/mountain" replace />} />
        </Routes>
        <footer className="site-footer">
          <span>SNAPSHOT / A FIELD GUIDE TO THE EVERYDAY</span>
          <span>Made for curious eyes.</span>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
