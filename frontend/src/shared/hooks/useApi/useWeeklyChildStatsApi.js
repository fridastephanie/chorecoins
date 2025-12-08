import { useState, useEffect } from "react";
import { getWeeklyStatsForChild } from "../../api/weeklyChildStats";
import { useError } from "../../context/ErrorContext";

/**
 * Custom hook for fetching weekly stats for a specific child.
 * Handles loading, error state, and exposes a reload() function.
 */
export const useWeeklyChildStatsApi = (childId) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showError } = useError();

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeeklyStatsForChild(childId);
      setStats(data);
    } catch (err) {
      const msg = "Failed to load weekly child stats";
      showError(msg);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childId) loadStats();
  }, [childId]);

  return {
    stats,
    loading,
    error,
    reload: loadStats,
  };
};
