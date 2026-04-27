const statements = [
  "Confidential handling of all cases",
  "Structured review before submission",
  "Case tracking updates",
  "Refund if case cannot proceed",
];

export function TrustList() {
  return (
    <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {statements.map((statement) => (
        <li
          key={statement}
          className="py-5 text-base tracking-[-0.02em] text-[var(--color-ink)]"
        >
          {statement}
        </li>
      ))}
    </ul>
  );
}
