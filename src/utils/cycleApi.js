// === src/utils/cycleApi.js ===

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
      `https://eve4userver.evepro365.com/api/GetPatientCycle?id=${patientId}&cycleid=${cycleId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
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
