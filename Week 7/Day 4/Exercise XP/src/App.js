import Exercise from './Exercise3.js';
import UserFavoriteAnimals from './UserFavoriteAnimals.js';

const user = {
  firstName: 'Bob',
  lastName: 'Dylan',
  favAnimals: ['Horse', 'Turtle', 'Elephant', 'Monkey'],
};

const myelement = <h1 className="jsx-title">I Love JSX!</h1>;
const sum = 5 + 5;

function App() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Week 7 · Day 4</p>
        <h1>React Exercise XP</h1>
        <p className="header-copy">A first look at JSX, props, components, and styling.</p>
      </header>

      <div className="exercise-list">
        <section className="exercise-section" aria-labelledby="exercise-one">
          <p className="section-label">Exercise 01</p>
          <h2 id="exercise-one">With JSX</h2>
          <p>Hello World!</p>
          {myelement}
          <p>React is {sum} times better with JSX</p>
        </section>

        <section className="exercise-section" aria-labelledby="exercise-two">
          <p className="section-label">Exercise 02</p>
          <h2 id="exercise-two">Object and props</h2>
          <h3>{user.firstName}</h3>
          <h3>{user.lastName}</h3>
          <UserFavoriteAnimals favAnimals={user.favAnimals} />
        </section>

        <section className="exercise-section exercise-three" aria-labelledby="exercise-three">
          <p className="section-label">Exercise 03</p>
          <h2 id="exercise-three">HTML tags in React</h2>
          <Exercise />
        </section>
      </div>
    </main>
  );
}

export default App;