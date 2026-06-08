import { generateLlmsTxt } from "@/lib/aiPortfolio";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return new Response(generateLlmsTxt(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
