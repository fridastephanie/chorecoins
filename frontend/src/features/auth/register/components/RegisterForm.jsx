import { useRegisterForm } from "../hooks/useRegisterForm";
import { useNavigate } from "react-router-dom";
import { useError } from "../../../../shared/context/ErrorContext.jsx";
import { useUserApi } from "../../../../shared/hooks/useUserApi";
import InputField from "../../../../shared/components/InputField";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { showError, clearError } = useError();
  const { form, errors, handleChange, isValid } = useRegisterForm();
  const { registerNewUser, loading } = useUserApi();

  /**
   * Handles form submission for user registration.
   * Validates form fields, calls registerNewUser from useUserApi,
   * and navigates to the login page on success.
   * Displays any validation or server errors using the error context.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!isValid()) {
      showError("Please fix the errors before submitting");
      return;
    }

    try {
      await registerNewUser(form);
      navigate("/login");
    } catch (err) {
      showError(err);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
        <InputField
            required
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
        />

        <InputField
            required
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
        />

        <InputField
            required
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
        />

        <InputField
            required
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
        />

        <div className="role-select">
            <label>
            <input
                type="radio"
                name="role"
                value="PARENT"
                checked={form.role === "PARENT"}
                onChange={handleChange}
            /> Parent
            </label>

            <label>
            <input
                type="radio"
                name="role"
                value="CHILD"
                checked={form.role === "CHILD"}
                onChange={handleChange}
            /> Child
            </label>
        </div>

        <button type="submit" disabled={loading}>
        {loading ? "Registering.." : "Register"}
        </button>
    </form>
  );
}