/**
 * Custom hook for getting the ISO week number of a given date.
 * Calculates the week number according to the ISO-8601 standard,
 * where weeks start on Monday and the first week of the year
 * contains the first Thursday.
 */
export default function useCurrentWeek(date = new Date()) {
  const getWeekNumber = (d) => {
    const dt = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = dt.getUTCDay() || 7;
    dt.setUTCDate(dt.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(dt.getUTCFullYear(), 0, 1));
    return Math.ceil((((dt - yearStart) / 86400000) + 1) / 7);
  };

  return getWeekNumber(date);
}
