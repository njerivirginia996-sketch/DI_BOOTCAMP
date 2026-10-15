import { useParams } from 'react-router-dom'
import PhotoGallery from '../components/PhotoGallery.jsx'

function SearchResults() {
	const { query = '' } = useParams()
	const searchTerm = query

	return (
		<main>
			<section className="intro-section search-intro">
				<div className="intro-copy">
					<p className="eyebrow"><span className="eyebrow-dot" /> YOUR SEARCH / PHOTO COLLECTION</p>
					<h1>Frames for <em>“{searchTerm}.”</em></h1>
					<p className="intro-note">A fresh collection, gathered around your idea.</p>
				</div>
			</section>
			<PhotoGallery key={searchTerm} query={searchTerm} />
		</main>
	)
}

export default SearchResults
