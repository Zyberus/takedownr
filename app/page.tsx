import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { AnimatedHero } from "@/components/animated-hero";

export const metadata: Metadata = {
  title:
    "Report & Remove Instagram Accounts, Photos & Reels — Takedownr",
  description:
    "Takedownr is a professional Instagram takedown service. Report fake Instagram accounts, remove unauthorized photos & reels, delete impersonation profiles, and submit DMCA takedowns. 98% success rate. Confidential service with full refund guarantee.",
  alternates: {
    canonical: "https://takedownr.com",
  },
  openGraph: {
    title:
      "Takedownr — Report & Remove Fake Instagram Accounts & Unauthorized Content",
    description:
      "Professional Instagram content removal. Report and delete fake accounts, remove unauthorized photos & reels, take down impersonation profiles. Fast, confidential, 98% success rate.",
    url: "https://takedownr.com",
  },
};

const serviceCards = [
  {
    title: "Instagram reel & photo takedowns",
    copy: "For Instagram reels, stories, or photos uploaded without your consent, we assemble the fastest, most credible removal request to get unauthorized content deleted from Instagram quickly.",
  },
  {
    title: "Fake Instagram account removal",
    copy: "When someone is impersonating you on Instagram, we build a clean identity-and-harm evidence packet designed to get the fake Instagram account reported and permanently deleted.",
  },
  {
    title: "Rapid Instagram escalation",
    copy: "If your Instagram takedown case is urgent — content spreading, account actively scamming — we prepare documentation for rapid escalation through Instagram's enforcement channels.",
  },
];

const steps = [
  {
    index: "01",
    title: "Submit the Instagram links & evidence",
    copy: "We structure Instagram profile URLs, post links, screenshots, and harm context into a professional case file optimized for fast platform review.",
  },
  {
    index: "02",
    title: "We route through the right Instagram pathway",
    copy: "Each Instagram takedown request is routed toward either unauthorized-content removal, impersonation-account enforcement, or DMCA copyright claims.",
  },
  {
    index: "03",
    title: "Track your Instagram case clearly",
    copy: "You get clear status updates on your Instagram content removal case — not a maze of tabs, DMs, and repeated explanations to Instagram support.",
  },
];

export default function Home() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Open a Case">
      <AnimatedHero />

      {/* Services Section — keyword-rich for "instagram takedown service", "remove instagram content" */}
      <section id="services" className="editorial-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Instagram Takedown Services</p>
          <h2 className="section-title">
            Professional Instagram content removal. Minimal process, heavy
            pressure where it counts.
          </h2>
          <p className="section-copy">
            Built for the most common Instagram problems people search for help
            with: photos and reels posted without consent, fake accounts
            impersonating you, and old Instagram accounts you need deleted.
          </p>
        </div>

        <div className="service-grid">
          {serviceCards.map((card, index) => (
            <article
              key={card.title}
              className={`service-card reveal reveal-delay-${(index % 3) + 1}`}
            >
              <span className="service-index">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How It Works Section — targets "how to report instagram account", "how to delete instagram account" */}
      <section className="story-section">
        <div className="story-layout">
          <div className="story-panel reveal">
            <p className="eyebrow">How to remove Instagram content</p>
            <h2 className="section-title">
              A clear process to report, remove, and delete Instagram content
              and accounts — even when it feels impossible.
            </h2>
            <p className="section-copy">
              Whether you need to report a fake Instagram account, remove
              unauthorized photos, or get an impersonation profile deleted, our
              structured process turns chaos into a calm, trackable case.
            </p>
          </div>

          <div className="steps-stack">
            {steps.map((step, index) => (
              <article
                key={step.index}
                className={`step-card reveal reveal-delay-${(index % 3) + 1}`}
              >
                <span>{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-panel reveal">
          <p className="eyebrow">Report Instagram Content Now</p>
          <h2 className="section-title">
            If someone posted your photos without consent or is impersonating
            you on Instagram, start the takedown now.
          </h2>
          <p className="section-copy">
            Private intake, organized evidence, and a focused Instagram takedown
            path from the first message. Free case review, full refund if
            removal fails.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button-primary">
              Start an Instagram takedown request
            </Link>
            <Link href="/how-it-works" className="button-secondary">
              See how Instagram removal works
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
