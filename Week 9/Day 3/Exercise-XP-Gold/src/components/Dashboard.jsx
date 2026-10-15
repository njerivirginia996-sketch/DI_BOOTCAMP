import { useSelector } from "react-redux";
import Logout from "./Logout";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  return (
    <section className="dashboard-card">
      <div className="dashboard-top">
        <span className="status">Authenticated</span>
        <Logout />
      </div>

      <h2>Welcome, {user?.username}!</h2>

      <p>
        You have successfully logged in.
        Your authentication status is managed by Redux.
      </p>

      <div className="info-card">
        <h3>Your Account</h3>
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>Status:</strong> Logged in
        </p>
      </div>
    </section>
  );
}

export default Dashboard;