import { useState, useCallback } from "react";
import {
  registerUser,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  getUserFamilies
} from "../../api/user";
import { useError } from "../../context/ErrorContext";

/**
 * Custom hook for managing users via the API.
 * Handles loading and error states for operations like
 * registering, fetching, updating, and deleting users,
 * as well as fetching the families a user belongs to.
 */
export function useUserApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useError();

  const registerNewUser = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to register user";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchUser = useCallback(async (userIdOrEmail) => {
    setLoading(true);
    setError(null);
    try {
      const res =
        typeof userIdOrEmail === "string" && userIdOrEmail.includes("@")
          ? await getUserByEmail(userIdOrEmail)
          : await getUser(userIdOrEmail);

      return res.data;
    } catch (err) {
      const msg = "Failed to load user";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateUserData = useCallback(async (userId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateUser(userId, payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to update user";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const deleteUserAccount = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
    } catch (err) {
      const msg = "Failed to delete user";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchUserFamilies = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserFamilies(userId);
      return res.data;
    } catch (err) {
      const msg = "Failed to load user families";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return {
    loading,
    error,
    registerNewUser,
    fetchUser,
    updateUserData,
    deleteUserAccount,
    fetchUserFamilies
  };
}