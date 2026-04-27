"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Submit request",
    description:
      "Start with the account or content link, issue type, and essential contact details.",
  },
  {
    number: "02",
    title: "Provide evidence",
    description:
      "Share screenshots, timestamps, identity context, and any supporting account history.",
  },
  {
    number: "03",
    title: "Case processing",
    description:
      "The case is reviewed, organized, and prepared for a structured submission pathway.",
  },
  {
    number: "04",
    title: "Resolution tracking",
    description:
      "Receive status updates on whether the case is in review, submitted, or closed.",
  },
];

export function ProcessList() {
  return (
    <motion.ol 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="space-y-10"
    >
      {steps.map((step, i) => (
        <motion.li
          key={step.number}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="grid gap-4 border-t border-[var(--color-line)] pt-6 md:grid-cols-[5rem_minmax(0,1fr)] hover:bg-[var(--color-line)]/5 transition-colors duration-300 rounded-lg -mx-4 px-4"
        >
          <p className="text-sm tracking-[0.16em] text-[var(--color-subtle)] font-bold">
            {step.number}
          </p>
          <div className="max-w-2xl">
            <h3 className="text-xl font-medium tracking-[-0.03em] text-[var(--color-ink)]">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {step.description}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
