import api from "./api";

export const getWeeklyStatsForChild = async (childId) => {
  const res = await api.get(`/weekly-stats/child/${childId}`);
  return res.data; 
};

export const getWeeklyStatsForChildWeek = async (childId, weekNumber, year) => {
  const res = await api.get(`/weekly-stats/child/${childId}/week/${weekNumber}/year/${year}`);
  return res.data;
};
