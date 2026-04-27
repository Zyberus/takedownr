"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Shield,
  ArrowRight,
  Check,
  Link2,
  Image as ImageIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const cases = [
  { id: "TR-2847", platform: "Instagram", type: "Reel",  duration: "2d 14h" },
  { id: "TR-2851", platform: "Instagram", type: "Photo", duration: "1d 06h" },
  { id: "TR-2856", platform: "Instagram", type: "Story", duration: "3d 02h" },
] as const;

const evidence = [
  { Icon: Link2,        label: "URL captured",       detail: "instagram.com/p/Cx9\u2026" },
  { Icon: ImageIcon,    label: "Screenshot sealed",  detail: "evidence_01.png" },
  { Icon: ShieldCheck,  label: "Identity verified",  detail: "KYC \u00b7 encrypted" },
] as const;

const stages = ["Filed", "Review", "Sent", "Removed"] as const;

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

export function AnimatedHero() {
  // phase: 0 -> Filed, 1 -> Review, 2 -> Sent, 3 -> Removed
  const [phase, setPhase] = useState(0);
  const [caseIdx, setCaseIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPhase((p) => {
        if (p >= 3) {
          setCaseIdx((c) => (c + 1) % cases.length);
          return 0;
        }
        return p + 1;
      });
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const current = cases[caseIdx];
  const removed = phase >= 3;

  return (
    <section className="compact-hero">
      {/* Ambient glow */}
      <motion.div
        className="compact-hero-glow"
        aria-hidden="true"
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="compact-hero-inner">
        {/* Left: text */}
        <motion.div
          className="compact-hero-text"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="compact-hero-badge" variants={fadeUp}>
            <Shield size={14} />
            <span>Instagram Takedown Studio</span>
          </motion.div>

          <motion.h1 className="compact-hero-title" variants={fadeUp}>
            Stolen content?
            <br />
            <span className="compact-hero-accent">We get it removed.</span>
          </motion.h1>

          <motion.p className="compact-hero-desc" variants={fadeUp}>
            Turn scattered evidence into a single decisive takedown — organized,
            private, and built to move fast.
          </motion.p>

          <motion.div className="compact-hero-ctas" variants={fadeUp}>
            <Link href="/contact" className="button-primary compact-hero-btn">
              Start your case
              <ArrowRight size={16} />
            </Link>
            <Link href="#services" className="button-secondary">
              See services
            </Link>
          </motion.div>

          <motion.div className="compact-hero-stats" variants={fadeUp}>
            <div className="compact-stat">
              <strong>24h</strong>
              <span>Intake review</span>
            </div>
            <div className="compact-stat-divider" />
            <div className="compact-stat">
              <strong>100%</strong>
              <span>Human reviewed</span>
            </div>
            <div className="compact-stat-divider" />
            <div className="compact-stat">
              <strong>2</strong>
              <span>Pathways</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Living Case File visualization */}
        <motion.div
          className="compact-hero-viz"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          {/* Stack of past case papers behind the active card */}
          <div className="case-stack" aria-hidden="true">
            <div className="case-paper case-paper-back" />
            <div className="case-paper case-paper-mid" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={caseIdx}
              className="case-card"
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.55, ease }}
            >
              <div className="case-card-header">
                <div className="case-id-row">
                  <span className="case-tag">Case</span>
                  <span className="case-id">#{current.id}</span>
                </div>
                <span
                  className={`case-status ${removed ? "case-status-done" : "case-status-live"}`}
                >
                  <span className="case-status-dot" />
                  {removed ? "Removed" : "In progress"}
                </span>
              </div>

              <div className="case-meta">
                <div className="case-meta-cell">
                  <span>Target</span>
                  <strong>{current.platform} · {current.type}</strong>
                </div>
                <div className="case-meta-cell">
                  <span>Pathway</span>
                  <strong>Priority · 24h</strong>
                </div>
              </div>

              {/* Evidence list — checks light up as phase advances */}
              <div className="case-section">
                <div className="case-section-label">
                  <Sparkles size={11} strokeWidth={2} />
                  Evidence
                </div>
                <ul className="case-evidence">
                  {evidence.map((e, i) => {
                    const visible = phase >= i;
                    const Icon = e.Icon;
                    return (
                      <li key={e.label} className="case-evidence-row">
                        <span className="case-evidence-icon">
                          <Icon size={12} strokeWidth={1.9} />
                        </span>
                        <div className="case-evidence-text">
                          <strong>{e.label}</strong>
                          <span>{e.detail}</span>
                        </div>
                        <motion.span
                          className="case-evidence-check"
                          animate={{
                            scale: visible ? 1 : 0,
                            opacity: visible ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.32,
                            delay: visible ? 0.12 : 0,
                            ease,
                          }}
                          aria-hidden="true"
                        >
                          <Check size={11} strokeWidth={2.6} />
                        </motion.span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Timeline progress */}
              <div className="case-section">
                <div className="case-section-label">Timeline</div>
                <div className="case-timeline">
                  <div className="case-timeline-track">
                    <motion.div
                      className="case-timeline-fill"
                      animate={{ width: `${(Math.min(phase, 3) / 3) * 100}%` }}
                      transition={{ duration: 0.7, ease }}
                    />
                  </div>
                  <div className="case-timeline-stages">
                    {stages.map((s, i) => (
                      <div
                        key={s}
                        className={`case-stage ${i <= phase ? "case-stage-done" : ""}`}
                      >
                        <span className="case-stage-dot" />
                        <span className="case-stage-label">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Removed stamp */}
              <AnimatePresence>
                {removed && (
                  <motion.div
                    key="stamp"
                    className="case-stamp"
                    initial={{ opacity: 0, scale: 0.55, rotate: -14 }}
                    animate={{ opacity: 1, scale: 1, rotate: -6 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.55, ease }}
                    aria-hidden="true"
                  >
                    <span className="case-stamp-label">Removed</span>
                    <span className="case-stamp-meta">in {current.duration}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
