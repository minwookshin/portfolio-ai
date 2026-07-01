"use client";

import { motion, useReducedMotion } from "framer-motion";
import StudioVideoPlayer from "@/components/StudioVideoPlayer";
import { PROJECT_PREVIEW_VIDEOS } from "@/data/projects";
import type { PortfolioProject } from "@/data/projects";
import { tweens } from "@/lib/material/motion";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";

function getVideoSrc(project: PortfolioProject) {
  return project.builder.demo?.video ?? PROJECT_PREVIEW_VIDEOS[project.title];
}

export default function ProjectVideoOnlyView({ project }: { project: PortfolioProject }) {
  const reduceMotion = Boolean(useReducedMotion());
  const videoSrc = getVideoSrc(project);

  if (!videoSrc) return null;

  return (
    <motion.section
      aria-labelledby={`${project.slug}-video-title`}
      className="studio-video-only-detail"
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
    >
      <h1 id={`${project.slug}-video-title`} className="sr-only">
        {project.title}
      </h1>
      <StudioVideoPlayer
        autoPlay={!reduceMotion}
        loop
        muted
        src={videoSrc}
        label={`${project.title} demo`}
        preload="metadata"
        poster={makeVideoPosterDataUrl(project.title)}
        className="studio-video-only-media"
        videoClassName="block h-auto w-full object-contain"
      />
    </motion.section>
  );
}
