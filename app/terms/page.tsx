import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { AnimatedPageHero } from "@/components/animated-page-hero";

export const metadata: Metadata = {
  title: "Terms & Conditions — Takedownr Instagram Takedown Service",
  description:
    "Terms and conditions governing use of Takedownr's Instagram takedown and content removal services. Covers refund guarantee, case processing, liability, and accuracy requirements for Instagram account deletion and content removal requests.",
  alternates: {
    canonical: "https://takedownr.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Takedownr — Instagram Takedown Service",
    description:
      "Terms governing Takedownr's Instagram content removal and account takedown services. Full refund guarantee if removal fails.",
    url: "https://takedownr.com/terms",
  },
};

export default function TermsPage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Start a Request">
      <AnimatedPageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        description="The terms and rules governing use of Takedownr's website, Instagram takedown services, and content removal processing."
      />

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 md:pb-32">
        <div className="space-y-8 text-base leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Takedownr&apos;s website or submitting an Instagram takedown case through our intake form, you fully agree to be bound by these Terms and Conditions. If you do not agree, please do not use our Instagram content removal services.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">2. Services Provided</h2>
            <p>
              Takedownr provides a specialized service to assist individuals or companies in submitting thorough takedown requests to Instagram and related platforms. We act on your behalf to present a structured case for unauthorized content removal, impersonation account deletion, or copyright violations based on your submitted evidence.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">3. Accuracy of Information</h2>
            <p>
              You certify that all Instagram links, screenshots, descriptions, and ownership proofs you submit are accurate and truthful to your knowledge. Submitting false, malicious, or intentionally misleading reports against an innocent party goes against our terms. In such instances, we reserve the right to instantly terminate your Instagram takedown case without a refund.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">4. No Guaranteed Outcomes</h2>
            <p>
              While we leverage deep Instagram platform knowledge and meticulous formatting to present your case expertly, the final removal decision strictly resides with Instagram. Takedownr guarantees standard turnaround bounds and focused pressure but cannot guarantee a mandatory removal by Instagram or third-party platforms.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">5. Payments and Refunds</h2>
            <p>
              Fees are processed upfront prior to initial submission of your Instagram takedown case. We stand by the quality of our service with a strict success guarantee: if we are unable to successfully get the Instagram content or account removed, we will issue you a 100% full refund. You only pay for successful results.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">6. Liability</h2>
            <p>
              Takedownr shall not be held liable for any damages, distress, or losses incurred due to Instagram platform delays, technical issues, content persistence, or unexpected decisions by Instagram or targeted services out of our immediate control.
            </p>
          </div>

          <div className="mt-12 rounded-2xl bg-[var(--color-panel-strong)] p-6 md:p-8">
            <h3 className="mb-2 text-base font-medium text-[var(--color-ink)]">Questions regarding these terms?</h3>
            <p className="text-sm">
              If you require clarification on these Terms and Conditions before continuing, reach out to legal@takedownr.com.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
