"use client";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Link2, FolderOpen, Route, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "Submit the raw links",
    copy: "Start with the target account or post URL. Our intake form takes 60 seconds — no bloated onboarding or unnecessary detours.",
    icon: Link2,
  },
  {
    num: "02",
    title: "We build the evidence pack",
    copy: "We organize screenshots, metadata, and identity proofs so the case reads clearly to reviewers instead of emotionally.",
    icon: FolderOpen,
  },
  {
    num: "03",
    title: "Assign takedown pathway",
    copy: "We route the case correctly — separating copyright, impersonation, and policy violations to ensure the highest success rate.",
    icon: Route,
  },
  {
    num: "04",
    title: "Monitor and remove",
    copy: "You get clear updates on what was submitted, what is pending, and when the content is permanently removed.",
    icon: ShieldCheck,
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Start a Request">
      <section className="pricing-hero-section how-page-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
          className="pricing-hero-text"
        >
          <p className="eyebrow">How It Works</p>
          <h1 className="pricing-hero-title">
            Built to reduce chaos, not add more of it.
          </h1>
          <p className="pricing-hero-desc">
            Every step is narrowed down to one clear job so sensitive Instagram cases move with less friction and more control.
          </p>
        </motion.div>

        <div className="steps-grid">
          {steps.map((step, idx) => (
            <motion.article
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.45 }}
              transition={{ delay: idx * 0.08, duration: 0.45, ease }}
              className="step-card-v2"
            >
              <div className="step-card-header">
                <span className="step-card-icon text-[var(--color-accent)]">
                  <step.icon size={24} strokeWidth={2} />
                </span>
                <span className="step-card-num">{step.num}</span>
              </div>
              <h2 className="step-card-title">{step.title}</h2>
              <p className="step-card-copy">{step.copy}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="cta-section cta-section-tight">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="cta-panel cta-panel-centered"
        >
          <p className="eyebrow">Ready?</p>
          <h2 className="section-title">
            If the fake account or stolen content is live, start the intake.
          </h2>
          <div className="hero-actions cta-actions-compact">
            <Link href="/contact" className="button-primary">
              Start confidential intake
            </Link>
          </div>
        </motion.div>
      </section>
    </SiteShell>
  );
}
