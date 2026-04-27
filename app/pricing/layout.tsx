import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Instagram Takedown Pricing — Content Removal & Account Deletion Plans",
  description:
    "Transparent pricing for Instagram takedown services. Remove unauthorized photos & reels from $149. Delete fake Instagram accounts from $179. Priority same-day intake available. Free case review. Full refund guarantee if removal fails.",
  alternates: {
    canonical: "https://takedownr.com/pricing",
  },
  openGraph: {
    title:
      "Instagram Takedown Pricing — Professional Content Removal Plans | Takedownr",
    description:
      "Affordable Instagram content removal & account deletion pricing. Standard from $149, Priority from $249. Free review, refund guarantee. One-time fees, no subscriptions.",
    url: "https://takedownr.com/pricing",
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
