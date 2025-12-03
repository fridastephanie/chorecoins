export const validateFirstName = (name) => {
  const nameRegex = /^[A-Z][a-z]+$/;
  return [
    { text: "First letter uppercase, letters only", isValid: nameRegex.test(name) }
  ];
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return [
    { text: "Must include @ and .", isValid: emailRegex.test(email) }
  ];
};

export const validatePassword = (password) => {
  return [
    { text: "Min 6 characters", isValid: password.length >= 6 },
    { text: "Include 1 uppercase letter", isValid: /[A-Z]/.test(password) },
    { text: "Include 1 number", isValid: /[0-9]/.test(password) }
  ];
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return []; 
  return [
    { text: "Passwords must match", isValid: password === confirmPassword }
  ];
};