import { generateDesignSystemMarkdown } from "@/lib/designSystemProof";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return new Response(generateDesignSystemMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
