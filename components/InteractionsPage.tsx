"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";
import { DetailOutlineHeading, DetailOutlineRow, OutlineSignalCell } from "@/components/Outline";
import SiteMasthead from "@/components/SiteMasthead";
import { springs, tweens } from "@/lib/material/motion";

type CapacityState = {
  action: string;
  beds: number;
  label: string;
  priority: string;
  tone: "calm" | "watch" | "critical";
};

const commandRows = [
  { label: "open atlas", meta: "artifact viewer", group: "navigate" },
  { label: "jump to proof bento", meta: "atlas section", group: "atlas" },
  { label: "copy event contract", meta: "code artifact", group: "copy" },
] as const;

const motionStates = [
  { label: "rest", caption: "state is visible but quiet" },
  { label: "intent", caption: "signal moves 2px toward the row" },
  { label: "confirm", caption: "feedback resolves back into the outline" },
] as const;

function getCapacityState(load: number): CapacityState {
  if (load >= 82) {
    return {
      action: "divert lower acuity",
      beds: 3,
      label: "critical",
      priority: "priority 1",
      tone: "critical",
    };
  }

  if (load >= 58) {
    return {
      action: "stage arrivals",
      beds: 8,
      label: "strained",
      priority: "priority 2",
      tone: "watch",
    };
  }

  return {
    action: "receive next unit",
    beds: 16,
    label: "receiving",
    priority: "priority 3",
    tone: "calm",
  };
}

function InteractionTile({
  caption,
  children,
  className = "",
  id,
  label,
  title,
}: {
  caption: string;
  children: ReactNode;
  className?: string;
  id: string;
  label: string;
  title: string;
}) {
  return (
    <article id={id} className={`interaction-tile ${className}`}>
      <div className="interaction-tile__body">{children}</div>
      <div className="interaction-tile__copy">
        <p className="interaction-tile__title">
          {title}
          <span>{label}</span>
        </p>
        <p className="interaction-tile__caption">{caption}</p>
      </div>
    </article>
  );
}

function DotArrowDemo() {
  return (
    <div className="interaction-signal-demo" aria-label="dot to arrow signal examples">
      <button type="button" className="interaction-signal-row micro-focus micro-focus-tight">
        <OutlineSignalCell
          arrow="right"
          arrowClassName="interaction-signal-arrow"
          cellClassName="interaction-signal-cell"
          dotClassName="interaction-signal-dot"
          rightArrowClassName="site-signal-icon"
        />
        <span>work</span>
        <span className="interaction-signal-meta">4</span>
      </button>
      <button type="button" className="interaction-signal-row interaction-signal-row--open micro-focus micro-focus-tight">
        <span className="interaction-signal-cell" aria-hidden="true">
          <span className="interaction-signal-dot" />
          <span className="interaction-signal-arrow">
            <MaterialArrowForwardIcon className="site-signal-icon site-signal-icon--down" />
          </span>
        </span>
        <span>today</span>
        <span className="interaction-signal-meta">open section</span>
      </button>
      <button type="button" className="interaction-signal-row interaction-signal-row--quiet micro-focus micro-focus-tight">
        <OutlineSignalCell
          cellClassName="interaction-signal-cell"
          dotClassName="interaction-signal-dot"
        />
        <span>note row</span>
        <span className="interaction-signal-meta">quiet dot</span>
      </button>
    </div>
  );
}

function GlassChipDemo() {
  return (
    <div className="interaction-chip-demo" aria-label="glass action chips">
      {["all work", "all notes", "resume"].map((label) => (
        <button key={label} type="button" className="home-mention micro-focus micro-focus-tight micro-pressable interaction-demo-chip">
          {label}
        </button>
      ))}
    </div>
  );
}

