// src/i18n_demo.js
import he from "./json-translations/he.json";
import eng from "./json-translations/eng.json";
import i18n from "./i18n";

const demoData = {
  he: he?.Demonstration || [],
  eng: eng?.Demonstration || [],
};

export function getDemoData() {
  return demoData[i18n.language] || [];
}
