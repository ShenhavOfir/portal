import React from "react";
import "../styles/Popup.css";
import "../styles/global.css";
export default function Popup({
  message,
  onClose,
  showConfirm = false,      // 🆕 מאפשר להציג כפתורי אישור/ביטול
  confirmText = "אישור",    // 🆕 טקסט לכפתור אישור
  cancelText = "ביטול",     // 🆕 טקסט לכפתור ביטול
  onConfirm = null           // 🆕 פונקציה להרצה בלחיצה על אישור
}) {
  if (!message) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-box" onClick={(e) => e.stopPropagation()}>
        {/* כפתור איקס למעלה */}
        <button className="popup-close" onClick={onClose}>✖</button>

        {/* הודעת הפופאפ */}
        <p className="popup-message">{message}</p>

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
    {confirmText}
  </button>
  <button className="popup-btn" onClick={onClose}>
    {cancelText}
  </button>
</div>

        ) : (
          <div className="popup-actions">
            <button className="popup-btn filled" onClick={onClose}>
              אישור
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
