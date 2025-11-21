import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user) return <h2>Unauthorized</h2>;

  return (
    <div>
      <h2>Welcome {user.email}</h2>
      <p>Role: {user.role}</p>

      <button
        onClick={() => {
          dispatch(logout());
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}
