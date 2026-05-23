"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { springs } from "@/lib/material/motion";

/**
 * Geometric blueprint intro: draws the stroke outlines of the centered 2x2 app
 * icons (square, matching the real icon grid) in the exact positions (based on
 * window size) where the real icons land once the wireframe locks.
 */
export function LandingWireframe() {
  const [dim, setDim] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    setDim({ w: window.innerWidth, h: window.innerHeight });
  }, []);
  if (!dim) return null;

  // Mirror ProjectField's layout math so the outlines sit exactly under the icons.
  const isMobile = dim.w <= 480;
  const iconSize = isMobile ? 64 : 88;
  const gap = Math.round(iconSize * 0.13);
  const spacing = iconSize + gap;
  const cx = dim.w / 2;
  const cy = dim.h / 2;
  const half = iconSize / 2;

  const cells = [
    { x: cx - spacing / 2, y: cy - spacing / 2 },
    { x: cx + spacing / 2, y: cy - spacing / 2 },
    { x: cx - spacing / 2, y: cy + spacing / 2 },
    { x: cx + spacing / 2, y: cy + spacing / 2 },
  ];

  const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    className: "text-on-surface-variant",
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 0.55 },
    transition: springs.spatialDefault,
  };

  return (
    <svg width={dim.w} height={dim.h} className="absolute inset-0" style={{ pointerEvents: "none" }} aria-hidden>
      {cells.map((c, i) => (
        <motion.rect key={i} x={c.x - half} y={c.y - half} width={iconSize} height={iconSize} rx={0} {...strokeProps} />
      ))}
    </svg>
  );
}
