const tiers = [
  {
    name: "Free Review",
    price: "$0",
    description: "Initial review of eligibility, evidence completeness, and next-step fit.",
  },
  {
    name: "Standard Case",
    price: "$149",
    description: "Structured preparation and submission support for a single active case.",
  },
  {
    name: "Priority Case",
    price: "$249",
    description: "Expedited review queue with faster intake handling and update cadence.",
  },
];

export function PricingList() {
  return (
    <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className="grid gap-4 py-8 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 md:grid-cols-[1fr_auto] md:items-start"
        >
          <div className="max-w-xl">
            <h3 className="text-xl font-medium tracking-[-0.03em] text-[var(--color-ink)]">
              {tier.name}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {tier.description}
            </p>
          </div>
          <p className="text-lg font-medium tracking-[-0.03em] text-[var(--color-ink)]">
            {tier.price}
          </p>
        </div>
      ))}
    </div>
  );
}
