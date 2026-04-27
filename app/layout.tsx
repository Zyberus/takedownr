import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://takedownr.com"),
  title: {
    default: "Takedownrr",
    template: "%s | Takedownrr",
  },
  description:
    "Animated modern landing site for confidential Instagram takedowns, unauthorized content removal, and impersonation account reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
