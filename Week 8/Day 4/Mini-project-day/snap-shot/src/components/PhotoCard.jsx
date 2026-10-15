function PhotoCard({ photo, index }) {
	return (
		<article className={`photo-card photo-card-${(index % 6) + 1}`}>
			<a
				className="photo-link"
				href={photo.photographerUrl || photo.src}
				target="_blank"
				rel="noreferrer"
				aria-label={`View photo by ${photo.photographer || 'a photographer'}`}
			>
				<img src={photo.src} alt={photo.alt} loading="lazy" />
				<span className="photo-open" aria-hidden="true">↗</span>
			</a>
			<div className="photo-caption">
				<span>{photo.alt || 'A moment worth keeping'}</span>
				{photo.photographer && <span className="photo-credit">BY {photo.photographer}</span>}
			</div>
		</article>
	)
}

export default PhotoCard
