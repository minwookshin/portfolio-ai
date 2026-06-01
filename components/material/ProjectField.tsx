"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Project } from "@/components/ProjectCard";

// Per-icon entrance directions, cycled so neighbours differ. The artwork starts
// pushed fully off one edge (clipped invisible) then slides to center.
const REVEAL_OFFSETS = ["translateY(-100%)", "translateX(100%)", "translateY(100%)", "translateX(-100%)"];

export interface OriginRect {
  cx: number;
  cy: number;
  w: number;
}

interface ProjectFieldProps {
  projects: Project[];
  onSelectProject: (project: Project, originRect?: OriginRect) => void;
  featuredProjectIds?: readonly string[];
  showAllProjects?: boolean;
  iconSize?: number;
  gap?: number;
}

function rectOf(el: Element | null | undefined): OriginRect | undefined {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width };
}

function horizontalCells(n: number, spacing: number) {
  const mid = (n - 1) / 2;
  return Array.from({ length: n }, (_, i) => ({ x: (i - mid) * spacing, y: 0 }));
}

function featuredGridCells(n: number, spacing: number) {
  if (n === 4) {
    const offset = spacing / 2;
    return [
      { x: -offset, y: -offset },
      { x: offset, y: -offset },
      { x: -offset, y: offset },
      { x: offset, y: offset },
    ];
  }

  const cols = Math.min(2, n);
  const rows = Math.ceil(n / cols);
  return Array.from({ length: n }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: (col - (cols - 1) / 2) * spacing,
      y: (row - (rows - 1) / 2) * spacing,
    };
  });
}

/**
 * A flat field of project app-icons. It opens with a centered 2x2 featured grid;
 * the archive mode restores the older horizontal row you can drag to pan.
 */