function CommandLensDemo() {
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <div className="interaction-command-demo" aria-label="command lens demo">
      <div className="interaction-command-search">
        <span aria-hidden="true">⌘</span>
        <span>search or run a command</span>
        <kbd>K</kbd>
      </div>
      <div className="interaction-command-list">
        <span
          aria-hidden="true"
          className="interaction-command-lens"
          style={{ transform: `translateY(${activeIndex * 42}px)` }}
        />
        {commandRows.map((row, index) => (
          <button
            key={row.label}
            type="button"
            className="interaction-command-row micro-focus micro-focus-tight"
            data-active={index === activeIndex ? "true" : "false"}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            <span>{row.label}</span>
            <span>{row.meta}</span>
            <span>{row.group}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CursorDemo() {
  const [cursor, setCursor] = useState({ active: false, x: 50, y: 50 });

  return (
    <div
      className="interaction-cursor-stage"
      onPointerEnter={() => setCursor((value) => ({ ...value, active: true }))}
      onPointerLeave={() => setCursor((value) => ({ ...value, active: false }))}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setCursor({
          active: true,
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <span
        aria-hidden="true"
        className="interaction-cursor-dot"
        data-active={cursor.active ? "true" : "false"}
        style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
      />
      <button type="button" className="home-mention micro-focus micro-focus-tight micro-pressable">
        cursor target
      </button>
    </div>
  );
}

function RouteTransitionDemo() {
  const [route, setRoute] = useState<"index" | "work">("index");
  const activeIndex = route === "index" ? 0 : 1;

  return (
    <div className="interaction-route-demo" aria-label="route transition demo">
      <div className="interaction-route-tabs">
        <span aria-hidden="true" style={{ transform: `translateX(${activeIndex * 100}%)` }} />
        {(["index", "work"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className="micro-focus micro-focus-tight"
            data-active={route === value ? "true" : "false"}
            onClick={() => setRoute(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <motion.div
        key={route}
        className="interaction-route-panel"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tweens.fast}
      >
        <p>{route === "index" ? "outline index" : "work archive"}</p>
        <span>{route === "index" ? "read structure" : "inspect proof"}</span>
      </motion.div>
    </div>
  );
}

function MotionRuleDemo() {
  const [stateIndex, setStateIndex] = useState(0);
  const state = motionStates[stateIndex] ?? motionStates[0];

  return (
    <div className="interaction-motion-demo" data-state={state.label}>
      <div className="interaction-motion-row" aria-live="polite">
        <span aria-hidden="true" />
        <div>
          <p>{state.label}</p>
          <small>{state.caption}</small>
        </div>
      </div>
      <button
        type="button"
        className="home-mention micro-focus micro-focus-tight micro-pressable"
        onClick={() => setStateIndex((index) => (index + 1) % motionStates.length)}
      >
        advance
      </button>
    </div>
  );
}

function CapacityDemo() {
  const [load, setLoad] = useState(64);
  const state = useMemo(() => getCapacityState(load), [load]);

  return (
    <div className="interaction-capacity-demo" data-tone={state.tone}>
      <div className="interaction-capacity-readout">
        <span>{state.label}</span>
        <output>{load}% load</output>
      </div>
      <div className="interaction-capacity-meter" aria-hidden="true">
        <span style={{ width: `${load}%` }} />
      </div>
      <label className="interaction-capacity-slider">
        <span>hospital load</span>
        <input
          type="range"
          min="24"
          max="94"
          value={load}
          aria-label="hospital load"
          onChange={(event) => setLoad(Number(event.target.value))}
        />
      </label>
      <dl className="interaction-state-list">
        <div>
          <dt>beds</dt>
          <dd>{state.beds} open</dd>
        </div>
        <div>
          <dt>priority</dt>
          <dd>{state.priority}</dd>
        </div>
        <div>
          <dt>next</dt>
          <dd>{state.action}</dd>
        </div>
      </dl>
    </div>
  );
}

export default function InteractionsPage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="site-lowercase detail-page-shell interaction-os-shell text-[length:var(--type-0)] text-[var(--text-primary)]">
      <motion.article
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? tweens.none : springs.spatialFast}
        className="interaction-os studio-detail w-full"
      >
        <nav className="archive-nav" aria-label="interaction navigation">
          <SiteMasthead className="archive-root-row" />
        </nav>

        <div className="detail-document-content document-content-boot">
          <header className="interaction-os__header detail-outline-section">
            <DetailOutlineHeading
              eyebrow="private system proof"
              heading="interactions"
              headingAs="h1"
            />
            <div className="detail-outline-list">
              <DetailOutlineRow body="live proofs for the small state language that makes this portfolio feel like an outline operating system." />
            </div>
          </header>

        <section className="detail-outline-section interaction-os__rules">
          <DetailOutlineHeading heading="release path" eyebrow="not public yet" />
          <div className="detail-outline-list detail-outline-list--grid">
            <DetailOutlineRow title="baseline" meta="locked" body="Home owns the outline grammar: dot, arrow, chip, cursor, and document boot." />
            <DetailOutlineRow title="artifact" meta="atlas first" body="Atlas proves the richer case-study template before the pattern is copied elsewhere." />
            <DetailOutlineRow title="interaction" meta="later" body="This page becomes public only after the demos feel like system evidence, not a playground." />
            <DetailOutlineRow title="command" meta="control layer" body="Command-K carries contextual utilities so the homepage stays quiet." />
          </div>
        </section>

        <section className="detail-outline-section interaction-os__rules">
          <DetailOutlineHeading heading="home state grammar" eyebrow="locked baseline" />
          <div className="detail-outline-list detail-outline-list--grid">
            <DetailOutlineRow title="row" meta="dot to arrow" body="internal links use one 16px Material arrow and a 2px lateral nudge." />
            <DetailOutlineRow title="section" meta="open / closed" body="sections keep one 6px signal: hollow when closed, filled when open, arrow only on intent." />
            <DetailOutlineRow title="chip" meta="glass action" body="glass appears only on explicit actions like all work, all notes, contact, and Command-K." />
            <DetailOutlineRow title="proof" meta="detail pages" body="richer demos live inside artifact surfaces, not on the homepage outline." />
          </div>
        </section>

        <section className="detail-outline-section interaction-os__proof">
          <DetailOutlineHeading heading="live interaction os" eyebrow="portfolio system proof" />
          <div className="interaction-grid">
            <InteractionTile
              id="dot-to-arrow"
              title="dot to arrow"
              label="signal family"
              caption="The mark starts as a dot, becomes a short stroke, then draws the same Material arrow used across the site."
              className="interaction-tile--wide"
            >
              <DotArrowDemo />
            </InteractionTile>

            <InteractionTile
              id="glass-chip"
              title="glass chip"
              label="action surface"
              caption="Glass is reserved for deliberate click targets, not every row."
            >
              <GlassChipDemo />
            </InteractionTile>

            <InteractionTile
              id="command-palette"
              title="command palette"
              label="control layer"
              caption="A thin glass panel with one active lens, so the command surface feels like a control layer."
              className="interaction-tile--tall"
            >
              <CommandLensDemo />
            </InteractionTile>

            <InteractionTile
              id="custom-cursor"
              title="custom cursor"
              label="graphite intent"
              caption="The cursor stays monochrome and only gets stronger over interactive targets."
            >
              <CursorDemo />
            </InteractionTile>

            <InteractionTile
              id="route-transition"
              title="route transition"
              label="page motion"
              caption="Route changes use a tiny opacity and y transition, enough to confirm navigation without becoming a showpiece."
            >
              <RouteTransitionDemo />
            </InteractionTile>

            <InteractionTile
              id="motion-rule"
              title="motion rule"
              label="state feedback"
              caption="Motion confirms state and then settles. The row moves 2px, matching the outline grammar."
            >
              <MotionRuleDemo />
            </InteractionTile>

            <InteractionTile
              id="atlas-capacity"
              title="atlas capacity"
              label="live proof"
              caption="A compact version of the Atlas capacity model: one slider changes load, beds, priority, and next action."
              className="interaction-tile--wide"
            >
              <CapacityDemo />
            </InteractionTile>
          </div>
        </section>
        </div>
      </motion.article>
    </main>
  );
}
