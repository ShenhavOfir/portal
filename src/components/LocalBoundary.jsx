// src/components/LocalBoundary.jsx
import React from "react";
import "../styles/global.css";
export default class LocalBoundary extends React.Component {
  constructor(p){ super(p); this.state={error:null}; }
  static getDerivedStateFromError(e){ return {error:e}; }
  componentDidCatch(e, info){ console.error("Local crash:", e, info); }
  render(){
    if (this.state.error) {
      return (
        <div style={{
          direction:"inherit", border:"1px dashed #f99", background:"#fff8f8",
          color:"#900", padding:10, borderRadius:8, fontSize:14
        }}>
          שגיאה בקטע זה: {String(this.state.error?.message || this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}
