import { useState, useEffect } from "react";
import { getWeeklyStatsForChild } from "../../../../shared/api/weeklyChildStats";
import useCurrentWeek from "../../../../shared/hooks/useCurrentWeek";

export function useAllChildrenStats(children, familyId) {
  const [allStats, setAllStats] = useState([]);
  const currentWeek = useCurrentWeek();

  useEffect(() => {
    if (!children || children.length === 0) {
      setAllStats([]);
      return;
    }

    let cancelled = false;

    /**
     * Loads weekly stats for all child members in the family.
     * Fetches each child's stats from the API, filters them by familyId,
     * sorts the stats so the newest week appears first, and determines the
     * correct stat object for the current week.
     */
    const loadStats = async () => {
      const statsArray = await Promise.all(
        children.map(async (child) => {
          const data = await getWeeklyStatsForChild(child.id);
          let filteredStats = data?.filter((s) => s.familyId === familyId) || [];

          filteredStats = filteredStats.sort((a, b) => b.weekNumber - a.weekNumber);

          /**
           * Determine the stat record for the current week.
           * If no stat exists yet for the current week, return a default empty record.
           */
          const currentWeekStat =
            filteredStats.find(s => s.weekNumber === currentWeek) ||
            { weekNumber: currentWeek, completedChoresCount: 0, earnedCoins: 0 };

          return {
            child,
            stats: filteredStats,
            currentWeekStat,
          };
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
  }, [children.map((c) => c.id).join(","), familyId, currentWeek]);

  /**
   * Returns an array where each entry contains:
   * - the child object
   * - all weekly stats for the child (sorted newest → oldest)
   * - the current week's stat for display in the Chore Board
   */
  return allStats;
}