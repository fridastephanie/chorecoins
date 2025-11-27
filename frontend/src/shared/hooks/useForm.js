import { useState } from "react";

/**
 * Custom hook for managing form state.
 * Provides current values, a change handler, and a reset function.
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  /**
   * Handles input changes for form fields.
   * Updates the corresponding value in the state based on input name.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Resets all form values to their initial state.
   */
  const resetForm = () => setValues(initialValues);

  return { values, setValues, handleChange, resetForm };
}