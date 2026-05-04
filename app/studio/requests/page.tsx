"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { firebaseAuth, firestore } from "@/lib/firebase-client";

type ContactRequest = {
  id: string;
  name?: string;
  email?: string;
  instagramUrl?: string;
  issueType?: string;
  description?: string;
  status?: string;
  source?: string;
  intakeSummary?: {
    country?: string;
    contactMethod?: string;
    contactValue?: string;
    instagramUrl?: string;
    caseType?: string;
    messageCount?: number;
  };
  createdAt?: any;
};

function formatDate(value?: any) {
  if (!value) return "Just now";
  return value.toDate().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RequestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "reviewed" | "closed">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "chat-assistant" | "contact-form">("all");

  useEffect(() => {
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const contactsQuery = query(
      collection(firestore, "contactRequests"),
      orderBy("createdAt", "desc"),
      limit(100),
    );

    const unsubscribeContacts = onSnapshot(contactsQuery, (snapshot) => {
      setContacts(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<ContactRequest, "id">),
        })),
      );
    });

    return () => unsubscribeContacts();
  }, [user]);

  const filteredContacts = useMemo(() => {
    const queryText = searchQuery.trim().toLowerCase();
    return contacts.filter((item) => {
      const itemStatus = item.status ?? "new";
      if (statusFilter !== "all" && itemStatus !== statusFilter) return false;
      if (sourceFilter !== "all" && item.source !== sourceFilter) return false;
      if (!queryText) return true;
      const haystack = [
        item.name,
        item.email,
        item.instagramUrl,
        item.issueType,
        item.description,
        item.intakeSummary?.country,
        item.intakeSummary?.caseType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(queryText);
    });
  }, [contacts, searchQuery, statusFilter, sourceFilter]);

  const updateContactStatus = async (id: string, status: string) => {
    await updateDoc(doc(firestore, "contactRequests", id), {
      status,
      updatedAt: serverTimestamp(),
    });
  };

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
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "tween", duration: 0.2 } }
  };

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
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Requests</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage incoming takedown requests</p>
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        className="border border-zinc-200 rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="grid md:grid-cols-[1fr_160px_160px] gap-4 mb-6">
          <div className="flex items-center gap-3 px-4 py-2.5 border border-zinc-200 hover:border-zinc-300 focus-within:border-zinc-800 focus-within:ring-1 focus-within:ring-zinc-800/20 rounded-xl bg-white transition-all shadow-sm">
            <Search size={18} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent text-sm text-zinc-900 w-full focus:outline-none placeholder:text-zinc-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="col-span-1 px-4 py-2.5 border border-zinc-200 hover:border-zinc-300 rounded-xl bg-zinc-50 text-sm text-zinc-800 font-medium cursor-pointer focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800/20 transition-all shadow-sm"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as typeof sourceFilter)}
             className="col-span-1 px-4 py-2.5 border border-zinc-200 hover:border-zinc-300 rounded-xl bg-zinc-50 text-sm text-zinc-800 font-medium cursor-pointer focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800/20 transition-all shadow-sm"
          >
            <option value="all">All sources</option>
            <option value="chat-assistant">Chat assistant</option>
            <option value="contact-form">Contact</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-100 bg-zinc-50/50 shadow-inner">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100/50 border-b border-zinc-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">User Details</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Request Information</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Source</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="right py-3 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <AnimatePresence>
            <motion.tbody 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-white"
            >
              {filteredContacts.map((item) => (
                <motion.tr 
                  variants={itemVariants}
                  layoutId={item.id}
                  key={item.id} 
                  className="border-b border-zinc-100 last:border-none hover:bg-zinc-50/80 transition-colors group align-top"
                >
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === "new" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : 
                        item.status === "reviewed" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-zinc-300"
                      }`} />
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.status === "new"
                          ? "bg-blue-50 text-blue-700 border border-blue-200/50"
                          : item.status === "reviewed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200/80"
                      }`}>
                        {item.status || "new"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-zinc-900 break-words">{item.name || "Anonymous"}</span>
                      <div className="flex flex-col gap-1 mt-0.5">
                        {item.email && !item.intakeSummary?.contactValue ? (
                          <div className="text-xs text-zinc-600 flex items-center gap-1">
                            <span className="font-semibold text-zinc-400">Email:</span>
                            <a href={`mailto:${item.email}`} className="hover:text-blue-600 truncate max-w-[150px]">{item.email}</a>
                          </div>
                        ) : null}
                        {item.intakeSummary?.contactValue ? (
                          <div className="text-xs text-zinc-600 flex items-center gap-1 truncate max-w-[200px]">
                            <span className="font-semibold text-zinc-400 capitalize">{item.intakeSummary.contactMethod || "Contact"}:</span>
                            <span className="truncate">{item.intakeSummary.contactValue}</span>
                          </div>
                        ) : null}
                      </div>
                      {item.intakeSummary?.country && (
                        <span className="text-[10px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded w-fit mt-0.5">
                          {item.intakeSummary.country}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-semibold text-zinc-800">{item.issueType || "—"}</span>
                      {item.description && (
                        <p className="text-xs text-zinc-600 line-clamp-2 max-w-[300px]" title={item.description}>
                          {item.description}
                        </p>
                      )}
                      {item.instagramUrl && (
                        <a href={item.instagramUrl.startsWith('http') ? item.instagramUrl : `https://${item.instagramUrl}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline w-fit max-w-[200px] truncate" onClick={e => e.stopPropagation()}>
                          {item.instagramUrl}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                      <span className="bg-zinc-100 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide text-zinc-600 border border-zinc-200/50">
                        {item.source || "—"}
                      </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-zinc-500 whitespace-nowrap tabular-nums">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-right">
                    <div className="flex gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => updateContactStatus(item.id, "new")}
                        className="px-2.5 py-1 border border-zinc-200 rounded text-xs font-medium text-zinc-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50 transition-all focus:outline-none"
                      >
                        New
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => updateContactStatus(item.id, "reviewed")}
                        className="px-2.5 py-1 border border-zinc-200 rounded text-xs font-medium text-zinc-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all focus:outline-none"
                      >
                        Reviewed
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => updateContactStatus(item.id, "closed")}
                        className="px-2.5 py-1 border border-zinc-200 rounded text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-100 transition-all focus:outline-none"
                      >
                        Closed
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
            </AnimatePresence>
          </table>
          {filteredContacts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-12 bg-white text-zinc-500 text-sm font-medium"
            >
              No requests match your filters
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
