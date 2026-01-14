import React from "react";

export default class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          direction: "rtl",
          padding: 16,
          margin: 16,
          border: "2px solid #ffb3b3",
          background: "#fff5f5",
          borderRadius: 12,
          color: "#b30000",
          fontFamily: "system-ui, sans-serif"
        }}>
          <h3 style={{marginTop: 0}}>⚠️ קרתה שגיאה ברכיב</h3>
          <div style={{whiteSpace: "pre-wrap", fontSize: 14}}>
            {String(this.state.error?.message || this.state.error)}
          </div>
          <p style={{color:"#444"}}>פתחי DevTools › Console כדי לראות פרטים.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
