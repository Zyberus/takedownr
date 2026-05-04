"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Save, CircleDollarSign, CheckCircle2, AlertCircle, TrendingUp, Zap } from "lucide-react";
import { firebaseAuth, firestore } from "@/lib/firebase-client";
import {
  applyPricingOverrides,
  buildPricingOverrideFromCases,
  caseTypes,
  type PricingOverride,
} from "@/lib/pricing-data";

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [pricingDraft, setPricingDraft] = useState<PricingOverride>(() =>
    buildPricingOverrideFromCases(caseTypes),
  );
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingMessage, setPricingMessage] = useState("");

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user || !authReady) return;

    const loadPricing = async () => {
      const snapshot = await getDoc(doc(firestore, "siteSettings", "pricing"));
      const prices = snapshot.data()?.prices as PricingOverride | undefined;
      if (prices) setPricingDraft(prices);
    };

    loadPricing();
  }, [user, authReady]);

  const savePricing = async () => {
    setSavingPricing(true);
    setPricingMessage("");
    try {
      await setDoc(
        doc(firestore, "siteSettings", "pricing"),
        {
          prices: pricingDraft,
          updatedAt: serverTimestamp(),
          updatedBy: user?.email ?? "admin",
        },
        { merge: true },
      );
      setPricingMessage("Pricing updated successfully");
      setTimeout(() => setPricingMessage(""), 3000);
    } catch {
      setPricingMessage("Failed to save pricing");
      setTimeout(() => setPricingMessage(""), 3000);
    } finally {
      setSavingPricing(false);
    }
  };

  const updatePrice = (caseId: string, planId: "standard" | "priority", value: string) => {
    setPricingDraft((current) => ({
      ...current,
      [caseId]: {
        ...current[caseId],
        [planId]: value === "" ? ("" as unknown as number) : Math.max(0, Number(value)),
      },
    }));
  };

  const pricedCases = applyPricingOverrides(pricingDraft);

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col relative"
    >
      <header className="flex items-start justify-between gap-4 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Pricing</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage live pricing plans and priority fees</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={savePricing}
          disabled={savingPricing}
          className="inline-flex items-center gap-2 px-5 py-2.5 border-none rounded-xl bg-zinc-900 text-white text-sm font-semibold cursor-pointer hover:bg-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900/20 disabled:opacity-50 shadow-sm"
        >
          {savingPricing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {savingPricing ? "Saving..." : "Save changes"}
        </motion.button>
      </header>

      <div className="h-14 mb-4">
        <AnimatePresence mode="wait">
          {pricingMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              className={`p-4 rounded-xl text-sm font-medium border flex items-center gap-3 ${
                pricingMessage.includes("success")
                  ? "bg-emerald-50/50 text-emerald-700 border-emerald-200"
                  : "bg-red-50/50 text-red-700 border-red-200"
              }`}
            >
              {pricingMessage.includes("success") ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {pricingMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden"
      >
        {/* Header Row */}
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr] gap-4 p-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-2">Service Type</div>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <TrendingUp size={14} className="text-zinc-400" />
            Standard
          </div>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap size={14} className="text-amber-500" />
            <span className="text-amber-700">Priority</span>
          </div>
        </div>

        <div className="divide-y divide-zinc-100">
          {pricedCases.map((caseType) => (
            <motion.div 
              variants={itemVariants}
              key={caseType.id} 
              className="group grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-4 md:gap-0 p-5 md:p-0 items-center hover:bg-zinc-50/50 transition-colors"
            >
              {/* Service Info */}
              <div className="flex items-center gap-3 md:p-5">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-zinc-200">
                  <CircleDollarSign size={16} />
                </div>
                <h2 className="text-sm font-semibold text-zinc-900">{caseType.short}</h2>
              </div>

              {/* Standard Input */}
              <div className="md:border-l border-zinc-100 md:p-5 flex items-center justify-center">
                <div className="relative group/input flex items-center w-full max-w-[140px]">
                  <span className="absolute left-3 text-zinc-400 text-sm font-medium pointer-events-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder=" "
                    value={pricingDraft[caseType.id]?.standard === ("" as unknown as number) ? "" : pricingDraft[caseType.id]?.standard ?? caseType.plans.find(p => p.id === 'standard')?.basePrice}
                    onChange={(e) => updatePrice(caseType.id, "standard", e.target.value)}
                    className="w-full text-sm font-bold text-center pl-7 pr-3 py-2.5 rounded-xl border border-transparent bg-transparent hover:bg-zinc-100 focus:bg-white focus:border-zinc-300 focus:ring-4 focus:ring-zinc-100 focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] placeholder:text-transparent text-zinc-900"
                  />
                </div>
              </div>

              {/* Priority Input */}
              <div className="md:border-l border-zinc-100 md:p-5 flex items-center justify-center">
                <div className="relative group/input flex items-center w-full max-w-[140px]">
                  <span className="absolute left-3 text-amber-500/70 text-sm font-medium pointer-events-none">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder=" "
                    value={pricingDraft[caseType.id]?.priority === ("" as unknown as number) ? "" : pricingDraft[caseType.id]?.priority ?? caseType.plans.find(p => p.id === 'priority')?.basePrice}
                    onChange={(e) => updatePrice(caseType.id, "priority", e.target.value)}
                    className="w-full text-sm font-bold text-center pl-7 pr-3 py-2.5 rounded-xl border border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] placeholder:text-transparent text-amber-900"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl mt-8"
      >
        <CircleDollarSign size={18} className="text-zinc-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-zinc-600 m-0">Changes save to Firestore and seamlessly update the public pricing page in real time without downtime.</p>
      </motion.div>
    </motion.div>
  );
}
