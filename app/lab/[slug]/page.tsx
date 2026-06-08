import { redirect } from "next/navigation";

type LegacyLabProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyLabProjectPage({ params }: LegacyLabProjectPageProps) {
  const { slug } = await params;
  redirect(`/studies/${slug}`);
}
