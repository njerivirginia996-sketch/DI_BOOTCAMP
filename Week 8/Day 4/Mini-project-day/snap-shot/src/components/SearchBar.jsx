import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
	const [query, setQuery] = useState('')
	const navigate = useNavigate()

	function handleSubmit(event) {
		event.preventDefault()
		const searchTerm = query.trim()
		if (searchTerm) {
			navigate(`/search/${encodeURIComponent(searchTerm)}`)
		}
	}

	return (
		<form className="search-form" role="search" onSubmit={handleSubmit}>
			<label className="visually-hidden" htmlFor="photo-search">Search photos</label>
			<input
				id="photo-search"
				name="q"
				type="search"
				placeholder="Try ‘wild flowers’"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
			/>
			<button type="submit" aria-label="Search photos" title="Search photos">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="10.8" cy="10.8" r="6.8" />
					<path d="m16 16 4.5 4.5" />
				</svg>
			</button>
		</form>
	)
}

export default SearchBar
