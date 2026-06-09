import { generateWorkProjectMarkdown, getWorkMarkdownSlugs } from "@/lib/aiPortfolio";

type WorkMarkdownRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const revalidate = 86400;

export function generateStaticParams() {
  return getWorkMarkdownSlugs().map((slug) => ({ slug }));
}

export async function GET(_request: Request, { params }: WorkMarkdownRouteProps) {
  const { slug } = await params;
  const markdown = generateWorkProjectMarkdown(slug);

  if (!markdown) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(markdown, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
