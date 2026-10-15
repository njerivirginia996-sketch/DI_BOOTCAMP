import { useState } from "react";
import { connect } from "react-redux";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import TodoList from "./components/TodoList";

function App({ isAuthenticated, message }) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <main className="app-container">
      <header className="app-header">
        <div>
          <p className="eyebrow">REACT + REDUX</p>
          <h1>My Task Manager</h1>
          <p className="subtitle">
            Organize your day, one task at a time.
          </p>
        </div>
      </header>

      {isAuthenticated ? (
        <>
          {message && <p className="success">{message}</p>}
          <Logout />
          <TodoList />
        </>
      ) : (
        <>
          <nav className="auth-tabs">
            <button
              className={!showRegister ? "active" : ""}
              onClick={() => setShowRegister(false)}
            >
              Login
            </button>

            <button
              className={showRegister ? "active" : ""}
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </nav>

          {showRegister ? <Register /> : <Login />}
          <p className="auth-note">
            Register first if you do not have an account.
          </p>
        </>
      )}

      <footer>Built with React, Redux Toolkit and React-Redux.</footer>
    </main>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  message: state.auth.message,
});

export default connect(mapStateToProps)(App);

