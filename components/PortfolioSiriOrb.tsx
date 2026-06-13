"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/components/ProjectCard";

type GuideSection = "work" | "studies";
type SiriMode = "idle" | "menu";

type Bands = {
  high: number;
  low: number;
  mid: number;
};

type SiriStateRuntime = {
  progress: Array<{ value: number }>;
  select: (name: "answer" | "idle" | "listening" | "thinking") => void;
  setPressed: (pressed: boolean) => void;
  sizes: {
    answer: { height: number; width: number };
    expanded: { width: number };
  };
  surface: Record<string, number>;
  tick: (dt: number, bands: Bands) => void;
};

type SiriRendererRuntime = {
  chipLenses: {
    hovers: number[];
    rects: number[][];
    states: number[];
  };
  container: {
    black: number;
    fade: number;
    gauss: number;
    strength: number;
  };
  canvas: HTMLCanvasElement;
  dispose: () => void;
  dpr: number;
  error?: Error | null;
  panelOffset: number[];
  render: (args: {
    bands: Bands;
    dt?: number;
    progress: SiriStateRuntime["progress"];
    sizes: SiriStateRuntime["sizes"];
    surface: SiriStateRuntime["surface"];
  }) => void;
  setBackgroundImage: (image: CanvasImageSource) => void;
  width: number;
};

type SiriRendererConstructor = new (
  canvas: HTMLCanvasElement,
  options?: { embedded?: boolean; wavePreset?: "bloom" | "classic" },
) => SiriRendererRuntime;

type PortfolioSiriOrbProps = {
  activeProject: Project | null;
  activeSection: GuideSection;
  onOpenProfile: () => void;
  onOpenProject: (project: Project) => void;
  onOpenStudies: () => void;
  onOpenWork: () => void;
};

type OrbAction = {
  action: "profile" | "project" | "studies" | "work";
  id: string;
  label: string;
  project?: Project;
};

const ORB_RESTING_SIZE = 115;
const ORB_MENU_WIDTH = 387;
const ORB_MENU_HEIGHT = 124;
const IDLE_BANDS: Bands = { low: 0.055, mid: 0.028, high: 0.014 };
const LIVE_BANDS: Bands = { low: 0.18, mid: 0.082, high: 0.04 };

function solidSource(color: string) {
  const tile = document.createElement("canvas");
  tile.width = 1;
  tile.height = 1;
  const context = tile.getContext("2d");
  if (context) {
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
  }
  return tile;
}

function projectLabel(project: Project) {
  return `open ${project.title}`;
}

