import { useAuth } from "../../../../shared/context/AuthContext";
import { useError } from "../../../../shared/context/ErrorContext";
import { useLoginForm } from "../hooks/useLoginForm";
import InputField from "../../../../shared/components/InputField";

export default function LoginForm() {
  const { login } = useAuth();
  const { showError, clearError } = useError();
  const { credentials, handleChange } = useLoginForm();

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
      <InputField
        required
        name="email"
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={handleChange}
      />

      <InputField
        required
        name="password"
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={handleChange}
      />

      <button type="submit">Login</button>
    </form>
  );
}
