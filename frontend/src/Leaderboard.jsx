import React, { useEffect, useState } from 'react';

const DAILY_ACTIVITIES = [
  {
    id: 1,
    title: "Daily C++ Hands-On Activity",
    desc: "Write a quick C++ code snippet or function addressing dynamic memory allocation.",
    placeholder: "Type C++ code here (e.g., int* ptr = new int(10);)...",
  },
  {
    id: 2,
    title: "Data Structures Quick Quest",
    desc: "Write a function or logic to check if a binary tree is balanced or calculate node depth.",
    placeholder: "Type logic here (e.g., return abs(height) < 2;)...",
  },
  {
    id: 3,
    title: "Algorithm Logic Challenge",
    desc: "Write a quick loop or condition to find the maximum element in an array or vector.",
    placeholder: "Type code here (e.g., int maxVal = max_element(...);)...",
  },
  {
    id: 4,
    title: "Object-Oriented Design Quest",
    desc: "Define a base class with a virtual destructor for safe polymorphic deletion.",
    placeholder: "Type code here (e.g., virtual ~Base() {})...",
  },
  {
    id: 5,
    title: "Database Indexing Challenge",
    desc: "Write a SQL query clause to optimize search performance using an index or join condition.",
    placeholder: "Type SQL query here (e.g., CREATE INDEX idx_user ON users(email);)...",
  },
  {
    id: 6,
    title: "Operating Systems Threading Quest",
    desc: "Create a standard C++ thread or mutex lock statement to prevent race conditions.",
    placeholder: "Type thread code here (e.g., std::thread t(worker);)...",
  },
  {
    id: 7,
    title: "Computer Networks HTTP Challenge",
    desc: "Specify the correct REST API status code for a successfully created resource.",
    placeholder: "Type code here (e.g., status_code = 201;)...",
  },
  {
    id: 8,
    title: "System Design Caching Quest",
    desc: "Write a short logic snippet implementing a Cache-Aside read check with TTL.",
    placeholder: "Type caching logic here (e.g., if (!cache.get(key)) { ... })...",
  },
  {
    id: 9,
    title: "Frontend React State Challenge",
    desc: "Write a React hook snippet to manage local loading or toggle state.",
    placeholder: "Type React code here (e.g., const [loading, setLoading] = useState(false);)...",
  },
  {
    id: 10,
    title: "Git Version Control Quest",
    desc: "Write the command or git workflow action to stage and commit tracked changes.",
    placeholder: "Type git command here (e.g., git commit -m 'fix bug')...",
  },
  {
    id: 11,
    title: "Python FastAPI Endpoint Challenge",
    desc: "Write a basic FastAPI route decorator and function returning a JSON payload.",
    placeholder: "Type Python code here (e.g., @app.get('/') def index(): return {'ok': True})...",
  },
  {
    id: 12,
    title: "Security & Hashing Quest",
    desc: "Specify a secure hashing algorithm standard commonly used for password encryption.",
    placeholder: "Type standard here (e.g., bcrypt or SHA-256)...",
  }
];

