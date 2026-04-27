import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact — Start a Confidential Instagram Takedown Request",
  description:
    "Submit a confidential Instagram takedown request. Report fake Instagram accounts, request removal of unauthorized photos and reels, or get impersonation profiles deleted. Response within 24 hours. Encrypted, human-reviewed intake process.",
  alternates: {
    canonical: "https://takedownr.com/contact",
  },
  openGraph: {
    title:
      "Start an Instagram Takedown Request — Confidential Intake | Takedownr",
    description:
      "Submit your Instagram takedown case confidentially. Report fake accounts, unauthorized photos, impersonation profiles. 24-hour response, encrypted, human-reviewed.",
    url: "https://takedownr.com/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
