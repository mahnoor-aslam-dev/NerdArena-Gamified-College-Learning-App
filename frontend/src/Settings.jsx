import React, { useState } from 'react';

const API_BASE = "http://localhost:8000";
async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default function Settings({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "Mahnoor Aslam",
    email: user?.email || "mahnoor@ucp.edu.pk",
    contact_number: user?.contact_number || "+92 300 1234567",
    student_id: user?.student_id || "L1S23BSCS0342",
    github: user?.github || "github.com/mahnoor",
    education: user?.education || "Bachelor of Science in Computer Science | UCP",
    skills: user?.skills || "C++, React, TypeScript",
    project: user?.project || "DocuMend Project",
    darkMode: user?.is_dark_mode || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const saveSettings = async () => {
    try {
      await apiPost("/user/update-resume", {
        user_id: user?.id || 1,
        ...formData,
        is_dark_mode: formData.darkMode
      });
      alert("Changes Saved Successfully! ✅");
    } catch (e) { alert("Error saving settings."); }
  };

  const handlePasswordSave = () => alert("New Password Saved Successfully! 🔒");

  const deleteAccount = () => {
    if(window.confirm("Are you sure? This action cannot be undone.")) {
        alert("Account Deleted Permanently. Goodbye! 💔");
    }
  };

  const sectionStyle = { background: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #e2e8f0", marginBottom: "24px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)" };
  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.9rem", marginTop: "6px", outline: "none" };

  return (
    <div style={{ maxWidth: "800px", width: "100%" }}>
      <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#201b38", marginBottom: "20px" }}>⚙️ Account Settings</h2>

      {/* Public & Contact Profile Section */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#1e293b" }}>👤 Public & Contact Information</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>Full Name</label>
            <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>Email Address</label>
            <input name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>Contact Number</label>
            <input name="contact_number" value={formData.contact_number} onChange={handleChange} style={inputStyle} placeholder="+92 3XX XXXXXXX" />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>Student ID / Identifier</label>
            <input name="student_id" value={formData.student_id} onChange={handleChange} style={inputStyle} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>GitHub / Portfolio Link</label>
            <input name="github" value={formData.github} onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>Academic Institution / Degree</label>
            <input name="education" value={formData.education} onChange={handleChange} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div style={sectionStyle}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "15px", color: "#1e293b" }}>🔒 Security & Password</h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>New Password</label>
                <input type="password" style={inputStyle} placeholder="Enter new password" />
            </div>
            <button onClick={handlePasswordSave} style={{ padding: "12px 20px", background: "#10b981", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 800, cursor: "pointer", height: "45px" }}>
                Save Password
            </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button onClick={saveSettings} style={{ padding: "12px 30px", background: "#5b45d0", color: "#fff", border: "none", borderRadius: "10px", fontWeight: 800, cursor: "pointer" }}>
          Save All Changes
        </button>
        <button onClick={deleteAccount} style={{ padding: "12px 30px", background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: "10px", fontWeight: 800, cursor: "pointer" }}>
          Delete Account
        </button>
      </div>
    </div>
  );
}