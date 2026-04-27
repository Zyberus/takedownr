import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { AnimatedHero } from "@/components/animated-hero";

const serviceCards = [
  {
    title: "Reel and photo takedowns",
    copy:
      "For videos or images uploaded without consent, we help assemble the fastest, most credible removal request possible.",
  },
  {
    title: "Impersonator account removal",
    copy:
      "When someone is pretending to be you, we build a clean identity-and-harm packet designed to support account deletion action.",
  },
  {
    title: "Rapid escalation prep",
    copy:
      "If a case is urgent, we focus the documentation so it is easier to escalate without losing critical details.",
  },
];

const steps = [
  {
    index: "01",
    title: "Send the evidence once",
    copy:
      "We structure links, screenshots, account details, and harm context into a clean case file built for fast review.",
  },
  {
    index: "02",
    title: "We pressure the right pathway",
    copy:
      "Each request is routed toward either unauthorized-content removal or impersonation-account enforcement.",
  },
  {
    index: "03",
    title: "Track the case without chaos",
    copy:
      "You get a clear next step, not a maze of tabs, DMs, and repeated explanations.",
  },
];

export default function Home() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Open a Case">
      <AnimatedHero />

      <section id="services" className="editorial-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Services</p>
          <h2 className="section-title">Minimal process. Heavy pressure where it counts.</h2>
          <p className="section-copy">
            Built for two of the most stressful Instagram problems: content posted without consent and impersonation accounts designed to deceive.
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

      <section className="story-section">
        <div className="story-layout">
          <div className="story-panel reveal">
            <p className="eyebrow">Scroll flow</p>
            <h2 className="section-title">A case journey that feels clear even when the situation doesn&apos;t.</h2>
            <p className="section-copy">
              The site is designed to slow the panic down: a composed interface, clear sequencing, and visible momentum from intake to escalation.
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

      <section className="cta-section">
        <div className="cta-panel reveal">
          <p className="eyebrow">Ready</p>
          <h2 className="section-title">If someone posted it without consent or is impersonating you, start the case now.</h2>
          <p className="section-copy">
            Private intake, organized evidence, and a focused takedown path from the first message.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button-primary">
              Start a takedown request
            </Link>
            <Link href="/how-it-works" className="button-secondary">
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
