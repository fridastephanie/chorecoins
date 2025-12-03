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
    <nav className="navbar">
      <div className="navbar_top">
        <span>Welcome {user.firstName}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
      <div className="navbar_bottom">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => navigate(`/edit-user/${user.id}`)}>Edit User</button>
      </div>
  </nav>
  );
}
