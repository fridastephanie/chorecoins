import { useState } from "react";
import { useAuth } from "../../../../shared/context/AuthContext";
import { useError } from "../../../../shared/context/ErrorContext";

export default function LoginForm() {
  const { login } = useAuth();
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
      await login(credentials); // hanterar token + redirect
    } catch (err) {
      showError(err); 
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
