import { NavLink } from 'react-router-dom'
import SearchBar from './SearchBar.jsx'

const categories = ['mountain', 'beaches', 'birds', 'food']

function Navbar() {
	return (
		<header className="site-header">
			<div className="header-top">
				<NavLink className="wordmark" to="/mountain" aria-label="Snapshot home">
					snap<span>shot</span><i>.</i>
				</NavLink>
				<p className="header-note">A little inspiration, collected.</p>
				<span className="issue-label">VOL. 01 / 2026</span>
			</div>
			<div className="header-tools">
				<nav className="category-nav" aria-label="Photo categories">
					{categories.map((category, index) => (
						<NavLink
							key={category}
							className={({ isActive }) => `category-link${isActive ? ' active' : ''}`}
							to={`/${category}`}
						>
							<span className="category-index">0{index + 1}</span>
							{category}
						</NavLink>
					))}
				</nav>
				<SearchBar />
			</div>
		</header>
	)
}

export default Navbar
