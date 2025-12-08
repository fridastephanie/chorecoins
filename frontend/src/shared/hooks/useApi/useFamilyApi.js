import { useState, useCallback } from "react";
import {
  createFamily,
  addMember,
  removeMember,
  updateFamilyName,
  deleteFamily,
  getFamily,
} from "../../api/family";
import { useError } from "../../context/ErrorContext";

/**
 * Custom hook for managing families via the API.
 * Handles loading and error states for operations like
 * creating, fetching, updating, and deleting families,
 * as well as adding or removing family members.
 */
export function useFamilyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useError();

  const createNewFamily = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createFamily(payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to create family";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchFamilyApi = useCallback(async (familyId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFamily(familyId);
      return res.data;
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? "Family not found"
          : "Failed to load family";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const addFamilyMemberApi = useCallback(async (familyId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addMember(familyId, userId);
      return res.data;
    } catch (err) {
      const msg = "Failed to add member";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const removeFamilyMemberApi = useCallback(async (familyId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await removeMember(familyId, userId);
      return res.data;
    } catch (err) {
      const msg = "Failed to remove member";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const updateFamilyApi = useCallback(async (familyId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateFamilyName(familyId, payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to update family";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const deleteFamilyApi = useCallback(async (familyId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFamily(familyId);
    } catch (err) {
      const msg = "Failed to delete family";
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
    createNewFamily,
    fetchFamilyApi,
    addFamilyMemberApi,
    removeFamilyMemberApi,
    updateFamilyApi,
    deleteFamilyApi,
  };
}