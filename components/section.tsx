import type { ReactNode } from "react";

export function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="section-space">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 sm:px-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:px-12">
        <div className="max-w-sm">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2 className="section-title">{title}</h2>
          {description ? <p className="section-copy">{description}</p> : null}
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
}
