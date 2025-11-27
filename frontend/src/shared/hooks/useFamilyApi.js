import { useState, useCallback } from "react";
import { createFamily } from "../api/family"; 

export function useFamilyApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addFamily = useCallback(async (payload) => {
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

  return {
    loading,
    error,
    addFamily,
  };
}