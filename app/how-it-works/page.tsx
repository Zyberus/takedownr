"use client";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Link2, FolderOpen, Route, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "Submit the Instagram link",
    copy: "Start by sharing the target Instagram account or post URL. Our intake form takes 60 seconds — paste the Instagram profile link, the post URL, or both. No bloated onboarding.",
    icon: Link2,
  },
  {
    num: "02",
    title: "We build the evidence packet",
    copy: "We organize your Instagram screenshots, account metadata, identity proofs, and platform policy references into a professional case file that Instagram reviewers take seriously.",
    icon: FolderOpen,
  },
  {
    num: "03",
    title: "Route to the correct Instagram pathway",
    copy: "We route your case correctly — separating Instagram copyright claims, impersonation reports, and policy violation reports to ensure the highest possible removal success rate.",
    icon: Route,
  },
  {
    num: "04",
    title: "Monitor until Instagram removes it",
    copy: "You get clear updates on what was submitted to Instagram, what is pending review, and confirmation when the content or fake account is permanently removed from the platform.",
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
          <p className="eyebrow">How Instagram Takedowns Work</p>
          <h1 className="pricing-hero-title">
            How to report and remove Instagram accounts & content — step by step.
          </h1>
          <p className="pricing-hero-desc">
            Wondering how to report a fake Instagram account, delete an
            impersonation profile, or remove photos posted without your consent?
            Every step is narrowed down to one clear job so your Instagram case
            moves with less friction and more control.
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
          <p className="eyebrow">Ready to report?</p>
          <h2 className="section-title">
            If the fake Instagram account or stolen content is still live, start
            the takedown intake now.
          </h2>
          <div className="hero-actions cta-actions-compact">
            <Link href="/contact" className="button-primary">
              Start confidential Instagram takedown
            </Link>
          </div>
        </motion.div>
      </section>
    </SiteShell>
  );
}
