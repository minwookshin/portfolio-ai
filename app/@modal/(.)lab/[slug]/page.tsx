import { notFound } from "next/navigation";
import ProjectRouteModal from "@/components/ProjectRouteModal";
import { getProjectBySlug, isLabProject } from "@/data/projects";

type InterceptedLabPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterceptedLabPage({ params }: InterceptedLabPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon || !isLabProject(project)) notFound();

  return <ProjectRouteModal project={project} baseHref="/studies" />;
}
