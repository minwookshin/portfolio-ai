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
      <div className="grid grid-cols-2 gap-x-[72px] gap-y-5">
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
              className="group flex flex-col items-center gap-2 outline-none rounded-shape-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            >
              <div className="relative w-[100px] h-[100px] rounded-shape-xl overflow-hidden bg-surface-container border border-outline-variant shadow-[0_6px_20px_rgba(0,0,0,0.10)]">
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
                {/* Material state layer */}
                <span className="absolute inset-0 rounded-[inherit] bg-on-surface opacity-0 transition-opacity group-hover:opacity-[0.04] group-active:opacity-[0.08]" />
              </div>
              <span className="font-mono uppercase tracking-[0.16em] text-[10px] text-on-surface-variant text-center">
                {project.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Center identity mark — nested in the grid's center gap */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ marginTop: "-13px" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springs.spatialDefault, delay: 0.28 }}
          className="w-[78px] h-[78px] rounded-shape-full flex items-center justify-center bg-surface-container-high border-[3px] border-surface shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        >
          <img src="/icon.png" alt="minwook" className="w-[54px] h-[54px] object-contain" />
        </motion.div>
      </div>
    </div>
  );
}
