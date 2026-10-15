import { useState } from "react";

function SearchBar({ onSearch, disabled }) {
  const [city, setCity] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (city.trim() === "") {
      return;
    }

    onSearch(city.trim());
    setCity("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        className="search-input"
        placeholder="Search any city..."
        aria-label="Search for a city"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />

      <button type="submit" className="search-submit" disabled={disabled || !city.trim()}>
        <span>Find weather</span><span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}

export default SearchBar;