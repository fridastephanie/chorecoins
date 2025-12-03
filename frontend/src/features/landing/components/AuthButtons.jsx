import { useNavigate } from "react-router-dom";

export default function AuthButtons() {
  const navigate = useNavigate();

  return (
    <div className="landing-buttons">
      <button className="landing-btn" onClick={() => navigate("/login")}>
        Login
      </button>

      <button className="landing-btn" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
}