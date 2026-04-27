"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ImageOff,
  KeyRound,
  Plus,
  ShieldCheck,
  Sparkles,
  UserX,
} from "lucide-react";

// ── Currency localization ──────────────────────────────────────────
// Prices are stored in USD as numbers and converted client-side based on
// the visitor's country (with manual override). Approximate rates are kept
// here intentionally; production would pull from a rates API.

type CurrencyCode = "USD" | "INR" | "EUR" | "GBP" | "CAD" | "AUD";

const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; rate: number; step: number; label: string }
> = {
  USD: { symbol: "$", rate: 1, step: 1, label: "USD" },
  INR: { symbol: "₹", rate: 83, step: 100, label: "INR" },
  EUR: { symbol: "€", rate: 0.92, step: 1, label: "EUR" },
  GBP: { symbol: "£", rate: 0.79, step: 1, label: "GBP" },
  CAD: { symbol: "C$", rate: 1.36, step: 1, label: "CAD" },
  AUD: { symbol: "A$", rate: 1.5, step: 1, label: "AUD" },
};

const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  IN: "INR",
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AU: "AUD",
  NZ: "AUD",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR",
  PT: "EUR", IE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
  LV: "EUR", LT: "EUR", EE: "EUR", SK: "EUR", SI: "EUR", MT: "EUR",
  CY: "EUR", HR: "EUR",
};

function formatPrice(usd: number, code: CurrencyCode): string {
  const c = CURRENCIES[code];
  const raw = usd * c.rate;
  const stepped = Math.round(raw / c.step) * c.step;
  return c.symbol + stepped.toLocaleString("en-US");
}

type Plan = {
  id: "standard" | "priority";
  name: string;
  tagline: string;
  bestFor: string;
  basePrice: number; // USD
  suffix: string;
  features: string[];
  cta: string;
  popular: boolean;
};

type CaseType = {
  id: string;
  label: string;
  short: string;
  description: string;
  icon: React.ElementType;
  plans: [Plan, Plan];
};

const caseTypes: CaseType[] = [
  {
    id: "content",
    label: "Instagram reel or photo posted without consent",
    short: "Non-consensual Instagram content",
    description:
      "Professional Instagram content removal pathway for reels, posts, or photos uploaded without your permission — built around Instagram's unauthorized-content policy for maximum takedown success.",
    icon: ImageOff,
    plans: [
      {
        id: "standard",
        name: "Standard Case",
        tagline: "The methodical path: complete packet, platform submission, calm cadence.",
        bestFor: "One piece of content. No active spread. You can wait 1–2 business days for movement.",
        basePrice: 149,
        suffix: "one-time, per case",
        features: [
          "Tailored takedown packet",
          "Platform-specific submission",
          "Status updates every 48h",
          "One revision round included",
          "Eligibility & evidence audit",
        ],
        cta: "Start this case",
        popular: false,
      },
      {
        id: "priority",
        name: "Priority Case",
        tagline: "When time matters: same-day intake and active escalation pressure.",
        bestFor: "Content is spreading, being re-uploaded, or screen-recorded. You need movement today.",
        basePrice: 249,
        suffix: "one-time, per case",
        features: [
          "Same-day intake & submission",
          "Priority queue placement",
          "Status updates every 24h",
          "Unlimited revisions",
          "Multi-platform coordination",
          "Dedicated escalation playbook",
        ],
        cta: "Open priority case",
        popular: true,
      },
    ],
  },
  {
    id: "impersonator",
    label: "Delete a fake Instagram impersonation account",
    short: "Instagram impersonator",
    description:
      "Identity-and-harm packet engineered to get fake Instagram accounts reported and deleted — the cleanest path to Instagram impersonation enforcement.",
    icon: UserX,
    plans: [
      {
        id: "standard",
        name: "Standard Case",
        tagline: "Full identity-and-deception packet, submitted through the right channel.",
        bestFor: "The fake exists but isn't actively scamming yet. You want it gone, not chased.",
        basePrice: 179,
        suffix: "one-time, per account",
        features: [
          "Identity verification dossier",
          "Harm & deception evidence pack",
          "Direct platform submission",
          "Status updates every 48h",
          "One revision round included",
        ],
        cta: "Start this case",
        popular: false,
      },
      {
        id: "priority",
        name: "Priority Case",
        tagline: "When the impersonator is active: scamming, DMing your circle, or growing fast.",
        bestFor: "Active impersonation harm — financial, reputational, or social. Speed is the point.",
        basePrice: 279,
        suffix: "one-time, per account",
        features: [
          "Same-day intake & submission",
          "Priority queue placement",
          "Status updates every 24h",
          "Unlimited revisions",
          "Multi-account coordination",
          "Dedicated escalation playbook",
        ],
        cta: "Open priority case",
        popular: true,
      },
    ],
  },
  {
    id: "account",
    label: "Delete an old Instagram account you can't access",
    short: "Old Instagram account",
    description:
      "For Instagram accounts you no longer have access to — old logins holding your photos, videos, or identity. We assemble the ownership and Instagram account deletion request.",
    icon: KeyRound,
    plans: [
      {
        id: "standard",
        name: "Standard Case",
        tagline: "Ownership-and-deletion packet for a dormant, recoverable old account.",
        bestFor: "Account is dormant. The media inside isn't actively spreading. You want it closed cleanly.",
        basePrice: 199,
        suffix: "one-time, per account",
        features: [
          "Ownership proof packet",
          "Account deletion submission",
          "Recovery pathway documentation",
          "Status updates every 48h",
          "One revision round included",
        ],
        cta: "Start this case",
        popular: false,
      },
      {
        id: "priority",
        name: "Priority Case",
        tagline: "When the dormant account holds sensitive media or is being actively misused.",
        bestFor: "Old account is leaking or being accessed by someone else. Sensitive photos or videos involved.",
        basePrice: 299,
        suffix: "one-time, per account",
        features: [
          "Same-day intake & submission",
          "Priority queue placement",
          "Status updates every 24h",
          "Unlimited revisions",
          "Sensitive-media handling protocol",
          "Dedicated escalation playbook",
        ],
        cta: "Open priority case",
        popular: true,
      },
    ],
  },
];

