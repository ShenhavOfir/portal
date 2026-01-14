// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import Header from "./components/Header";
import TreatmentPlan from "./pages/TreatmentPlan";
import TestResults from "./pages/TestResults";
import OvulationTracking from "./pages/OvulationTracking";
import Dashboard from "./pages/Dashboard";
import NotificationsPage from "./pages/NotificationsPage";
import TasksPage from "./pages/TasksPage";
import ContactFloating from "./components/ContactFloating";
import ContactPageExternal from "./pages/ContactPageExternal";
import ContactPageInternal from "./pages/ContactPageInternal";
import "bootstrap/dist/css/bootstrap.min.css";
import HamburgerMenu from "./components/HamburgerMenu";
import BottomNav from "./components/BottomNav";
import AboutPage from "./pages/AboutPage";
import { CycleProvider } from "./context/CycleContext";
import InjectionGuide from "./components/InjectionGuide";
import TermsPage from "./pages/TermsPage";
import InstructionsPage from "./pages/InstructionsPage";
import LoginPage from "./pages/LoginPage";
import DemoBanner from "./components/DemoBanner";
import InfoMenuPageExternal from "./pages/InfoMenuPageExternal";
import InfoMenuPageInternal from "./pages/InfoMenuPageInternal";
import IDLoginPage from "./pages/IDLoginPage";
import OTPPage from "./pages/OTPPage";
import ReshTimeSender from "./components/ReshTimeSender";


import "./styles/global.css";
function AppShell() {
  return (
    <div className="app-container">
      <DemoBanner />
      <Header /> {/* ✅ בלי להעביר taskCount / notificationCount */}
      <ContactFloating />
      <HamburgerMenu />
      <ReshTimeSender />
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* עמודים לפני התחברות – בלי Provider */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/id-login" element={<IDLoginPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPageExternal />} />
        <Route path="/info-menu" element={<InfoMenuPageExternal />} />

        {/* עמודים אחרי התחברות – עם CycleProvider */}
        <Route
          element={
            <CycleProvider>
              <AppShell />
            </CycleProvider>
          }
        >
          <Route path="/demo" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Dashboard />} />
          <Route path="/plan" element={<TreatmentPlan />} />
          <Route path="/results" element={<TestResults />} />
          <Route path="/summary" element={<OvulationTracking />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/injection-guide" element={<InjectionGuide />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/app-info-menu" element={<InfoMenuPageInternal />} />
          <Route path="/app-contact" element={<ContactPageInternal />} />
        </Route>
      </Routes>
    </Router>
  );
}
