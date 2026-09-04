// 1. Create an array of planets
const planets = [
    {
        name: "Mercury",
        color: "#b0b0b0",
        size: 48,
        moons: 0
    },
    {
        name: "Venus",
        color: "#d89b52",
        size: 58,
        moons: 0
    },
    {
        name: "Earth",
        color: "#2d7af7",
        size: 70,
        moons: 1
    },
    {
        name: "Mars",
        color: "#d74b3d",
        size: 60,
        moons: 2
    },
    {
        name: "Jupiter",
        color: "#c49166",
        size: 110,
        moons: 4
    },
    {
        name: "Saturn",
        color: "#e7d7a5",
        size: 96,
        moons: 3
    },
    {
        name: "Uranus",
        color: "#9fe3ec",
        size: 72,
        moons: 2
    },
    {
        name: "Neptune",
        color: "#1e3dff",
        size: 70,
        moons: 2
    }
];

if (typeof document !== "undefined") {
    const section = document.querySelector(".listPlanets");

    if (section) {
        planets.forEach((planet) => {
            const planetDiv = document.createElement("div");
            planetDiv.classList.add("planet");
            planetDiv.style.backgroundColor = planet.color;
            planetDiv.style.width = `${planet.size}px`;
            planetDiv.style.height = `${planet.size}px`;

            const label = document.createElement("span");
            label.textContent = planet.name;
            planetDiv.appendChild(label);

            for (let i = 0; i < planet.moons; i++) {
                const moon = document.createElement("div");
                moon.classList.add("moon");

                const angle = (Math.PI * 2 * i) / planet.moons;
                const distance = planet.size / 2 + 18 + i * 8;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                moon.style.left = `${50 + x}px`;
                moon.style.top = `${50 + y}px`;
                moon.style.width = `${Math.max(8, planet.size / 12)}px`;
                moon.style.height = `${Math.max(8, planet.size / 12)}px`;

                planetDiv.appendChild(moon);
            }

            section.appendChild(planetDiv);
        });
    } else {
        console.log("No .listPlanets section found.");
    }
} else {
    console.log("This solar system script must run in a browser.");
}