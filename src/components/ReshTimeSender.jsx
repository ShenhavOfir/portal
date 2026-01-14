import { useEffect, useRef } from "react";
import { useCycle } from "../context/CycleContext";
import { sendReshTimeUpdate } from "../utils/reshTime";

export default function ReshTimeSender() {
  const { patientData, demoMode, publicMode } = useCycle();
  const hasSent = useRef(false);

  useEffect(() => {
    console.log("🔍 ReshTimeSender hook: patientData =", patientData, "demoMode =", demoMode, "publicMode =", publicMode);

    if (
      hasSent.current ||
      demoMode ||
      publicMode ||
      !patientData?.id ||
      !patientData?.medicalcenterid
    ) {
      console.log("⛔ ReshTimeSender skipped sending", {
        hasSent: hasSent.current,
        demoMode,
        publicMode,
        id: patientData?.id,
        medicalcenterid: patientData?.medicalcenterid
      });
      return;
    }

    console.log("🔄 ReshTimeSender will send refresh time for patient", patientData.id);

    sendReshTimeUpdate({
      id: patientData.id,
      medicalcenterid: patientData.medicalcenterid,
    }).then((ok) => {
      if (ok) {
        console.log("✅ ReshTimeSender sent successfully for", patientData.id);
        hasSent.current = true;
      } else {
        console.warn("⚠️ ReshTimeSender send returned false");
      }
    }).catch((err) => {
      console.error("❌ ReshTimeSender error:", err);
    });
  }, [patientData, demoMode, publicMode]);

  return null;
}
