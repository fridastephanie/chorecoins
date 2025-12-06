import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  /**
   * Sets an error message to be displayed globally.
   * Handles different types of errors including:
   *   - Strings
   *   - Axios HTTP responses (handles common status codes)
   *   - JavaScript Error objects
   *   - Unknown errors
   */
  const showError = (err, context = null) => {

    if (typeof err === "string") {
      setError(err);
      return;
    }

    if (err?.response) {
      switch (err.response.status) {
        case 400:
          setError("Bad request");
          break;
        case 401:
          if (context === "login") {
            setError("Incorrect email or password");
          } else {
            setError("You must be logged in");
          }
          break;
        case 403:
          setError("You are not authorized");
          break;
        case 404:
          setError("Resource not found");
          break;
        case 409:
          setError("Email is already in use");
          break;
        case 500:
          setError("Server error, please try again later");
          break;
        default:
          setError(err.response.data?.message || "An error occurred");
      }
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unknown error occurred");
    }
  };

 /**
   * Clears any currently set global error.
   */
  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

/**
 * Custom hook to access the ErrorContext.
 */
export const useError = () => useContext(ErrorContext);