export default function PortfolioSiriOrb({
  activeProject,
  activeSection,
  onOpenProfile,
  onOpenProject,
  onOpenStudies,
  onOpenWork,
}: PortfolioSiriOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<SiriRendererRuntime | null>(null);
  const siriRef = useRef<SiriStateRuntime | null>(null);
  const modeRef = useRef<SiriMode>("idle");
  const activeProjectRef = useRef<Project | null>(activeProject);
  const hoverChipRef = useRef<number | null>(null);
  const [mode, setMode] = useState<SiriMode>("idle");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    activeProjectRef.current = activeProject;
    const siri = siriRef.current;
    if (!siri || modeRef.current !== "idle") return;
    siri.select(activeProject ? "listening" : "idle");
  }, [activeProject]);

  const closeOrb = useCallback(() => {
    siriRef.current?.setPressed(false);
    siriRef.current?.select(activeProject ? "listening" : "idle");
    setMode("idle");
  }, [activeProject]);

  const openOrb = useCallback(() => {
    const siri = siriRef.current;
    if (!siri) return;
    siri.setPressed(true);
    window.setTimeout(() => siri.setPressed(false), 140);
    siri.select("answer");
    setMode("menu");
  }, []);

  const runAction = useCallback((action: () => void) => {
    closeOrb();
    window.setTimeout(action, 120);
  }, [closeOrb]);

  const actions = useMemo<OrbAction[]>(() => {
    if (activeProject) {
      return [
        {
          action: "project",
          id: `project-${activeProject.id}`,
          label: projectLabel(activeProject),
          project: activeProject,
        },
        {
          action: "work",
          id: "work",
          label: "work",
        },
        {
          action: "studies",
          id: "studies",
          label: "studies",
        },
      ];
    }

    return [
      {
        action: "work",
        id: "work",
        label: "work",
      },
      {
        action: "studies",
        id: "studies",
        label: "studies",
      },
      {
        action: "profile",
        id: "profile",
        label: "profile",
      },
    ];
  }, [activeProject]);

  const selectAction = useCallback((action: OrbAction) => {
    if (action.action === "project" && action.project) {
      const project = action.project;
      runAction(() => onOpenProject(project));
      return;
    }
    if (action.action === "studies") {
      runAction(onOpenStudies);
      return;
    }
    if (action.action === "profile") {
      runAction(onOpenProfile);
      return;
    }
    runAction(onOpenWork);
  }, [onOpenProfile, onOpenProject, onOpenStudies, onOpenWork, runAction]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && modeRef.current === "menu") closeOrb();
      if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey)) return;
      event.preventDefault();
      if (modeRef.current === "menu") closeOrb();
      else openOrb();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeOrb, openOrb]);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let previousTime = 0;

    const feedChipLenses = (renderer: SiriRendererRuntime) => {
      const panel = panelRef.current;
      const buttons = panel ? Array.from(panel.querySelectorAll<HTMLButtonElement>(".portfolio-siri__chip")) : [];
      const visible = modeRef.current === "menu" ? 1 : 0;
      if (!visible || buttons.length === 0) {
        renderer.chipLenses.states = [0, 0, 0];
        renderer.chipLenses.hovers = [0, 0, 0];
        return;
      }

      const rect = renderer.canvas.getBoundingClientRect();
      if (!rect.width || !renderer.width) return;

      const clientPerDevice = rect.width / renderer.width;
      const panelX = rect.left + rect.width * 0.5 + renderer.panelOffset[0] * clientPerDevice;
      const panelY = rect.top + rect.height * 0.5 + renderer.panelOffset[1] * clientPerDevice;

      renderer.chipLenses.states = buttons.map(() => visible).slice(0, 3);
      renderer.chipLenses.hovers = buttons.map((_, index) => (hoverChipRef.current === index ? 1 : 0)).slice(0, 3);
      renderer.chipLenses.rects = buttons.slice(0, 3).map((button) => {
        const chip = button.getBoundingClientRect();
        return [
          (chip.left + chip.width * 0.5 - panelX) / clientPerDevice,
          (chip.top + chip.height * 0.5 - panelY) / clientPerDevice,
          (chip.width * 0.5) / clientPerDevice,
          (chip.height * 0.5) / clientPerDevice,
        ];
      });
    };

    const boot = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const [rendererModule, stateModule] = await Promise.all([
        import("../prototypes/siri-interaction/shader/siriai/js/renderer.js"),
        import("../prototypes/siri-interaction/shader/siriai/js/state.js"),
      ]);
      const { SiriRenderer } = rendererModule as unknown as { SiriRenderer: SiriRendererConstructor };
      const { createSiriState } = stateModule as unknown as { createSiriState: () => SiriStateRuntime };

      if (cancelled) return;

      const renderer = new SiriRenderer(canvas, { embedded: true, wavePreset: "classic" });
      const siri = createSiriState();

      renderer.container = { black: 0.72, fade: 1, gauss: 9, strength: 0.82 };
      renderer.panelOffset = [0, 0];
      siri.sizes.expanded.width = ORB_RESTING_SIZE;
      siri.sizes.answer.width = ORB_MENU_WIDTH;
      siri.sizes.answer.height = ORB_MENU_HEIGHT;
      siri.select(activeProjectRef.current ? "listening" : "idle");

      renderer.setBackgroundImage(solidSource("#000000"));
      rendererRef.current = renderer;
      siriRef.current = siri;

      const frame = (time: number) => {
        if (cancelled) return;
        const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.1) : 0;
        previousTime = time;
        const live = modeRef.current === "menu" || Boolean(activeProjectRef.current);
        const bands = live ? LIVE_BANDS : IDLE_BANDS;

        feedChipLenses(renderer);
        siri.tick(dt, bands);
        renderer.render({
          bands,
          dt,
          progress: siri.progress,
          sizes: siri.sizes,
          surface: siri.surface,
        });

        rafId = window.requestAnimationFrame(frame);
      };

      frame(0);
    };

    void boot();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      rendererRef.current?.dispose();
      rendererRef.current = null;
      siriRef.current = null;
    };
  }, []);

  return (
    <div className="portfolio-siri" data-mode={mode}>
      <canvas ref={canvasRef} className="portfolio-siri__canvas" aria-label="Portfolio Siri orb" />
      {mode === "menu" && (
        <button type="button" className="portfolio-siri__scrim" aria-label="Close portfolio orb" onClick={closeOrb} />
      )}
      <div ref={panelRef} className="portfolio-siri__overlay" aria-hidden={mode === "idle"}>
        <div className="portfolio-siri__panel">
          <p className="portfolio-siri__prompt">
            {activeProject ? "this proof is ready." : activeSection === "studies" ? "choose a note." : "choose a path."}
          </p>
          <div className="portfolio-siri__chips" aria-label="Portfolio quick actions">
            {actions.map((action, index) => (
              <button
                key={action.id}
                type="button"
                className="portfolio-siri__chip micro-focus micro-focus-tight"
                tabIndex={mode === "menu" ? 0 : -1}
                onClick={() => selectAction(action)}
                onPointerEnter={() => {
                  hoverChipRef.current = index;
                }}
                onPointerLeave={() => {
                  if (hoverChipRef.current === index) hoverChipRef.current = null;
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {mode === "idle" && (
        <button
          type="button"
          className="portfolio-siri__hit micro-focus micro-focus-tight"
          aria-label="Open portfolio orb"
          onClick={openOrb}
        />
      )}
    </div>
  );
}
