import Exercise1 from './Exercise1.jsx';
import Exercise2 from './Exercise2.jsx';

function App() {
  return (
    <main className="container py-5">
      <header className="mb-5">
        <p className="text-uppercase fw-bold small text-secondary mb-2">Week 7 · Day 4</p>
        <h1 className="display-5 fw-bold">Exercise XP Gold</h1>
        <p className="lead text-secondary mb-0">React components styled with Bootstrap.</p>
      </header>

      <Exercise1 />
      <Exercise2 />
    </main>
  );
}

export default App;