export function parseYMD(ymd) {
  if (!ymd || String(ymd).length !== 8) return null;
  const y = Number(String(ymd).slice(0, 4));
  const m = Number(String(ymd).slice(4, 6)) - 1;
  const d = Number(String(ymd).slice(6, 8));
  return new Date(Date.UTC(y, m, d));
}

export function formatHeYMD(ymd) {
  const dt = parseYMD(ymd);
  if (!dt) return "";

  const d = String(dt.getUTCDate()).padStart(2, "0");
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const y = dt.getUTCFullYear();

  // יום/חודש/שנה עם "/"
  return `${d}/${m}/${y}`;
}
