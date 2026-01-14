import { useCycle } from "../context/CycleContext";
import "../styles/BackToCurrentCycle.css"; // ← תוודאי שהקובץ קיים

export default function BackToCurrentCycle() {
  const { setSelectedIndex } = useCycle();

  const handleClick = () => {
    setSelectedIndex(0); // רק להחליף מחזור, בלי ניווט
  };

  return (
    <button className="back-to-current-btn ova-btn" onClick={handleClick}>
      חזרה למחזור האחרון
    </button>
  );
}
