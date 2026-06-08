import { notFound } from "next/navigation";
import ProjectRouteModal from "@/components/ProjectRouteModal";
import { getProjectBySlug } from "@/data/projects";

type InterceptedWorkPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterceptedWorkPage({ params }: InterceptedWorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon) notFound();

  return <ProjectRouteModal project={project} />;
}
