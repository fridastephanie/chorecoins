import { useState } from "react";

/**
 * Custom hook for managing form state.
 * Provides current values, a change handler, and a reset function.
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => setValues(initialValues);

  return { values, setValues, handleChange, resetForm };
}