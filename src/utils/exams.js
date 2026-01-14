// src/utils/exams.js
export function normalize(items) {
  return (items ?? [])
    .map((it) => {
      if (typeof it === "string") return { label: "", value: it };
      const label = (it?.name ?? it?.label ?? "").trim();
      const val = (it?.result ?? it?.value ?? "").toString().trim();
      return { label, value: val };
    })
    .filter((x) => x.label || x.value);
}

/** מוצא את התאריך האחרון שבו יש נתונים מסוג נתון ומחזיר {date, items[]} */
export function getLatestByType(dates = [], type) {
  const safe = Array.isArray(dates) ? dates : [];
  const candidates = safe
    .filter((d) => (d?.examinations?.[type] ?? []).length > 0)
    .map((d) => ({ date: d.date, items: normalize(d.examinations[type]) }));

  if (candidates.length === 0) return null;
  candidates.sort((a, b) => b.date.localeCompare(a.date)); // YYYYMMDD
  return candidates[0];
}

/** המרה בטוחה מ־YYYYMMDD */
export function formatHeYMD(ymd) {
  if (!ymd || String(ymd).length !== 8) return "";
  const y = +String(ymd).slice(0, 4);
  const m = +String(ymd).slice(4, 6) - 1;
  const d = +String(ymd).slice(6, 8);
  return new Date(Date.UTC(y, m, d)).toLocaleDateString("he-IL");
}
