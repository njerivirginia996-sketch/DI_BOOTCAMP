import { useState } from "react";
import { connect } from "react-redux";
import { loginUser, clearAuthFeedback } from "../redux/authSlice";

function Login({ loginUser, clearAuthFeedback, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    clearAuthFeedback();

    loginUser({
      email: email.trim().toLowerCase(),
      password,
    });
  }

  return (
    <section className="auth-card">
      <h2>Welcome back</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  );
}

const mapStateToProps = (state) => ({
  error: state.auth.error,
});

const mapDispatchToProps = {
  loginUser,
  clearAuthFeedback,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
