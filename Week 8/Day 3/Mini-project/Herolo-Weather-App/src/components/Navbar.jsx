import { NavLink } from 'react-router-dom'

function Navbar({ favoriteCount }) {
	return (
		<header className="topbar">
			<NavLink className="brand" to="/" aria-label="Atmos home">
				<span className="brand-mark" aria-hidden="true">A</span><span>atmos</span>
			</NavLink>
			<nav className="main-nav" aria-label="Main navigation">
				<NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Weather</NavLink>
				<NavLink to="/favorites" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
					Favorites <span className="nav-count">{favoriteCount}</span>
				</NavLink>
			</nav>
			<span className="topbar-note">A little closer to the sky</span>
		</header>
	)
}

export default Navbar
