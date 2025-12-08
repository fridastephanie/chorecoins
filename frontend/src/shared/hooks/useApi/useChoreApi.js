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
import { useUploadImage } from "./useUploadImage";
import { useError } from "../../context/ErrorContext";

/**
 * Custom hook for managing chores via the API.
 * Handles loading and error states for all operations like
 * creating, fetching, submitting, approving, rejecting, and deleting chores.
 */
export function useChoreApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadFiles } = useUploadImage();
  const { showError } = useError();

  const createNewChore = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await createChore(payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to create chore";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchChoresForFamily = useCallback(async (familyId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChoresForFamily(familyId);
      return res.data;
    } catch (err) {
      const msg = "Failed to load chores for family";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchChoresForChild = useCallback(async (childId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChoresForChild(childId);
      return res.data;
    } catch (err) {
      const msg = "Failed to load chores for child";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const fetchChoreById = useCallback(async (choreId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChoreById(choreId);
      return res.data;
    } catch (err) {
      const msg = "Failed to load chore";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleSubmitChoreAndReturnChore = useCallback(async (choreId, { commentChild, files }) => {
    setLoading(true);
    setError(null);

    try {
      let uploadedUrls = [];
      if (files?.length > 0) {
        uploadedUrls = await uploadFiles(files);
      }

      const res = await submitChoreAndReturnChore(choreId, {
        commentChild,
        imageUrls: uploadedUrls,
      });

      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit chore";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [uploadFiles, showError]);

  const approveChoreSubmission = useCallback(async (choreId, submissionId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await approveChore(choreId, submissionId, payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to approve submission";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const rejectChoreSubmission = useCallback(async (choreId, submissionId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await rejectChore(choreId, submissionId, payload);
      return res.data;
    } catch (err) {
      const msg = "Failed to reject submission";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const handleDeleteChore = useCallback(async (choreId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteChore(choreId);
    } catch (err) {
      const msg = "Failed to delete chore";
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