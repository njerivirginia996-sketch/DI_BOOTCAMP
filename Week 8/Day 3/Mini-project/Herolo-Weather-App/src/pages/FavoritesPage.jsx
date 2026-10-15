import FavoriteButton from '../components/FavoriteButton'

function FavoritesPage({ favorites, onRemoveFavorite }) {
	return (
		<section className="favorites-page">
			<div className="page-heading">
				<div><p className="eyebrow">YOUR PERSONAL FORECAST LIST</p>
					<h1>Saved places<span className="heading-count">{String(favorites.length).padStart(2, '0')}</span></h1>
				</div>
				<p className="page-description">A quick look at the places you keep close.</p>
			</div>
			{favorites.length === 0 ? (
				<div className="favorites-empty">
					<span className="empty-sun" aria-hidden="true">☼</span>
					<h2>No saved places yet</h2>
					<p>Search for a city and save it to keep its latest conditions here.</p>
				</div>
			) : (
				<div className="favorite-list">
					{favorites.map((weather, index) => (
						<article className="favorite-row" key={weather.id}>
							<span className="favorite-index">{String(index + 1).padStart(2, '0')}</span>
							<div className="favorite-place"><h2>{weather.city}</h2><span>{[weather.region, weather.country].filter(Boolean).join(', ')}</span></div>
							<span className="favorite-condition">{weather.description}</span>
							<strong className="favorite-temperature">{weather.temperature}°</strong>
							<FavoriteButton isFavorite onClick={() => onRemoveFavorite(weather)} />
						</article>
					))}
				</div>
			)}
		</section>
	)
}

export default FavoritesPage
