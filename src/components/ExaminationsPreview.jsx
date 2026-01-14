// src/components/ExaminationsPreview.jsx
import { useTranslation } from "react-i18next";
import { formatHeYMD } from "../utils/date";

function ExaminationsPreview({ title, icon, items = [] }) {
  const { t } = useTranslation();

  // כיוון מהתרגומים בלבד (אין נפילה חכמה)
  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined;

  const list = Array.isArray(items) ? items : [];

  // מוצאים את התאריך האחרון (YYYYMMDD) אם קיים
  const latestDate = list.length
    ? list
        .map((x) => x?.date)
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a))[0]
    : null;

  // מסננים רק פריטים עם שם/תוצאה לא ריקים באותו תאריך אחרון
  const latestItems = latestDate
    ? list
        .filter((x) => x?.date === latestDate)
        .filter(
          (x) =>
            (x?.name && String(x.name).trim()) ||
            (x?.result && String(x.result).trim())
        )
    : [];

  // אם אין “בדיקות אחרונות” – לא מציגים כלום
 if (!latestDate || latestItems.length === 0) {
  return (
    <div className="preview-box" dir={dir}>
      <h4 style={{ margin: 0 }}>
        {icon} {title}
      </h4>
      <div style={{ color: "#999", fontStyle: "italic", marginTop: "0.5rem" }}>
        {t("noResults")}
      </div>
    </div>
  );
}


  return (
    <div className="preview-box" dir={dir}>
      {/* כותרת ואייקון מגיעים רק מבחוץ (ללא טקסטים קשיחים) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h4 style={{ margin: 0 }}>
          {icon} {title}
        </h4>

        {/* תגית תאריך – פורמט נשלט ע"י פונקציה חיצונית */}
        <span
          style={{
            background: "#f0ecff",
            color: "#5b41a8",
            fontWeight: 800,
            borderRadius: "999px",
            padding: "2px 8px",
            border: "1px solid #e6ddff",
            whiteSpace: "nowrap",
          }}
        >
          {formatHeYMD(latestDate)}
        </span>
      </div>

      {/* רשימת פריטים ללא מחרוזות קבועות (אין נקודתיים/טקסט) */}
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {latestItems.map((item, idx) => (
          <li key={idx} style={{ marginBottom: "0.35rem" }}>
            <span style={{ color: "#666" }}>{item?.name}</span>{" "}
            {item?.result ? <span style={{ fontWeight: 700 }}>{item.result}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExaminationsPreview;
