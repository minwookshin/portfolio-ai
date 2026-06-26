"use client";

import { motion, useReducedMotion } from "framer-motion";
import LabStudyDetailView from "@/components/LabStudyDetailView";
import StudioVideoPlayer from "@/components/StudioVideoPlayer";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { PROJECT_PREVIEW_VIDEOS, isLabStudyProject, isVisibleBuilderValue } from "@/data/projects";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";

type LabLink = {
  label: string;
  href: string;
};

function getLabLinks(project: PortfolioProject) {
  const links: LabLink[] = [];
  const liveHref = project.link ?? project.builder.demo?.href;

  if (liveHref) links.push({ label: "live", href: liveHref });
  if (project.github) links.push({ label: "github", href: project.github });
  if (project.linkedin) links.push({ label: "linkedin", href: project.linkedin });

  const seen = new Set<string>();
  return links.filter((link) => {
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function LabFallbackMedia({ project }: { project: PortfolioProject }) {
  const image = project.image ?? project.icon;

  if (image) {
    return (
      <img
        src={image}
        alt={project.title}
        className="h-full w-full object-contain"
        draggable={false}
        loading="eager"
        decoding="async"
      />
    );
  }

  if (project.glyph) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[length:var(--type-4)] text-[var(--text-primary)]">
        {project.glyph}
      </div>
    );
  }

  return null;
}

export default function LabProjectDetailView({ project }: { project: PortfolioProject }) {
  const reduceMotion = Boolean(useReducedMotion());
  const proof = project.builder;
  const videoSrc = proof.demo?.video ?? PROJECT_PREVIEW_VIDEOS[project.title];
  const links = getLabLinks(project);
  const oneLine = [proof.oneLiner, project.description, project.fullDescription].find(isVisibleBuilderValue);

  if (isLabStudyProject(project)) {
    return <LabStudyDetailView project={project} />;
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className="studio-lab-detail detail-outline-stack"
    >
      {videoSrc ? (
        <StudioVideoPlayer
          autoPlay={!reduceMotion}
          loop
          muted
          src={videoSrc}
          label={`${project.title} demo`}
          preload="metadata"
          poster={makeVideoPosterDataUrl(project.title)}
          className="studio-lab-detail-media"
          videoClassName="h-full w-full object-contain"
        />
      ) : (
        <div className="studio-lab-detail-media">
          <LabFallbackMedia project={project} />
        </div>
      )}

      <section className="detail-outline-section">
        <div className="detail-outline-heading-row">
          <span className="detail-outline-bullet-cell" aria-hidden="true">
            <span className="detail-outline-bullet detail-outline-bullet--section" />
          </span>
          <div className="detail-outline-heading-copy">
            <h1 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
              {project.title}
            </h1>
            {oneLine && (
              <p className="max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
                {oneLine}
              </p>
            )}
          </div>
        </div>
        {links.length > 0 && (
          <div className="studio-detail-link-list">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-lateral-link studio-detail-link-row micro-focus micro-pressable text-[length:var(--type-0)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
