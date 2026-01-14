// src/i18n_instructions.js
import he from "./json-translations/he.json";
import eng from "./json-translations/eng.json";
import i18n from "./i18n"; // כדי לבדוק מה השפה הנוכחית

const instructionsData = {
  he: he?.Instructions?.instructions || [],
  eng: eng?.Instructions?.instructions || [],
};

export function getInstructions() {
  return instructionsData[i18n.language] || [];
}
