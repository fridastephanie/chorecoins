import { useEffect } from "react";
import { useAuth } from "../../../../shared/context/AuthContext";
import { useError } from "../../../../shared/context/ErrorContext";
import { useLoginForm } from "../hooks/useLoginForm";
import InputField from "../../../../shared/components/InputField";

export default function LoginForm() {
  const { login } = useAuth();
  const { showError, clearError } = useError();
  const { credentials, handleChange } = useLoginForm();

  useEffect(() => {
    document.getElementById("email")?.focus(); 
  }, []);

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
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <InputField
          id="email"
          required
          name="email"
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          aria-required="true"
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Password</label>
        <InputField
          id="password"
          required
          name="password"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          aria-required="true"
        />
      </div>

      <button type="submit" aria-label="Login">Login</button>
    </form>
  );
}