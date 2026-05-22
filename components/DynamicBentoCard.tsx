"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useParametricStore, useDominantMode } from "@/store/useParametricStore";

interface DynamicBentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  creativeContent?: ReactNode;
  logicContent?: ReactNode;
  businessContent?: ReactNode;
}

export default function DynamicBentoCard({
  children,
  className = "",
  delay = 0,
  creativeContent,
  logicContent,
  businessContent,
}: DynamicBentoCardProps) {
  const mode = useDominantMode();
  const { creativity, logic, business } = useParametricStore();

  // Dynamic styling based on mode
  const getCardStyle = () => {
    if (creativity > 60) {
      return "bg-gradient-to-br from-white via-purple-50 to-pink-50 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:shadow-purple-100";
    }
    if (logic > 60) {
      return "bg-gray-900 text-white border-gray-700 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/20 font-mono";
    }
    if (business > 60) {
      return "bg-gradient-to-br from-white via-green-50 to-emerald-50 border-green-200 hover:border-green-400 hover:shadow-xl hover:shadow-green-100";
    }
    return "bg-white/80 backdrop-blur-sm border-border hover:border-accent hover:shadow-lg";
  };

  // Dynamic motion based on creativity
  const getMotionProps = () => {
    const baseScale = creativity > 60 ? 1.03 : 1.02;

    return {
      whileHover: { scale: baseScale, rotate: creativity > 70 ? 1 : 0 },
    };
  };

  // Render appropriate content based on mode
  const renderContent = () => {
    if (creativity > 60 && creativeContent) return creativeContent;
    if (logic > 60 && logicContent) return logicContent;
    if (business > 60 && businessContent) return businessContent;
    return children;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      {...getMotionProps()}
      className={`
        relative overflow-hidden rounded-2xl border
        p-6 md:p-8
        transition-all duration-300
        ${getCardStyle()}
        ${className}
      `}
    >
      {/* Animated gradient overlay for creative mode */}
      {creativity > 70 && (
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-orange-400/20 pointer-events-none"
        />
      )}

      {/* Code snippet overlay for logic mode */}
      {logic > 70 && (
        <div className="absolute top-0 right-0 text-[10px] font-mono text-blue-400/30 p-4 leading-tight">
          {`const mode = "logic";`}
          <br />
          {`// Analyzing...`}
        </div>
      )}

      {/* Card content */}
      <div className="relative z-10">{renderContent()}</div>
    </motion.div>
  );
}
