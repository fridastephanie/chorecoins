import { useRegisterForm } from "../hooks/useRegisterForm";
import { useNavigate } from "react-router-dom";
import { useError } from "../../../../shared/context/ErrorContext.jsx";
import { registerUser } from "../../../../shared/api/auth.js";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { showError } = useError();
  const { form, errors, handleChange, isValid } = useRegisterForm();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      showError("Please fix the errors before submitting");
      return;
    }

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      showError(err); 
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div>
        <input
          name="firstName"
          placeholder="First name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        {errors.firstName && <p className="field-error">{errors.firstName}</p>}
      </div>

      <div>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {errors.password && Array.isArray(errors.password) &&
          errors.password.map((err, i) => <p key={i} className="field-error">{err}</p>)
        }
      </div>

      <div>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
      </div>

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

      <button type="submit">Register</button>
    </form>
  );
}