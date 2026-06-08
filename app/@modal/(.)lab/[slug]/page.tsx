import { redirect } from "next/navigation";

type LegacyInterceptedLabPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyInterceptedLabPage({ params }: LegacyInterceptedLabPageProps) {
  const { slug } = await params;
  redirect(`/studies/${slug}`);
}
