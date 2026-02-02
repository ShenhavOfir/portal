import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCycle } from "../context/CycleContext";
import BackToCurrentCycle from "../components/BackToCurrentCycle";
import Popup from "../components/Popup";
import "../styles/PatientPortal.css";
import "../styles/global.css";

// Icon components
const CalendarIcon = ({ size = 24, color = "#7e4bbf" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FileTextIcon = ({ size = 24, color = "#7e4bbf" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const FlaskIcon = ({ size = 24, color = "#7e4bbf" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M9 3h6v7l5 8a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3l5-8V3z" />
    <line x1="12" y1="3" x2="12" y2="10" />
  </svg>
);

const CreditCardIcon = ({ size = 24, color = "#7e4bbf" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const PatientPortal = () => {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const { selectedDates, selectedCycle } = useCycle();
  const [activeTab, setActiveTab] = useState("appointments");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [confirmPopup, setConfirmPopup] = useState(null);

  const dirVal = t("Direction");
  const dir = typeof dirVal === "string" ? dirVal : undefined;

  // Mock data for demonstration
  const upcomingAppointments = [
    {
      id: 1,
      date: "2024-02-15",
      time: "10:00 AM",
      provider: "Dr. Sarah Cohen",
      type: "Consultation",
      status: "Confirmed",
    },
    {
      id: 2,
      date: "2024-02-22",
      time: "2:30 PM",
      provider: "Dr. David Levi",
      type: "Follow-up",
      status: "Confirmed",
    },
    {
      id: 3,
      date: "2024-03-01",
      time: "11:00 AM",
      provider: "Dr. Sarah Cohen",
      type: "Blood Test",
      status: "Pending",
    },
  ];

  const visitReports = [
    {
      id: 1,
      date: "2024-01-20",
      provider: "Dr. Sarah Cohen",
      type: "Initial Consultation",
      summary: "Patient evaluation and treatment plan discussion. Reviewed medical history and current symptoms.",
      diagnosis: "Fertility treatment - IVF cycle planning",
    },
    {
      id: 2,
      date: "2024-01-10",
      provider: "Dr. David Levi",
      type: "Follow-up",
      summary: "Medication review and progress assessment. Patient responding well to current protocol.",
      diagnosis: "Ongoing fertility treatment monitoring",
    },
    {
      id: 3,
      date: "2023-12-15",
      provider: "Dr. Sarah Cohen",
      type: "Test Results Review",
      summary: "Comprehensive hormone panel results discussed. All values within expected ranges for treatment.",
      diagnosis: "Pre-treatment assessment",
    },
  ];

  const labResults = [
    {
      id: 1,
      date: "2024-01-25",
      type: "Blood Test",
      testName: "Hormone Panel",
      status: "Complete",
      results: [
        { name: "FSH", value: "6.5 mIU/mL", range: "3.5-12.5", normal: true },
        { name: "LH", value: "4.2 mIU/mL", range: "2.4-12.6", normal: true },
        { name: "Estradiol", value: "145 pg/mL", range: "30-400", normal: true },
      ],
    },
    {
      id: 2,
      date: "2024-01-18",
      type: "Ultrasound",
      testName: "Follicle Monitoring",
      status: "Complete",
      results: [
        { name: "Right Ovary Follicles", value: "8", range: "5-12", normal: true },
        { name: "Left Ovary Follicles", value: "7", range: "5-12", normal: true },
        { name: "Endometrial Thickness", value: "9.5mm", range: "7-16mm", normal: true },
      ],
    },
    {
      id: 3,
      date: "2024-01-05",
      type: "Blood Test",
      testName: "Thyroid Function",
      status: "Complete",
      results: [
        { name: "TSH", value: "2.1 μIU/mL", range: "0.4-4.0", normal: true },
        { name: "Free T4", value: "1.3 ng/dL", range: "0.8-1.8", normal: true },
      ],
    },
  ];

  const billingStatements = [
    {
      id: 1,
      date: "2024-01-25",
      description: "Consultation & Blood Work",
      amount: 850.0,
      status: "Paid",
      paymentDate: "2024-01-26",
      invoiceNumber: "INV-2024-001",
    },
    {
      id: 2,
      date: "2024-01-18",
      description: "Ultrasound Examination",
      amount: 450.0,
      status: "Paid",
      paymentDate: "2024-01-20",
      invoiceNumber: "INV-2024-002",
    },
    {
      id: 3,
      date: "2024-02-01",
      description: "IVF Treatment Cycle - Initial Payment",
      amount: 3500.0,
      status: "Pending",
      paymentDate: null,
      invoiceNumber: "INV-2024-003",
    },
    {
      id: 4,
      date: "2023-12-15",
      description: "Initial Consultation",
      amount: 350.0,
      status: "Paid",
      paymentDate: "2023-12-15",
      invoiceNumber: "INV-2023-089",
    },
  ];

  const providers = [
    "Dr. Sarah Cohen",
    "Dr. David Levi",
    "Dr. Rachel Goldstein",
    "Dr. Michael Ben-David",
  ];

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handleScheduleAppointment = () => {
    if (!selectedDate || !selectedProvider || !selectedTime) {
      setConfirmPopup({
        message: "Please fill in all required fields",
        showConfirm: false,
      });
      return;
    }
    setConfirmPopup({
      message: `Appointment scheduled successfully for ${selectedDate} at ${selectedTime} with ${selectedProvider}`,
      showConfirm: false,
    });
    setShowScheduleModal(false);
    // Reset form
    setSelectedDate("");
    setSelectedProvider("");
    setSelectedTime("");
    setAppointmentReason("");
  };

  const handleCancelAppointment = () => {
    setConfirmPopup({
      message: "Are you sure you want to cancel this appointment?",
      showConfirm: true,
      onConfirm: () => {
        setConfirmPopup({
          message: "Appointment cancelled successfully",
          showConfirm: false,
        });
      },
    });
  };

  const handleDownloadReport = () => {
    setConfirmPopup({
      message: "Downloading report...",
      showConfirm: false,
    });
  };

  const handlePayBill = () => {
    setConfirmPopup({
      message: "Redirecting to payment gateway...",
      showConfirm: false,
    });
  };

  const tabs = [
    { id: "appointments", label: "Appointments", icon: <CalendarIcon size={20} /> },
    { id: "visits", label: "Visit Reports", icon: <FileTextIcon size={20} /> },
    { id: "labs", label: "Lab Results", icon: <FlaskIcon size={20} /> },
    { id: "billing", label: "Billing", icon: <CreditCardIcon size={20} /> },
  ];

  const renderAppointments = () => (
    <div className="portal-section">
      <div className="section-header">
        <h3>Upcoming Appointments</h3>
        <button className="btn-primary" onClick={() => setShowScheduleModal(true)}>
          Schedule New Appointment
        </button>
      </div>

      {upcomingAppointments.length > 0 ? (
        <div className="cards-list">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="portal-card appointment-card">
              <div className="card-header">
                <div className="card-date">
                  <CalendarIcon size={18} />
                  <span>{apt.date}</span>
                  <span className="card-time">{apt.time}</span>
                </div>
                <span className={`status-badge status-${apt.status.toLowerCase()}`}>
                  {apt.status}
                </span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <strong>Provider:</strong>
                  <span>{apt.provider}</span>
                </div>
                <div className="info-row">
                  <strong>Type:</strong>
                  <span>{apt.type}</span>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn-secondary btn-small">Reschedule</button>
                <button
                  className="btn-danger btn-small"
                  onClick={() => handleCancelAppointment()}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No upcoming appointments</p>
          <button className="btn-primary" onClick={() => setShowScheduleModal(true)}>
            Schedule Your First Appointment
          </button>
        </div>
      )}

      {/* Schedule Appointment Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule New Appointment</h3>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>
                ✖
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Provider *</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select a provider</option>
                  {providers.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Time *</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reason for Visit</label>
                <textarea
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="Optional: Describe the reason for your visit"
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleScheduleAppointment}>
                Confirm Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderVisitReports = () => (
    <div className="portal-section">
      <div className="section-header">
        <h3>Previous Visit Reports</h3>
      </div>

      {visitReports.length > 0 ? (
        <div className="cards-list">
          {visitReports.map((report) => (
            <div key={report.id} className="portal-card visit-card">
              <div className="card-header">
                <div className="card-date">
                  <FileTextIcon size={18} />
                  <span>{report.date}</span>
                </div>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <strong>Provider:</strong>
                  <span>{report.provider}</span>
                </div>
                <div className="info-row">
                  <strong>Visit Type:</strong>
                  <span>{report.type}</span>
                </div>
                <div className="info-row">
                  <strong>Diagnosis:</strong>
                  <span>{report.diagnosis}</span>
                </div>
                <div className="info-section">
                  <strong>Summary:</strong>
                  <p className="report-summary">{report.summary}</p>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="btn-primary btn-small"
                  onClick={() => handleDownloadReport()}
                >
                  Download Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No visit reports available</p>
        </div>
      )}
    </div>
  );

  const renderLabResults = () => (
    <div className="portal-section">
      <div className="section-header">
        <h3>Lab & Test Results</h3>
      </div>

      {labResults.length > 0 ? (
        <div className="cards-list">
          {labResults.map((result) => (
            <div key={result.id} className="portal-card lab-card">
              <div className="card-header">
                <div className="card-date">
                  <FlaskIcon size={18} />
                  <span>{result.date}</span>
                </div>
                <span className={`status-badge status-${result.status.toLowerCase()}`}>
                  {result.status}
                </span>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <strong>Test Type:</strong>
                  <span>{result.type}</span>
                </div>
                <div className="info-row">
                  <strong>Test Name:</strong>
                  <span>{result.testName}</span>
                </div>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Normal Range</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.value}</td>
                          <td>{item.range}</td>
                          <td>
                            <span className={item.normal ? "normal-result" : "abnormal-result"}>
                              {item.normal ? "✓ Normal" : "⚠ Abnormal"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-actions">
                <button
                  className="btn-primary btn-small"
                  onClick={() => handleDownloadReport()}
                >
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No lab results available</p>
        </div>
      )}
    </div>
  );

  const renderBilling = () => {
    const totalPending = billingStatements
      .filter((b) => b.status === "Pending")
      .reduce((sum, b) => sum + b.amount, 0);

    return (
      <div className="portal-section">
        <div className="section-header">
          <h3>Billing Information</h3>
        </div>

        {totalPending > 0 && (
          <div className="billing-summary">
            <div className="summary-card">
              <span className="summary-label">Total Outstanding Balance:</span>
              <span className="summary-amount">${totalPending.toFixed(2)}</span>
              <button className="btn-primary btn-small" onClick={() => handlePayBill()}>
                Pay Now
              </button>
            </div>
          </div>
        )}

        {billingStatements.length > 0 ? (
          <div className="cards-list">
            {billingStatements.map((bill) => (
              <div key={bill.id} className="portal-card billing-card">
                <div className="card-header">
                  <div className="card-date">
                    <CreditCardIcon size={18} />
                    <span>{bill.date}</span>
                  </div>
                  <span className={`status-badge status-${bill.status.toLowerCase()}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <strong>Invoice #:</strong>
                    <span>{bill.invoiceNumber}</span>
                  </div>
                  <div className="info-row">
                    <strong>Description:</strong>
                    <span>{bill.description}</span>
                  </div>
                  <div className="info-row amount-row">
                    <strong>Amount:</strong>
                    <span className="amount">${bill.amount.toFixed(2)}</span>
                  </div>
                  {bill.paymentDate && (
                    <div className="info-row">
                      <strong>Payment Date:</strong>
                      <span>{bill.paymentDate}</span>
                    </div>
                  )}
                </div>
                <div className="card-actions">
                  {bill.status === "Pending" ? (
                    <button
                      className="btn-primary btn-small"
                      onClick={() => handlePayBill()}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <button
                      className="btn-secondary btn-small"
                      onClick={() => handleDownloadReport()}
                    >
                      Download Receipt
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No billing information available</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="patient-portal-container container-lg" dir={dir}>
      <div className="ova-toolbar center">
        <BackToCurrentCycle />
      </div>

      <div className="portal-header">
        <h2>Premium Patient Portal</h2>
        <p className="portal-subtitle">
          Manage your appointments, view reports, and access your medical information
        </p>
      </div>

      <div className="portal-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="portal-content">
        {activeTab === "appointments" && renderAppointments()}
        {activeTab === "visits" && renderVisitReports()}
        {activeTab === "labs" && renderLabResults()}
        {activeTab === "billing" && renderBilling()}
      </div>

      {confirmPopup && (
        <Popup
          message={confirmPopup.message}
          onClose={() => setConfirmPopup(null)}
          showConfirm={confirmPopup.showConfirm}
          onConfirm={
            confirmPopup.onConfirm
              ? () => {
                  confirmPopup.onConfirm();
                  setConfirmPopup(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default PatientPortal;
