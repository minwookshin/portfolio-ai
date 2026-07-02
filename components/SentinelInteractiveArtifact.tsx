"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { tweens } from "@/lib/material/motion";

type SentinelScenario = {
  id: string;
  label: string;
  location: string;
  score: number;
  level: string;
  alert: string;
  summary: string;
  action: string;
  savings: string;
  breakdown: Array<{ label: string; value: number }>;
  tasks: string[];
  tone: "watch" | "high" | "calm";
};

const sentinelScenarios: SentinelScenario[] = [
  {
    id: "storm",
    label: "storm watch",
    location: "savannah, ga",
    score: 72,
    level: "elevated",
    alert: "wind exposure rising in the next 36 hours",
    summary: "prioritize exterior checks before the forecast changes.",
    action: "secure roof edges",
    savings: "$420",
    breakdown: [
      { label: "property", value: 64 },
      { label: "history", value: 58 },
      { label: "forecast", value: 82 },
    ],
    tasks: ["check loose shingles", "clear roof drains", "document exterior condition"],
    tone: "watch",
  },
  {
    id: "flood",
    label: "flood advisory",
    location: "miami, fl",
    score: 81,
    level: "high",
    alert: "flood probability moved above the action threshold",
    summary: "turn forecast and home profile into one visible next step.",
    action: "move valuables above grade",
    savings: "$610",
    breakdown: [
      { label: "property", value: 51 },
      { label: "history", value: 78 },
      { label: "forecast", value: 91 },
    ],
    tasks: ["raise stored equipment", "test sump backup", "photo basement entry points"],
    tone: "high",
  },
  {
    id: "maintenance",
    label: "maintenance",
    location: "atlanta, ga",
    score: 46,
    level: "moderate",
    alert: "risk is stable, maintenance window is open",
    summary: "use calm periods to improve the next risk calculation.",
    action: "replace hvac filter",
    savings: "$180",
    breakdown: [
      { label: "property", value: 72 },
      { label: "history", value: 38 },
      { label: "forecast", value: 29 },
    ],
    tasks: ["replace filter", "verify smart monitor", "update roof age"],
    tone: "calm",
  },
];

const taskMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -2 },
};

function SentinelGauge({ score, level, tone }: { score: number; level: string; tone: SentinelScenario["tone"] }) {
  const gaugeStyle = { "--sentinel-score": `${score * 3.6}deg` } as CSSProperties & Record<"--sentinel-score", string>;

  return (
    <div
      className="sentinel-gauge"
      data-tone={tone}
      style={gaugeStyle}
      aria-label={`home vulnerability score ${score}, ${level}`}
    >
      <div className="sentinel-gauge__inner">
        <motion.span
          key={score}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={tweens.fast}
        >
          {score}
        </motion.span>
        <small>hvs</small>
        <em>{level}</em>
      </div>
    </div>
  );
}

export default function SentinelInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(sentinelScenarios[0].id);
  const [planReady, setPlanReady] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const active = useMemo(
    () => sentinelScenarios.find((scenario) => scenario.id === activeId) ?? sentinelScenarios[0],
    [activeId]
  );

  function selectScenario(id: string) {
    setActiveId(id);
    setPlanReady(false);
    setCompleted([]);
  }

  function toggleTask(task: string) {
    setCompleted((items) =>
      items.includes(task) ? items.filter((item) => item !== task) : [...items, task]
    );
  }

  return (
    <motion.section
      className="sentinel-artifact"
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      aria-labelledby="sentinel-artifact-title"
    >
      <div className="sentinel-artifact__intro">
        <p className="sentinel-artifact__eyebrow">live artifact</p>
        <h2 id="sentinel-artifact-title">risk into one next action</h2>
      </div>

      <div className="sentinel-console" data-tone={active.tone}>
        <div className="sentinel-console__scenario" aria-label="risk scenarios">
          {sentinelScenarios.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              className="micro-focus micro-pressable"
              data-active={scenario.id === active.id ? "true" : undefined}
              onClick={() => selectScenario(scenario.id)}
            >
              {scenario.label}
            </button>
          ))}
        </div>

        <div className="sentinel-console__grid">
          <div className="sentinel-device" aria-label="sentinel dashboard state">
            <div className="sentinel-device__chrome">
              <span>sentinel</span>
              <span>{active.location}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="sentinel-alert"
                data-tone={active.tone}
                {...taskMotion}
                transition={reduceMotion ? tweens.none : tweens.fast}
              >
                <span />
                <p>{active.alert}</p>
              </motion.div>
            </AnimatePresence>

            <div className="sentinel-score-card">
              <SentinelGauge score={active.score} level={active.level} tone={active.tone} />
              <p>{active.summary}</p>
            </div>

            <div className="sentinel-breakdown" aria-label="risk breakdown">
              {active.breakdown.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <i style={{ transform: `scaleX(${item.value / 100})` }} />
                </div>
              ))}
            </div>
          </div>

          <div className="sentinel-action-panel">
            <div className="sentinel-action-panel__header">
              <span>next action</span>
              <span>{active.savings} est. impact</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.id}-${planReady ? "ready" : "draft"}`}
                className="sentinel-action-card"
                {...taskMotion}
                transition={reduceMotion ? tweens.none : tweens.fast}
              >
                <p>{active.action}</p>
                <span>{planReady ? "action plan generated" : "ready to generate"}</span>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              className="sentinel-generate micro-focus micro-pressable"
              data-ready={planReady ? "true" : undefined}
              onClick={() => setPlanReady(true)}
            >
              {planReady ? "generated" : "generate action plan"}
            </button>

            <div className="sentinel-task-stack" aria-label="recommended tasks" aria-live="polite">
              {active.tasks.map((task) => {
                const isDone = completed.includes(task);
                return (
                  <button
                    key={`${active.id}-${task}`}
                    type="button"
                    className="sentinel-task micro-focus micro-pressable"
                    data-active={planReady ? "true" : undefined}
                    data-done={isDone ? "true" : undefined}
                    disabled={!planReady}
                    onClick={() => toggleTask(task)}
                  >
                    <span aria-hidden="true" />
                    <p>{task}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
