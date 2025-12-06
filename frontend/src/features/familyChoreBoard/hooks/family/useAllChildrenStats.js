import { useState, useEffect } from "react";
import { getWeeklyStatsForChild } from "../../../../shared/api/weeklyChildStats";

export function useAllChildrenStats(children, familyId) {
  const [allStats, setAllStats] = useState([]);

  useEffect(() => {
    if (!children || children.length === 0) {
      setAllStats([]);
      return;
    }

    let cancelled = false;

  /**
   * Loads weekly stats for all child members in the family.
   * Filters stats by familyId and sets the current week's stat.
   * Cancels state update if the component is unmounted.
   */
    const loadStats = async () => {
      const statsArray = await Promise.all(
        children.map(async (child) => {
          const data = await getWeeklyStatsForChild(child.id);
          const filteredStats = data?.filter((s) => s.familyId === familyId) || [];
          return { child, stats: filteredStats, currentWeekStat: filteredStats[0] || {} };
        })
      );

      if (!cancelled) {
        setAllStats(statsArray);
      }
    };

    loadStats();

    return () => {
      cancelled = true; 
    };
  }, [children.map(c => c.id).join(","), familyId]); 

  return allStats;
}