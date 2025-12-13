"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface StickerData {
  id: string;
  type: "project" | "skill" | "contact" | "about";
  content: {
    title?: string;
    description?: string;
    icon?: ReactNode;
    color?: string;
  };
  position: { x: number; y: number };
}

interface StickerCardProps {
  sticker: StickerData;
  onDragEnd?: (id: string, position: { x: number; y: number }) => void;
}

export default function StickerCard({ sticker, onDragEnd }: StickerCardProps) {
  const getGradient = () => {
    switch (sticker.type) {
      case "project":
        return "from-blue-400 via-blue-500 to-blue-600";
      case "skill":
        return "from-purple-400 via-purple-500 to-purple-600";
      case "contact":
        return "from-green-400 via-green-500 to-green-600";
      case "about":
        return "from-orange-400 via-orange-500 to-orange-600";
      default:
        return "from-gray-400 via-gray-500 to-gray-600";
    }
  };

  const getShape = () => {
    switch (sticker.type) {
      case "project":
        return (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient()} rounded-full shadow-2xl`} />
        );
      case "skill":
        return (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient()} rounded-3xl shadow-2xl`} />
        );
      case "contact":
        return (
          <div
            className={`w-full h-full bg-gradient-to-br ${getGradient()} shadow-2xl`}
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
        );
      case "about":
        return (
          <div
            className={`w-full h-full bg-gradient-to-br ${getGradient()} shadow-2xl`}
            style={{ borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }}
          />
        );
      default:
        return (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient()} rounded-2xl shadow-2xl`} />
        );
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragEnd={(_, info) => {
        if (onDragEnd) {
          onDragEnd(sticker.id, { x: info.point.x, y: info.point.y });
        }
      }}
      initial={{
        scale: 0,
        rotate: Math.random() * 40 - 20,
        x: sticker.position.x,
        y: sticker.position.y,
      }}
      animate={{
        scale: 1,
        rotate: 0,
      }}
      whileHover={{
        scale: 1.05,
        rotate: Math.random() * 10 - 5,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        scale: 0.95,
        cursor: "grabbing",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      {/* Shadow Layer */}
      <motion.div
        className="absolute inset-0 blur-2xl opacity-50"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {getShape()}
      </motion.div>

      {/* Main Shape */}
      <div className="relative w-full h-full flex items-center justify-center">
        {getShape()}

        {/* Content Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
        >
          {sticker.content.icon && (
            <div className="mb-2 text-white/90">{sticker.content.icon}</div>
          )}
          {sticker.content.title && (
            <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">
              {sticker.content.title}
            </h3>
          )}
          {sticker.content.description && (
            <p className="text-white/80 text-xs drop-shadow">
              {sticker.content.description}
            </p>
          )}
        </motion.div>
      </div>

      {/* Glossy Highlight */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent 50%)",
        }}
      />
    </motion.div>
  );
}
