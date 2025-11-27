import { useState } from "react";

export function useLoginForm(initialValues = { email: "", password: "" }) {
  const [credentials, setCredentials] = useState(initialValues);

  /**
   * Handles changes to input fields.
   * Updates the credentials state with the new value for the changed field.
   */
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return { credentials, handleChange, setCredentials };
}