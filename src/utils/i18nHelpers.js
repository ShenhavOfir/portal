import i18n from "../i18n";

/**
 * tAny(["key1", "key2", ...], opts?) -> יחזיר את המפתח הראשון שקיים.
 * אם אף מפתח לא קיים, יחזיר מחרוזת ריקה או opts.fallback אם הועבר.
 */
export function tAny(keys, opts = {}) {
  const arr = Array.isArray(keys) ? keys : [keys];
  for (const k of arr) {
    if (i18n.exists(k)) {
      return i18n.t(k, opts);
    }
  }
  // fallback אופציונלי
  return typeof opts.fallback === "string" ? opts.fallback : "";
}

/** בדיקה נוחה אם מפתח קיים */
export function keyExists(key) {
  return i18n.exists(key);
}
