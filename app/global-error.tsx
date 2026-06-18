"use client";

import StatusPage from "@/components/StatusPage";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <StatusPage
          action={
            <button className="intro-contact-link micro-focus micro-focus-tight text-left" onClick={reset} type="button">
              try again
            </button>
          }
          code="error"
          eyebrow="something slipped"
          title="this site could not finish loading."
          body="you can try again or move back into the main sections."
        />
      </body>
    </html>
  );
}
