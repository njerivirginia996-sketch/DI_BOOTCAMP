import { useEffect, useState } from 'react'
import { getPhotos } from '../services/pexelsApi.js'
import PhotoCard from './PhotoCard.jsx'

function PhotoGallery({ query }) {
	const [photos, setPhotos] = useState([])
	const [page, setPage] = useState(1)
	const [hasMore, setHasMore] = useState(true)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [isPreview, setIsPreview] = useState(false)

	useEffect(() => {
		const controller = new AbortController()

		getPhotos(query, 1, controller.signal)
			.then((result) => {
				setPhotos(result.photos)
				setHasMore(result.hasMore)
				setIsPreview(result.isPreview)
			})
			.catch((requestError) => {
				if (requestError.name !== 'AbortError') {
					setError(requestError.message || 'Photos could not be loaded. Please try again.')
				}
			})
			.finally(() => {
				if (!controller.signal.aborted) setLoading(false)
			})

		return () => controller.abort()
	}, [query])

	async function loadMore() {
		const nextPage = page + 1
		setLoading(true)
		setError('')
		try {
			const result = await getPhotos(query, nextPage)
			setPhotos((currentPhotos) => [...currentPhotos, ...result.photos])
			setPage(nextPage)
			setHasMore(result.hasMore)
			setIsPreview(result.isPreview)
		} catch (requestError) {
			setError(requestError.message || 'More photos could not be loaded.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<section className="gallery-section" aria-label={`${query} photo gallery`}>
			<div className="gallery-meta">
				<p>{loading && photos.length === 0 ? 'GATHERING FRAMES' : `${photos.length} FRAMES`}</p>
				<p>SCROLL TO WANDER <span aria-hidden="true">↓</span></p>
			</div>

			{isPreview && (
				<p className="api-notice">
					Preview collection. Add <code>VITE_PEXELS_API_KEY</code> to <code>.env.local</code> for live Pexels photos.
				</p>
			)}

			{error && <p className="gallery-message gallery-error" role="alert">{error}</p>}
			{!loading && !error && photos.length === 0 && (
				<p className="gallery-message">No photos found for “{query}”. Try another search.</p>
			)}

			<div className="photo-grid" aria-live="polite">
				{photos.map((photo, index) => (
					<PhotoCard key={`${photo.id}-${index}`} photo={photo} index={index} />
				))}
			</div>

			{loading && <p className="gallery-message loading-message">Finding something lovely...</p>}
			{hasMore && photos.length > 0 && (
				<button className="load-more" type="button" onClick={loadMore} disabled={loading}>
					{loading ? 'Loading...' : 'Load more frames'}
					{!loading && <span aria-hidden="true">↓</span>}
				</button>
			)}
		</section>
	)
}

export default PhotoGallery
