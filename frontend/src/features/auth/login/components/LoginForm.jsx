import { useAuth } from "../../../../shared/context/AuthContext";
import { useError } from "../../../../shared/context/ErrorContext";
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginForm() {
  const { login } = useAuth();
  const { showError, clearError } = useError();
  const { credentials, handleChange } = useLoginForm();

  /**
   * Handles form submission for login.
   * Calls login from AuthContext and shows errors if login fails.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await login(credentials);
    } catch (err) {
      showError(err, "login");
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