const Leaderboard = () => {
  const [user, setUser] = useState(null);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [codeAnswer, setCodeAnswer] = useState("");
  const [activityStatus, setActivityStatus] = useState(null);

  useEffect(() => {
    fetch('https://nerdarena-gamified-college-learning-app.onrender.com/user?user_id=1')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, []);

  const activeQuest = DAILY_ACTIVITIES[currentActivityIndex];

  const handleActivitySubmit = (e) => {
    e.preventDefault();
    if (!codeAnswer.trim()) return;
    
    if (codeAnswer.length > 3) {
      setActivityStatus({ success: true, msg: "🎉 Activity Verified Successfully! +30 XP Added." });
      
      setTimeout(() => {
        setCodeAnswer("");
        setActivityStatus(null);
        setCurrentActivityIndex((prev) => (prev + 1) % DAILY_ACTIVITIES.length);
      }, 2000);
    } else {
      setActivityStatus({ success: false, msg: "⚠️ Please write a valid response before submitting." });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      
      {/* 1. Arena Leaderboard & Ranks Card */}
      <div style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#201b38", margin: 0 }}>
            🏆 Arena Leaderboard & Ranks
          </h2>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", background: "#f3f0fe", color: "#5b45d0", borderRadius: "99px" }}>
            Live Rankings
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#fef3c7", borderRadius: "14px", border: "1px solid #fde68a" }}>
            <span style={{ fontWeight: 800, color: "#92400e", fontSize: "0.95rem" }}>🥇 1. Emma </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, background: "#ffffff", padding: "6px 14px", borderRadius: "10px", color: "#b45309", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>Level 6 • 1450 XP</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f3f0fe", borderRadius: "14px", border: "1px solid #e9d5ff" }}>
            <span style={{ fontWeight: 800, color: "#4c1d95", fontSize: "0.95rem" }}>🥈 2. {user ? user.name : 'Mahnoor'} (You)</span>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, background: "#ffffff", padding: "6px 14px", borderRadius: "10px", color: "#5b45d0", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>Level {user ? user.current_level : 1} • {user ? user.total_xp : 0} XP</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontWeight: 800, color: "#334155", fontSize: "0.95rem" }}>🥉 3. Noah </span>
            <span style={{ fontSize: "0.82rem", fontWeight: 800, background: "#ffffff", padding: "6px 14px", borderRadius: "10px", color: "#64748b", boxShadow: "0 2px 4px rgba(0,0,0,0.03)" }}>Level 1 • 80 XP</span>
          </div>
        </div>
      </div>

      {/* 2. Rotating Daily Interactive Activity Card (12 Quests) */}
      <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)", color: "#ffffff", padding: "28px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(15, 23, 42, 0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#ffffff" }}>{activeQuest.title}</h3>
          </div>
          <span style={{ fontSize: "0.72rem", background: "rgba(255,255,255,0.1)", padding: "3px 10px", borderRadius: "99px", color: "#cbd5e1" }}>
            Quest {currentActivityIndex + 1} of {DAILY_ACTIVITIES.length}
          </span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#cbd5e1", marginBottom: "16px", lineHeight: "1.5" }}>
          {activeQuest.desc}
        </p>

        <form onSubmit={handleActivitySubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <textarea 
            rows="3"
            placeholder={activeQuest.placeholder}
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #334155", background: "#090d16", color: "#38bdf8", fontFamily: "monospace", fontSize: "0.88rem", outline: "none", resize: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>Reward: <strong style={{ color: "#fde047" }}>+30 XP</strong></span>
            <button type="submit" style={{ padding: "10px 24px", background: "#6366f1", color: "#ffffff", fontWeight: 800, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.88rem", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" }}>
              Verify & Submit Activity 🚀
            </button>
          </div>
        </form>

        {activityStatus && (
          <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "10px", fontSize: "0.84rem", fontWeight: 700, background: activityStatus.success ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)", color: activityStatus.success ? "#34d399" : "#fb7185", border: `1px solid ${activityStatus.success ? "#059669" : "#e11d48"}` }}>
            {activityStatus.msg}
          </div>
        )}
      </div>

      {/* 3. Milestone Badges & Profile Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#201b38", marginBottom: "14px" }}>🏅 Milestone Badges</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", textAlign: "center" }}>
            <div style={{ padding: "12px 8px", background: "#fef3c7", borderRadius: "14px", border: "1px solid #fde68a" }}>
              <span style={{ fontSize: "1.4rem" }}>🚀</span>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "#92400e", margin: "6px 0 0 0" }}>Early Bird</p>
            </div>
            <div style={{ padding: "12px 8px", background: "#f3f0fe", borderRadius: "14px", border: "1px solid #e9d5ff", opacity: 0.6 }}>
              <span style={{ fontSize: "1.4rem" }}>💻</span>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "#5b45d0", margin: "6px 0 0 0" }}>C++ Pro</p>
            </div>
            <div style={{ padding: "12px 8px", background: "#f0fdf4", borderRadius: "14px", border: "1px solid #bbf7d0", opacity: 0.6 }}>
              <span style={{ fontSize: "1.4rem" }}>🔥</span>
              <p style={{ fontSize: "0.72rem", fontWeight: 800, color: "#166534", margin: "6px 0 0 0" }}>7-Day Streak</p>
            </div>
          </div>
        </div>

        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#201b38", marginBottom: "6px" }}>Placement Status</h3>
            <p style={{ fontSize: "0.8rem", color: "#6b6575", lineHeight: "1.4" }}>Your profile matches core requirements for frontend & backend engineering positions.</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.78rem", fontWeight: 800 }}>
            <span style={{ color: "#475569" }}>Verification Engine</span>
            <span style={{ color: "#16a34a", background: "#dcfce7", padding: "2px 8px", borderRadius: "6px" }}>Active ⚡</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;
