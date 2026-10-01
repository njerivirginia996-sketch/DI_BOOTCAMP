function Card({ id, icon, title, description, alternate }) {
  return (
    <section id={id} className={`feature-row${alternate ? ' feature-row-alternate' : ''}`}>
      <div className="feature-icon" aria-hidden="true">
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="feature-copy">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}

export default Card;