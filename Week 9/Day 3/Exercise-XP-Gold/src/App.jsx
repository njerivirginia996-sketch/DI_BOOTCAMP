import { useSelector } from "react-redux";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return (
    <main className="app-container">
      <header className="app-header">
        <p className="eyebrow">REACT + REDUX TOOLKIT</p>
        <h1>User Authentication</h1>
        <p>Manage login status with Redux.</p>
      </header>

      {isAuthenticated ? <Dashboard /> : <Login />}

      <footer>
        Built with React, Redux Toolkit and React-Redux.
      </footer>
    </main>
  );
}

export default App;