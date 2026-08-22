import React from 'react';

export default function HelpSupport({ setActiveTab }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "800px" }}>
      <div style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#201b38", marginBottom: "8px" }}>
          ❓ Help & Support Center
        </h2>
        <p style={{ color: "#6b6575", fontSize: "0.9rem", marginBottom: "24px" }}>
          Need assistance with quests, roadmap levels, or platform navigation? We are here to help!
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b", marginBottom: "6px" }}>💬 24/7 Live Support Assistant</h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", marginBottom: "12px" }}>Have urgent questions about your C++ quest or resume compilation? Chat directly with our AI Support Bot powered by Gemini.</p>
            <button 
              onClick={() => setActiveTab("radar")}
              className="btn-purple-pill" 
              style={{ padding: "10px 20px", fontSize: "0.84rem", cursor: "pointer" }}
            >
              Open Mentorship Radar Chat 🚀
            </button>
          </div>

          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b", marginBottom: "6px" }}>🗺️ How does the 7-Level Roadmap work?</h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", margin: 0 }}>Each level contains verified tasks. Submit your GitHub repository or commit proof URL to earn XP, unlock higher levels, and advance your placement status.</p>
          </div>

          <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b", marginBottom: "10px" }}>📄 ATS LaTeX Resume Help</h3>
            <p style={{ fontSize: "0.84rem", color: "#64748b", margin: 0 }}>Go to the ATS Resume Builder tab, fill out your student details, click generate, and copy the source code directly into an Overleaf project to compile a polished PDF.</p>
          </div>
        </div>
      </div>
    </div>
  );
}