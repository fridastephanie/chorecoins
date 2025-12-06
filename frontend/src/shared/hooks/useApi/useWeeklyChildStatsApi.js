import { useState, useEffect } from "react";
import { getWeeklyStatsForChild } from "../../api/weeklyChildStats";

/**
 * Custom hook for fetching weekly stats for a specific child.
 * Manages loading, error, and provides a reload function to refetch the data.
 */
export const useWeeklyChildStatsApi = (childId) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getWeeklyStatsForChild(childId);
      setStats(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childId) loadStats();
  }, [childId]);

  return { stats, loading, error, reload: loadStats };
};