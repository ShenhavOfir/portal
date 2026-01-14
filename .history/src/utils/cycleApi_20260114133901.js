// === src/utils/cycleApi.js ===

import { API_FULL_URL } from "../config/apiConfig";

/**
 * שליפת מחזור ספציפי לפי מזהה
 */
export async function fetchCycleById(patientId, cycleId) {
  if (!patientId || !cycleId) {
    console.warn("⚠️ fetchCycleById: חסרים פרמטרים:", { patientId, cycleId });
    return null;
  }

  try {
    const response = await fetch(
      `${API_FULL_URL}/GetPatientCycle?id=${patientId}&cycleid=${cycleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("❌ שגיאה בשליפת מחזור:", response.statusText);
      return null;
    }

    const data = await response.json();

    console.log("📥 מחזור מעודכן:", data);
    return data;
  } catch (err) {
    console.error("❌ שגיאת רשת בשליפת מחזור:", err);
    return null;
  }
}
