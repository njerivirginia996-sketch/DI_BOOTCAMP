const FAVORITES_KEY = 'herolo-weather-favorites'

export function getFavorites() {
	try {
		const storedFavorites = localStorage.getItem(FAVORITES_KEY)
		const favorites = storedFavorites ? JSON.parse(storedFavorites) : []
		return Array.isArray(favorites) ? favorites : []
	} catch {
		return []
	}
}

export function saveFavorites(favorites) {
	try {
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
	} catch {
		return false
	}
	return true
}
