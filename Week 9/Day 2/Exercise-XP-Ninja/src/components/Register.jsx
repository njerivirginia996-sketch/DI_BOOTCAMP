import { useState } from "react";
import { connect } from "react-redux";
import { registerUser, clearAuthFeedback } from "../redux/authSlice";

function Register({ registerUser, clearAuthFeedback, error, message }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    clearAuthFeedback();

    if (!username.trim() || !email.trim() || !password) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    registerUser({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  }

  return (
    <section className="auth-card">
      <h2>Create an account</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="register-username">Username</label>
        <input
          id="register-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <button type="submit">Register</button>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <p className="hint">Use a password of at least 8 characters.</p>
    </section>
  );
}

const mapStateToProps = (state) => ({
  error: state.auth.error,
  message: state.auth.message,
});

const mapDispatchToProps = {
  registerUser,
  clearAuthFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