export function ProjectField({
  projects,
  onSelectProject,
  featuredProjectIds = [],
  showAllProjects = false,
  iconSize: iconSizeProp,
  gap,
}: ProjectFieldProps) {
  const [vw, setVw] = useState(1024);
  const [vh, setVh] = useState(768);
  useEffect(() => {
    const onResize = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const isMobile = vw <= 480;

  const iconSize = iconSizeProp ?? (isMobile ? 69 : 116);
  const cellGap = gap ?? Math.round((iconSize * 0.08) / 4) * 4;
  const spacing = iconSize + cellGap;

  // The field fills most of the viewport so every icon is shown in full.
  const boxW = Math.min(vw - 24, 1100);
  const boxH = Math.min(vh - 150, 820);

  // Placement per project id: default is a tight 2x2 featured grid. The "show
  // all" button restores the older horizontal row for the full archive.
  const placement = useMemo(() => {
    const matching = showAllProjects
      ? projects
      : featuredProjectIds
          .map((id) => projects.find((p) => p.id === id))
          .filter((p): p is Project => Boolean(p));
    const cells = showAllProjects
      ? horizontalCells(matching.length, spacing)
      : featuredGridCells(matching.length, spacing);
    const map = new Map<string, { x: number; y: number; visible: boolean }>();
    matching.forEach((p, i) => map.set(p.id, { x: cells[i].x, y: cells[i].y, visible: true }));
    projects.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, { x: 0, y: 0, visible: false });
    });
    return map;
  }, [projects, featuredProjectIds, showAllProjects, spacing]);

  // Row extent (max distance from centre among visible icons) for pan clamping.
  const extent = useMemo(() => {
    let ex = 0, ey = 0;
    placement.forEach((p) => {
      if (!p.visible) return;
      ex = Math.max(ex, Math.abs(p.x));
      ey = Math.max(ey, Math.abs(p.y));
    });
    return { ex, ey };
  }, [placement]);

  // Two ways panning is allowed: shift the cluster around inside a roomy frame
  // (when it all fits), or pan to reveal icons that sit beyond the frame edge
  // (when the cluster is larger than the frame). Whichever gives more freedom.
  const rowClampX = Math.max(0, boxW / 2 - extent.ex - iconSize / 2 - 12, extent.ex + iconSize / 2 - boxW / 2 + 24);
  const clampX = showAllProjects ? rowClampX : 0;
  const clampY = 0;

  // Landing reveal: each icon's artwork slides in from a different edge (clipped
  // to its own frame), staggered, just after the name settles at the top.
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 2250);
    return () => clearTimeout(t);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pan = useRef({ x: 0, y: 0 });
  const drag = useRef({ active: false, lastX: 0, lastY: 0, moved: 0, id: null as string | null });
  const raf = useRef<number | null>(null);
  const autoDir = useRef(1);
  const autoPausedUntil = useRef(0);
  const placementRef = useRef(placement);
  placementRef.current = placement;

  const paint = () => {
    const { x, y } = pan.current;
    if (worldRef.current) worldRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;

  // Re-clamp the pan and repaint when the project mode changes the layout.
  useEffect(() => {
    pan.current.x = Math.max(-clampX, Math.min(clampX, pan.current.x));
    pan.current.y = Math.max(-clampY, Math.min(clampY, pan.current.y));
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement]);

  useEffect(() => {
    if (clampX <= 1) {
      pan.current.x = 0;
      pan.current.y = 0;
      paintRef.current();
      return;
    }

    let frame = 0;
    let last = performance.now();
    const speed = isMobile ? 30 : 22;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 48) / 1000;
      last = now;

      if (revealed && !drag.current.active && now > autoPausedUntil.current) {
        const next = pan.current.x + autoDir.current * speed * dt;
        if (next >= clampX) {
          pan.current.x = clampX;
          autoDir.current = -1;
          autoPausedUntil.current = now + 900;
        } else if (next <= -clampX) {
          pan.current.x = -clampX;
          autoDir.current = 1;
          autoPausedUntil.current = now + 900;
        } else {
          pan.current.x = next;
        }
        pan.current.y = 0;
        paintRef.current();
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clampX, isMobile, revealed]);

  const onPointerDown = (e: React.PointerEvent) => {
    autoPausedUntil.current = performance.now() + 2400;
    const btn = (e.target as HTMLElement).closest("button[data-id]");
    drag.current.id = btn ? btn.getAttribute("data-id") : null;
    drag.current.moved = 0;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.active = true;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    autoPausedUntil.current = performance.now() + 1600;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    drag.current.moved += Math.abs(dx) + Math.abs(dy);
    pan.current.x = Math.max(-clampX, Math.min(clampX, pan.current.x + dx));
    pan.current.y = Math.max(-clampY, Math.min(clampY, pan.current.y + dy));
    if (raf.current == null) {
      raf.current = requestAnimationFrame(() => { raf.current = null; paint(); });
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    drag.current.active = false;
    autoPausedUntil.current = performance.now() + 2400;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    // Tap (negligible movement) on a visible icon opens it, expanding from its rect.
    if (drag.current.moved < 6 && drag.current.id != null) {
      const project = projects.find((p) => p.id === drag.current.id);
      if (project && placement.get(project.id)?.visible) {
        const el = containerRef.current?.querySelector(`button[data-id="${project.id}"]`);
        onSelectProject(project, rectOf(el));
      }
    }
    drag.current.id = null;
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
      style={{ width: boxW, height: boxH }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div ref={worldRef} data-project-world className="absolute left-1/2 top-1/2 will-change-transform">
        {projects.map((project, i) => {
          const place = placement.get(project.id)!;
          const iconSrc = project.icon ?? project.image;
          const isComingSoon = project.comingSoon;
          const d = `${i * 55}ms`;
          // The whole tile (box + artwork) fades in together so the empty box
          // never shows before its icon; the artwork additionally slides in from
          // one edge, clipped to the frame.
          const boxReveal = {
            opacity: revealed ? 1 : 0,
            transition: `opacity 0.5s ease-out ${d}`,
          };
          const revealStyle = {
            transform: revealed ? "translate(0,0)" : REVEAL_OFFSETS[(i * 3) % REVEAL_OFFSETS.length],
            transition: `transform 0.8s cubic-bezier(0.34, 1.28, 0.5, 1) ${d}`,
          };
          return (
            <button
              key={project.id}
              type="button"
              data-id={project.id}
              aria-label={isComingSoon ? `${project.title} is not ready yet` : `Open ${project.title}`}
              aria-hidden={!place.visible}
              tabIndex={place.visible ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && place.visible) {
                  e.preventDefault();
                  onSelectProject(project, rectOf(e.currentTarget));
                }
              }}
              className={`absolute will-change-transform rounded-none text-on-surface outline-none group focus-visible:ring-2 focus-visible:ring-on-surface focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${isComingSoon ? "cursor-not-allowed" : ""}`}
              style={{
                width: iconSize,
                height: iconSize,
                left: -iconSize / 2,
                top: -iconSize / 2,
                opacity: place.visible ? 1 : 0,
                pointerEvents: place.visible ? "auto" : "none",
                transform: `translate(${place.x}px, ${place.y}px)`,
                transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
              }}
            >
              <div className="w-full h-full rounded-none" style={boxReveal}>
              <div
                className="relative w-full h-full rounded-none overflow-hidden bg-transparent transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-95"
              >
                <div className="absolute inset-0 rounded-none" style={revealStyle}>
                  {iconSrc ? (
                    <Image
                      src={iconSrc}
                      alt={project.title}
                      fill
                      sizes={`${Math.ceil(iconSize)}px`}
                      draggable={false}
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                      style={{ filter: "grayscale(1) contrast(1.03)" }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center font-normal text-on-surface transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 ${(project.glyph ?? "").length > 1 ? "text-lg tracking-tight" : "text-3xl"}`}
                      style={{ filter: "grayscale(1)" }}
                    >
                      {project.glyph ?? project.title.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
