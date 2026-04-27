"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function InteractiveEmailLink() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cases = [
    "Non-consensual content",
    "Impersonator account",
    "Old account"
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMailtoLink = (caseName: string) => {
    const subject = encodeURIComponent("New Takedown Request: [Your Name/Entity]");
    const bodyText = `Hello Takedownr Team,

I would like to submit a takedown request. Please find my details below:

1. Type of Case: ${caseName}

2. Target URL(s): 

3. Summary of the Issue: 

4. Any Screenshots or Proof Attached? 

Thank you.`;
    const body = encodeURIComponent(bodyText);
    return `mailto:industries@zefaza.com?subject=${subject}&body=${body}`;
  };

  return (
    <span className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 font-medium text-[var(--color-ink)] underline decoration-[var(--color-line)] underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
      >
        industries@zefaza.com
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-10 mt-2 w-64 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2 shadow-xl"
          >
            <div className="mb-2 px-2 text-xs font-semibold text-[var(--color-muted)]">Select your case type:</div>
            <div className="flex flex-col gap-1">
              {cases.map((c) => (
                <a
                  key={c}
                  href={getMailtoLink(c)}
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-2 py-2 text-left text-sm text-[var(--color-ink)] hover:bg-[var(--color-line)] transition-colors"
                >
                  {c}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
