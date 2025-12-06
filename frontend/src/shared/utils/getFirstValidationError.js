/**
 * Returns the text of the first invalid field from a validation errors object, or null if all are valid.
 */
export function getFirstValidationError(errors) {
  for (const key in errors) {
    const arr = errors[key];
    if (Array.isArray(arr)) {
      const invalid = arr.find(item => !item.isValid);
      if (invalid) return invalid.text;
    }
  }
  return null;
}