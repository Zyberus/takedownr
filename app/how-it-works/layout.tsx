import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "How Instagram Takedowns Work — Report & Remove Accounts, Photos & Reels",
  description:
    "Step-by-step guide on how to report a fake Instagram account, remove unauthorized photos and reels, and delete impersonation profiles. Learn how Takedownr's professional Instagram content removal process works.",
  alternates: {
    canonical: "https://takedownr.com/how-it-works",
  },
  openGraph: {
    title:
      "How Instagram Takedowns Work — Step-by-Step Removal Process | Takedownr",
    description:
      "Learn how to report and remove fake Instagram accounts, unauthorized photos, and impersonation profiles. Professional step-by-step Instagram takedown process.",
    url: "https://takedownr.com/how-it-works",
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
