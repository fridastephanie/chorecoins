import { useState, useEffect } from "react";
import { validateFirstName, validateEmail, validatePassword, validateConfirmPassword } from "../../../../shared/utils/validation";

export function useRegisterForm(initialValues = { firstName: "", email: "", password: "", confirmPassword: "", role: "PARENT" }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /**
   * Runs live validation on all form fields whenever their values change.
   * Updates the `errors` state with validation messages for UI feedback.
   */
  useEffect(() => {
    setErrors({
      firstName: validateFirstName(form.firstName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword)
    });
  }, [form]);

  /**
   * Handles changes to input fields.
   * Updates the form state with the new value for the changed field.
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Checks if the current form values are valid.
   * Returns true only if all fields pass their respective validation rules.
   */
  const isValid = () => Object.values(errors).every(err => !err || (Array.isArray(err) && err.length === 0));

  return { form, errors, handleChange, isValid };
}