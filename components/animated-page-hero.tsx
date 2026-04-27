"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease },
  },
};

export function AnimatedPageHero({
  eyebrow,
  title,
  description,
  noteLabel,
  noteContent,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  noteLabel?: string;
  noteContent?: string;
  children?: ReactNode;
}) {
  return (
    <section className="page-hero page-hero-angled page-hero-animated">
      <motion.div
        className="hero-orb hero-orb-page-1"
        aria-hidden="true"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="hero-orb hero-orb-page-2"
        aria-hidden="true"
        animate={{
          y: [0, 12, 0],
          x: [0, -8, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="page-hero-angled-grid">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="eyebrow" variants={fadeUp}>
            {eyebrow}
          </motion.p>
          <motion.h1
            className="page-title page-title-editorial"
            variants={fadeUp}
          >
            {title}
          </motion.h1>
          <motion.p className="page-copy" variants={fadeUp}>
            {description}
          </motion.p>
          {children && (
            <motion.div variants={fadeUp}>{children}</motion.div>
          )}
        </motion.div>

        {noteLabel && noteContent && (
          <motion.div
            className="angled-note"
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
          >
            <p>{noteLabel}</p>
            <strong>{noteContent}</strong>
          </motion.div>
        )}
      </div>
    </section>
  );
}
