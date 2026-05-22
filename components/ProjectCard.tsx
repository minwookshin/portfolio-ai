"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Github, Calendar, Tag } from "lucide-react";

export interface ProjectContentSection {
  type: 'text' | 'gallery' | 'video';
  content?: string;
  images?: { image: string; caption: string; span?: string | number }[];
  url?: string;
  caption?: string;
  aspectRatio?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  tags: string[];
  link?: string;
  github?: string;
  date: string;
  image?: string;
  icon?: string;
  role?: string;
  timeline?: string;
  overview?: string;
  features?: string[];
  challenges?: string;
  outcome?: string;
  themeColor?: string;
  contentSections?: ProjectContentSection[];
  team?: string;
  gallery?: string[];
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="w-full"
    >
      {/* Card Header - Always Visible */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* File Icon */}
            {project.icon ? (
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img
                  src={project.icon}
                  alt={`${project.title} icon`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {project.title.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            {/* Title & Quick Description */}
            <div className="text-left flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {project.description}
              </p>
            </div>
          </div>

          {/* Expand Icon */}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 border-t-0 rounded-b-2xl p-6 space-y-6 mt-[-8px]">
              {/* Full Description */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  About this project
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {project.fullDescription}
                </p>
              </div>

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700">
                    Technologies
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{project.date}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
