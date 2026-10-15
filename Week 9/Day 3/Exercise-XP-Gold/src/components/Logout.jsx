import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";

function Logout() {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className="logout-button"
      onClick={() => dispatch(logoutUser())}
    >
      Logout
    </button>
  );
}

export default Logout;