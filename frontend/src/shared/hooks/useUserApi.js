import { useState, useCallback } from "react";
import { registerUser, getUser, updateUser, deleteUser, getUserFamilies } from "../api/user";

export function useUserApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   const registerNewUser = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUser(userId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserData = useCallback(async (userId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateUser(userId, payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUserAccount = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(userId);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserFamilies = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUserFamilies(userId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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