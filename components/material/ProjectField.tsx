"use client";

import { useEffect, useMemo, useRef } from "react";
import { animate, useMotionValue } from "framer-motion";
import { Project } from "@/components/ProjectCard";
import { springs } from "@/lib/material/motion";

interface ProjectFieldProps {
  projects: Project[];
  mode: "grid" | "globe";
  onSelectProject: (project: Project) => void;
  iconSize?: number;
  gap?: number;
  globeRadius?: number;
  mainCount?: number;
}

const FLAT_RADIUS = 3000; // near-flat grid
const DEG = 180 / Math.PI;

/**
 * One field of project app-icons. The flat 2x2 grid of the main projects
 * bends onto a sphere when `mode` becomes "globe": the sphere radius
 * interpolates from near-flat down to `globeRadius`, so the main icons tilt
 * a little while the extra projects fade in alongside - one continuous morph.
 */
export function ProjectField({
  projects,
  mode,
  onSelectProject,
  iconSize = 88,
  gap,
  globeRadius = 460,
  mainCount = 4,
}: ProjectFieldProps) {
  // Spacing scales with icon size so it tightens as icons shrink
  const cellGap = gap ?? Math.round(iconSize * 0.26);
  const worldRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const progress = useMotionValue(mode === "globe" ? 1 : 0);
  const rot = useRef({ rx: 0, ry: 0 });
  const drag = useRef({ active: false, lastX: 0, lastY: 0, moved: 0, idx: null as number | null });
  const modeRef = useRef(mode);
  const renderRef = useRef<() => void>(() => {});
  const dragRaf = useRef<number | null>(null);
  const spacing = iconSize + cellGap;

  // Center-out cells: main projects fill the inner 2x2, extras ring outward.
  const layout = useMemo(() => {
    const max = Math.ceil(Math.sqrt(projects.length)) + 1;
    const cells: { cx: number; cy: number }[] = [];
    for (let gy = -max; gy < max; gy++) {
      for (let gx = -max; gx < max; gx++) cells.push({ cx: gx + 0.5, cy: gy + 0.5 });
    }
    cells.sort((a, b) => a.cx * a.cx + a.cy * a.cy - (b.cx * b.cx + b.cy * b.cy));
    return cells.slice(0, projects.length).map((c, i) => ({
      isMain: i < mainCount,
      ax: c.cx * spacing, // arc distance from center along the sphere surface
      ay: c.cy * spacing,
    }));
  }, [projects.length, spacing, mainCount]);

  useEffect(() => {
    modeRef.current = mode;
    if (mode === "grid") rot.current = { rx: 0, ry: 0 };
    const controls = animate(progress, mode === "globe" ? 1 : 0, springs.spatialDefault);
    return () => controls.stop();
  }, [mode, progress]);

  // Paint transforms only when something actually changes: the morph spring
  // fires "change" events while animating and stops when settled, and drags
  // schedule their own frames. No perpetual rAF loop competing for paint time.
  useEffect(() => {
    const renderFrame = () => {
      const t = progress.get();
      // curvature 1/R interpolates from flat to the globe radius
      const invR = (1 - t) / FLAT_RADIUS + t / globeRadius;
      const R = 1 / invR;

      if (worldRef.current) {
        worldRef.current.style.transform = `translateZ(${-R}px) rotateX(${rot.current.rx}deg) rotateY(${rot.current.ry}deg)`;
      }

      const extrasOpacity = Math.min(1, Math.max(0, (t - 0.05) / 0.7));

      layout.forEach((L, i) => {
        const lon = (L.ax / R) * DEG;
        const lat = (L.ay / R) * DEG;
        const el = itemsRef.current[i];
        if (el) {
          el.style.transform = `rotateY(${lon}deg) rotateX(${-lat}deg) translateZ(${R}px)`;
          const o = L.isMain ? 1 : extrasOpacity;
          el.style.opacity = String(o);
          el.style.pointerEvents = o < 0.12 ? "none" : "auto";
        }
      });
    };
    renderRef.current = renderFrame;
    renderFrame(); // initial paint
    const unsub = progress.on("change", renderFrame);
    return () => {
      unsub();
      if (dragRaf.current) cancelAnimationFrame(dragRaf.current);
    };
  }, [layout, globeRadius, progress]);

  const onPointerDown = (e: React.PointerEvent) => {
    const btn = (e.target as HTMLElement).closest("button[data-idx]");
    drag.current.idx = btn ? Number(btn.getAttribute("data-idx")) : null;
    drag.current.moved = 0;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    // Only the globe is draggable to rotate; the grid is static.
    if (modeRef.current === "globe") {
      drag.current.active = true;
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.moved += Math.abs(dx) + Math.abs(dy);
    rot.current.ry += dx * 0.25;
    rot.current.rx = Math.max(-55, Math.min(55, rot.current.rx - dy * 0.25));
    if (dragRaf.current == null) {
      dragRaf.current = requestAnimationFrame(() => {
        dragRaf.current = null;
        renderRef.current();
      });
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    if (drag.current.active) {
      drag.current.active = false;
      (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    }
    // Tap (negligible movement) on an icon opens it - works for grid & globe.
    if (drag.current.moved < 6 && drag.current.idx != null) {
      onSelectProject(projects[drag.current.idx]);
    }
    drag.current.idx = null;
  };

  const box = 620;

  return (
    <div
      className={`relative mx-auto select-none ${mode === "globe" ? "touch-none cursor-grab active:cursor-grabbing" : ""}`}
      style={{
        width: box,
        height: box,
        perspective: 1100,
        WebkitMaskImage: "radial-gradient(circle at center, #000 48%, transparent 80%)",
        maskImage: "radial-gradient(circle at center, #000 48%, transparent 80%)",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={worldRef}
        className="absolute left-1/2 top-1/2"
        style={{ transformStyle: "preserve-3d" }}
      >
        {projects.map((project, i) => {
          const iconSrc = project.icon ?? project.image;
          return (
            <button
              key={project.id}
              ref={(el) => { itemsRef.current[i] = el; }}
              type="button"
              data-idx={i}
              aria-label={`Open ${project.title}`}
              className="absolute will-change-transform outline-none group"
              style={{
                width: iconSize,
                height: iconSize,
                left: -iconSize / 2,
                top: -iconSize / 2,
                backfaceVisibility: "hidden",
              }}
            >
              <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-surface-container border border-outline-variant">
                {iconSrc ? (
                  <img
                    src={iconSrc}
                    alt={project.title}
                    draggable={false}
                    className="w-full h-full object-cover"
                    style={{ filter: "grayscale(1) contrast(1.03)" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-light text-on-surface-variant">
                    {project.title.charAt(0)}
                  </div>
                )}
                <span className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/[0.06]" />
                {/* monochrome hover state layer */}
                <span className="absolute inset-0 rounded-[inherit] bg-on-surface opacity-0 transition-opacity duration-200 group-hover:opacity-[0.1]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
