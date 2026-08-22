import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import NerdArenaLogo from "./NerdArenaLogo";
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import support from "./support.jpg";


import {
  Zap,
  Lock,
  ChevronDown,
  Check,
  ArrowRight,
  Flame,
  Star,
  Compass,
  ExternalLink,
  BookOpen,
  Video,
  Headphones,
  MessageSquare
} from "lucide-react";
import "./App.css";

const API_BASE = "http://localhost:8000";
const CURRENT_USER_ID = 1;

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path} failed`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

const ROADMAP_LEVELS = [
  { id: 1, title: "CS Foundations & Memory Setup", subtitle: "Git SSH, Pointer Manipulation & WSL Setup" },
  { id: 2, title: "Data Structures & Algorithmic Rigor", subtitle: "Graphs, Dynamic Programming & LRU Cache" },
  { id: 3, title: "Production Full-Stack Architecture", subtitle: "Full-Stack App, CI/CD Deployment & Unit Testing" },
  { id: 4, title: "Open Source & Portfolio Engineering", subtitle: "Open Source PRs & Figma Design Systems" },
  { id: 5, title: "System Design & Distributed Systems", subtitle: "System Design Architecture & Redis Caching Layer" },
  { id: 6, title: "LaTeX Resume & Job Pipeline", subtitle: "ATS Resume Optimization & Application Tracking" },
  { id: 7, title: "Placement Ready Software Engineer", subtitle: "Timed Technical Assessment & Panel Reviews" },
];

const SKILL_MODULES = [
  {
    id: 1,
    title: "C++ & Memory Management",
    skills: "Pointers & References, Dynamic Allocation (Heap vs Stack), Virtual Functions, vtables & Cache Locality.",
    links: [
      { text: "LearnCpp.com Tutorials", url: "https://www.learncpp.com/", type: "doc" },
      { text: "The Cherno C++ Series (YouTube)", url: "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48v429XM24VlQ641q", type: "video" }
    ]
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    skills: "Graph Traversals (BFS/DFS), Dynamic Programming, Binary Trees & O(1) LRU Cache.",
    links: [
      { text: "NeetCode.io Practice Roadmap", url: "https://neetcode.io/", type: "doc" },
      { text: "LeetCode Problem Sets", url: "https://leetcode.com/", type: "doc" },
      { text: "Abdul Bari Algorithm Lectures (YouTube)", url: "https://www.youtube.com/@abdul_bari", type: "video" }
    ]
  },
  {
    id: 3,
    title: "System Design & Redis",
    skills: "Redis Caching (Cache-Aside, TTL), Load Balancing (L4/L7), Rate Limiters & Microservices.",
    links: [
      { text: "System Design Primer GitHub", url: "https://github.com/donnemartin/system-design-primer", type: "doc" },
      { text: "Redis Official Documentation", url: "https://redis.io/docs/", type: "doc" },
      { text: "ByteByteGo Animated System Design", url: "https://www.youtube.com/@ByteByteGo", type: "video" }
    ]
  },
  {
    id: 4,
    title: "Full-Stack & CI/CD",
    skills: "Docker Containerization, GitHub Actions CI/CD Pipelines, FastAPI Async Web & React Hooks.",
    links: [
      { text: "FastAPI Documentation", url: "https://fastapi.tiangolo.com/", type: "doc" },
      { text: "React Official Docs", url: "https://react.dev/", type: "doc" },
      { text: "TechWorld with Nana (Docker & CI/CD)", url: "https://www.youtube.com/@TechWorldwithNana", type: "video" }
    ]
  },
  {
    id: 5,
    title: "Operating Systems & Linux Kernel",
    skills: "Process Scheduling, Multithreading, Deadlocks, Virtual Memory & Linux CLI/Bash Scripting.",
    links: [
      { text: "Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", type: "doc" },
      { text: "Neso Academy OS Lectures (YouTube)", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O", type: "video" }
    ]
  },
  {
    id: 6,
    title: "Computer Networks & Web Security",
    skills: "OSI & TCP/IP Model, HTTP/HTTPS, DNS Resolution, WebSockets, TLS Encryption & CORS.",
    links: [
      { text: "MDN Web HTTP & Networking Docs", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP", type: "doc" },
      { text: "Neso Academy Computer Networks (YouTube)", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUagxdkyzp9z22yBYM1G", type: "video" }
    ]
  },
  {
    id: 7,
    title: "Database Systems & SQL/NoSQL",
    skills: "SQL Normalization, Indexing (B-Trees), ACID Transactions, PostgreSQL & MongoDB Architecture.",
    links: [
      { text: "Use The Index, Luke (DB Optimization)", url: "https://use-the-index-luke.com/", type: "doc" },
      { text: "freeCodeCamp SQL Database Course", url: "https://www.youtube.com/watch?v=HXV3zeRVqfc", type: "video" }
    ]
  },
  {
    id: 8,
    title: "Object-Oriented Design & Patterns",
    skills: "SOLID Principles, Singleton, Factory, Observer, Strategy & Adapter Design Patterns.",
    links: [
      { text: "Refactoring.Guru Design Patterns Guide", url: "https://refactoring.guru/design-patterns", type: "doc" },
      { text: "Christopher Okhravi Design Patterns (YouTube)", url: "https://www.youtube.com/playlist?list=PLrhzvIcii64OIDjhctdmyv481X8S96f-p", type: "video" }
    ]
  }
];

function RadarChatModule({ currentUserId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [peers, setPeers] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  const supportBot = {
    id: 999,
    name: "NerdArena Support Bot",
    role: "24/7 Official Support",
    current_level: 7,
    tech_stack: "Roadmap Help & Platform Guidance"
  };

  const handleSearch = useCallback(async (query) => {
    try {
      const results = await apiGet(`/peers/search?query=${query}&current_user_id=${currentUserId}`);
      setPeers(results);
    } catch (e) {
      console.error("Failed to search peers:", e);
    }
  }, [currentUserId]);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleSelectPeer = async (peer) => {
    setSelectedPeer(peer);
    try {
      const msgs = await apiGet(`/messages/${currentUserId}/${peer.id}`);
      setChatMessages(msgs);
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedPeer) return;

    const textToSend = messageText.trim();
    setMessageText("");

    const tempUserMsg = {
      id: Date.now(),
      sender_id: currentUserId,
      receiver_id: selectedPeer.id,
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, tempUserMsg]);

    try {
      await apiPost("/messages/send", {
        sender_id: currentUserId,
        receiver_id: selectedPeer.id,
        text: textToSend
      });

      setTimeout(async () => {
        const updatedMsgs = await apiGet(`/messages/${currentUserId}/${selectedPeer.id}`);
        setChatMessages(updatedMsgs);
      }, 300);

    } catch (e) {
      console.error("Failed to send message:", e);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px", background: "#ffffff", padding: "24px", borderRadius: "24px", border: "1px solid #e2e8f0", minHeight: "520px" }}>
      
      <div style={{ borderRight: "1px solid #e2e8f0", paddingRight: "16px", display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#201b38", marginBottom: "12px" }}>
          🎯 Peer & Mentorship Radar
        </h3>

        <div 
          onClick={() => handleSelectPeer(supportBot)}
          style={{
            padding: "12px",
            borderRadius: "14px",
            background: selectedPeer?.id === 999 ? "#e0f2fe" : "#f0f9ff",
            border: selectedPeer?.id === 999 ? "1.5px solid #0284c7" : "1px solid #bae6fd",
            cursor: "pointer",
            marginBottom: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: "0.88rem", color: "#0369a1", display: "flex", alignItems: "center", gap: "6px" }}>
              <Headphones size={15} /> Support Assistant
            </strong>
            <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "99px", background: "#0284c7", color: "#ffffff", fontWeight: 800 }}>
              24/7 Live
            </span>
          </div>
          <div style={{ fontSize: "0.74rem", color: "#0369a1", marginTop: "4px" }}>
            First time? Click here for instant help & replies!
          </div>
        </div>
        
        <input 
          type="text" 
          placeholder="Search by name, skills (e.g. C++)..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "0.85rem", marginBottom: "16px", outline: "none" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", maxHeight: "320px" }}>
          {peers.map((peer) => (
            <div 
              key={peer.id}
              onClick={() => handleSelectPeer(peer)}
              style={{
                padding: "12px",
                borderRadius: "14px",
                background: selectedPeer?.id === peer.id ? "#f3f0fe" : "#f8fafc",
                border: selectedPeer?.id === peer.id ? "1.5px solid #5b45d0" : "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "0.9rem", color: "#201b38" }}>{peer.name}</strong>
                <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "99px", background: peer.role?.includes("Mentor") ? "#dbeafe" : "#fef3c7", color: peer.role?.includes("Mentor") ? "#1e40af" : "#b45309", fontWeight: 800 }}>
                  {peer.role || "Peer"}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b6575", marginTop: "4px" }}>
                Level {peer.current_level} · {peer.tech_stack || "C++, Python"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {selectedPeer ? (
          <>
            <div style={{ paddingBottom: "12px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#201b38" }}>{selectedPeer.name}</h4>
                <p style={{ fontSize: "0.78rem", color: "#6b6575" }}>{selectedPeer.role} · {selectedPeer.tech_stack}</p>
              </div>
              <span style={{ fontSize: "0.75rem", background: "#f0fdf4", color: "#15803d", fontWeight: 800, padding: "4px 10px", borderRadius: "99px" }}>
                Online
              </span>
            </div>

            <div style={{ flex: 1, padding: "16px 0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "340px" }}>
              {chatMessages.length === 0 ? (
                <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", marginTop: "40px" }}>
                  👋 Say hi to {selectedPeer.name}! Ask questions or get instant platform guidance.
                </div>
              ) : (
                chatMessages.map((msg, idx) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div 
                      key={msg.id || idx}
                      style={{
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        background: isMe ? "#5b45d0" : "#f1f5f9",
                        color: isMe ? "#ffffff" : "#1e293b",
                        padding: "10px 16px",
                        borderRadius: isMe ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        maxWidth: "75%",
                        fontSize: "0.88rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                })
              )}
          </div>

          <form onSubmit={handleSendMessage} style={{ display: "flex", gap: "10px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
            <input 
              type="text" 
              placeholder={`Message ${selectedPeer.name}...`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ flex: 1, padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", fontSize: "0.88rem" }}
            />
            <button className="btn-purple-pill" type="submit" style={{ padding: "12px 24px" }}>
              Send 🚀
            </button>
          </form>
          </>
        ) : (
          <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center", color: "#6b6575", flexDirection: "column", gap: "12px", textAlign: "center" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7" }}>
              <MessageSquare size={26} />
            </div>
            <div>
              <strong style={{ fontSize: "1.05rem", color: "#201b38" }}>Select a peer, mentor or official support</strong>
              <p style={{ fontSize: "0.84rem", color: "#6b6575", marginTop: "4px" }}>First time here? Chat directly with support to get answers and guidance.</p>
            </div>
            <button 
              className="btn-purple-pill" 
              style={{ background: "#0284c7", marginTop: "8px", padding: "10px 20px" }}
              onClick={() => handleSelectPeer(supportBot)}
            >
              💬 Message Support Assistant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [activeTab, setActiveTab] = useState("roadmap");
  const [user, setUser] = useState(null);
  const [expandedLevel, setExpandedLevel] = useState(1);
  const [levelTasks, setLevelTasks] = useState([]);
  const [proofInputs, setProofInputs] = useState({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "982892849647-668mnacv8lfd9864hjb24ki1k982spnm.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await apiPost("/auth/google", { credential: response.credential });
      if (res.status === "success") {
        setUser(res.user);
        setView("dashboard");
        alert(`Welcome, ${res.user.name}! 🎉`);
      }
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  const triggerGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const googleButtonDiv = document.createElement("div");
          window.google.accounts.id.renderButton(googleButtonDiv, { theme: "outline", size: "large" });
          googleButtonDiv.querySelector("div[role=button]")?.click();
        }
      });
    } else {
      alert("Google Login script is still loading. Please try again.");
    }
  };

  const refreshUser = useCallback(async () => {
    if (user && user.id) {
      try {
        const data = await apiGet(`/user?user_id=${user.id}`);
        setUser(data);
      } catch (e) { console.error(e); }
    }
  }, [user]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (view === "dashboard" && expandedLevel !== null) {
      apiGet(`/tasks/${expandedLevel}`).then(setLevelTasks).catch(console.error);
    }
  }, [view, expandedLevel]);

  const handleToggleLevel = async (levelId) => {
    if (expandedLevel === levelId) {
      setExpandedLevel(null);
    } else {
      setExpandedLevel(levelId);
      try {
        const tasks = await apiGet(`/tasks/${levelId}`);
        setLevelTasks(tasks);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleInputChange = (taskId, value) => {
    setProofInputs((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleSubmitProof = async (taskId, levelId) => {
    const proofUrl = proofInputs[taskId] || "";
    if (!proofUrl.trim()) return;

    try {
      await apiPost("/submit-proof", {
        user_id: user?.id || CURRENT_USER_ID,
        task_id: taskId,
        level_id: levelId,
        proof_url: proofUrl.trim(),
      });

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

      setProofInputs((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      await refreshUser();
      const tasks = await apiGet(`/tasks/${levelId}`);
      setLevelTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  if (view === "landing") {
    return (
      <div>
        <div className="top-announcement">
          ⚡ Try NerdArena risk-free with our 7-level placement roadmap
        </div>

        <nav className="landing-nav">
          <div className="brand-logo-text" onClick={() => setView("landing")}>
            <NerdArenaLogo size={42} /> NerdArena
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <span style={{ fontWeight: 600, color: "#6b6575", cursor: "pointer" }}>Track Hub</span>
            <span style={{ fontWeight: 600, color: "#6b6575", cursor: "pointer" }}>What's New?</span>
            <button className="btn-purple-pill" onClick={triggerGoogleLogin}>
              Sign in with Google
            </button>
          </div>
        </nav>

        <section className="hero-section">
          <div>
            <h1 className="hero-headline">
              Skill Anxiety Stops Here. Meet NerdArena.
            </h1>
            <p className="hero-subtext">
              Get instant, senior-backed computer science guidance the moment you need it. NerdArena has <b>7-level verified quests</b>, 24/7 roadmap tracking, and 1-on-1 peer mentorship tailored for your placement success.
            </p>
            <button className="btn-purple-pill" style={{ fontSize: "1.05rem", padding: "16px 36px" }} onClick={triggerGoogleLogin}>
              Sign in with Google 🚀
            </button>
          </div>

          <div className="hero-mockup-container">
            <div className="blue-aura-glow-fixed"></div>

            <div className="floating-seal-badge" style={{ zIndex: 10 }}>
              <span style={{ fontSize: "1rem" }}>⚡</span>
              <span>VERIFIED</span>
              <span>ROADMAP</span>
            </div>

            <motion.div 
              className="phone-card-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="phone-cartoon-screen left-screen-bg">
                <div className="dynamic-island"></div>

                <div className="cartoon-wrapper floating-cartoon">
                  <div className="cartoon-speech-bubble">
                    Study Now, Shine Later! ✨
                  </div>

                  <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="40" y="145" width="120" height="20" rx="4" fill="#a7f3d0" stroke="#1e1b2e" strokeWidth="4"/>
                    <rect x="50" y="125" width="100" height="20" rx="4" fill="#fde047" stroke="#1e1b2e" strokeWidth="4"/>
                    <ellipse cx="100" cy="95" rx="50" ry="40" fill="#ffffff" stroke="#1e1b2e" strokeWidth="5"/>
                    <ellipse cx="75" cy="100" rx="16" ry="25" fill="#1e1b2e" transform="rotate(-15 75 100)"/>
                    <ellipse cx="125" cy="100" rx="16" ry="25" fill="#1e1b2e" transform="rotate(15 125 100)"/>
                    <circle cx="65" cy="62" r="16" fill="#1e1b2e"/>
                    <circle cx="135" cy="62" r="16" fill="#1e1b2e"/>
                    <ellipse cx="80" cy="88" rx="14" ry="18" fill="#1e1b2e" transform="rotate(-10 80 88)"/>
                    <ellipse cx="120" cy="88" rx="14" ry="18" fill="#1e1b2e" transform="rotate(10 120 88)"/>
                    <circle cx="83" cy="86" r="5" fill="#ffffff"/>
                    <circle cx="117" cy="86" r="5" fill="#ffffff"/>
                    <ellipse cx="70" cy="98" rx="7" ry="4" fill="#f472b6"/>
                    <ellipse cx="130" cy="98" rx="7" ry="4" fill="#f472b6"/>
                    <ellipse cx="100" cy="94" rx="6" ry="4" fill="#1e1b2e"/>
                    <path d="M70 52 L100 42 L130 52 L100 60 Z" fill="#f43f5e" stroke="#1e1b2e" strokeWidth="4"/>
                  </svg>
                </div>

                <button className="btn-purple-pill" style={{ width: "100%", padding: "10px", fontSize: "0.8rem", borderRadius: "14px" }} onClick={triggerGoogleLogin}>
                  Sign in with Google 🚀
                </button>
              </div>
            </motion.div>

            <motion.div 
              className="phone-card-white offset"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 32, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="phone-cartoon-screen right-screen-bg">
                <div className="dynamic-island"></div>

                <div className="cartoon-wrapper floating-cartoon" style={{ animationDelay: "1.5s" }}>
                  <div className="cartoon-speech-bubble" style={{ color: "#0284c7" }}>
                    Level Up CS Skills! ⚡
                  </div>

                  <svg width="140" height="140" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 25 C120 25 130 55 150 65 C170 75 190 95 180 120 C170 145 140 165 115 175 C90 185 60 170 40 150 C20 130 15 95 30 70 C45 45 80 25 100 25 Z" fill="#60a5fa" stroke="#1e1b2e" strokeWidth="5"/>
                    <path d="M45 90 C45 50 155 50 155 90" stroke="#f43f5e" strokeWidth="10" strokeLinecap="round"/>
                    <rect x="35" y="80" width="18" height="30" rx="9" fill="#f43f5e" stroke="#1e1b2e" strokeWidth="3"/>
                    <rect x="147" y="80" width="18" height="30" rx="9" fill="#f43f5e" stroke="#1e1b2e" strokeWidth="3"/>
                    <circle cx="78" cy="100" r="16" fill="#ffffff" stroke="#1e1b2e" strokeWidth="4"/>
                    <circle cx="122" cy="100" r="16" fill="#ffffff" stroke="#1e1b2e" strokeWidth="4"/>
                    <circle cx="82" cy="100" r="8" fill="#1e1b2e"/>
                    <circle cx="126" cy="100" r="8" fill="#1e1b2e"/>
                    <circle cx="85" cy="97" r="3" fill="#ffffff"/>
                    <circle cx="129" cy="97" r="3" fill="#ffffff"/>
                    <path d="M92 120 Q100 132 108 120" stroke="#1e1b2e" strokeWidth="4" strokeLinecap="round" fill="none"/>
                    <circle cx="62" cy="115" r="7" fill="#f472b6" opacity="0.8"/>
                    <circle cx="138" cy="115" r="7" fill="#f472b6" opacity="0.8"/>
                  </svg>
                </div>

                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "14px", fontSize: "0.75rem", color: "#0284c7", fontWeight: 800, textAlign: "center", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                  💬 Mentorship with Sara Active
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mascot-row">
          <span>🚀</span><span>🧠</span><span>⚡</span><span>🎓</span><span>💻</span><span>🔥</span>
        </div>

        <section className="nerd-features-section">
          <div className="nerd-features-header">
            <p className="nerd-sub-heading">
              Skill anxiety stops here. NerdArena makes placement prep simple.
            </p>
            <h2 className="nerd-main-heading">
              One Arena for All Your CS Placement Needs
            </h2>
          </div>

          <div className="nerd-cards-container">
            <div className="nerd-feature-card nerd-card-orange">
              <div className="nerd-mockup-area">
                <img src={support} alt="Support Mockup" className="nerd-card-top-img" />
                <div className="nerd-badge-style">
                  <span>💬</span>
                  <span>24/7 Senior Mentorship</span>
                </div>
              </div>
              <div className="nerd-card-content">
                <h3>24/7 Personalized Support</h3>
                <p>
                  Real-time, verified guidance tailored to <strong>your tech stack</strong> and <strong>your target roles</strong>—available <strong>whenever</strong> you hit a bug (even at 3am).
                </p>
              </div>
            </div>

            <div className="nerd-feature-card nerd-card-lavender">
              <div className="nerd-mockup-area">
                <div className="nerd-quest-card">
                  <div className="nerd-quest-header">
                    <div className="nerd-quest-title">
                      <span>⚡</span>
                      <span>System Design</span>
                    </div>
                    <span className="nerd-xp-tag">+200 XP</span>
                  </div>
                  <div className="nerd-quest-body">
                    <p className="time-text">Redis Caching Layer</p>
                    <p className="sub-text">Level 5 · 2 Tasks Pending</p>
                  </div>
                </div>
              </div>
              <div className="nerd-card-content">
                <h3>Smart, Gamified Roadmap</h3>
                <p>
                  NerdArena doesn't just list tutorials, it <strong>tracks and gamifies your growth</strong>. Complete quests, earn XP, and level up from C++ basics to distributed systems.
                </p>
              </div>
            </div>

            <div className="nerd-feature-card nerd-card-yellow">
              <div className="nerd-mockup-area">
                <div className="nerd-mini-card">
                  <div className="nerd-mini-title">
                    <span>❇️</span>
                    <span>Sara's Mock Review</span>
                  </div>
                  <div className="nerd-mini-pills">
                    <span className="pill">DSA</span>
                    <span className="pill">System Design</span>
                    <span className="pill">Peers</span>
                  </div>
                  <p className="nerd-mini-desc">Sara reviewed your LRU Cache PR & ATS Resume...</p>
                  <div className="nerd-mini-actions">
                    <button className="nerd-btn-light">View Code</button>
                    <button className="nerd-btn-purple">Feedback</button>
                  </div>
                </div>
              </div>
              <div className="nerd-card-content">
                <h3>Quests Tailored Just for You</h3>
                <p>
                  No more endless tutorial hell. NerdArena gives you <strong>curated hands-on projects</strong> made <strong>just for software engineering placements</strong>.
                </p>
              </div>
            </div>
        </div>

        <div className="nerd-cta-wrapper">
          <button className="nerd-cta-button" onClick={triggerGoogleLogin}>
            Sign in with Google
          </button>
        </div>
      </section>

      <section className="purple-container-box">
        <h2 className="font-serif" style={{ fontSize: "2.4rem" }}>What CS Superpower Do You Need Today?</h2>
        <div className="superpower-grid">
          <div className="power-card" onClick={triggerGoogleLogin}>
            <span>💻 Master C++ & Data Structures</span> <ArrowRight size={18} color="#5b45d0" />
          </div>
          <div className="power-card" onClick={triggerGoogleLogin}>
            <span>⚡ System Design & Redis Caching</span> <ArrowRight size={18} color="#5b45d0" />
          </div>
          <div className="power-card" onClick={triggerGoogleLogin}>
            <span>🌐 Full-Stack App Deployment</span> <ArrowRight size={18} color="#5b45d0" />
          </div>
          <div className="power-card" onClick={triggerGoogleLogin}>
            <span>📄 ATS-Optimized LaTeX Resumes</span> <ArrowRight size={18} color="#5b45d0" />
          </div>
        </div>
      </section>

      <section className="comparison-section">
        <h2 className="font-serif" style={{ fontSize: "2.2rem", textAlign: "center" }}>Why NerdArena Stands Out</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Feature / Benefit</th>
              <th>NerdArena</th>
              <th>Generic Courses</th>
              <th>YouTube Tutorials</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Verified Submission Engine</td>
              <td><span className="check-mark"><Check size={14} /></span></td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Peer & Senior Mentorship Radar</td>
              <td><span className="check-mark"><Check size={14} /></span></td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>7-Level Sequential CS Roadmap</td>
              <td><span className="check-mark"><Check size={14} /></span></td>
              <td><span className="check-mark"><Check size={14} /></span></td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <button className="btn-purple-pill" onClick={triggerGoogleLogin}>
            Enter Arena — Free Forever
          </button>
        </div>
      </section>

      <footer className="nerd-footer-section">
        <div className="nerd-footer-banner">
          <h2 className="nerd-footer-title">
            We are building a generation of placement-ready software engineers.
          </h2>
          <button className="nerd-footer-cta-btn" onClick={triggerGoogleLogin}>
            Get guidance that gets you
          </button>
        </div>

        <div className="nerd-footer-brand">
          <div className="brand-logo-text" onClick={() => setView("landing")} style={{ fontSize: "2.2rem" }}>
            <NerdArenaLogo size={36} /> NerdArena
          </div>
          <p className="nerd-footer-copyright">© 2026 NerdArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

return (
  <div className="app-dashboard-layout">
    {/* Left Sidebar Panel */}
    <aside className="dash-sidebar" style={{ width: "280px", padding: "28px 20px" }}>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", justifyContent: "space-between" }}>
        <div>
          <div className="brand-logo-text" onClick={() => setView("landing")} style={{ marginBottom: "28px", fontSize: "2rem" }}>
            <NerdArenaLogo size={36} /> NerdArena
          </div>

          <div className="sidebar-section-label">Core Navigation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <button 
              className={`sidebar-nav-btn ${activeTab === "roadmap" ? "active" : ""}`}
              onClick={() => setActiveTab("roadmap")}
            >
              🗺️ Career Roadmap
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              📚 Skill Hub
            </button>
  
            <button 
              className={`sidebar-nav-btn ${activeTab === "radar" ? "active" : ""}`}
              onClick={() => setActiveTab("radar")}
            >
              🎯 Peer & Mentorship Radar
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === "leaderboard" ? "active" : ""}`}
              onClick={() => setActiveTab("leaderboard")}
            >
              🏆 Leaderboard & Ranks
            </button>

            <button 
              className={`sidebar-nav-btn ${activeTab === "resume" ? "active" : ""}`}
              onClick={() => setActiveTab("resume")}
            >
              📄 ATS Resume Builder
            </button>
          </div>

          <div className="sidebar-section-label">Daily Goal</div>
          <div className="sidebar-widget-card">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 800 }}>
              <span>Today's XP Target</span>
              <span style={{ color: "#ff8a52" }}>{user?.total_xp || 0} / 100 XP</span>
            </div>
            <div className="sidebar-progress-bar">
              <div className="sidebar-progress-fill" style={{ width: `${Math.min(100, ((user?.total_xp || 0) / 100) * 100)}%` }}></div>
            </div>
            <div style={{ fontSize: "0.72rem", color: "#6b6575", marginTop: "6px" }}>
              🔥 Complete 1 quest to keep streak alive!
            </div>
          </div>

          <div className="sidebar-section-label">Active Mentor</div>
          <div className="sidebar-widget-card" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="mentor-avatar-badge">S</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#201b38" }}>Rohan</div>
              <div style={{ fontSize: "0.72rem", color: "#0284c7", fontWeight: 700 }}>Level 6 Senior · Online</div>
            </div>
          </div>


          <div className="sidebar-section-label">Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <button 
              className={`sidebar-nav-btn ${activeTab === "settings" ? "active" : ""}`} 
              onClick={() => setActiveTab("settings")}
              style={{ fontSize: "0.82rem", color: activeTab === "settings" ? "#fff" : "#6b6575" }}
            >
              ⚙️ Account Settings
            </button>
          </div>
        </div>

        <div style={{ padding: "14px 16px", background: "#f3f0fe", borderRadius: "18px", marginTop: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #ff8a52, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800 }}>
            {user?.name?.[0] || "M"}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.92rem", color: "#201b38" }}>{user?.name || "Mahnoor"}</div>
            <div style={{ fontSize: "0.78rem", color: "#5b45d0", fontWeight: 700 }}>Level {user?.current_level || 1} · {user?.total_xp || 0} XP</div>
          </div>
        </div>
      </div>
    </aside>

    {/* Main Content Area */}
    <main className="dash-main" style={{ padding: "32px 28px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: "2.2rem" }}>Welcome back, {user?.name || "Mahnoor"} 👋</h1>
          <p style={{ color: "#6b6575" }}>Complete verified tasks to progress to placement-ready status.</p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "#e8e3fc", padding: "8px 16px", borderRadius: "99px", fontWeight: "800", color: "#5b45d0" }}>
            <Star size={16} style={{ display: "inline", marginRight: 4 }} /> Level {user?.current_level || 1}
          </div>
          <div style={{ background: "#fef3c7", padding: "8px 16px", borderRadius: "99px", fontWeight: "800", color: "#b45309" }}>
            <Zap size={16} style={{ display: "inline", marginRight: 4 }} /> {user?.total_xp || 0} XP
          </div>
        </div>
      </header>

      {activeTab === "roadmap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {ROADMAP_LEVELS.map((lvl) => {
            const isUnlocked = user ? lvl.id <= user.current_level : lvl.id === 1;
            const isExpanded = expandedLevel === lvl.id;

            return (
              <div key={lvl.id} style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid rgba(91,69,208,0.12)", overflow: "hidden" }}>
                <div 
                  style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", cursor: isUnlocked ? "pointer" : "not-allowed", opacity: isUnlocked ? 1 : 0.6 }}
                  onClick={() => isUnlocked && handleToggleLevel(lvl.id)}
                >
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: isUnlocked ? "#f3f0fe" : "#f1f5f9", color: isUnlocked ? "#5b45d0" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                    {isUnlocked ? lvl.id : <Lock size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#201b38" }}>Level {lvl.id}: {lvl.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#6b6575" }}>{lvl.subtitle}</p>
                  </div>
                  <ChevronDown size={20} color="#6b6575" />
                </div>

                {isExpanded && isUnlocked && (
                  <div style={{ padding: "20px 24px", background: "#faf8f5", borderTop: "1px solid rgba(91,69,208,0.12)" }}>
                    {levelTasks.length > 0 ? (
                      levelTasks.map((t) => (
                        <div key={t.id} style={{ background: "#ffffff", padding: "16px", borderRadius: "14px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", border: "1px solid #e2e8f0" }}>
                          <div style={{ flex: 1, minWidth: "300px" }}>
                            <strong style={{ fontSize: "0.95rem", color: "#201b38" }}>{t.title}</strong>
                            <div style={{ marginTop: "10px", display: "flex", gap: "10px", alignItems: "center", width: "100%" }}>
                              <input 
                                type="text" 
                                placeholder="Paste GitHub repository or commit URL..." 
                                value={proofInputs[t.id] || ""} 
                                onChange={(e) => handleInputChange(t.id, e.target.value)} 
                                style={{ 
                                  padding: "10px 16px", 
                                  borderRadius: "10px", 
                                  border: "1px solid #d1d5db", 
                                  fontSize: "0.88rem",
                                  flex: 1,
                                  outline: "none"
                                }}
                              />
                              <button className="btn-purple-pill" style={{ padding: "10px 24px", whiteSpace: "nowrap" }} onClick={() => handleSubmitProof(t.id, lvl.id)}>
                                Submit Proof
                              </button>
                            </div>
                          </div>
                          <span style={{ fontWeight: 800, color: "#ff8a52", fontSize: "0.95rem" }}>+{t.xp} XP</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ color: "#6b6575", fontSize: "0.9rem" }}>Loading level quests...</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SKILL HUB WITH CLEAN ARRAY MAPPING */}
      {activeTab === "skills" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#201b38", marginBottom: "6px" }}>📚 Computer Science Skill Modules</h2>
            <p style={{ color: "#6b6575", fontSize: "0.9rem", marginBottom: "24px" }}>Master core software engineering competencies with curated tutorials, documentation, and videos.</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {SKILL_MODULES.map((mod) => (
                <div key={mod.id} style={{ padding: "20px", borderRadius: "18px", background: "#faf8f5", border: "1px solid rgba(91,69,208,0.12)" }}>
                  <h3 style={{ fontWeight: 800, color: "#5b45d0", fontSize: "1.15rem", marginBottom: "8px" }}>{mod.title}</h3>
                  <div style={{ fontSize: "0.85rem", color: "#475569", marginBottom: "14px", lineHeight: "1.5" }}>
                    <strong>Key Sub-skills:</strong> {mod.skills}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {mod.links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "6px", 
                          color: link.type === "video" ? "#dc2626" : "#0284c7", 
                          fontSize: "0.82rem", 
                          fontWeight: 700, 
                          textDecoration: "none" 
                        }}
                      >
                        {link.type === "video" ? <Video size={14} /> : <BookOpen size={14} />} 
                        {link.text} 
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RADAR CHAT TAB */}
      {activeTab === "radar" && (
        <RadarChatModule currentUserId={user?.id || CURRENT_USER_ID} />
      )}
      {activeTab === "settings" && <Settings user={user} />}
      {activeTab === "leaderboard" && (
        <Leaderboard />
      )}

      {activeTab === "resume" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
          
          {/* Header & Form Card */}
          <div style={{ background: "#ffffff", padding: "28px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#201b38", margin: 0 }}>
                📄 Advanced ATS LaTeX Resume Generator
              </h2>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "4px 12px", background: "#f0fdf4", color: "#16a34a", borderRadius: "99px" }}>
                Database Synced ⚡
              </span>
            </div>
            <p style={{ color: "#6b6575", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.5" }}>
              Fill in your education, skills, and project details. Saving will sync your profile with the backend and compile your Overleaf-ready LaTeX code.
            </p>

            {/* Form Fields pre-filled with user state */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>Full Name</label>
                <input type="text" defaultValue={user?.name || "Mahnoor Aslam"} id="res-name" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>Student ID / Identifier</label>
                <input type="text" defaultValue={user?.student_id || "L1S23BSCS0342"} id="res-id" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>Email Address</label>
                <input type="text" defaultValue={user?.email || "mahnoor@ucp.edu.pk"} id="res-email" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>GitHub / Portfolio Link</label>
                <input type="text" defaultValue={user?.github || "github.com/mahnoor"} id="res-github" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }} />
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>Education & University Details</label>
              <input type="text" defaultValue={user?.education || "Bachelor of Science in Computer Science | University of Central Punjab (2023 -- 2027)"} id="res-edu" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>Technical Skills & Tech Stack</label>
              <input type="text" defaultValue={user?.skills || "C++, React, TypeScript, Tailwind, FastAPI, WebAssembly"} id="res-skills" style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none" }} />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 800, color: "#334155", marginBottom: "6px" }}>Featured Project & Experience</label>
              <textarea rows="3" defaultValue={user?.project || "DocuMend (Final Year Project): Engineered a local-first document processing pipeline using Rust and WebAssembly."} id="res-project" style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "0.85rem", outline: "none", resize: "vertical" }} />
            </div>

            <button 
              className="btn-purple-pill" 
              onClick={async () => {
                const name = document.getElementById("res-name").value;
                const id = document.getElementById("res-id").value;
                const email = document.getElementById("res-email").value;
                const github = document.getElementById("res-github").value;
                const edu = document.getElementById("res-edu").value;
                const skills = document.getElementById("res-skills").value;
                const project = document.getElementById("res-project").value;

                try {
                  await apiPost("/user/update-resume", {
                    user_id: user?.id || CURRENT_USER_ID,
                    name, student_id: id, email, github, education: edu, skills, project, is_dark_mode: user?.is_dark_mode || false
                  });
                  alert("Profile synced and saved to Database successfully! 🚀");
                } catch (e) {
                  console.error("Sync failed:", e);
                }

                const generatedCode = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\begin{document}

\\begin{center}
    {\\Huge \\textbf{${name}}} \\\\ \\vspace{2pt}
    \\small ${id} \\\\
    \\href{mailto:${email}}{${email}} \\| \\href{https://${github}}{${github}}
\\end{center}

\\section{Education}
${edu}

\\section{Technical Stack}
${skills}

\\section{Key Projects \\& Experience}
${project}

\\end{document}`;

                document.getElementById("latex-source-view").innerText = generatedCode;
                document.getElementById("latex-code-box").style.display = "block";
              }}
              style={{ padding: "12px 28px", cursor: "pointer", fontWeight: 800 }}
            >
              Save to Database & Generate LaTeX 🚀
            </button>

            {/* Code Box */}
            <div id="latex-code-box" style={{ display: "none", marginTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <strong style={{ fontSize: "0.88rem", color: "#201b38" }}>Overleaf-Ready Source Code:</strong>
                <button 
                  onClick={() => {
                    const text = document.getElementById("latex-source-view").innerText;
                    navigator.clipboard.writeText(text);
                    alert("LaTeX Code Copied to Clipboard!");
                  }}
                  style={{ fontSize: "0.78rem", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: 700 }}
                >
                  📋 Copy Code
                </button>
              </div>
              <pre id="latex-source-view" style={{ background: "#0f172a", color: "#38bdf8", padding: "20px", borderRadius: "14px", fontSize: "0.78rem", overflowX: "auto", fontFamily: "monospace", lineHeight: "1.5" }}>
              </pre>
            </div>
          </div>

          {/* Guidelines Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#201b38", marginBottom: "10px" }}>💡 Why ATS LaTeX?</h3>
              <p style={{ fontSize: "0.85rem", color: "#6b6575", lineHeight: "1.6", margin: 0 }}>
                Corporate filters process plain text structure reliably, ensuring your qualifications are accurately interpreted without parsing errors.
              </p>
            </div>

            <div style={{ background: "#ffffff", padding: "24px", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#201b38", marginBottom: "10px" }}>🛠️ How to Compile</h3>
              <ol style={{ fontSize: "0.85rem", color: "#6b6575", lineHeight: "1.6", paddingLeft: "18px", margin: 0 }}>
                <li>Copy code from above.</li>
                <li>Paste into a new project on <a href="https://www.overleaf.com" target="_blank" rel="noreferrer" style={{ color: "#5b45d0", fontWeight: 700 }}>Overleaf</a>.</li>
                <li>Compile to export your final ATS-compliant PDF.</li>
              </ol>
            </div>
          </div>

        </div>
      )}
    </main>

    {/* Right Sidebar Widget Panel */}
    <aside className="dash-right-panel">
      <div className="right-widget-card gradient-bg">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span style={{ fontWeight: 800, fontSize: "0.9rem" }}>Day Streak</span>
          <span style={{ fontSize: "1.2rem" }}>🔥 5 Days</span>
        </div>
        <p style={{ fontSize: "0.8rem", opacity: 0.9, lineHeight: 1.4 }}>
          "Consistency is what turns average coders into senior engineers!"
        </p>
      </div>

      <div className="right-widget-card">
        <div className="widget-title" style={{ color: "#201b38" }}>
          <Flame size={18} color="#ff8a52" /> Live Arena Feed
        </div>

        <div className="feed-item" style={{ marginTop: "10px" }}>
          <div className="feed-avatar">L</div>
          <div style={{ fontSize: "0.78rem" }}>
            <strong>Bob</strong> submitted <i>Git SSH Key Quest</i>
            <div style={{ color: "#6b6575", fontSize: "0.7rem", marginTop: 2 }}>2 mins ago · +50 XP</div>
          </div>
        </div>

        <div className="feed-item" style={{ marginTop: "10px" }}>
          <div className="feed-avatar" style={{ background: "#fef3c7", color: "#b45309" }}>U</div>
          <div style={{ fontSize: "0.78rem" }}>
            <strong>Harry</strong> unlocked <i>Level 2 DSA</i>
            <div style={{ color: "#6b6575", fontSize: "0.7rem", marginTop: 2 }}>15 mins ago</div>
          </div>
        </div>

        <div className="feed-item" style={{ marginTop: "10px" }}>
          <div className="feed-avatar" style={{ background: "#e0f2fe", color: "#0284c7" }}>S</div>
          <div style={{ fontSize: "0.78rem" }}>
            <strong>Elizabeth</strong> approved a code submission
            <div style={{ color: "#6b6575", fontSize: "0.7rem", marginTop: 2 }}>1 hr ago</div>
          </div>
        </div>
      </div>

      <div className="right-widget-card">
        <div className="widget-title" style={{ color: "#201b38" }}>
          <Compass size={18} color="#5b45d0" /> Weekly Target
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
              <span>C++ & Memory</span>
              <span style={{ color: "#5b45d0" }}>80%</span>
            </div>
            <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: "80%", height: "100%", background: "#5b45d0", borderRadius: "99px" }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, marginBottom: "4px" }}>
              <span>Data Structures</span>
              <span style={{ color: "#ff8a52" }}>35%</span>
            </div>
            <div style={{ height: "6px", background: "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: "35%", height: "100%", background: "#ff8a52", borderRadius: "99px" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-widget-card" style={{ background: "#f0fdf4", borderColor: "#bbf7d0", textAlign: "center", padding: "18px 14px" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#15803d", marginBottom: "8px" }}>
          Keep Going, Future Engineer! 📚
        </div>

        <div style={{ margin: "10px auto", display: "flex", justifyContent: "center" }}>
          <svg width="110" height="110" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40 L34 50 L44 54 L34 58 L30 68 L26 58 L16 54 L26 50 Z" fill="#fde047" />
            <path d="M165 30 L168 38 L178 41 L168 44 L165 52 L162 44 L152 41 L162 38 Z" fill="#fde047" />
            <ellipse cx="100" cy="115" rx="42" ry="48" fill="#4f46e5" />
            <ellipse cx="100" cy="120" rx="30" ry="36" fill="#e0e7ff" />
            <path d="M65 72 L78 90 L60 92 Z" fill="#3730a3" />
            <path d="M135 72 L140 92 L122 90 Z" fill="#3730a3" />
            <circle cx="82" cy="100" r="16" fill="#ffffff" stroke="#1e1b2e" strokeWidth="4" />
            <circle cx="118" cy="100" r="16" fill="#ffffff" stroke="#1e1b2e" strokeWidth="4" />
            <line x1="98" y1="100" x2="102" y2="100" stroke="#1e1b2e" strokeWidth="4" />
            <circle cx="85" cy="100" r="7" fill="#1e1b2e" />
            <circle cx="121" cy="100" r="7" fill="#1e1b2e" />
            <circle cx="87" cy="98" r="2.5" fill="#ffffff" />
            <circle cx="123" cy="98" r="2.5" fill="#ffffff" />
            <polygon points="100,108 94,115 106,115" fill="#ff8a52" />
            <ellipse cx="70" cy="112" rx="5" ry="3" fill="#f472b6" />
            <ellipse cx="130" cy="112" rx="5" ry="3" fill="#f472b6" />
            <path d="M68 135 Q100 130 100 145 Q100 130 132 135 L132 165 Q100 160 100 170 Q100 160 68 165 Z" fill="#f43f5e" stroke="#1e1b2e" strokeWidth="3" />
            <path d="M100 145 L100 170" stroke="#1e1b2e" strokeWidth="3" />
            <ellipse cx="68" cy="142" rx="6" ry="4" fill="#3730a3" />
            <ellipse cx="132" cy="142" rx="6" ry="4" fill="#3730a3" />
          </svg>
        </div>

        <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 700, lineHeight: 1.4 }}>
          NerdOwl is watching! Complete your daily C++ quest today. 🦉✨
        </div>
      </div>
    </aside>
  </div>
);
}