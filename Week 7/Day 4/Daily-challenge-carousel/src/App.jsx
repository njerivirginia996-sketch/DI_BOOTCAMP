import { Carousel } from 'react-responsive-carousel'
import './App.css'

const destinations = [
  {
    name: 'Hong Kong',
    region: 'China',
    note: 'A city that never loses its sense of wonder.',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/jrfyzvgzvhs1iylduuhj.jpg',
  },
  {
    name: 'Macao',
    region: 'China',
    note: 'Portuguese heritage meets a vivid new skyline.',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/c1cklkyp6ms02tougufx.webp',
  },
  {
    name: 'Japan',
    region: 'East Asia',
    note: 'Find your own rhythm between old and new.',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/e8fnw35p6zgusq218foj.webp',
  },
  {
    name: 'Las Vegas',
    region: 'United States',
    note: 'Bright lights, bold nights, endless possibility.',
    image:
      'https://res.klook.com/image/upload/fl_lossy.progressive,q_65/c_fill,w_480,h_384/cities/liw377az16sxmp9a6ylg.webp',
  },
]

function App() {
  return (
    <main className="container-fluid page-shell">
      <header className="site-header row align-items-center">
        <a className="wordmark col-auto" href="#top" aria-label="Elsewhere home">
          <span className="wordmark-mark" aria-hidden="true">E</span>
          ELSEWHERE
        </a>
        <p className="header-note col">A field guide to going places</p>
        <p className="header-index col-auto">ISSUE 01 <span>/</span> 2026</p>
      </header>

      <section className="destination-section" id="top" aria-labelledby="page-title">
        <div className="section-kicker">
          <span className="kicker-line" />
          <span>THE DESTINATION EDIT</span>
          <span className="kicker-line" />
        </div>
        <div className="intro-row row align-items-end">
          <div className="col-lg-7">
            <p className="eyebrow">A little further from the everyday</p>
            <h1 id="page-title">Go where the<br className="desktop-break" /> feeling takes you.</h1>
          </div>
          <p className="intro-copy col-lg-4 offset-lg-1">
            Four city escapes, each with a different kind of magic. Pick a place
            and let the day unfold.
          </p>
        </div>

        <div className="carousel-frame">
          <Carousel
            ariaLabel="Featured destinations"
            className="destination-carousel"
            showThumbs={false}
            showStatus
            showIndicators
            showArrows
            infiniteLoop
            useKeyboardArrows
            swipeable
            emulateTouch
            autoPlay={false}
            statusFormatter={(current, total) =>
              `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
            }
            renderIndicator={(onClick, isSelected, index) => (
              <li className="carousel-indicator" key={index}>
                <button
                  type="button"
                  className={`carousel-dot${isSelected ? ' is-active' : ''}`}
                  onClick={onClick}
                  aria-label={`Go to ${destinations[index].name}`}
                  aria-current={isSelected ? 'true' : undefined}
                />
              </li>
            )}
            renderArrowPrev={(onClick, hasPrev) =>
              hasPrev && (
                <button type="button" className="carousel-arrow carousel-arrow-prev" onClick={onClick} aria-label="Previous destination">
                  <span aria-hidden="true">&#8592;</span>
                </button>
              )
            }
            renderArrowNext={(onClick, hasNext) =>
              hasNext && (
                <button type="button" className="carousel-arrow carousel-arrow-next" onClick={onClick} aria-label="Next destination">
                  <span aria-hidden="true">&#8594;</span>
                </button>
              )
            }
          >
            {destinations.map((destination, index) => (
              <article className="destination-slide" key={destination.name}>
                <img src={destination.image} alt={`${destination.name} cityscape`} />
                <div className="slide-shade" />
                <div className="slide-caption">
                  <span className="slide-region">{destination.region}</span>
                  <h2>{destination.name}</h2>
                  <p>{destination.note}</p>
                </div>
                <span className="image-index" aria-hidden="true">ELSEWHERE / 0{index + 1}</span>
              </article>
            ))}
          </Carousel>
        </div>
      </section>

      <footer className="page-footer row align-items-center">
        <p className="col">COLLECT MOMENTS, NOT MILESTONES</p>
        <p className="col-auto">SCROLL LESS. SEE MORE. <span aria-hidden="true">&#8599;</span></p>
      </footer>
    </main>
  )
}

export default App
