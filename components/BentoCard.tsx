"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  span?: string;
  glow?: boolean;
}

export default function BentoCard({
  children,
  className = "",
  delay = 0,
  span = "",
  glow = false,
}: BentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      className={`
        relative overflow-hidden rounded-2xl border border-gray-custom/20
        bg-white/80 backdrop-blur-sm
        p-6 md:p-8
        transition-all duration-300
        hover:border-accent-orange/50 hover:shadow-lg
        ${glow ? "hover:shadow-glow" : ""}
        ${span}
        ${className}
      `}
    >
      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-20 grid-background pointer-events-none" />
    </motion.div>
  );
}
