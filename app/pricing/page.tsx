import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/lib/firebase-client";
import { PricingClient } from "./PricingClient";
import type { PricingOverride } from "@/lib/pricing-data";

// This makes the page dynamic so it fetches fresh pricing on every request
// or you can set a revalidation time like 3600 for 1 hour cache.
export const revalidate = 0; 

async function getInitialPricing(): Promise<PricingOverride | null> {
  try {
    const snapshot = await getDoc(doc(firestore, "siteSettings", "pricing"));
    if (snapshot.exists()) {
      return (snapshot.data()?.prices as PricingOverride) ?? null;
    }
  } catch (error) {
    console.error("Error fetching initial pricing on server:", error);
  }
  return null;
}

export default async function PricingPage() {
  const initialPricing = await getInitialPricing();
  
  return <PricingClient initialPricing={initialPricing} />;
}
