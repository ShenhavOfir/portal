// src/components/BackgroundSplit.jsx
import React from "react";
import "../styles/BackgroundSplit.css";

/**
 * Background component that forces a 50/50 split between white (top) and purple (bottom)
 * Independent of display resolution
 */
export default function BackgroundSplit({ children }) {
  return (
    <div className="background-split-container">
      <div className="background-split-top" />
      <div className="background-split-bottom" />
      <div className="background-split-content">
        {children}
      </div>
    </div>
  );
}
