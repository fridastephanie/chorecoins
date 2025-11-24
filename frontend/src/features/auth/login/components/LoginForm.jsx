import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../../shared/api/api.js";
import { useError } from "../../../../shared/context/ErrorContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { showError, clearError } = useError();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    clearError();
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      const res = await loginUser(credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      showError("Incorrect email or password");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Login</button>
    </form>
  );
}
