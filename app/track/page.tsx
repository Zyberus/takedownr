"use client";

import { useState } from "react";
import { SiteShell } from "@/components/site-shell";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase-client";

type CaseStatus = "pending" | "in_review" | "submitted" | "completed" | "rejected" | "refunded";

type TrackedCase = {
  id: string;
  trackingId: string;
  status: CaseStatus;
  caseType?: string;
  instagramUrl?: string;
  createdAt?: any;
  updatedAt?: any;
  notes?: string;
};

const statusConfig: Record<
  CaseStatus,
  { label: string; color: string; bgColor: string; borderColor: string; step: number; primaryColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    step: 1,
    primaryColor: "bg-orange-500",
  },
  in_review: {
    label: "In Review",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    step: 2,
    primaryColor: "bg-blue-500",
  },
  submitted: {
    label: "Submitted",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    step: 3,
    primaryColor: "bg-sky-500",
  },
  completed: {
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    step: 4,
    primaryColor: "bg-green-500",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    step: 0,
    primaryColor: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    step: 0,
    primaryColor: "bg-orange-500",
  },
};

const stages = [
  { key: "pending" as CaseStatus, label: "Pending", description: "Case submitted & waiting" },
  { key: "in_review" as CaseStatus, label: "In Review", description: "Team reviewing details" },
  { key: "submitted" as CaseStatus, label: "Submitted", description: "Sent to Instagram" },
  { key: "completed" as CaseStatus, label: "Completed", description: "Takedown successful" },
];

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [caseData, setCaseData] = useState<TrackedCase | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError("");
    setCaseData(null);

    try {
      const docRef = doc(firestore, "trackedCases", trackingId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        setCaseData({
          id: docSnap.id,
          trackingId: data.trackingId || docSnap.id,
          status: data.status,
          caseType: data.caseType,
          instagramUrl: data.instagramUrl,
          notes: data.notes,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        const q = query(
          collection(firestore, "trackedCases"),
          where("trackingId", "==", trackingId.trim())
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data() as any;
          setCaseData({
            id: doc.id,
            trackingId: data.trackingId || doc.id,
            status: data.status,
            caseType: data.caseType,
            instagramUrl: data.instagramUrl,
            notes: data.notes,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        } else {
          setError("No case found with this tracking ID.");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: any) => {
    if (!value) return "—";
    return value.toDate().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <SiteShell ctaHref="/contact" ctaLabel="Contact Us">
      <section className="min-h-[70vh] py-12 md:py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold text-zinc-900 mb-3 tracking-tight">
              Track Your Case
            </h1>
            <p className="text-base md:text-lg text-zinc-600">
              Enter your tracking ID to check your case status
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="Tracking ID"
                className="flex-1 px-4 py-3.5 text-base border border-zinc-300 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3.5 text-base bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : "Track"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {caseData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-zinc-200 rounded-lg bg-white overflow-hidden"
              >
                <div className="p-6 border-b border-zinc-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Tracking ID</p>
                      <p className="text-2xl font-semibold text-zinc-900">{caseData.trackingId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[caseData.status].bgColor} ${statusConfig[caseData.status].color} border ${statusConfig[caseData.status].borderColor}`}>
                      {statusConfig[caseData.status].label}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {caseData.status !== "rejected" && caseData.status !== "refunded" && (
                    <div className="mb-8">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-6">Progress</p>
                      <div className="relative">
                        <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 -translate-y-1/2 rounded-full bg-zinc-100 shadow-inner" />
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: (statusConfig[caseData.status].step - 1) / 3 }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                          style={{ transformOrigin: "left" }}
                          className={`absolute top-4 left-[12.5%] right-[12.5%] h-1 -translate-y-1/2 rounded-full ${statusConfig[caseData.status].primaryColor}`}
                        />
                        <motion.div
                          initial={{ opacity: 0, x: 0 }}
                          animate={{
                            opacity: [0, 1, 0],
                            x: `${((statusConfig[caseData.status].step - 1) / 3) * 300}%`,
                          }}
                          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`absolute top-4 left-[12.5%] h-2 w-8 -translate-y-1/2 rounded-full blur-md ${statusConfig[caseData.status].primaryColor}`}
                        />
                        <div className="relative flex justify-between items-start">
                          {stages.map((stage, index) => {
                            const isCurrent = caseData.status === stage.key;
                            const isPast = statusConfig[caseData.status].step > statusConfig[stage.key].step;

                            return (
                              <div key={stage.key} className="flex flex-col items-center gap-3 flex-1">
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: index * 0.1, duration: 0.3 }}
                                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                    isPast
                                      ? "bg-green-500 border-green-500"
                                      : isCurrent
                                      ? `${statusConfig[caseData.status].primaryColor} border-white shadow-lg shadow-${statusConfig[caseData.status].primaryColor.replace("bg-", "")}/30`
                                      : "bg-white border-zinc-300"
                                  }`}
                                >
                                  {isPast ? (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                                    >
                                      <CheckCircle size={16} className="text-white" />
                                    </motion.div>
                                  ) : isCurrent ? (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                      className="w-3 h-3 rounded-full bg-white"
                                    />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                  )}
                                </motion.div>
                                <div className="text-center">
                                  <span
                                    className={`text-xs font-medium block ${
                                      isPast
                                        ? "text-emerald-600"
                                        : isCurrent
                                        ? statusConfig[caseData.status].color
                                        : "text-zinc-400"
                                    }`}
                                  >
                                    {stage.label}
                                  </span>
                                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                                    {stage.description}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {caseData.status === "completed" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      <CheckCircle size={20} className="text-emerald-600" />
                      <span className="font-medium text-emerald-800">Your case has been completed successfully.</span>
                    </motion.div>
                  )}

                  {caseData.status === "in_review" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <Clock size={20} className="text-blue-600" />
                      <span className="font-medium text-blue-800">Your case is currently under review.</span>
                    </motion.div>
                  )}

                  {caseData.status === "rejected" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
                    >
                      <AlertCircle size={20} className="text-red-600" />
                      <span className="font-medium text-red-800">Your case has been rejected.</span>
                    </motion.div>
                  )}

                  {caseData.status === "refunded" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <AlertCircle size={20} className="text-orange-600" />
                      <span className="font-medium text-orange-800">
                        {caseData.notes || "We couldn't take it down. Refunded back to original payment method."}
                      </span>
                    </motion.div>
                  )}

                  {caseData.caseType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Case Type</p>
                      <p className="text-zinc-900">{caseData.caseType.replace(/_/g, " ")}</p>
                    </motion.div>
                  )}

                  {caseData.instagramUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.3 }}
                    >
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Instagram URL</p>
                      <a
                        href={
                          caseData.instagramUrl.startsWith("http")
                            ? caseData.instagramUrl
                            : `https://${caseData.instagramUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                      >
                        {caseData.instagramUrl}
                      </a>
                    </motion.div>
                  )}

                  {caseData.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Notes</p>
                      <p className="text-zinc-700">{caseData.notes}</p>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.3 }}
                    className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200"
                  >
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Created</p>
                      <p className="text-zinc-900">{formatDate(caseData.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Updated</p>
                      <p className="text-zinc-900">{formatDate(caseData.updatedAt)}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!caseData && !error && (
            <div className="text-center py-12 text-zinc-400">
              <p>Enter your tracking ID above to get started.</p>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
