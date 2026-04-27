"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function AnimatedHero() {
  const ease = [0.22, 1, 0.36, 1] as const;
  
  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } }
  };

  return (
    <section className="relative overflow-hidden bg-[var(--color-surface)] pt-12 pb-16 md:pt-16 lg:pt-20 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 lg:items-center">
          
          {/* Left Column - Main Copy — targets "instagram takedown", "report instagram account", "remove instagram content" */}
          <motion.div 
            className="lg:col-span-7 flex flex-col items-start"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
              <div className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-40"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"></span>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                Intake Open &middot; 24h Response
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeUp}
              className="font-serif text-5xl font-medium tracking-tight text-[var(--color-ink)] sm:text-6xl lg:text-7xl lg:leading-[1.05]"
            >
              Report &amp; remove <br className="hidden sm:block" /> 
              <span className="text-[var(--color-muted)] italic">Instagram content.</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              className="mt-6 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
            >
              Takedownr is a professional Instagram takedown service. We help you report fake Instagram accounts, remove photos and reels posted without consent, and delete impersonation profiles — fast, confidentially, with a full refund guarantee.
            </motion.p>
            
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
              <Link href="/contact" className="button-primary">
                Start a takedown request <ArrowUpRight size={18} strokeWidth={2} />
              </Link>
              <span className="text-sm font-medium text-[var(--color-ink)]">
                Results guaranteed or 100% refund.
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column - Stats */}
          <motion.div 
            className="lg:col-span-4 lg:col-start-9"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <div className="relative border-l border-[var(--color-line)] bg-gradient-to-r from-[var(--color-line)] to-transparent pl-8 py-6 opacity-80 mix-blend-multiply">
              {/* Animated subtle trace line */}
              <motion.div 
                className="absolute -left-[1px] top-0 w-[2px] bg-[var(--color-ink)]"
                initial={{ height: "0%", top: "0%" }}
                animate={{ 
                  height: ["0%", "30%", "0%"],
                  top: ["0%", "70%", "100%"]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              <div className="flex flex-col gap-12">
                <div>
                  <div className="text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">98%</div>
                  <div className="mt-2 text-sm font-medium text-[var(--color-ink)]">Instagram Removal Success Rate</div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">On all accepted Instagram policy violations and takedown cases.</div>
                </div>
                
                <div>
                  <div className="text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">&lt; 24h</div>
                  <div className="mt-2 text-sm font-medium text-[var(--color-ink)]">Instagram Case Submission</div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">Instagram takedown cases are vetted, packaged, and submitted within hours.</div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">Zero</div>
                  <div className="mt-2 text-sm font-medium text-[var(--color-ink)]">Public Footprint</div>
                  <div className="mt-1 text-xs text-[var(--color-muted)]">Your Instagram takedown case remains end-to-end encrypted and anonymous.</div>
                </div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
