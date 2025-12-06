import { useRegisterForm } from "../hooks/useRegisterForm";
import { useNavigate } from "react-router-dom";
import { useError } from "../../../../shared/context/ErrorContext.jsx";
import { useUserApi } from "../../../../shared/hooks/useApi/useUserApi.js";
import InputField from "../../../../shared/components/InputField";
import RoleSelect from "./RoleSelect.jsx";
import { getFirstValidationError } from "../../../../shared/utils/getFirstValidationError";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { showError, clearError } = useError();
  const { form, errors, handleChange, isValid } = useRegisterForm();
  const { registerNewUser, loading } = useUserApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!isValid()) {
      const msg = getFirstValidationError(errors);
      showError(msg || "Please fix the errors before submitting");
      return;
    }

    try {
      await registerNewUser(form);
      navigate("/login");
    } catch (err) {
      showError(err);
    }
  };

  const fields = [
    { name: "firstName", placeholder: "First name", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
    { name: "confirmPassword", placeholder: "Confirm password", type: "password" },
  ];

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <InputField
          key={field.name}
          required
          {...field}
          value={form[field.name]}
          onChange={handleChange}
          error={errors[field.name]}
        />
      ))}

      <RoleSelect value={form.role} onChange={handleChange} />

      <button type="submit" disabled={loading}>
        {loading ? "Registering.." : "Register"}
      </button>
    </form>
  );
}