"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Inbox,
  Server,
  WalletCards,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase-client";

const navItems = [
  { href: "/studio/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/studio/requests", label: "Requests", icon: Inbox },
  { href: "/studio/health", label: "API Health", icon: Server },
  { href: "/studio/pricing", label: "Pricing", icon: WalletCards },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 border-none">
      <div className="grid md:grid-cols-[260px_1fr] min-h-screen">
        <aside className="border-r border-gray-200 bg-white flex flex-col sticky top-0 h-screen shadow-sm">
          <div className="px-6 py-6 border-b border-gray-100 flex items-center gap-3">
            <div className="flex items-center justify-center bg-zinc-900 text-white rounded-lg w-10 h-10 shadow-md">
              <ShieldCheck size={22} className="text-zinc-50" />
            </div>
            <div>
              <h2 className="m-0 text-base font-semibold text-zinc-900 tracking-tight">Takedownr</h2>
              <p className="m-0 mt-0.5 text-xs text-zinc-500 font-medium">Admin Console</p>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className="relative outline-none">
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-zinc-900 rounded-xl shadow-md"
                      initial={false}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <motion.div 
                    whileHover={{ scale: isActive ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium z-10 transition-colors ${
                      isActive ? "text-white" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    <Icon size={18} className={isActive ? "text-zinc-50" : "text-zinc-400"} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-xl bg-transparent text-red-600 text-sm font-medium cursor-pointer hover:bg-red-50 transition-colors"
              onClick={() => signOut(firebaseAuth)}
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </motion.button>
          </div>
        </aside>
        
        <main className="px-6 py-8 md:px-10 md:py-10 max-w-6xl mx-auto w-full relative">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
