import { useState, useEffect } from "react";
import { useForm } from "../../../shared/hooks/useForm";
import { validateFirstName, validateEmail, validatePassword, validateConfirmPassword } from "../../../shared/utils/validation";
import { useUserApi } from "../../../shared/hooks/useUserApi";

const userCache = {}; // Simple in-memory cache for user data keyed by userId

export function useEditUserForm(user, onDeleteSuccess) {
  const { fetchUser, updateUserData, deleteUserAccount, loading, error } = useUserApi();
  const { values, handleChange, setValues } = useForm({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [originalValues, setOriginalValues] = useState({ firstName: "", email: "" });

  /**
   * Fetches the full user data from the backend when the component mounts or when userId changes.
   * Populates the form with the user's current first name and email, leaving password fields empty.
   * Stores original fetched values to compare against during updates.
   * Uses in-memory cache to prevent repeated requests when navigating back to the edit page.
   */
  useEffect(() => {
    if (!user) return;

    const loadUser = async () => {
      try {
        let data;
        if (userCache[user.id]) {
          data = userCache[user.id]; // Use cached data
        } else {
          data = await fetchUser(user.id);
          userCache[user.id] = data; // Store in cache
        }

        const initialValues = {
          firstName: data.firstName || "",
          email: data.email || "",
          password: "",
          confirmPassword: ""
        };

        setValues(initialValues);
        setOriginalValues({ firstName: data.firstName || "", email: data.email || "" });
      } catch (_) {}
    };

    loadUser();
  }, [user, fetchUser, setValues]);

  /**
   * Runs live validation on all form fields whenever their values change.
   * Validates first name, email, and password/confirm password only if password is being updated.
   * Updates the `errors` state for UI feedback.
   */
  useEffect(() => {
    setErrors({
      firstName: validateFirstName(values.firstName),
      email: validateEmail(values.email),
      password: values.password ? validatePassword(values.password) : [],
      confirmPassword: values.password ? validateConfirmPassword(values.password, values.confirmPassword) : ""
    });
  }, [values]);

  /**
   * Checks if the current form values are valid based on the errors state.
   * Returns true only if all fields pass their respective validation rules.
   */
  const isValid = () => Object.values(errors).every(err => !err || (Array.isArray(err) && err.length === 0));

  /**
   * Prepares a payload of updated fields and sends it to the backend.
   * Only includes fields that have changed compared to the original fetched values.
   * Returns null if no fields were modified to avoid unnecessary API calls.
   */
  const handleUpdate = async () => {
    const payload = {};
    if (values.firstName && values.firstName !== originalValues.firstName) payload.firstName = values.firstName;
    if (values.email && values.email !== originalValues.email) payload.email = values.email;
    if (values.password) payload.password = values.password;
    if (Object.keys(payload).length === 0) return null;

    const updatedUser = await updateUserData(user.id, payload);
    userCache[user.id] = updatedUser; // Update cache with latest values
    return updatedUser;
  };

  /**
   * Deletes the user account by calling the backend and triggers a callback on success.
   * Intended to handle logout or redirect after successful account deletion.
   */
  const handleDelete = async () => {
    await deleteUserAccount(user.id);
    if (onDeleteSuccess) onDeleteSuccess();
    delete userCache[user.id]; // Remove from cache on delete
  };

  return { values, errors, handleChange, isValid, handleUpdate, handleDelete, loading, error };
}