/**
 * שליחת מחיקה של התראה בודדת
 */
export async function markNotificationSeen({ patientId, notificationIndex, medicalcenterid = "-1" }) {
  if (!patientId || notificationIndex == null) {
    console.warn("⚠️ markNotificationSeen: חסרים פרמטרים", { patientId, notificationIndex });
    return false;
  }

  const payload = {
    id: patientId,
    type: "notification",
    medicalcenterid,
    message: notificationIndex,
  };

  console.log("📤 מחיקת התראה בודדת — Payload:", payload);

  try {
    const response = await fetch("https://eve4userver.evepro365.com/api/UpdateAllPatientDataNew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("❌ שגיאה במחיקה בודדת:", response.statusText);
      return false;
    }

    console.log("✅ מחיקה בודדת הצליחה");
    return true;
  } catch (err) {
    console.error("❌ שגיאת רשת במחיקה בודדת:", err);
    return false;
  }
}

/**
 * מחיקת כל ההתראות — מבוצעת אחת-אחת לפי אינדקס
 */
export async function markAllNotificationsSeen({ patientId, medicalcenterid = "-1", notificationIndices }) {
  if (!patientId || !Array.isArray(notificationIndices)) {
    console.warn("⚠️ markAllNotificationsSeen: חסר patientId או רשימה לא תקינה", { patientId, notificationIndices });
    return false;
  }

  for (const idx of notificationIndices) {
    const payload = {
      id: patientId,
      type: "notification",
      medicalcenterid,
      message: idx
    };
    console.log("📤 שליחה ל־API:", payload);

    try {
      const res = await fetch("https://eve4userver.evepro365.com/api/UpdateAllPatientDataNew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error("❌ שגיאה במחיקת התראה", res.statusText);
        return false;
      }
    } catch (err) {
      console.error("❌ שגיאת רשת:", err);
      return false;
    }
  }

  console.log("✅ כל ההתראות שנבחרו נמחקו");
  return true;
}

