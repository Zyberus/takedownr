import { SiteShell } from "@/components/site-shell";
import { AnimatedPageHero } from "@/components/animated-page-hero";

export default function TermsPage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Start a Request">
      <AnimatedPageHero
        eyebrow="Legal"
        title="Terms and Conditions"
        description="The terms and rules governing use of our website, services, and takedown processing."
      />

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 md:pb-32">
        <div className="space-y-8 text-base leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Takedownrr&apos;s website or submitting a case through our intake form, you fully agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">2. Services Provided</h2>
            <p>
              Takedownrr provides a specialized service to assist individuals or companies in submitting thorough takedown requests to platforms like Instagram. We act on your behalf to present a structured case for unauthorized content, impersonation, or copyright violations based on your submitted evidence.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">3. Accuracy of Information</h2>
            <p>
              You certify that all links, screenshots, descriptions, and ownership proofs you submit are accurate and truthful to your knowledge. Submitting false, malicious, or intentionally misleading reports against an innocent party goes against our terms. In such instances, we reserve the right to instantly terminate your case without a refund.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">4. No Guaranteed Outcomes</h2>
            <p>
              While we leverage deep platform knowledge and meticulous formatting to present your case expertly, the final removal decision strictly resides with the target platform. Takedownrr guarantees standard turnaround bounds and focused pressure but cannot guarantee a mandatory removal by third parties.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">5. Payments and Refunds</h2>
            <p>
              Fees are processed upfront prior to initial submission of your case. We stand by the quality of our service with a strict success guarantee: if we are unable to successfully get the content or account removed, we will issue you a 100% full refund. You only pay for successful results.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">6. Liability</h2>
            <p>
              Takedownrr shall not be held liable for any damages, distress, or losses incurred due to platform delays, technical issues, content persistence, or unexpected decisions by targeted services out of our immediate control.
            </p>
          </div>

          <div className="mt-12 rounded-2xl bg-[var(--color-panel-strong)] p-6 md:p-8">
            <h3 className="mb-2 text-base font-medium text-[var(--color-ink)]">Questions regarding these terms?</h3>
            <p className="text-sm">
              If you require clarification on these Terms and Conditions before continuing, reach out to legal@takedownrr.com.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
