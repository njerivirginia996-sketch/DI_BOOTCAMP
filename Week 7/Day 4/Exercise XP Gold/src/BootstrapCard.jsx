function BootstrapCard({ title, imageUrl, buttonLabel, buttonUrl, description }) {
  return (
    <article className="card m-5 celebrity-card">
      <img className="card-img-top celebrity-image" src={imageUrl} alt={`${title} portrait`} />
      <div className="card-body">
        <h3 className="card-title h5">{title}</h3>
        <p className="card-text">{description}</p>
        <a className="btn btn-primary" href={buttonUrl} target="_blank" rel="noreferrer">
          {buttonLabel}
        </a>
      </div>
    </article>
  );
}

export default BootstrapCard;