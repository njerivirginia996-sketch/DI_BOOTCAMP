// 1. Array of planet objects containing name, color, and number of moons
const planets = [
  { name: "Mercury", color: "gray", moons: 0 },
  { name: "Venus", color: "orange", moons: 0 },
  { name: "Earth", color: "blue", moons: 1 },
  { name: "Mars", color: "red", moons: 2 },
  { name: "Jupiter", color: "brown", moons: 79 },
  { name: "Saturn", color: "goldenrod", moons: 82 },
  { name: "Uranus", color: "lightblue", moons: 27 },
  { name: "Neptune", color: "darkblue", moons: 14 }
];

const listPlanetsSection = document.querySelector(".listPlanets");

// 2. Loop through each planet
planets.forEach((planet) => {
  // Create planet div
  const planetDiv = document.createElement("div");
  planetDiv.classList.add("planet");
  planetDiv.style.backgroundColor = planet.color;
  planetDiv.textContent = planet.name;

  // Bonus: Create moon divs inside the planet (capped at 5 visually)
  const displayMoons = Math.min(planet.moons, 5);
  for (let i = 0; i < displayMoons; i++) {
    const moonDiv = document.createElement("div");
    moonDiv.classList.add("moon");
    
    // Position moons relative to planet box
    moonDiv.style.left = `${(i + 1) * 25}px`;
    moonDiv.style.top = `${i % 2 === 0 ? 10 : 50}px`;

    planetDiv.appendChild(moonDiv);
  }

  // Append to section
  listPlanetsSection.appendChild(planetDiv);
});