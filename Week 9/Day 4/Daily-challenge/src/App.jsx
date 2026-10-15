import AgeDisplay from "./components/AgeDisplay";
import AgeControls from "./components/AgeControls";
import "./App.css";

function App() {
  return (
    <main className="app">
      <div className="tracker-card">
        <div className="icon">⌛</div>

        <h1>Age Tracker</h1>
        <p className="subtitle">
          Track your age with asynchronous Redux actions.
        </p>

        <AgeDisplay />
        <AgeControls />
      </div>

      <footer>Built with React, Redux Toolkit, and Thunk</footer>
    </main>
  );
}

export default App;