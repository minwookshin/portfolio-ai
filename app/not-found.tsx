import type { Metadata } from "next";
import StatusPage from "@/components/StatusPage";

export const metadata: Metadata = {
  title: "page not found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="page not found"
      title="this page is not part of the archive."
      body="the work, writing, and lab pages are still here."
    />
  );
}
