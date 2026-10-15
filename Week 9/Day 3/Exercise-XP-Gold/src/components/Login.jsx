import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    dispatch(
      loginUser({
        username: username.trim(),
      })
    );
  }

  return (
    <section className="auth-card">
      <h2>Login</h2>
      <p>Enter your details to access your account.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Enter your username"
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          required
        />

        <button type="submit">Login</button>
      </form>

      <p className="hint">
        Demo only: use any non-empty username and password.
      </p>
    </section>
  );
}

export default Login;