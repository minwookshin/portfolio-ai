import { DESIGN_SYSTEM_TOKENS } from "@/lib/designSystemProof";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  return Response.json(DESIGN_SYSTEM_TOKENS, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
