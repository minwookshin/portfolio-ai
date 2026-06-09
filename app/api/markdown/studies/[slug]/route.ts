import { generateStudyMarkdown, getStudyMarkdownSlugs } from "@/lib/aiPortfolio";

type StudyMarkdownRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-static";
export const revalidate = 86400;

export function generateStaticParams() {
  return getStudyMarkdownSlugs().map((slug) => ({ slug }));
}

export async function GET(_request: Request, { params }: StudyMarkdownRouteProps) {
  const { slug } = await params;
  const markdown = generateStudyMarkdown(slug);

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
