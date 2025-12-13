"use client";

import { motion } from "framer-motion";
import { useParametricStore, useDominantMode } from "@/store/useParametricStore";

export default function GeometricBackground() {
  const mode = useDominantMode();
  const { creativity, logic, business } = useParametricStore();

  // Base colors depending on mode
  const getColors = () => {
    if (creativity > 60) {
      return {
        primary: "bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400",
        secondary: "bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400",
        accent: "bg-gradient-to-br from-rose-400 via-fuchsia-400 to-indigo-400",
      };
    }
    if (logic > 60) {
      return {
        primary: "bg-gradient-to-br from-gray-800 to-gray-900",
        secondary: "bg-gradient-to-br from-blue-900 to-cyan-900",
        accent: "bg-gradient-to-br from-slate-700 to-slate-800",
      };
    }
    if (business > 60) {
      return {
        primary: "bg-gradient-to-br from-green-600 to-emerald-700",
        secondary: "bg-gradient-to-br from-teal-600 to-cyan-700",
        accent: "bg-gradient-to-br from-lime-600 to-green-700",
      };
    }
    // Balanced mode - monochrome
    return {
      primary: "bg-gradient-to-br from-gray-300 to-gray-400",
      secondary: "bg-gradient-to-br from-gray-400 to-gray-500",
      accent: "bg-gradient-to-br from-gray-200 to-gray-300",
    };
  };

  const colors = getColors();
  const opacity = creativity > 60 ? 0.8 : logic > 60 ? 0.6 : business > 60 ? 0.7 : 0.4;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large sphere - top left */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: creativity > 60 ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: creativity > 60 ? 8 : 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute -top-48 -left-48 w-96 h-96 rounded-full ${colors.primary} blur-3xl`}
        style={{ opacity }}
      />

      {/* Medium sphere - top right */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: creativity > 60 ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: creativity > 60 ? 10 : 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className={`absolute top-20 -right-32 w-80 h-80 rounded-full ${colors.secondary} blur-3xl`}
        style={{ opacity }}
      />

      {/* Small accent sphere - center */}
      <motion.div
        animate={{
          scale: creativity > 60 ? [1, 1.2, 1] : [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: creativity > 60 ? 6 : 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className={`absolute top-1/3 left-1/3 w-64 h-64 rounded-full ${colors.accent} blur-3xl`}
        style={{ opacity: opacity * 0.7 }}
      />

      {/* Bottom sphere */}
      <motion.div
        animate={{
          x: [0, -30, 0],
          y: [0, 30, 0],
          scale: creativity > 60 ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{
          duration: creativity > 60 ? 9 : 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className={`absolute -bottom-32 right-1/4 w-72 h-72 rounded-full ${colors.primary} blur-3xl`}
        style={{ opacity: opacity * 0.6 }}
      />

      {/* Logic mode - grid overlay */}
      {logic > 60 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(1, 81, 254, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(1, 81, 254, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      )}
    </div>
  );
}
