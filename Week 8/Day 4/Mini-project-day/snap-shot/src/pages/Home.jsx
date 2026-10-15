import PhotoGallery from '../components/PhotoGallery.jsx'

const categoryCopy = {
	mountain: { label: 'Out there', title: 'Take the scenic route.', note: 'High places, open skies, and room to breathe.' },
	beaches: { label: 'By the water', title: 'Somewhere, the tide turns.', note: 'Salt air, slow afternoons, and the long way home.' },
	birds: { label: 'In the wild', title: 'Look a little closer.', note: 'Small wings, big skies, and life in motion.' },
	food: { label: 'At the table', title: 'Good things are growing.', note: 'Colorful plates and the pleasure of making time.' },
}

function Home({ category }) {
	const content = categoryCopy[category] || categoryCopy.mountain

	return (
		<main>
			<section className="intro-section">
				<div className="intro-copy">
					<p className="eyebrow"><span className="eyebrow-dot" /> {content.label} / A PHOTO COLLECTION</p>
					<h1>{content.title}</h1>
					<p className="intro-note">{content.note}</p>
				</div>
				<div className="intro-stamp" aria-hidden="true">
					<span>THE</span><strong>GOOD<br />LIGHT</strong><span>IS OUT THERE</span>
				</div>
			</section>
			<PhotoGallery key={category} query={category} />
		</main>
	)
}

export default Home
