import { generatePortfolioMarkdown } from "@/lib/aiPortfolio";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return new Response(generatePortfolioMarkdown(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
