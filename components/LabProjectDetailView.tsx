"use client";

import { motion, useReducedMotion } from "framer-motion";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { PROJECT_PREVIEW_VIDEOS, isVisibleBuilderValue } from "@/data/projects";
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

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.base}
      className="studio-lab-detail"
    >
      <div className="studio-lab-detail-media">
        {videoSrc && !reduceMotion ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={makeVideoPosterDataUrl(project.title)}
            className="h-full w-full object-contain"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <LabFallbackMedia project={project} />
        )}
      </div>

      <section className="border-t border-[var(--border-light)] pt-[var(--space-3)]">
        <h1 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
          {project.title}
        </h1>
        {oneLine && (
          <p className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
            {oneLine}
          </p>
        )}
        {links.length > 0 && (
          <div className="mt-[var(--space-2)] flex flex-wrap items-center gap-x-[var(--space-2)] gap-y-[var(--space-1)]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-lateral-link micro-focus micro-pressable inline-flex text-[length:var(--type-0)]"
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
