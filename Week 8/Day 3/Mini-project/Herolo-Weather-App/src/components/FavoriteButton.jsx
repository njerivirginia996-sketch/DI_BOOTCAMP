function FavoriteButton({ isFavorite, onClick }) {
	return (
		<button type="button" className={`favorite-button${isFavorite ? ' is-favorite' : ''}`} onClick={onClick}
			aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
			<span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
			<span>{isFavorite ? 'Saved' : 'Save city'}</span>
		</button>
	)
}

export default FavoriteButton
