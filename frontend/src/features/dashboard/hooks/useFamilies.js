import { useState, useEffect } from "react";
import { useUserApi } from "../../../shared/hooks/useUserApi";

const familyCache = {}; // Simple in-memory cache keyed by userId

export default function useFamilies(userId) {
  const { fetchUserFamilies } = useUserApi();
  const [families, setFamilies] = useState(() => familyCache[userId] || []);
  const [error, setError] = useState(null);

  /**
   * Fetches the families for the given user from the backend if not cached.
   * Updates the in-memory cache and local state.
   * Sets the `error` state if the fetch fails.
   */
  useEffect(() => {
    if (!userId || familyCache[userId]) return; // Skip if cached

    const loadFamilies = async () => {
      try {
        const res = await fetchUserFamilies(userId);
        familyCache[userId] = res; // Update cache
        setFamilies(res); // Update state
      } catch (err) {
        console.error("Failed to fetch families:", err);
        setError("Failed to load families.");
      }
    };

    loadFamilies();
  }, [userId, fetchUserFamilies]);

  /**
   * Adds a new family to the existing families state.
   * Updates both local state and the in-memory cache.
   * @param {Object} family - The new family object to add
   */
  const addFamily = (family) => {
    setFamilies((prev) => {
      const updated = [...prev, family];
      familyCache[userId] = updated; // Update cache
      return updated;
    });
  };

  return {
    families,
    error,
    addFamily,
  };
}