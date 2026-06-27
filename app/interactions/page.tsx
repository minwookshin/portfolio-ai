import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InteractionsPage from "@/components/InteractionsPage";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl, collectionPageJsonLd } from "@/lib/seo";

const description = "Live interaction systems behind Minwook Shin's outline operating-system portfolio.";
const url = absoluteUrl("/interactions");
const showDraftInteractions =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_INTERACTIONS === "true";

const interactionItems = [
  {
    name: "dot to arrow",
    description: "outline signal grammar for links and expandable sections",
    url: absoluteUrl("/interactions#dot-to-arrow"),
  },
  {
    name: "glass chip",
    description: "small action-chip glass treatment for explicit click targets",
    url: absoluteUrl("/interactions#glass-chip"),
  },
  {
    name: "command palette",
    description: "glass control layer with one active command lens",
    url: absoluteUrl("/interactions#command-palette"),
  },
  {
    name: "custom cursor",
    description: "graphite cursor coupling for interactive surfaces",
    url: absoluteUrl("/interactions#custom-cursor"),
  },
  {
    name: "route transition",
    description: "small page transition rule for spatial continuity",
    url: absoluteUrl("/interactions#route-transition"),
  },
  {
    name: "atlas capacity",
    description: "live capacity state model from the Atlas case study",
    url: absoluteUrl("/interactions#atlas-capacity"),
  },
];

export const metadata: Metadata = {
  title: "interactions",
  description,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    url,
    title: "interactions · minwook shin",
    description,
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "interactions · minwook shin",
    description,
  },
};

export default function InteractionsRoute() {
  if (!showDraftInteractions) {
    notFound();
  }

  return (
    <>
      <StructuredData
        data={collectionPageJsonLd({
          description,
          items: interactionItems,
          name: "Live interaction systems by Minwook Shin",
          url,
        })}
      />
      <InteractionsPage />
    </>
  );
}
