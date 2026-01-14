import React from "react";

export default function TermsModal({ onClose, pdfUrl }) {
  return (
    <div
      className="tp-modal-backdrop"
      style={{
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="tp-modal-fullscreen"
        style={{
          width: "95vw",
          height: "95vh",
          background: "#fff",
          borderRadius: "8px",
          position: "relative",
          padding: "0",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "16px",         // ✅ תמיד בצד ימין
            fontSize: "22px",
            fontWeight: "bold",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            direction: "ltr",      // ✅ ביטול הירושת RTL
          }}
        >
          ✖
        </button>

        <iframe
          src={pdfUrl}
          title="Terms and Conditions"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
}
