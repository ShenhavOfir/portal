// src/components/ActionButtons.jsx
import React from "react";
import "../styles/ActionButtons.css";

/**
 * קומפוננט שמכיל את 3 הכפתורים העגולים ומרכז אותם בדיוק באזור הסגול
 * Component containing the 3 circular buttons and centering them precisely in the purple area
 */
export default function ActionButtons({ buttons }) {
  return (
    <div className="action-buttons-container">
      <div className="action-buttons-wrapper">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className="action-button"
            aria-label={button.label}
          >
            {button.icon}
            <span className="action-button-label">{button.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
