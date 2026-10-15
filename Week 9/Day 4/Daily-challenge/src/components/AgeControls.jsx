import { useDispatch, useSelector } from "react-redux";
import { ageUpAsync, ageDownAsync } from "../features/age/ageThunks";

function AgeControls() {
  const dispatch = useDispatch();
  const { loading, age } = useSelector((state) => state.age);

  function handleAgeUp(event) {
    event.preventDefault();
    dispatch(ageUpAsync());
  }

  function handleAgeDown(event) {
    event.preventDefault();
    dispatch(ageDownAsync());
  }

  return (
    <form className="age-controls">
      <p>Choose an action</p>

      <div className="button-group">
        <button
          type="button"
          onClick={handleAgeUp}
          disabled={loading}
        >
          + Age Up
        </button>

        <button
          type="button"
          onClick={handleAgeDown}
          disabled={loading || age === 0}
        >
          − Age Down
        </button>
      </div>

      <p className="hint">
        Each update takes one second.
      </p>
    </form>
  );
}

export default AgeControls;