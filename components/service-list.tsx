const services = [
  {
    title: "Remove non-consensual Instagram content",
    description:
      "Structured preparation for reports involving private, intimate, or exploitative content.",
  },
  {
    title: "Report impersonation accounts",
    description:
      "Clear submission support for accounts misusing identity, likeness, or reputation.",
  },
  {
    title: "Evidence review and structured submission",
    description:
      "Case materials reviewed before action to reduce ambiguity and improve submission quality.",
  },
];

export function ServiceList() {
  return (
    <div className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {services.map((service) => (
        <div key={service.title} className="grid gap-4 py-8 md:grid-cols-[1.2fr_1fr] md:gap-8">
          <h3 className="text-xl font-medium tracking-[-0.03em] text-[var(--color-ink)]">
            {service.title}
          </h3>
          <p className="max-w-md text-sm leading-7 text-[var(--color-muted)]">
            {service.description}
          </p>
        </div>
      ))}
    </div>
  );
}
