import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunks";
import { logout } from "../features/auth/authSlice";

function AuthForm() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    dispatch(loginUser({ name, email, password }))
      .unwrap()
      .then(() => {
        setName("");
        setEmail("");
        setPassword("");
      })
      .catch(() => {
        // The error message is displayed from Redux state below.
      });
  }

  if (user) {
    return (
      <section className="auth-panel">
        <h2>Welcome, {user.name}!</h2>
        <p>You are signed in as {user.email}.</p>
        <button
          className="secondary-button"
          onClick={() => dispatch(logout())}
        >
          Log Out
        </button>
      </section>
    );
  }

  return (
    <section className="auth-panel">
      <h2>Customer Login</h2>
      <p className="category">Demo login — no account is created.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 4 characters"
          minLength={4}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button
          className="primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;