import type { ElementType } from "react";
import { ImageOff, KeyRound, UserX } from "lucide-react";

export type PlanId = "standard" | "priority";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  bestFor: string;
  basePrice: number;
  suffix: string;
  features: string[];
  cta: string;
  popular: boolean;
};

export type CaseType = {
  id: string;
  label: string;
  short: string;
  description: string;
  icon: ElementType;
  plans: [Plan, Plan];
};

export type PricingOverride = Record<string, Partial<Record<PlanId, number>>>;

export const caseTypes: CaseType[] = [
  {
    id: "content",
    label: "Instagram reel or photo posted without consent",
    short: "Non-consensual Instagram content",
    description:
      "Professional Instagram content removal pathway for reels, posts, or photos uploaded without your permission — built around Instagram's unauthorized-content policy for maximum takedown success.",
    icon: ImageOff,
    plans: [
      {
        id: "standard",
        name: "Standard Case",
        tagline: "The methodical path: complete packet, platform submission, calm cadence.",
        bestFor: "One piece of content. No active spread. You can wait 1–2 business days for movement.",
        basePrice: 149,
        suffix: "one-time, per case",
        features: [
          "Tailored takedown packet",
          "Platform-specific submission",
          "Status updates every 48h",
          "One revision round included",
          "Eligibility & evidence audit",
        ],
        cta: "Start this case",
        popular: false,
      },
      {
        id: "priority",
        name: "Priority Case",
        tagline: "When time matters: same-day intake and active escalation pressure.",
        bestFor: "Content is spreading, being re-uploaded, or screen-recorded. You need movement today.",
        basePrice: 249,
        suffix: "one-time, per case",
        features: [
          "Same-day intake & submission",
          "Priority queue placement",
          "Status updates every 24h",
          "Unlimited revisions",
          "Multi-platform coordination",
          "Dedicated escalation playbook",
        ],
        cta: "Open priority case",
        popular: true,
      },
    ],
  },
  {
    id: "impersonator",
    label: "Delete a fake Instagram impersonation account",
    short: "Instagram impersonator",
    description:
      "Identity-and-harm packet engineered to get fake Instagram accounts reported and deleted — the cleanest path to Instagram impersonation enforcement.",
    icon: UserX,
    plans: [
      {
        id: "standard",
        name: "Standard Case",
        tagline: "Full identity-and-deception packet, submitted through the right channel.",
        bestFor: "The fake exists but isn't actively scamming yet. You want it gone, not chased.",
        basePrice: 179,
        suffix: "one-time, per account",
        features: [
          "Identity verification dossier",
          "Harm & deception evidence pack",
          "Direct platform submission",
          "Status updates every 48h",
          "One revision round included",
        ],
        cta: "Start this case",
        popular: false,
      },
      {
        id: "priority",
        name: "Priority Case",
        tagline: "When the impersonator is active: scamming, DMing your circle, or growing fast.",
        bestFor: "Active impersonation harm — financial, reputational, or social. Speed is the point.",
        basePrice: 279,
        suffix: "one-time, per account",
        features: [
          "Same-day intake & submission",
          "Priority queue placement",
          "Status updates every 24h",
          "Unlimited revisions",
          "Multi-account coordination",
          "Dedicated escalation playbook",
        ],
        cta: "Open priority case",
        popular: true,
      },
    ],
  },
  {
    id: "account",
    label: "Delete an old Instagram account you can't access",
    short: "Old Instagram account",
    description:
      "For Instagram accounts you no longer have access to — old logins holding your photos, videos, or identity. We assemble the ownership and Instagram account deletion request.",
    icon: KeyRound,
    plans: [
      {
        id: "standard",
        name: "Standard Case",
        tagline: "Ownership-and-deletion packet for a dormant, recoverable old account.",
        bestFor: "Account is dormant. The media inside isn't actively spreading. You want it closed cleanly.",
        basePrice: 199,
        suffix: "one-time, per account",
        features: [
          "Ownership proof packet",
          "Account deletion submission",
          "Recovery pathway documentation",
          "Status updates every 48h",
          "One revision round included",
        ],
        cta: "Start this case",
        popular: false,
      },
      {
        id: "priority",
        name: "Priority Case",
        tagline: "When the dormant account holds sensitive media or is being actively misused.",
        bestFor: "Old account is leaking or being accessed by someone else. Sensitive photos or videos involved.",
        basePrice: 299,
        suffix: "one-time, per account",
        features: [
          "Same-day intake & submission",
          "Priority queue placement",
          "Status updates every 24h",
          "Unlimited revisions",
          "Sensitive-media handling protocol",
          "Dedicated escalation playbook",
        ],
        cta: "Open priority case",
        popular: true,
      },
    ],
  },
];

export function applyPricingOverrides(overrides: PricingOverride | null): CaseType[] {
  if (!overrides) return caseTypes;

  return caseTypes.map((caseType) => ({
    ...caseType,
    plans: caseType.plans.map((plan) => ({
      ...plan,
      basePrice: overrides[caseType.id]?.[plan.id] ?? plan.basePrice,
    })) as [Plan, Plan],
  }));
}

export function buildPricingOverrideFromCases(cases: CaseType[]): PricingOverride {
  return cases.reduce<PricingOverride>((acc, caseType) => {
    acc[caseType.id] = caseType.plans.reduce<Partial<Record<PlanId, number>>>((plans, plan) => {
      plans[plan.id] = plan.basePrice;
      return plans;
    }, {});
    return acc;
  }, {});
}
