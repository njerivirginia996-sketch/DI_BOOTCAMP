const previewPhotos = [
	['mountain', '1500530855697-b586d89ba3ee', 'Mountain light'],
	['mountain', '1501785888041-af3ef285b470', 'A quiet alpine lake'],
	['mountain', '1464822759023-fed622ff2c3b', 'Peaks above the clouds'],
	['mountain', '1519681393784-d120267933ba', 'The mountain at dusk'],
	['mountain', '1470770841072-f978cf4d019e', 'Green valley morning'],
	['mountain', '1464278533981-50106e6176b1', 'A trail through the hills'],
	['beaches', '1507525428034-b723cf961d3e', 'A day at the shoreline'],
	['beaches', '1518837695005-2083093ee35b', 'Blue water, open horizon'],
	['beaches', '1473116763249-2ffaa81b3d37', 'Palm trees by the sea'],
	['beaches', '1500375592092-40eb2168fd21', 'Waves rolling in'],
	['beaches', '1493558103817-58b2924bce98', 'Sunlit coast'],
	['beaches', '1519046904884-53103b34b206', 'A quiet beach escape'],
	['birds', '1444464666168-49d633b86797', 'A bird in flight'],
	['birds', '1452570053594-1b985d6ea890', 'Wildlife in the treetops'],
	['birds', '1552728089-57bdde30beb3', 'Colorful feathers'],
	['birds', '1474511320723-9a56873867b5', 'A curious visitor'],
	['birds', '1497206365907-f5e630693df0', 'Birdsong at sunrise'],
	['birds', '1522926193341-e9ffd686c60f', 'A moment in the wild'],
	['food', '1546069901-ba9599a7e63c', 'A bright and fresh bowl'],
	['food', '1512621776951-a57141f2eefd', 'Greens for the table'],
	['food', '1490645935967-10de6ba17061', 'A colorful breakfast'],
	['food', '1504674900247-0877df9cc836', 'Dinner is ready'],
	['food', '1512621776951-a57141f2eefd', 'Market-fresh ingredients'],
	['food', '1476224203421-9ac39bcb3327', 'Something delicious'],
]

const previewCollection = previewPhotos.map(([category, imageId, alt], index) => ({
	id: `preview-${category}-${index}`,
	src: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=1200&q=85`,
	alt,
	photographer: 'Unsplash preview',
	photographerUrl: `https://unsplash.com/s/photos/${category}`,
	category,
}))

function normalizePhoto(photo) {
	return {
		id: photo.id,
		src: photo.src.large || photo.src.medium,
		alt: photo.alt || 'A photograph from the collection',
		photographer: photo.photographer,
		photographerUrl: photo.photographer_url,
	}
}

export async function getPhotos(query, page = 1, signal) {
	const apiKey = import.meta.env.VITE_PEXELS_API_KEY

	if (!apiKey) {
		const normalizedQuery = query.toLowerCase()
		const matches = previewCollection.filter((photo) =>
			photo.category === normalizedQuery ||
			photo.alt.toLowerCase().includes(normalizedQuery) ||
			normalizedQuery.includes(photo.category),
		)
		const start = (page - 1) * 30
		return {
			photos: matches.slice(start, start + 30),
			hasMore: start + 30 < matches.length,
			isPreview: true,
		}
	}

	const parameters = new URLSearchParams({ query, page: String(page), per_page: '30' })
	const response = await fetch(`https://api.pexels.com/v1/search?${parameters}`, {
		headers: { Authorization: apiKey },
		signal,
	})

	if (!response.ok) {
		throw new Error(response.status === 401
			? 'Pexels rejected the API key. Check VITE_PEXELS_API_KEY in .env.local.'
			: `Pexels request failed (${response.status}). Please try again.`)
	}

	const data = await response.json()
	return {
		photos: data.photos.map(normalizePhoto),
		hasMore: data.page * data.per_page < data.total_results,
		isPreview: false,
	}
}
