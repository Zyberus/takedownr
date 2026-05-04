"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Edit2, Trash2, Save, X, Clock, CheckCircle, AlertCircle, Package, Loader2, MoreVertical } from "lucide-react";
import { firebaseAuth, firestore } from "@/lib/firebase-client";

type CaseStatus = "pending" | "in_review" | "submitted" | "completed" | "rejected" | "refunded";

type TrackedCase = {
  id: string;
  trackingId: string;
  status: CaseStatus;
  caseType?: string;
  instagramUrl?: string;
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
};

const statusConfig: Record<
  CaseStatus,
  { label: string; icon: any; color: string; bgColor: string; borderColor: string; dotColor: string }
> = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    dotColor: "bg-amber-500",
  },
  in_review: {
    label: "In Review",
    icon: Loader2,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    dotColor: "bg-blue-500",
  },
  submitted: {
    label: "Submitted to Instagram",
    icon: Package,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    dotColor: "bg-purple-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    icon: AlertCircle,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    dotColor: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    icon: AlertCircle,
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    dotColor: "bg-orange-500",
  },
};

function formatDate(value?: any) {
  if (!value) return "Just now";
  return value.toDate().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function generateTrackingId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TDN-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function TrackingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cases, setCases] = useState<TrackedCase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [showDrawer, setShowDrawer] = useState(false);
  const [editingCase, setEditingCase] = useState<TrackedCase | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineNotes, setInlineNotes] = useState("");
  const [formData, setFormData] = useState({
    trackingId: "",
    status: "pending" as CaseStatus,
    caseType: "",
    instagramUrl: "",
    notes: "",
  });

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (showDrawer || editingCase)) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showDrawer, editingCase]);

  useEffect(() => {
    if (!user) return;

    const casesQuery = query(
      collection(firestore, "trackedCases"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribeCases = onSnapshot(casesQuery, (snapshot) => {
      setCases(
        snapshot.docs.map((item) => ({
          id: item.id,
          trackingId: item.id,
          ...(item.data() as Omit<TrackedCase, "id" | "trackingId">),
        })),
      );
    });

    return () => unsubscribeCases();
  }, [user]);

  const filteredCases = cases.filter((item) => {
    const queryText = searchQuery.trim().toLowerCase();
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (!queryText) return true;
    const haystack = [
      item.trackingId,
      item.caseType,
      item.instagramUrl,
      item.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(queryText);
  });

  const handleCreate = async () => {
    setIsSubmitting(true);
    const trackingId = formData.trackingId || generateTrackingId();
    try {
      await setDoc(doc(firestore, "trackedCases", trackingId), {
        trackingId,
        status: formData.status,
        caseType: formData.caseType,
        instagramUrl: formData.instagramUrl,
        notes: formData.notes,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setShowDrawer(false);
      setFormData({
        trackingId: "",
        status: "pending",
        caseType: "",
        instagramUrl: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Failed to create case. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCase) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(firestore, "trackedCases", editingCase.id), {
        status: formData.status,
        caseType: formData.caseType,
        instagramUrl: formData.instagramUrl,
        notes: formData.notes,
        updatedAt: serverTimestamp(),
      });
      setEditingCase(null);
      setFormData({
        trackingId: "",
        status: "pending",
        caseType: "",
        instagramUrl: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error updating case:", error);
      alert("Failed to update case. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: CaseStatus) => {
    try {
      await updateDoc(doc(firestore, "trackedCases", id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleInlineNotesSave = async (id: string) => {
    try {
      await updateDoc(doc(firestore, "trackedCases", id), {
        notes: inlineNotes,
        updatedAt: serverTimestamp(),
      });
      setInlineEditingId(null);
      setInlineNotes("");
    } catch (error) {
      console.error("Error updating notes:", error);
      alert("Failed to update notes. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    try {
      await deleteDoc(doc(firestore, "trackedCases", id));
    } catch (error) {
      console.error("Error deleting case:", error);
      alert("Failed to delete case. Please try again.");
    }
  };

  const openEditModal = (item: TrackedCase) => {
    setEditingCase(item);
    setFormData({
      trackingId: item.trackingId,
      status: item.status,
      caseType: item.caseType || "",
      instagramUrl: item.instagramUrl || "",
      notes: item.notes || "",
    });
  };

  const closeModal = () => {
    setShowDrawer(false);
    setEditingCase(null);
    setFormData({
      trackingId: "",
      status: "pending",
      caseType: "",
      instagramUrl: "",
      notes: "",
    });
  };

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col relative"
    >
      <header className="flex items-start justify-between gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Case Tracking</h1>
          <p className="text-sm text-zinc-500 mt-1">Create and manage case tracking IDs</p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-2 px-5 py-3 bg-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
        >
          <Plus size={18} />
          New Case
        </motion.button>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as CaseStatus | "all")}
              className="px-4 py-3 border border-zinc-200 rounded-xl bg-white text-sm text-zinc-800 font-medium cursor-pointer focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Tracking ID</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Case Type</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Instagram URL</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Notes</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Created</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCases.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-zinc-50 transition-colors group"
                >
                  <td className="py-4 px-6">
                    <span className="text-sm font-semibold text-zinc-900">{item.trackingId}</span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={item.status}
                      onChange={(e) => handleQuickStatusChange(item.id, e.target.value as CaseStatus)}
                      className={`text-sm font-medium border-0 bg-transparent focus:ring-0 cursor-pointer ${
                        statusConfig[item.status].color
                      }`}
                    >
                      {(Object.keys(statusConfig) as CaseStatus[]).map((status) => (
                        <option key={status} value={status}>
                          {statusConfig[status].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-zinc-700 capitalize">
                      {item.caseType?.replace(/_/g, " ") || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {item.instagramUrl ? (
                      <a
                        href={
                          item.instagramUrl.startsWith("http")
                            ? item.instagramUrl
                            : `https://${item.instagramUrl}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline max-w-[200px] block truncate"
                      >
                        {item.instagramUrl}
                      </a>
                    ) : (
                      <span className="text-sm text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {inlineEditingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inlineNotes}
                          onChange={(e) => setInlineNotes(e.target.value)}
                          className="w-40 px-2 py-1 border border-zinc-300 rounded text-sm focus:outline-none focus:border-zinc-900"
                          autoFocus
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleInlineNotesSave(item.id)}
                          className="p-1 text-zinc-500 hover:text-zinc-900"
                        >
                          <Save size={14} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setInlineEditingId(null);
                            setInlineNotes("");
                          }}
                          className="p-1 text-zinc-500 hover:text-red-600"
                        >
                          <X size={14} />
                        </motion.button>
                      </div>
                    ) : (
                      <div
                        className="text-sm text-zinc-600 line-clamp-1 max-w-[200px] cursor-pointer hover:text-zinc-900"
                        onClick={() => {
                          setInlineEditingId(item.id);
                          setInlineNotes(item.notes || "");
                        }}
                        title={item.notes}
                      >
                        {item.notes || "—"}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-zinc-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(item)}
                        className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filteredCases.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-zinc-500"
            >
              <Package size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium">No cases found</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {(showDrawer || editingCase) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={closeModal}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {editingCase ? "Edit Case" : "Create New Case"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    value={formData.trackingId}
                    onChange={(e) => setFormData({ ...formData, trackingId: e.target.value.toUpperCase() })}
                    placeholder={editingCase ? "" : "Auto-generated if empty"}
                    disabled={!!editingCase}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all disabled:bg-zinc-50 disabled:text-zinc-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(statusConfig) as CaseStatus[]).map((status) => (
                      <motion.button
                        key={status}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, status })}
                        className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          formData.status === status
                            ? `${statusConfig[status].borderColor} ${statusConfig[status].bgColor} ${statusConfig[status].color}`
                            : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                        }`}
                      >
                        {statusConfig[status].label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Case Type
                  </label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all bg-white"
                  >
                    <option value="">Select case type</option>
                    <option value="impersonation">Impersonation</option>
                    <option value="content">Unauthorized Content</option>
                    <option value="account">Account Deletion</option>
                    <option value="harassment">Harassment</option>
                    <option value="privacy">Privacy Violation</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {formData.status === "refunded" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Refund Reason
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g., Couldn't take down, refunded to original payment method"
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all"
                  />
                </div>

                {formData.status !== "refunded" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes about this case..."
                      rows={3}
                      className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 transition-all resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-zinc-200 bg-zinc-50">
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={editingCase ? handleUpdate : handleCreate}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingCase ? "Update" : "Create"}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
