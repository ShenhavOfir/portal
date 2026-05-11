import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/Popup.css";
export default function Popup({
  message,
  onClose,
  showConfirm = false,      // 🆕 מאפשר להציג כפתורי אישור/ביטול
  confirmText,              // אם לא נשלח – נלקח מהתרגומים
  cancelText,               // אם לא נשלח – נלקח מהתרגומים
  onConfirm = null           // 🆕 פונקציה להרצה בלחיצה על אישור
}) {
  const { t } = useTranslation();
  if (!message) return null;

  const confirmLabel = confirmText ?? t("confirm");
  const cancelLabel = cancelText ?? t("cancel");

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        {/* כפתור איקס למעלה */}
        <button className="popup-close" onClick={onClose}>✖</button>

        {/* div (not p): message may be JSX with divs/links — p cannot nest p/div */}
        <div className="popup-message">{message}</div>

        {/* כפתורי אישור וביטול */}
        {showConfirm ? (
         <div className="popup-actions">
  <button
    className="popup-btn filled"
    onClick={() => {
      if (onConfirm) onConfirm();
      onClose();
    }}
  >
    {confirmLabel}
  </button>
  <button className="popup-btn" onClick={onClose}>
    {cancelLabel}
  </button>
</div>

        ) : (
          <div className="popup-actions">
            <button className="popup-btn filled" onClick={onClose}>
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
