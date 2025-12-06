import { useState, useCallback } from "react";
import {
  createChore,
  getChoresForFamily,
  getChoresForChild,
  getChoreById,
  submitChoreAndReturnChore,
  approveChore,
  rejectChore,
  deleteChore,
} from "../../api/chore";

/**
 * Custom hook for managing chores via the API.
 * Handles loading and error states for all operations like
 * creating, fetching, submitting, approving, rejecting, and deleting chores.
 */
export function useChoreApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createNewChore = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createChore(payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChoresForFamily = useCallback(async (familyId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChoresForFamily(familyId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChoresForChild = useCallback(async (childId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChoresForChild(childId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChoreById = useCallback(async (choreId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChoreById(choreId);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

    const handleSubmitChoreAndReturnChore = useCallback(async (choreId, payload) => {
    setLoading(true);
    setError(null);
    try {
        const res = await submitChoreAndReturnChore(choreId, payload);
        return res.data; 
    } catch (err) {
        setError(err);
        throw err;
    } finally {
        setLoading(false);
    }
    }, []);


  const approveChoreSubmission = useCallback(async (choreId, submissionId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await approveChore(choreId, submissionId, payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectChoreSubmission = useCallback(async (choreId, submissionId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await rejectChore(choreId, submissionId, payload);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteChore = useCallback(async (choreId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteChore(choreId);
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
    createNewChore,
    fetchChoresForFamily,
    fetchChoresForChild,
    fetchChoreById,
    handleSubmitChoreAndReturnChore,
    approveChoreSubmission,
    rejectChoreSubmission,
    handleDeleteChore,
  };
}