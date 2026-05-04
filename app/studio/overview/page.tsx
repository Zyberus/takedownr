"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Sparkles, CheckCircle2, TrendingUp, Server, WalletCards, ArrowRight } from "lucide-react";
import { firebaseAuth, firestore } from "@/lib/firebase-client";
import Link from "next/link";

type ContactRequest = {
  id: string;
  status?: string;
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

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);

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
      limit(50),
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

  const stats = useMemo(() => {
    const newCount = contacts.filter((item) => item.status === "new" || !item.status).length;
    const reviewedCount = contacts.filter((item) => item.status === "reviewed").length;
    const closedCount = contacts.filter((item) => item.status === "closed").length;
    return [
      { label: "Total requests", value: contacts.length, icon: Inbox, color: "blue" },
      { label: "Needs review", value: newCount, icon: Sparkles, color: "amber" },
      { label: "Reviewed", value: reviewedCount, icon: CheckCircle2, color: "green" },
      { label: "Closed", value: closedCount, icon: TrendingUp, color: "gray" },
    ];
  }, [contacts]);

  const recentRequests = contacts.slice(0, 5);

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20",
    amber: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
    green: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
    gray: "bg-zinc-500/10 text-zinc-600 ring-1 ring-zinc-500/20",
  };

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

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-gray-100 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate percentages for simple horizontal progress bar chart
  const maxStat = Math.max(...stats.map(s => s.value), 1);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col relative"
    >
      <motion.header variants={itemVariants} className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-sm text-zinc-500 mt-1">Dashboard overview and key metrics</p>
        </div>
      </motion.header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color }, idx) => (
          <motion.div 
            variants={itemVariants}
            key={label}
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 30 } }}
            className="flex flex-col gap-4 p-5 border border-zinc-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Subtle background glow on hover */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${colorClasses[color as keyof typeof colorClasses].split(" ")[0]}`} />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-sm ${colorClasses[color as keyof typeof colorClasses]}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <div className="text-3xl font-semibold text-zinc-900 tracking-tight">{value}</div>
                <div className="text-xs text-zinc-500 mt-0.5 font-medium">{label}</div>
              </div>
            </div>
            
            {/* Inline Mini Chart representation */}
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden relative z-10 mt-1">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(value / maxStat) * 100}%` }}
                  transition={{ delay: 0.2 + (idx * 0.1), duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    color === 'blue' ? 'bg-blue-500' : 
                    color === 'amber' ? 'bg-amber-500' : 
                    color === 'green' ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`}
                />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <motion.div variants={itemVariants} className="border border-zinc-200 rounded-2xl bg-white p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900">Recent Requests</h2>
            <Link href="/studio/requests" className="group flex items-center gap-1 text-zinc-600 text-sm font-medium hover:text-zinc-900 transition-colors">
              View all
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <AnimatePresence>
              {recentRequests.length > 0 ? (
                recentRequests.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.05) }}
                    key={item.id} 
                    whileHover={{ scale: 1.01 }}
                    className="p-4 border border-zinc-100 rounded-xl bg-zinc-50/50 flex items-center justify-between hover:bg-zinc-50 hover:border-zinc-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === "new" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" : 
                        item.status === "reviewed" ? "bg-emerald-500" : "bg-zinc-300"
                      }`} />
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        item.status === "new"
                          ? "bg-blue-500/10 text-blue-700 border border-blue-500/20"
                          : item.status === "reviewed"
                          ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                          : "bg-zinc-100 text-zinc-600 border border-zinc-200/80"
                      }`}>
                        {item.status || "new"}
                      </span>
                    </div>
                    <span className="text-sm text-zinc-500 font-medium tabular-nums">{formatDate(item.createdAt)}</span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 rounded-xl border border-dashed border-zinc-200 text-zinc-500 text-sm font-medium bg-zinc-50/50 my-auto">
                  No recent requests
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="border border-zinc-200 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-zinc-900">Quick Actions</h2>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/studio/requests" className="group flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-blue-600 group-hover:bg-white group-hover:border-blue-200 group-hover:shadow-sm transition-all">
                  <Inbox size={18} />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">Review Requests</div>
                  <small className="text-xs text-zinc-500 mt-0.5 max-w-[180px] truncate">Manage incoming takedowns</small>
                </div>
              </Link>
              <Link href="/studio/health" className="group flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-emerald-600 group-hover:bg-white group-hover:border-emerald-200 group-hover:shadow-sm transition-all">
                  <Server size={18} />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-zinc-900 group-hover:text-emerald-600 transition-colors">System Health</div>
                  <small className="text-xs text-zinc-500 mt-0.5 max-w-[180px] truncate">Check agent and API status</small>
                </div>
              </Link>
              <Link href="/studio/pricing" className="group flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 group-hover:text-amber-600 group-hover:bg-white group-hover:border-amber-200 group-hover:shadow-sm transition-all">
                  <WalletCards size={18} />
                </div>
                <div className="flex flex-col">
                  <div className="text-sm font-semibold text-zinc-900 group-hover:text-amber-600 transition-colors">Pricing Setup</div>
                  <small className="text-xs text-zinc-500 mt-0.5 max-w-[180px] truncate">Manage product catalogs</small>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
