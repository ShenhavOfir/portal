export function getLastExaminations(days = [], type, count = 4) {
  const safeDays = Array.isArray(days) ? days : [];

  return safeDays
    .flatMap((day) =>
      (day?.examinations?.[type] ?? []).map((exam) => ({
        date: day.date, // נשאר כמחרוזת YYYYMMDD
        ...exam,
      }))
    )
    // מחרוזת YYYYMMDD ניתנת להשוואה לקסיקוגרפית
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
}
