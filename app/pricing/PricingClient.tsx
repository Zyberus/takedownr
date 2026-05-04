"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "@/lib/firebase-client";
import { applyPricingOverrides, caseTypes, type PricingOverride } from "@/lib/pricing-data";

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

interface PricingClientProps {
  initialPricing?: PricingOverride | null;
}

export function PricingClient({ initialPricing }: PricingClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeCase, setActiveCase] = useState<string>(caseTypes[0].id);
  const [pricingOverrides, setPricingOverrides] = useState<PricingOverride | null>(initialPricing ?? null);
  
  const pricedCaseTypes = applyPricingOverrides(pricingOverrides);
  const current = pricedCaseTypes.find((c) => c.id === activeCase) ?? pricedCaseTypes[0];

  const [currency, setCurrency] = useState<CurrencyCode>("USD");

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

  useEffect(() => {
    return onSnapshot(doc(firestore, "siteSettings", "pricing"), (snapshot) => {
      const data = snapshot.data();
      if (data?.prices) {
        setPricingOverrides(data.prices as PricingOverride);
      }
    });
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
            {pricedCaseTypes.map((c) => {
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

          {/* ── Editorial Spec Board ── */}
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
              <span className="pv3-eyebrow">Questions</span>
              <h2 className="pv3-faq-title">Helpful clarity.</h2>
              <p className="pv3-faq-sub">
                Everything you need to know about our Instagram takedown process and fees.
              </p>
            </motion.div>

            <div className="pv3-faq-list">
              {faqs.map((faq, idx) => {
                const open = openFaq === idx;
                return (
                  <div key={idx} className="pv3-faq-item" data-open={open}>
                    <button
                      type="button"
                      className="pv3-faq-trigger"
                      onClick={() => setOpenFaq(open ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <span className="pv3-faq-icon">
                        <Plus size={14} strokeWidth={1.5} />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pv3-faq-body">{faq.a}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
