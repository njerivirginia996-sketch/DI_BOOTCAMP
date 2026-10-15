import { useSelector } from "react-redux";

function AgeDisplay() {
  const { age, loading, error } = useSelector((state) => state.age);

  return (
    <section className="age-display">
      <p className="eyebrow">YOUR CURRENT AGE</p>

      <h2>{age}</h2>
      <p>{age === 1 ? "year old" : "years old"}</p>

      {loading && (
        <div className="loading" role="status">
          <span className="spinner" />
          Updating age...
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </section>
  );
}

export default AgeDisplay;