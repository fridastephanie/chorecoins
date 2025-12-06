/**
 * Validates first name: must start with uppercase and contain only letters.
 */
export const validateFirstName = (name) => {
  const nameRegex = /^[A-Z][a-z]+$/;
  return [
    { text: "First letter uppercase, letters only", isValid: nameRegex.test(name) }
  ];
};

/**
 * Validates email format: must include "@" and ".".
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return [
    { text: "Must include @ and .", isValid: emailRegex.test(email) }
  ];
};

/**
 * Validates password: min 6 characters, at least 1 uppercase letter, and 1 number.
 */
export const validatePassword = (password) => {
  return [
    { text: "Min 6 characters", isValid: password.length >= 6 },
    { text: "Include 1 uppercase letter", isValid: /[A-Z]/.test(password) },
    { text: "Include 1 number", isValid: /[0-9]/.test(password) }
  ];
};

/**
 * Validates that confirm password matches the original password.
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return []; 
  return [
    { text: "Passwords must match", isValid: password === confirmPassword }
  ];
};