import { useState, useEffect } from "react";
import { getWeeklyStatsForChild } from "../api/weeklyChildStats";

export const useWeeklyChildStats = (childId) => {
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