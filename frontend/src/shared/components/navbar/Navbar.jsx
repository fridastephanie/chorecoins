import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <span>Welcome {user.firstName}</span>
      <div className="navbar__links">
        <Link to="/dashboard">Home</Link>
        <Link to={`/edit-user/${user.id}`}>Edit User</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}