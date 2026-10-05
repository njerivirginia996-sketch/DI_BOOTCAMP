import React, { useState } from 'react'

export function ColumnLeft() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [requestError, setRequestError] = useState('')

  const fetchImages = async () => {
    setLoading(true)
    setRequestError('')

    try {
      const response = await fetch('https://picsum.photos/v2/list?page=0&limit=2')
      if (!response.ok) {
        throw new Error(`Image request failed (${response.status})`)
      }

      setImages(await response.json())
    } catch (error) {
      setRequestError(error.message || 'Could not load images. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="column column-left" aria-labelledby="images-heading">
      <div className="column-heading">
        <span className="column-index">01 / REQUEST</span>
        <h2 id="images-heading">A view into<br />the image feed.</h2>
        <p>Fetch two photographs from the public Picsum endpoint. This column stays independent of errors on the right.</p>
      </div>

      <button className="primary-button" onClick={fetchImages} disabled={loading}>
        {loading ? 'Loading images...' : 'Get images'}
        <span aria-hidden="true">{loading ? '…' : '↗'}</span>
      </button>

      {requestError && <p className="request-error" role="status">{requestError}</p>}

      {images.length > 0 ? (
        <div className="image-list" aria-live="polite">
          {images.map(({ id, author, download_url }) => (
            <figure className="image-item" key={id}>
              <img src={download_url} alt={`Photograph by ${author}`} />
              <figcaption><span>{author}</span><span>IMG / {id}</span></figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="image-placeholder">
          <span className="placeholder-mark" aria-hidden="true">＋</span>
          <p>Your images will appear here.</p>
        </div>
      )}
      <p className="column-footnote">SOURCE <span>picsum.photos</span></p>
    </section>
  )
}