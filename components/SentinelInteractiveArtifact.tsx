"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  House,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { tweens } from "@/lib/material/motion";

type TaskFilter = "all" | "active" | "completed";

const riskStats = [
  { icon: House, label: "Property", tone: "green", value: 48 },
  { icon: Clock3, label: "History", tone: "orange", value: 100 },
  { icon: Zap, label: "Forecast", tone: "red", value: 60 },
];

const recommendedActions: Array<{
  icon: ComponentType<{ size?: number }>;
  title: string;
  tag: string;
  due: string;
  body: string;
  tone: "orange" | "blue" | "purple";
}> = [
  { icon: Wind, title: "Hurricane Preparedness", tag: "High Priority", due: "1 month", body: "Area has high hurricane risk (85/100)", tone: "orange" },
  { icon: Waves, title: "Flood Protection", tag: "Urgent", due: "2 weeks", body: "Area has flood risk (68/100)", tone: "blue" },
  { icon: Home, title: "Roof Inspection & Repair", tag: "Urgent", due: "1 month", body: "Roof is 15 years old", tone: "purple" },
];

function FilterChip({
  active,
  count,
  label,
  onClick,
}: {
  active: boolean;
  count?: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="sentinel-mini-chip micro-focus micro-pressable"
      data-active={active ? "true" : undefined}
      onClick={onClick}
    >
      {label}
      {typeof count === "number" && <span>{count}</span>}
    </button>
  );
}

function AlertTile({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  return (
    <article className="sentinel-bento-tile sentinel-bento-tile--wide sentinel-bento-tile--alert" aria-label="Sentinel mitigation alert">
      <div className="sentinel-bento-topline">
        <span>mitigation plan</span>
        <span>savannah, ga</span>
      </div>
      <button
        type="button"
        className="sentinel-alert-surface micro-focus micro-pressable"
        data-expanded={expanded ? "true" : undefined}
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <AlertTriangle size={22} />
        <span>Detailed mitigation plan for 516 Drayton St.</span>
        <strong aria-hidden="true">›</strong>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="sentinel-alert-detail"
            initial={{ opacity: 0, y: 5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -2, height: 0 }}
            transition={tweens.commandLens}
          >
            <span>
              <Wind size={18} />
              hurricane exposure moved above the action threshold
            </span>
            <button type="button" className="sentinel-ios-button micro-focus micro-pressable">
              generate plan
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function ScoreTile({ score, onRefresh, refreshing }: { score: number; onRefresh: () => void; refreshing: boolean }) {
  return (
    <article className="sentinel-bento-tile" aria-label="Home vulnerability score">
      <div className="sentinel-bento-topline">
        <span>home score</span>
        <button
          type="button"
          className="sentinel-icon-button micro-focus micro-pressable"
          data-active={refreshing ? "true" : undefined}
          onClick={onRefresh}
          aria-label="Refresh home vulnerability score"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      <div className="sentinel-hvs-mini" aria-label={`HVS ${score} High Risk`}>
        <strong>{score}</strong>
        <span>HVS</span>
        <em>High Risk</em>
      </div>
      <p>Risk surfaced as one score before the user sees the breakdown.</p>
    </article>
  );
}

function TaskTile({ filter, onFilterChange }: { filter: TaskFilter; onFilterChange: (filter: TaskFilter) => void }) {
  const completed = filter === "completed";

  return (
    <article className="sentinel-bento-tile sentinel-bento-tile--wide sentinel-bento-tile--task" aria-label="Action plan task state">
      <div className="sentinel-ios-heading-mini">
        <h3>Action Plan</h3>
        <button type="button" className="sentinel-icon-button micro-focus micro-pressable" aria-label="Add task">
          <Plus size={18} />
        </button>
      </div>
      <div className="sentinel-mini-filter-row" aria-label="Task filters">
        <FilterChip active={filter === "all"} label="All" onClick={() => onFilterChange("all")} />
        <FilterChip active={filter === "active"} count={1} label="Active" onClick={() => onFilterChange("active")} />
        <FilterChip active={filter === "completed"} count={completed ? 1 : 0} label="Completed" onClick={() => onFilterChange("completed")} />
      </div>
      <label className="sentinel-mini-search">
        <Search size={16} />
        <input aria-label="Search tasks" placeholder="Search tasks..." readOnly value="" />
      </label>
      <button type="button" className="sentinel-mini-task micro-focus micro-pressable" data-completed={completed ? "true" : undefined}>
        <span className="sentinel-mini-task__circle">{completed && <CheckCircle2 size={18} />}</span>
        <span className="sentinel-mini-task__copy">
          <strong>Heavy Rain: Check your drains</strong>
          <em>
            <CalendarDays size={14} />
            Maintenance
          </em>
        </span>
        <i aria-hidden="true" />
      </button>
    </article>
  );
}

function RiskTile() {
  return (
    <article className="sentinel-bento-tile" aria-label="Risk breakdown">
      <div className="sentinel-bento-topline">
        <span>risk breakdown</span>
        <span>3 signals</span>
      </div>
      <div className="sentinel-mini-risk-grid">
        {riskStats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="sentinel-mini-risk-card" data-tone={item.tone}>
              <Icon size={22} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function RecommendationsTile({ activeIndex, onSelect }: { activeIndex: number; onSelect: (index: number) => void }) {
  return (
    <article className="sentinel-bento-tile sentinel-bento-tile--wide sentinel-bento-tile--recommendations" aria-label="Recommended actions">
      <div className="sentinel-recommend-mini-heading">
        <ShieldCheck size={19} />
        <h3>Recommended Actions &amp; Deadlines</h3>
      </div>
      <div className="sentinel-recommend-mini-list">
        {recommendedActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              type="button"
              className="sentinel-recommend-mini-row micro-focus micro-pressable"
              data-active={activeIndex === index ? "true" : undefined}
              data-tone={action.tone}
              onClick={() => onSelect(index)}
            >
              <span>
                <Icon size={20} />
              </span>
              <span>
                <strong>{action.title}</strong>
                <em>{action.tag} · {action.due}</em>
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={recommendedActions[activeIndex].body}
          className="sentinel-recommend-mini-detail"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={tweens.fast}
        >
          {recommendedActions[activeIndex].body}
        </motion.p>
      </AnimatePresence>
    </article>
  );
}

export default function SentinelInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [alertOpen, setAlertOpen] = useState(true);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [score, setScore] = useState(28);
  const [refreshing, setRefreshing] = useState(false);
  const [activeRecommendation, setActiveRecommendation] = useState(0);

  function refreshScore() {
    setRefreshing(true);
    setScore((current) => (current === 28 ? 34 : 28));
    window.setTimeout(() => setRefreshing(false), 600);
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
        <h2 id="sentinel-artifact-title">sentinel ui states</h2>
      </div>

      <div className="sentinel-live-surface">
        <div className="sentinel-bento-grid">
          <AlertTile expanded={alertOpen} onToggle={() => setAlertOpen((value) => !value)} />
          <ScoreTile score={score} onRefresh={refreshScore} refreshing={refreshing} />
          <TaskTile filter={filter} onFilterChange={setFilter} />
          <RiskTile />
          <RecommendationsTile activeIndex={activeRecommendation} onSelect={setActiveRecommendation} />
        </div>
      </div>
    </motion.section>
  );
}
