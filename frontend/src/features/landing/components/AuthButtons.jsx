import { useNavigate } from "react-router-dom";

export default function AuthButtons() {
  const navigate = useNavigate();

  return (
    <nav className="landing-buttons" aria-label="Authentication actions">
      <button
        className="landing-btn"
        onClick={() => navigate("/login")}
        aria-label="Go to login page"
      >
        Login
      </button>

      <button
        className="landing-btn"
        onClick={() => navigate("/register")}
        aria-label="Go to register page"
      >
        Register
      </button>
    </nav>
  );
}
