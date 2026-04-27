"use client";

import { ContactForm } from "@/components/contact-form";
import { SiteShell } from "@/components/site-shell";
import { InteractiveEmailLink } from "@/components/interactive-email-link";
import {
  BadgeCheck,
  Image,
  Link2,
  Lock,
  MessageSquareText,
  UserCheck,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const checklistItems = [
  { label: "Instagram profile or post link", icon: Link2 },
  { label: "Screenshots of the content or fake account", icon: Image },
  { label: "What happened, in your words", icon: MessageSquareText },
  { label: "Identity or ownership proof", icon: BadgeCheck },
];

export default function ContactPage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Submit Request">
      <section className="contact-hero-section">
        <motion.div
          className="contact-hero-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
        >
          <div className="contact-hero-text">
            <motion.p
              variants={fadeUp}
              className="eyebrow"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem" }}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  height: "0.4rem",
                  width: "0.4rem",
                  borderRadius: "999px",
                  background: "#30d158",
                  boxShadow: "0 0 0 0.28rem rgba(48, 209, 88, 0.18)",
                  animation: "pv3-pulse 2.4s ease-in-out infinite",
                }}
              />
              Intake open · response in 24h
            </motion.p>

            <motion.h1 variants={fadeUp} className="contact-hero-title">
              Open a confidential Instagram takedown request.
            </motion.h1>

            <motion.div variants={fadeUp} className="contact-hero-desc">
              Report a fake Instagram account, request removal of unauthorized photos or reels,
              or get an impersonation profile deleted. Send the essentials once — your Instagram
              takedown case begins immediately with calm process and focused pressure where it
              counts. Alternatively, you can email us directly at{" "}
              <InteractiveEmailLink />.
            </motion.div>

            <motion.div variants={fadeUp} className="contact-checklist">
              {checklistItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.35 + index * 0.07,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="contact-check-item"
                >
                  <span className="contact-check-icon">
                    <item.icon size={14} strokeWidth={2.3} />
                  </span>
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="contact-trust-row">
              {[
                { Icon: Lock, label: "Encrypted" },
                { Icon: UserCheck, label: "Human-reviewed" },
                { Icon: Zap, label: "24h response" },
              ].map(({ Icon, label }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.55 + i * 0.06,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -2 }}
                  className="contact-trust-badge"
                >
                  <Icon size={14} className="text-[var(--color-accent)]" /> {label}
                </motion.span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="contact-form-panel"
          >
            <div className="contact-form-header-compact">
              <p className="panel-kicker">Confidential Instagram takedown intake</p>
              <h2>Your Instagram case details</h2>
            </div>
            <ContactForm />
          </motion.div>
        </motion.div>
      </section>
    </SiteShell>
  );
}
