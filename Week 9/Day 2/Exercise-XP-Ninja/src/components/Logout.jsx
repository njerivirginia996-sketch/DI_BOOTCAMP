import { connect } from "react-redux";
import { logoutUser } from "../redux/authSlice";

function Logout({ logoutUser, username }) {
  return (
    <div className="logout-section">
      <span>Logged in as <strong>{username}</strong></span>
      <button className="logout-button" onClick={logoutUser}>
        Logout
      </button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  username: state.auth.currentUser?.username || "",
});

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
