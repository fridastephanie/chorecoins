import { useState, useCallback } from "react";
import {
  createFamily,
  addMember,
  removeMember,
  updateFamilyName,
  deleteFamily,
  getFamily,
} from "../api/family";

export function useFamilyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewFamily = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createFamily(payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFamilyApi = useCallback(async (familyId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFamily(familyId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addFamilyMemberApi = useCallback(async (familyId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await addMember(familyId, userId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFamilyMemberApi = useCallback(async (familyId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await removeMember(familyId, userId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFamilyApi = useCallback(async (familyId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateFamilyName(familyId, payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFamilyApi = useCallback(async (familyId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteFamily(familyId);
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
    createNewFamily,
    fetchFamilyApi,
    addFamilyMemberApi,
    removeFamilyMemberApi,
    updateFamilyApi,
    deleteFamilyApi,
  };
}