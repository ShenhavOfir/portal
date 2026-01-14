import { getIsraelYMDHM } from "./dateUtils";

export async function sendReshTimeUpdate({ id, medicalcenterid }) {
  if (!id || !medicalcenterid) {
    console.warn("⚠️ sendReshTimeUpdate: חסרים פרמטרים id או medicalcenterid");
    return false;
  }

  const ymdhm = getIsraelYMDHM();

  const payload = {
    id,
    type: "refreshtime",
    medicalcenterid,
    message: ymdhm,
  };

  console.log("📤 שליחת רענון:", payload);

  try {
    const response = await fetch(
      "/api/UpdateAllPatientDataNew",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.error("❌ שגיאה בשרת:", response.statusText);
      return false;
    }

    console.log("✅ השרת אישר את הרענון");
    return true;
  } catch (err) {
    console.error("❌ שגינת רשת:", err);
    return false;
  }
}
