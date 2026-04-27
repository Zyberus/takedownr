import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-8 sm:px-6 sm:py-12 md:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="flex max-w-xs flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/takedownr_logo.png" 
              alt="Takedownr Logo" 
              width={160} 
              height={46} 
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="text-sm leading-relaxed text-[var(--color-muted)]">
            Professional Instagram takedown service. Report fake accounts, remove unauthorized photos & reels, delete impersonation profiles. Confidential, fast, full refund guarantee.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-16">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Platform</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">Home</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">How It Works</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">Plans</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-[var(--color-ink)]">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/privacy" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[var(--color-line)] pt-8 md:mt-16">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-[var(--color-muted)]">
            &copy; {currentYear} Takedownr. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Intake open
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
