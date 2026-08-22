import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Map, Radar, Trophy, Sparkles, ArrowRight, ChevronLeft,
} from "lucide-react";

const FEATURES = [
  {
    icon: Map,
    title: "Career Roadmap",
    desc: "7-level CS mastery path — Git to placement-ready engineer, one verified task at a time.",
    grad: "linear-gradient(135deg,#eab308,#ec4899)",
  },
  {
    icon: Trophy,
    title: "XP & Level-Ups",
    desc: "Every submission earns XP. Watch your bar fill, level up, and get a confetti celebration.",
    grad: "linear-gradient(135deg,#22c55e,#eab308)",
  },
  {
    icon: Sparkles,
    title: "Skill Hub",
    desc: "Curated tracks — DSA, System Design, Full-Stack, Open Source — handpicked, not generic.",
    grad: "linear-gradient(135deg,#ec4899,#8b5cf6)",
  },
  {
    icon: Radar,
    title: "Community Radar",
    desc: "Find seniors for mentorship, peers to grind with, juniors to guide. Real growth, together.",
    grad: "linear-gradient(135deg,#64748b,#22c55e)",
  },
  {
    icon: Zap,
    title: "Direct Messaging",
    desc: "A sleek glass chat, right inside the app. No context switching, just conversation.",
    grad: "linear-gradient(135deg,#eab308,#22c55e)",
  },
];

export default function Onboarding({ onDone }) {
  const [stage, setStage] = useState("hero"); // hero | features | login
  const [slide, setSlide] = useState(0);

  return (
    <div className="onb-shell">
      <div className="onb-orb orb-1" />
      <div className="onb-orb orb-2" />
      <div className="onb-orb orb-3" />

      <AnimatePresence mode="wait">
        {stage === "hero" && (
          <motion.div
            key="hero"
            className="onb-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
          >
            <div className="onb-logo-badge">⚡</div>
            <h1 className="onb-title">
              Nerd<span className="onb-title-accent">Arena</span>
            </h1>
            <p className="onb-subtitle">
              The gamified way to become placement-ready. Level up your CS
              journey — one verified skill at a time.
            </p>
            <button className="onb-cta" onClick={() => setStage("features")}>
              Get Started <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {stage === "features" && (
          <motion.div
            key="features"
            className="onb-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button className="onb-back" onClick={() => setStage("hero")}>
              <ChevronLeft size={16} /> Back
            </button>

            <AnimatePresence mode="wait">
              {(() => {
                const F = FEATURES[slide];
                const Icon = F.icon;
                return (
                  <motion.div
                    key={slide}
                    className="onb-feature-card"
                    initial={{ opacity: 0, x: 40, rotate: 2 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: -40, rotate: -2 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <div className="onb-feature-icon" style={{ background: F.grad }}>
                      <Icon size={30} color="#fff" />
                    </div>
                    <h2>{F.title}</h2>
                    <p>{F.desc}</p>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            <div className="onb-dots">
              {FEATURES.map((_, i) => (
                <span
                  key={i}
                  className={`onb-dot ${i === slide ? "active" : ""}`}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>

            <button
              className="onb-cta"
              onClick={() =>
                slide < FEATURES.length - 1 ? setSlide(slide + 1) : setStage("login")
              }
            >
              {slide < FEATURES.length - 1 ? "Next" : "Continue"} <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {stage === "login" && (
          <motion.div
            key="login"
            className="onb-login"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button className="onb-back" onClick={() => setStage("features")}>
              <ChevronLeft size={16} /> Back
            </button>
            <div className="onb-logo-badge small">⚡</div>
            <h2 className="onb-login-title">Welcome to the Arena</h2>
            <p className="onb-subtitle">Sign in to save your progress and XP.</p>

            <button className="onb-social-btn google" onClick={onDone}>
              <GoogleIcon /> Continue with Google
            </button>
            <button className="onb-social-btn apple" onClick={onDone}>
              <AppleIcon /> Continue with Apple
            </button>

            <p className="onb-fineprint">
              By continuing you agree to grind, ship, and level up. No spam, ever.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.9 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 35.4 27 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.5l6.6 5.4C41.5 35.9 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 384 512" fill="#fff">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 37.6 59 129.3 107.2 127.8 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-84.1 102.6-121.8-65.2-30.7-61.7-90-61.7-91.99zM256.4 74.5c26.9-32 24.4-61.2 23.6-71.5-23.7 1.4-51.2 16.4-66.9 34.9-17.3 19.5-27.5 43.6-25.4 71 25.7 2 49.1-11.1 68.7-34.4z"/>
    </svg>
  );
}