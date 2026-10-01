const planets = ['Mars', 'Venus', 'Jupiter', 'Earth', 'Saturn', 'Neptune'];

function Exercise2() {
  return (
    <section aria-labelledby="exercise-two-heading">
      <p className="text-uppercase fw-bold small text-secondary mb-2">Exercise 2</p>
      <h2 id="exercise-two-heading" className="h3 mb-3">Planets</h2>
      <ul className="list-group planet-list">
        {planets.map((planet) => (
          <li className="list-group-item" key={planet}>{planet}</li>
        ))}
      </ul>
    </section>
  );
}

export default Exercise2;