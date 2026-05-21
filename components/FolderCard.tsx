"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ChevronRight } from "lucide-react";
import { Project } from "./ProjectCard";
import { useThemeStore } from "@/lib/theme-store";

interface FolderCardProps {
  project: Project;
  index: number;
  onViewDetails?: (project: Project) => void;
}

export default function FolderCard({ project, index, onViewDetails }: FolderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setActiveThemeColor } = useThemeStore();

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded && project.themeColor) {
      setActiveThemeColor(project.themeColor);
    } else if (isExpanded) {
      setActiveThemeColor(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {/* Folder Card */}
      <motion.button
        onClick={handleExpand}
        className={`w-full bg-surface-container rounded-shape-lg p-0 transition-all duration-500 group relative overflow-hidden before:absolute before:inset-0 before:bg-on-surface before:opacity-0 hover:before:opacity-[0.04] before:transition-opacity`}
        whileHover={{ scale: 1.01, y: -4 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Content */}
        <div className="p-5 sm:p-6 min-h-[200px] sm:h-[230px] flex flex-col">
          {/* Header with project number and year */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="font-mono text-xs text-on-surface-variant tracking-wider">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs text-on-surface-variant">
              {project.date}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 flex-1">
            {/* Project Info */}
            <div className="text-left flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-on-surface mb-2 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-sm text-on-surface-variant line-clamp-2 leading-[1.4]">
                {project.description}
              </p>
            </div>

            {/* Expand Arrow */}
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 mt-1 relative z-10"
            >
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </motion.div>
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-surface-container-high rounded-shape-sm text-xs font-medium text-on-surface-variant"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-3 py-1.5 bg-surface-container-high rounded-shape-sm text-xs font-medium text-on-surface-variant">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="bg-surface-container rounded-shape-lg p-6 space-y-6 mt-4">
              {/* Full Description */}
              <div>
                <h4 className="font-mono text-xs text-on-surface-variant mb-2 uppercase tracking-[0.2em]">
                  Overview
                </h4>
                <p className="text-on-surface-variant leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              {/* All Tags */}
              <div>
                <h4 className="font-mono text-xs text-on-surface-variant mb-3 uppercase tracking-[0.2em]">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-surface-container-high rounded-shape-sm text-sm font-medium text-on-surface-variant transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-2 text-sm text-on-surface-variant pt-2 border-t border-outline-variant">
                <span className="font-semibold text-on-surface">Year:</span>
                <span className="text-on-surface-variant">{project.date}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {onViewDetails && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(project);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 px-6 py-3.5 bg-on-surface hover:opacity-90 text-surface rounded-shape-md font-semibold transition-all flex items-center justify-center gap-2 duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    See Details
                  </motion.button>
                )}
                {project.link && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1 sm:flex-initial px-6 py-3.5 bg-transparent border border-outline hover:border-on-surface text-on-surface rounded-shape-md font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
