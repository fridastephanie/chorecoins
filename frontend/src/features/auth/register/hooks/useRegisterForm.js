import { useState, useEffect } from "react";
import { validateFirstName, validateEmail, validatePassword, validateConfirmPassword } from "../../../../shared/utils/validation";

export function useRegisterForm(initialValues = { firstName: "", email: "", password: "", confirmPassword: "", role: "PARENT" }) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Live-validation
    setErrors({
      firstName: validateFirstName(form.firstName),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword)
    });
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = () => Object.values(errors).every(err => !err || (Array.isArray(err) && err.length === 0));

  return { form, errors, handleChange, isValid };
}