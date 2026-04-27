"use client";

import { motion } from "framer-motion";

const issueTypes = [
  "Non-consensual Instagram content",
  "Instagram impersonation account",
  "Old Instagram account deletion",
  "Instagram evidence review",
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function ContactForm() {
  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.04,
          },
        },
      }}
      className="form-stack"
      action="#"
      method="post"
    >
      <motion.div variants={fadeUp} className="form-row-2">
        <label className="field">
          <span>Name</span>
          <input type="text" name="name" autoComplete="name" placeholder="Full name" required />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" autoComplete="email" placeholder="you@email.com" required />
        </label>
      </motion.div>
      <motion.div variants={fadeUp} className="form-row-2">
        <label className="field">
          <span>Instagram URL</span>
          <input
            type="url"
            name="instagramUrl"
            placeholder="https://instagram.com/..."
            required
          />
        </label>
        <label className="field">
          <span>Issue type</span>
          <select name="issueType" defaultValue={issueTypes[0]} required>
            {issueTypes.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </select>
        </label>
      </motion.div>
      <motion.label variants={fadeUp} className="field">
        <span>What happened?</span>
        <textarea
          name="description"
          rows={4}
          placeholder="Briefly describe the situation - the account, the content, and any urgency."
          required
        />
      </motion.label>
      <motion.button
        variants={fadeUp}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="button-primary form-submit"
      >
        Submit confidential request
      </motion.button>
    </motion.form>
  );
}
