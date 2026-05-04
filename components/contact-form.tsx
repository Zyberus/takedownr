"use client";

import { motion } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { firestore } from "@/lib/firebase-client";

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
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
      issueType: String(formData.get("issueType") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      status: "new",
      source: "contact-form",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(firestore, "contactRequests"), payload);
      form.reset();
      setStatus("success");
      setMessage("Request received. We'll review it and respond within 24 hours.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please email industries@zefaza.com directly.");
    }
  };

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
      onSubmit={handleSubmit}
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
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Submit confidential request"}
      </motion.button>
      {message ? (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`form-status form-status-${status}`}
        >
          {message}
        </motion.p>
      ) : null}
    </motion.form>
  );
}
