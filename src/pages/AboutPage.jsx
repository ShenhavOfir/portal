import React from "react";
import AboutSection from "../components/AboutSection";
import { useTranslation } from "react-i18next";
import "../styles/global.css";

export default function AboutPage() {
  const { t } = useTranslation();

  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined;

  return (
    <div className="about-page" dir={dir}>
      <h1 style={{ textAlign: "center", color: "#663399" }}>{t("appTitle")}</h1>
      <p className="about-intro">{t("aboutText")}</p>

      <AboutSection />
    </div>
  );
}
