import { generateResumeJson } from "@/lib/aiPortfolio";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return Response.json(generateResumeJson(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
