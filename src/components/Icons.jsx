import React from "react";

export function UltrasoundIcon({ size = 24, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17c4 2.5 14 2.5 18 0" />
      <path d="M5 14.5c3 2 11 2 14 0" />
      <path d="M7 12.2c2 1.3 8 1.3 10 0" />
      <circle cx="14.8" cy="10.2" r="2.1" />
      <path d="M12.8 12.3c-1.2.2-2.6 1.1-3.4 2.1" />
    </svg>
  );
}

export function PumpIcon({ size = 24, color = "currentColor" }) {
  // אפשר ליצור SVG מותאם לשאיבה
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      {/* ציור לדוגמה */}
      <path d="M4 4h16v16H4z" />
      <path d="M8 12h8" />
      <path d="M8 16h4" />
    </svg>
  );
}

export function ReturnIcon({ size = 24, color = "currentColor" }) {
  // אייקון לדוגמה להחזרה
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
         fill="none" stroke={color} strokeWidth="1.8"
         strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}
