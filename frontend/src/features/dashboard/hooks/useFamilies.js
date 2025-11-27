import { useState, useEffect, useRef } from "react";
import { useUserApi } from "../../../shared/hooks/useUserApi";

/**
 * Custom hook to fetch and manage the families associated with a given user.
 * Handles fetching, storing, and updating family data in local state.
 */
export default function useFamilies(userId) {
  const { fetchUserFamilies } = useUserApi();
  const [families, setFamilies] = useState([]);
  const [error, setError] = useState(null);
  const fetched = useRef(false);

  /**
   * Fetches the families for the given user from the backend.
   * Populates the local `families` state and ensures the fetch only occurs once.
   * Sets the `error` state if the fetch fails.
   */
  useEffect(() => {
    if (!userId || fetched.current) return;

    const loadFamilies = async () => {
      try {
        const res = await fetchUserFamilies(userId);
        setFamilies(res);
        fetched.current = true;
      } catch (err) {
        console.error("Failed to fetch families:", err);
        setError("Failed to load families.");
      }
    };

    loadFamilies();
  }, [userId, fetchUserFamilies]);

  /**
   * Adds a new family to the existing families state.
   * Useful for immediately reflecting newly created families in the UI.
   * @param {Object} family - The new family object to add
   */
  const addFamily = (family) => {
    setFamilies((prev) => [...prev, family]);
  };

  return {
    families,
    error,
    addFamily,
  };
}
