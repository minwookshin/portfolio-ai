"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Project } from "@/components/ProjectCard";
import { springs } from "@/lib/material/motion";

interface HomeScreenGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function HomeScreenGrid({ projects, onSelectProject }: HomeScreenGridProps) {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-fit">
      {/* 2x2 grid of project app icons */}
      <div className="grid grid-cols-2 gap-[32px]">
        {projects.slice(0, 4).map((project, index) => {
          const iconSrc = project.icon ?? project.image;
          return (
            <motion.button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project)}
              aria-label={`Open ${project.title}`}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...springs.spatialDefault, delay: 0.08 * index }}
              whileHover={reduce ? undefined : { y: -4 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className="group outline-none rounded-[27px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              {/* iOS app-icon frame: ~22% corner radius, image full-bleed */}
              <div className="relative w-[120px] h-[120px] rounded-[27px] overflow-hidden bg-surface-container border border-outline-variant shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                {iconSrc ? (
                  <img
                    src={iconSrc}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: "grayscale(1) contrast(1.03)" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-light text-on-surface-variant">
                    {project.title.charAt(0)}
                  </div>
                )}
                {/* iOS-style hairline + Material state layer */}
                <span className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.06]" />
                <span className="absolute inset-0 rounded-[inherit] bg-on-surface opacity-0 transition-opacity group-hover:opacity-[0.04] group-active:opacity-[0.08]" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
