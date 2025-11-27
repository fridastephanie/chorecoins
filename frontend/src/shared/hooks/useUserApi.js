import { useState, useCallback } from "react";
import { getUser, updateUser, deleteUser } from "../api/user";

export function useUserApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return {
    loading,
    error,
    fetchUser,
    updateUserData,
    deleteUserAccount
  };
}