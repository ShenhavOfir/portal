// src/components/PurpleBackgroundSection.jsx
import React from "react";
import "../styles/PurpleBackgroundSection.css";

/**
 * PurpleBackgroundSection - A component that creates a vertical gradient background
 * splitting white (top) and purple (bottom) at exactly 41% to center the action buttons
 * 
 * @param {React.ReactNode} children - Content to render within the background
 */
export default function PurpleBackgroundSection({ children }) {
  return (
    <div className="purple-background-section">
      {children}
    </div>
  );
}
