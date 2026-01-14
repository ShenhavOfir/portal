// === src/utils/medicineApi.js ===
import { getIsraelYMDHM } from "./dateUtils";

/**
 * מחשב את שלב התרופה (phase) לפי תאריכי מחזור
 */
function getMedicinePhase(date, firstdays = {}) {
  const { firstdaycycle, firstdaysupport, firstdaysuppress } = firstdays;

  console.log("🧮 getMedicinePhase — בדיקה:", {
    date,
    firstdaycycle,
    firstdaysupport,
    firstdaysuppress,
  });

  if (!firstdaycycle || firstdaycycle === "0") return "cycle";

  // אם יש תאריך תמיכה – כל מה שאחריו זה תמיכה
  if (firstdaysupport && firstdaysupport !== "0" && date >= firstdaysupport)
    return "support";

  // אם יש תאריך דיכוי – כל מה שבין דיכוי למחזור זה דיכוי
  if (
    firstdaysuppress &&
    firstdaysuppress !== "0" &&
    date >= firstdaysuppress &&
    date < firstdaycycle
  )
    return "suppress";

  // אחרת — תרופה רגילה
  return "cycle";
}

/**
 * שליחת עדכון תרופה לשרת
 */
export async function sendMedicineUpdate({
  date,
  index = 0,
  name,
  source,
  firstdays,
  id,
  medicalcenterid,
}) {
  if (!date || !name || !id || !medicalcenterid) {
    console.warn("⚠️ sendMedicineUpdate: חסרים פרמטרים:", {
      date,
      name,
      id,
      medicalcenterid,
    });
    return false; // חשוב להחזיר false כדי שהמסך לא יסמן 'בוצע'
  }

  const timestamp = getIsraelYMDHM();
  let payload;

  // === תרופת ביוץ ===
  if (source === "ovulation") {
    const type = index === 1 ? "ovulation1" : "ovulation0";
    payload = {
      type,
      id,
      medicalcenterid,
      message: `${date},${name}`,
    };
  }

  // === תרופה רגילה / דיכוי / תמיכה ===
  else {
    const phase = getMedicinePhase(date, firstdays);
    payload = {
      type: "medicine",
      id,
      medicalcenterid,
      message: `${date},${index},${name},${phase}`,
    };
  }

console.log("📤 נשלח לשרת:", {
  name,
  date,
  index,
  source,
  type: payload?.type,
  message: payload?.message,
  id,
  medicalcenterid,
});


  try {
    const response = await fetch(
      "https://eve4userver.evepro365.com/api/UpdateAllPatientDataNew",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.error("❌ שגיאה בתגובה מהשרת:", response.statusText);
      return false;
    }

    console.log("✅ תרופה נשלחה בהצלחה!");
    return true;
  } catch (err) {
    console.error("❌ שגיאת רשת בעת שליחת תרופה:", err);
    return false;
  }
}
