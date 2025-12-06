import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../../css/shared/navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="navbar_top">
        <span>Welcome {user.firstName}</span>
        <button
          onClick={handleLogout}
          className="logout-btn"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
      <div className="navbar_bottom">
        <button onClick={() => navigate("/dashboard")} aria-label="Go to dashboard">
          Dashboard
        </button>
        <button onClick={() => navigate(`/edit-user/${user.id}`)} aria-label="Edit user profile">
          Edit User
        </button>
      </div>
    </nav>
  );
}