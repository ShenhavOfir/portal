// src/pages/DemoPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCycle } from "../context/CycleContext";
import "../styles/global.css";
export default function DemoPage() {
  const { setDemoMode, setPublicMode } = useCycle();
  const navigate = useNavigate();

  useEffect(() => {
    setDemoMode(true);
    setPublicMode(false); // גם הדגמה = בתוך האפליקציה
    navigate("/today", { replace: true });
  }, [setDemoMode, setPublicMode, navigate]);

  return null;
}