const faqs = [
  {
    q: "How do I know which case type to pick?",
    a: "If Instagram photos or reels were posted without your permission, choose Non-consensual Instagram content. If a fake Instagram profile is pretending to be you, choose Instagram impersonator. If you're locked out of an old Instagram profile that still holds your photos or videos, choose Old Instagram account. Not sure? Start a free review and we'll route it correctly.",
  },
  {
    q: "What's the difference between Standard and Priority?",
    a: "Standard is the right choice for most Instagram takedown cases — full packet, Instagram platform submission, and 48-hour status updates. Priority is for Instagram cases that are spreading, escalating, or time-sensitive: same-day intake, 24-hour status updates, and dedicated Instagram escalation prep.",
  },
  {
    q: "How quickly do you respond after intake?",
    a: "Free Instagram case reviews are answered within 24 hours. Standard Instagram takedown cases enter the work queue within one business day; priority cases are handled the same day, including evenings and weekends when needed.",
  },
  {
    q: "What if the takedown doesn't go through?",
    a: "Full refund. Every cent. We only get paid when your Instagram case moves forward, and if a submission ultimately fails to result in Instagram content or account removal, you don't pay for the work.",
  },
  {
    q: "Can I run multiple cases at once?",
    a: "Yes. Each Instagram takedown case is billed separately, but we coordinate them in one workspace so evidence, identity proof, and Instagram platform context are reused — no duplicate intake.",
  },
  {
    q: "Is my evidence kept private?",
    a: "Yes. Instagram intake, evidence, and case context are stored in a restricted-access workspace and shared only with Instagram's enforcement channel during submission. Everything is encrypted and confidential.",
  },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCase, setActiveCase] = useState<string>(caseTypes[0].id);
  const current = caseTypes.find((c) => c.id === activeCase) ?? caseTypes[0];

  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  // IP-based currency detection (client-side, no API key needed).
  // Falls back silently to USD if the lookup fails or is blocked.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/country/", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const code = (await res.text()).trim().toUpperCase();
        if (cancelled) return;
        const next = COUNTRY_TO_CURRENCY[code];
        if (next) setCurrency(next);
      } catch {
        // ignore — keep USD
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <SiteShell ctaHref="/contact" ctaLabel="Start Free Review">
      <section className="pv3">
        <div className="pv3-bg" aria-hidden="true" />
        <div className="pv3-grain" aria-hidden="true" />

        <div className="pv3-shell">
          {/* ── Tight Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pv3-hero-tight"
          >
            <h1 className="pv3-title pv3-title-tight">
              One-time fees. <em>Refund</em> if it fails.
            </h1>
            <p className="pv3-hero-sub">
              Pick the case type that matches your situation. Free review on every case —
              you only pay if we can move it forward.
            </p>
          </motion.div>

          {/* ── Case-type Switcher ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="pv3-tabs"
            role="tablist"
            aria-label="Case type"
          >
            {caseTypes.map((c) => {
              const active = c.id === activeCase;
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className="pv3-tab"
                  data-active={active}
                  onClick={() => setActiveCase(c.id)}
                >
                  {active && (
                    <motion.span
                      layoutId="pv3-tab-thumb"
                      className="pv3-tab-thumb"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="pv3-tab-content">
                    <Icon size={15} strokeWidth={1.7} />
                    <span className="pv3-tab-label-full">{c.label}</span>
                    <span className="pv3-tab-label-short">{c.short}</span>
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* ── Editorial Spec Board (replaces card grid) ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="pv3-case-stage"
            >
              <p className="pv3-case-desc">{current.description}</p>

              <div className="pv3-board" onMouseMove={handleCardMove}>
                {/* Integrated guarantee + currency bar */}
                <div className="pv3-board-bar">
                  <span className="pv3-board-bar-item pv3-board-bar-guarantee">
                    <ShieldCheck size={14} strokeWidth={1.9} />
                    Free review · Refund if it fails
                  </span>
                  <span className="pv3-board-bar-divider" aria-hidden="true" />
                  <span className="pv3-board-bar-item">No subscriptions</span>
                </div>

                <span className="pv3-board-spine" aria-hidden="true" />

                {current.plans.map((plan, idx) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.06 + idx * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`pv3-board-side${plan.popular ? " pv3-board-side-featured" : ""}`}
                  >
                    <div className="pv3-board-head">
                      <span className="pv3-board-tag">
                        {plan.popular ? (
                          <>
                            <span className="pv3-popular-dot" /> Most chosen
                          </>
                        ) : (
                          <>0{idx + 1} · {plan.name.split(" ")[0]}</>
                        )}
                      </span>
                      <h3 className="pv3-board-name">{plan.name}</h3>
                      <p className="pv3-board-tagline">{plan.tagline}</p>
                    </div>

                    <div className="pv3-board-bestfor">
                      <span className="pv3-board-bestfor-label">Best for</span>
                      <p>{plan.bestFor}</p>
                    </div>

                    <div className="pv3-board-price">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={`${plan.id}-${currency}`}
                          initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="pv3-board-price-num"
                        >
                          {formatPrice(plan.basePrice, currency)}
                        </motion.span>
                      </AnimatePresence>
                      <span className="pv3-board-price-suffix">{plan.suffix}</span>
                    </div>

                    <ul className="pv3-board-features">
                      {plan.features.map((f) => (
                        <li key={f} className="pv3-board-feature">
                          <span className="pv3-board-feature-bullet" aria-hidden="true">
                            <Check size={10} strokeWidth={2.6} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact" className="pv3-board-cta">
                      {plan.cta}
                      <ArrowRight size={14} strokeWidth={1.8} />
                    </Link>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </AnimatePresence>

          {/* ── FAQ ── */}
          <div className="pv3-faq-grid">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <span className="pv3-eyebrow">
                <span className="pv3-eyebrow-dot" />
                Questions
              </span>
              <h2
                style={{
                  margin: "1.1rem 0 0",
                  fontSize: "clamp(1.8rem, 3.6vw, 2.5rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: "var(--color-ink)",
                  textWrap: "balance",
                }}
              >
                Clear answers before you commit.
              </h2>
              <p
                style={{
                  margin: "1rem 0 0",
                  color: "var(--color-muted)",
                  lineHeight: 1.7,
                  fontSize: "0.96rem",
                  maxWidth: "26rem",
                }}
              >
                Pricing is the easy part. If anything below isn&apos;t covered, the free review is the
                next step.
              </p>
            </motion.div>

            <div className="pv3-faq-list">
              {faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q} className="pv3-faq-item" data-open={open}>
                    <button
                      type="button"
                      className="pv3-faq-trigger"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span>{f.q}</span>
                      <span className="pv3-faq-icon" aria-hidden="true">
                        <Plus size={14} strokeWidth={1.8} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="pv3-faq-body">{f.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Closing CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pv3-closing"
          >
            <span className="pv3-eyebrow">
              <Sparkles size={12} /> Ready when you are
            </span>
            <h3>Start with a free review. Decide from there.</h3>
            <p>
              Send the evidence once. We&apos;ll structure it, recommend the cleanest pathway, and
              tell you exactly what a case would look like.
            </p>
            <div className="pv3-closing-actions">
              <Link href="/contact" className="button-primary">
                Start a free review
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </Link>
              <Link href="/how-it-works" className="button-secondary">
                See how it works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteShell>
  );
}

