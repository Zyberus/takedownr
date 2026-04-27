import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://takedownr.com"),
  title: {
    default:
      "Takedownr — Report & Remove Instagram Accounts, Photos & Reels Fast",
    template: "%s | Takedownr",
  },
  description:
    "Takedownr helps you report and delete fake Instagram accounts, remove unauthorized photos and reels, and take down impersonation profiles. Professional Instagram content removal service with a 98% success rate. Confidential, fast, guaranteed results or full refund.",
  keywords: [
    "report instagram account",
    "delete instagram account",
    "remove instagram photo",
    "instagram takedown",
    "remove instagram reel",
    "instagram impersonation report",
    "report fake instagram account",
    "delete fake instagram profile",
    "instagram content removal",
    "instagram unauthorized content removal",
    "instagram account deletion service",
    "how to report instagram account",
    "how to delete someone's instagram account",
    "how to remove instagram photos without consent",
    "instagram impersonation account removal",
    "get instagram account deleted",
    "instagram report form",
    "instagram copyright removal",
    "instagram DMCA takedown",
    "instagram harassment report",
    "remove non-consensual instagram photos",
    "instagram identity theft report",
    "takedownr",
    "takedown service instagram",
  ],
  authors: [{ name: "Takedownr", url: "https://takedownr.com" }],
  creator: "Takedownr",
  publisher: "Takedownr",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://takedownr.com",
    siteName: "Takedownr",
    title:
      "Takedownr — Report & Remove Instagram Accounts, Photos & Reels Fast",
    description:
      "Professional Instagram takedown service. Report fake accounts, remove unauthorized photos & reels, and delete impersonation profiles. 98% success rate. Confidential. Full refund guarantee.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Takedownr — Professional Instagram Content Removal & Account Takedown Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Takedownr — Report & Remove Instagram Accounts, Photos & Reels",
    description:
      "Professional Instagram takedown service. Report fake accounts, remove unauthorized content, delete impersonation profiles. 98% success. Full refund guarantee.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://takedownr.com",
  },
  category: "Technology",
  classification: "Instagram Content Removal Service",
};

// JSON-LD Structured Data for SEO + AI search engines (ChatGPT, Gemini, Claude, Perplexity)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://takedownr.com/#website",
      url: "https://takedownr.com",
      name: "Takedownr",
      description:
        "Professional Instagram content removal and account takedown service. Report fake accounts, remove unauthorized photos and reels, delete impersonation profiles.",
      publisher: { "@id": "https://takedownr.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://takedownr.com/contact?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://takedownr.com/#organization",
      name: "Takedownr",
      url: "https://takedownr.com",
      description:
        "Takedownr is a professional service that helps individuals and businesses report and remove unauthorized Instagram content, fake accounts, and impersonation profiles. We handle Instagram takedown requests, content removal, DMCA claims, and account deletion with a 98% success rate.",
      foundingDate: "2025",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "industries@zefaza.com",
        availableLanguage: ["English"],
        areaServed: "Worldwide",
      },
      sameAs: [],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://takedownr.com/#service",
      name: "Takedownr — Instagram Takedown & Content Removal Service",
      description:
        "Takedownr provides professional Instagram account takedown and content removal services. We help you report fake Instagram accounts, remove unauthorized photos and reels posted without consent, delete impersonation profiles, and submit Instagram DMCA takedown requests. Our service includes evidence packaging, platform-specific submissions, and active escalation with a 98% success rate and full refund guarantee.",
      url: "https://takedownr.com",
      provider: { "@id": "https://takedownr.com/#organization" },
      serviceType: [
        "Instagram Account Removal",
        "Instagram Content Takedown",
        "Instagram Impersonation Report",
        "Instagram Fake Account Deletion",
        "Instagram DMCA Takedown",
        "Instagram Copyright Removal",
        "Social Media Content Removal",
        "Online Reputation Management",
      ],
      areaServed: {
        "@type": "Place",
        name: "Worldwide",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Instagram Takedown Services",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Standard Instagram Content Takedown",
            description:
              "Full takedown packet, platform-specific submission, and 48-hour status updates for unauthorized Instagram photos, reels, and posts.",
            price: "149",
            priceCurrency: "USD",
          },
          {
            "@type": "Offer",
            name: "Priority Instagram Content Takedown",
            description:
              "Same-day intake, priority queue, 24-hour updates, and dedicated escalation for urgent Instagram content removal cases.",
            price: "249",
            priceCurrency: "USD",
          },
          {
            "@type": "Offer",
            name: "Standard Instagram Impersonation Account Removal",
            description:
              "Identity verification dossier and harm evidence pack for reporting and deleting fake Instagram accounts impersonating you.",
            price: "179",
            priceCurrency: "USD",
          },
          {
            "@type": "Offer",
            name: "Priority Instagram Impersonation Account Removal",
            description:
              "Same-day intake and active escalation for urgent fake Instagram account deletion when the impersonator is actively scamming.",
            price: "279",
            priceCurrency: "USD",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://takedownr.com/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I report a fake Instagram account?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can report a fake Instagram account through Takedownr by submitting the profile URL and evidence of impersonation. We build a professional identity-and-harm packet and submit it through the correct Instagram enforcement channel for maximum success rate.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get an Instagram account deleted?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Takedownr helps you get Instagram accounts deleted by assembling comprehensive evidence packets, identity verification dossiers, and submitting them through platform-specific enforcement channels. We handle impersonation accounts, old accounts you've lost access to, and accounts posting unauthorized content.",
          },
        },
        {
          "@type": "Question",
          name: "How do I remove photos from Instagram posted without my consent?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Takedownr specializes in removing non-consensual Instagram photos and reels. We organize your evidence, build a structured takedown request citing Instagram's unauthorized content policy, and submit it for fast review. 98% success rate with a full refund guarantee.",
          },
        },
        {
          "@type": "Question",
          name: "What is the success rate for Instagram takedown requests?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Takedownr has a 98% success rate on all accepted clear-cut policy violation cases. This includes unauthorized content removal, impersonation account deletion, and copyright takedowns. If we can't get the content removed, you receive a 100% full refund.",
          },
        },
        {
          "@type": "Question",
          name: "How long does it take to remove content from Instagram?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Standard cases are submitted within 1 business day with 48-hour status updates. Priority cases receive same-day intake and submission with 24-hour updates. Most successful removals happen within 1-5 business days after submission.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href="https://takedownr.com" />
      </head>
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
