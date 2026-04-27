"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight, Lock, Menu, X } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Plans" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({
  children,
  ctaLabel = "Start a Takedown",
  ctaHref = "/contact",
}: {
  children: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navSpring = { type: "spring" as const, stiffness: 360, damping: 36, mass: 0.85 };

  return (
    <div className="min-h-screen overflow-x-clip pt-[5.25rem] sm:pt-[5.75rem]">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <motion.div
          initial={false}
          animate={{
            maxWidth: scrolled ? "46rem" : "76rem",
            paddingTop: scrolled ? 8 : 16,
          }}
          transition={navSpring}
          className="pointer-events-auto mx-auto w-full px-4 sm:px-6"
        >
          <motion.div
            initial={false}
            animate={{
              paddingTop: scrolled ? 6 : 10,
              paddingBottom: scrolled ? 6 : 10,
            }}
            transition={navSpring}
            className="flex items-center justify-between gap-3 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/90 px-4 shadow-[0_18px_50px_rgba(24,20,17,0.08)] backdrop-blur-xl sm:px-5"
            style={{
              boxShadow: scrolled
                ? "0 10px 36px rgba(24,20,17,0.14)"
                : "0 18px 50px rgba(24,20,17,0.08)",
              transition: "box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <Link href="/" className="brand-mark">
              <span className="brand-mark-dot" />
              Takedownrr
            </Link>

            <motion.nav
              aria-label="Primary"
              initial={false}
              animate={{ gap: scrolled ? 20 : 28 }}
              transition={navSpring}
              className="hidden items-center md:flex"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-nav-link ${pathname === item.href ? "site-nav-link-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </motion.nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={ctaHref}
                className="button-primary hidden min-h-0 whitespace-nowrap px-4 py-2 text-sm sm:inline-flex"
                style={{
                  transform: scrolled ? "scale(0.96)" : "scale(1)",
                  transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transformOrigin: "center",
                }}
              >
                {ctaLabel}
              </Link>

              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-panel-strong)] text-[var(--color-ink)] md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav-sheet"
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2.55rem) 2.55rem)" }}
            animate={{ opacity: 1, clipPath: "circle(160% at calc(100% - 2.55rem) 2.55rem)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 2.55rem) 2.55rem)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mn-sheet md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="mn-topbar">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="brand-mark"
              >
                <span className="brand-mark-dot" />
                Takedownrr
              </Link>
              <button
                type="button"
                className="mn-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.7} />
              </button>
            </div>

            <nav aria-label="Primary mobile" className="mn-body">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="mn-link"
                  >
                    <span>{item.label}</span>
                    <span className="mn-link-arrow" aria-hidden="true">
                      <ArrowUpRight size={16} strokeWidth={1.8} />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: 0.08 + navigation.length * 0.06,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mn-foot"
            >
              <div className="mn-foot-meta">
                <span className="inline-flex items-center gap-2">
                  <span className="mn-foot-meta-dot" />
                  Intake open · response in 24h
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock size={12} strokeWidth={1.8} /> Encrypted
                </span>
              </div>
              <Link
                href={ctaHref}
                onClick={() => setIsMobileMenuOpen(false)}
                className="button-primary w-full"
              >
                {ctaLabel}
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="page-enter flex min-h-[calc(100vh-5.25rem)] flex-col">
        {children}
        <SiteFooter />
      </main>
    </div>
  );
}
