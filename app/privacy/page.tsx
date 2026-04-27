import { SiteShell } from "@/components/site-shell";
import { AnimatedPageHero } from "@/components/animated-page-hero";

export default function PrivacyPage() {
  return (
    <SiteShell ctaHref="/contact" ctaLabel="Start a Request">
      <AnimatedPageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How we collect, use, and protect your information when you use Takedownrr's confidential services."
      />

      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 md:pb-32">
        <div className="space-y-8 text-base leading-relaxed text-[var(--color-muted)]">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">1. Information We Collect</h2>
            <p>
              When you submit a takedown request, we collect only the necessary information required to process and submit your case to the relevant platforms. This includes URLs, evidence screenshots, descriptions of the incident, and basic contact information to maintain correspondence with you.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">2. How We Use Information</h2>
            <p>
              Your data is exclusively used for constructing, submitting, and managing your ongoing takedown requests. We do not sell, rent, or trade your personal information to third parties under any circumstances.
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 pl-2">
              <li>To evaluate request feasibility and strategize the takedown pathway.</li>
              <li>To communicate with platform moderators (Instagram, etc.) regarding your case.</li>
              <li>To notify you about status updates, tracking history, and case closures.</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">3. Data Retention and Deletion</h2>
            <p>
              We believe in extreme data minimization. Evidence files, screenshots, and URLs submitted regarding a takedown target are securely purged from our systems 30 days after your case has been successfully closed or terminated. You can request early deletion by emailing us directly.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">4. Security Measures</h2>
            <p>
              We prioritize confidentiality and employ robust, encrypted methods for file transmission and storage during the active phase of your request. Only authorized case managers involved in processing your dispute have secure, temporary access to your case details.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-ink)]">5. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy occasionally to reflect operational or regulatory changes. Any significant updates will be visibly posted on this page. Re-visiting this page ensures you are up to date on our current stance regarding your privacy.
            </p>
          </div>

          <div className="mt-12 rounded-2xl bg-[var(--color-panel-strong)] p-6 md:p-8">
            <h3 className="mb-2 text-base font-medium text-[var(--color-ink)]">Questions regarding this policy?</h3>
            <p className="text-sm">
              Please contact us at privacy@takedownrr.com for any inquiries regarding data protection during your takedown process.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
