// === scripts/apiConfig.cjs ===
// קובץ קונפיג משותף לכל הסקריפטים שרצים ב‑Node
// אם משנים כתובת שרת — מחליפים רק כאן.

const API_BASE_URL = "https://eve4userver.evepro365.com";
const API_FULL_URL = `${API_BASE_URL}/api`;

module.exports = {
  API_BASE_URL,
  API_FULL_URL,
};

