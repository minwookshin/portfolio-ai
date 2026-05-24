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
  activeCategory?: string | null;
  iconSize?: number;
  gap?: number;
}

function rectOf(el: Element | null | undefined): OriginRect | undefined {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width };
}

// Center-out cell ordering: nearest cells to the middle fill first, so the field
// reads as one grid that grows outward in rows from a centered core.
function centerOutCells(n: number, spacing: number) {
  const max = Math.ceil(Math.sqrt(Math.max(n, 1))) + 1;
  const cells: { x: number; y: number }[] = [];
  for (let gy = -max; gy < max; gy++)
    for (let gx = -max; gx < max; gx++) cells.push({ x: gx + 0.5, y: gy + 0.5 });
  cells.sort((a, b) => a.x * a.x + a.y * a.y - (b.x * b.x + b.y * b.y));
  return cells.slice(0, n).map((c) => ({ x: c.x * spacing, y: c.y * spacing }));
}

/**
 * A flat field of project app-icons you drag to pan. The matching projects sit
 * center-out in a grid; filtering by category recompacts the survivors toward
 * the centre (non-matching icons fade out in place). Every icon shows in full —
 * no edge-fade mask.
 */
export function ProjectField({
  projects,
  onSelectProject,
  activeCategory = null,
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

  const iconSize = iconSizeProp ?? (isMobile ? 105 : 145);
  const cellGap = gap ?? Math.round((iconSize * 0.13) / 4) * 4;
  const spacing = iconSize + cellGap;

  // The field fills most of the viewport so every icon is shown in full.
  const boxW = Math.min(vw - 24, 1100);
  const boxH = Math.min(vh - 150, 820);

  // Placement per project id: matching projects get center-out cells; the rest
  // park at the centre, invisible, ready to fade back in when the filter clears.
  const placement = useMemo(() => {
    const matching = projects.filter(
      (p) => !activeCategory || p.categories?.includes(activeCategory)
    );
    const cells = centerOutCells(matching.length, spacing);
    const map = new Map<string, { x: number; y: number; visible: boolean }>();
    matching.forEach((p, i) => map.set(p.id, { x: cells[i].x, y: cells[i].y, visible: true }));
    projects.forEach((p) => { if (!map.has(p.id)) map.set(p.id, { x: 0, y: 0, visible: false }); });
    return map;
  }, [projects, activeCategory, spacing]);

  // Grid extent (max distance from centre among visible icons) for pan clamping.
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
  const clampX = Math.max(0, boxW / 2 - extent.ex - iconSize / 2 - 12, extent.ex + iconSize / 2 - boxW / 2 + 24);
  const clampY = Math.max(0, boxH / 2 - extent.ey - iconSize / 2 - 12, extent.ey + iconSize / 2 - boxH / 2 + 24);

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
  const placementRef = useRef(placement);
  placementRef.current = placement;

  const paint = () => {
    const { x, y } = pan.current;
    if (worldRef.current) worldRef.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;

  // Re-clamp the pan and repaint when the filter changes the layout.
  useEffect(() => {
    pan.current.x = Math.max(-clampX, Math.min(clampX, pan.current.x));
    pan.current.y = Math.max(-clampY, Math.min(clampY, pan.current.y));
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement]);

  const onPointerDown = (e: React.PointerEvent) => {
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
      <div ref={worldRef} className="absolute left-1/2 top-1/2">
        {projects.map((project, i) => {
          const place = placement.get(project.id)!;
          const iconSrc = project.icon ?? project.image;
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
              aria-label={`Open ${project.title}`}
              aria-hidden={!place.visible}
              tabIndex={place.visible ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && place.visible) {
                  e.preventDefault();
                  onSelectProject(project, rectOf(e.currentTarget));
                }
              }}
              className="absolute will-change-transform rounded-none outline-none group focus-visible:ring-2 focus-visible:ring-on-surface focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
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
              <div className="w-full h-full" style={boxReveal}>
              <div className="bg-surface-container relative w-full h-full rounded-none overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-90">
                <div className="absolute inset-0" style={revealStyle}>
                {iconSrc ? (
                  <Image
                    src={iconSrc}
                    alt={project.title}
                    fill
                    sizes="128px"
                    draggable={false}
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125"
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
                {/* dither texture — ordered dot screen for depth instead of flat gray */}
                <span className="dither-overlay absolute inset-0 rounded-[inherit] pointer-events-none" />
                {/* monochrome hover state layer */}
                <span className="absolute inset-0 rounded-[inherit] bg-on-surface opacity-0 transition-opacity duration-200 group-hover:opacity-[0.1]" />
              </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
