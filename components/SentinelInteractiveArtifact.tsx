"use client";

import { useState } from "react";
import type { CSSProperties, ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Home,
  House,
  ListChecks,
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
  { icon: House, label: "Property Risk", tone: "green", value: 48 },
  { icon: Clock3, label: "Historical Exposure", tone: "orange", value: 100 },
  { icon: Zap, label: "Forecast Severity", tone: "red", value: 60 },
] as const;

const recommendedActions: Array<{
  icon: ComponentType<{ size?: number }>;
  title: string;
  tag: string;
  due: string;
  body: string;
  tone: "orange" | "blue" | "purple";
}> = [
  {
    icon: Wind,
    title: "Hurricane Preparedness",
    tag: "High Priority",
    due: "1 month",
    body: "Area has high hurricane risk (85/100)",
    tone: "orange",
  },
  {
    icon: Waves,
    title: "Flood Protection",
    tag: "Urgent",
    due: "2 weeks",
    body: "Area has flood risk (68/100)",
    tone: "blue",
  },
  {
    icon: Home,
    title: "Roof Inspection & Repair",
    tag: "Urgent",
    due: "1 month",
    body: "Roof is 15 years old",
    tone: "purple",
  },
];

function SentinelTile({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <article className={`project-ui-tile sentinel-ui-tile ${className}`} aria-label={label}>
      <div className="sentinel-ui-stage">{children}</div>
    </article>
  );
}

function SentinelStatusBar({ time }: { time: string }) {
  return (
    <div className="sentinel-ui-status">
      <span>{time}</span>
      <span className="sentinel-ui-island" aria-hidden="true" />
      <span className="sentinel-ui-status-icons" aria-hidden="true">
        <i />
        <i />
        <i />
        <b />
      </span>
    </div>
  );
}

function SentinelTabbar({ active }: { active: "Dashboard" | "Tasks" | "History" | "Profile" }) {
  const items = [
    { icon: Home, label: "Dashboard" },
    { icon: ListChecks, label: "Tasks" },
    { icon: Clock3, label: "History" },
    { icon: House, label: "Profile" },
  ] as const;

  return (
    <nav className="sentinel-ui-tabbar" aria-label="Sentinel tabs">
      {items.map((item) => {
        const Icon = item.icon;
        return (
        <button
          key={item.label}
          type="button"
          className="micro-focus micro-pressable"
          data-active={active === item.label ? "true" : undefined}
        >
          <Icon size={18} />
          <span>{item.label}</span>
        </button>
        );
      })}
    </nav>
  );
}

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
      className="sentinel-ui-filter-chip micro-focus micro-pressable"
      data-active={active ? "true" : undefined}
      onClick={onClick}
    >
      {label}
      {typeof count === "number" && <span>{count}</span>}
    </button>
  );
}

function DashboardScene({
  expanded,
  onRefresh,
  onToggleAlert,
  refreshing,
  score,
}: {
  expanded: boolean;
  onRefresh: () => void;
  onToggleAlert: () => void;
  refreshing: boolean;
  score: number;
}) {
  return (
    <div className="sentinel-phone-scene sentinel-phone-scene--dashboard">
      <SentinelStatusBar time="8:31" />
      <header className="sentinel-ui-title-row">
        <h3>Sentinel</h3>
        <button
          type="button"
          className="sentinel-ui-floating-action micro-focus micro-pressable"
          data-active={refreshing ? "true" : undefined}
          aria-label="Refresh home vulnerability score"
          onClick={onRefresh}
        >
          <RefreshCw size={22} />
        </button>
      </header>

      <button
        type="button"
        className="sentinel-ui-alert micro-focus micro-pressable"
        data-expanded={expanded ? "true" : undefined}
        aria-expanded={expanded}
        onClick={onToggleAlert}
      >
        <AlertTriangle size={26} />
        <span>
          <strong>Here is a detailed, actionable mitigation plan for your property at 516 Drayton St.</strong>
          <em>Savannah, GA 31401</em>
        </span>
        <strong aria-hidden="true">›</strong>
      </button>

      <section className="sentinel-ui-score-card" aria-label={`HVS ${score} High Risk`}>
        <h4>Home Vulnerability Score</h4>
        <div className="sentinel-ui-gauge" style={{ "--sentinel-score": `${score * 3.6}deg` } as CSSProperties}>
          <strong>{score}</strong>
          <span>HVS</span>
          <em>High Risk</em>
        </div>
        <p>Your home has significant vulnerabilities. Immediate action is recommended.</p>
      </section>

      <h4 className="sentinel-ui-section-title">Risk Breakdown</h4>
      <div className="sentinel-ui-risk-grid">
        {riskStats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="sentinel-ui-risk-card" data-tone={item.tone}>
              <Icon size={24} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>

      <SentinelTabbar active="Dashboard" />
    </div>
  );
}

function ActionPlanScene({
  filter,
  onFilterChange,
}: {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}) {
  const completed = filter === "completed";

  return (
    <div className="sentinel-phone-scene sentinel-phone-scene--tasks">
      <SentinelStatusBar time="9:29" />
      <header className="sentinel-ui-title-row">
        <h3>Action Plan</h3>
        <button type="button" className="sentinel-ui-floating-action micro-focus micro-pressable" aria-label="Add task">
          <Plus size={22} />
        </button>
      </header>

      <div className="sentinel-ui-filter-row" aria-label="Task filters">
        <FilterChip active={filter === "all"} label="All" onClick={() => onFilterChange("all")} />
        <FilterChip active={filter === "active"} count={1} label="Active" onClick={() => onFilterChange("active")} />
        <FilterChip active={filter === "completed"} count={completed ? 1 : 0} label="Completed" onClick={() => onFilterChange("completed")} />
      </div>

      <label className="sentinel-ui-search">
        <Search size={18} />
        <input aria-label="Search tasks" placeholder="Search tasks..." readOnly value="" />
      </label>

      <div className="sentinel-ui-task-stats">
        <span>
          <strong>1</strong>
          total
        </span>
        <span>
          <strong>1</strong>
          active
        </span>
        <span>
          <strong>{completed ? 1 : 0}</strong>
          done
        </span>
      </div>

      <button type="button" className="sentinel-ui-task-row micro-focus micro-pressable" data-completed={completed ? "true" : undefined}>
        <span className="sentinel-ui-task-circle">{completed && <CheckCircle2 size={19} />}</span>
        <span className="sentinel-ui-task-copy">
          <strong>Heavy Rain: Check your drains</strong>
          <em>
            <CalendarDays size={15} />
            Maintenance
          </em>
        </span>
        <i aria-hidden="true" />
      </button>

      <SentinelTabbar active="Tasks" />
    </div>
  );
}

function RecommendationScene({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="sentinel-phone-scene sentinel-phone-scene--recommendations">
      <SentinelStatusBar time="10:52" />
      <h3 className="sentinel-ui-centered-title">Historical Timeline</h3>
      <div className="sentinel-ui-recommend-card">
        <div className="sentinel-ui-recommend-heading">
          <ShieldCheck size={24} />
          <h3>Recommended Actions &amp; Deadlines</h3>
        </div>
        <div className="sentinel-ui-recommend-list">
          {recommendedActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                type="button"
                className="sentinel-ui-recommend-row micro-focus micro-pressable"
                data-active={activeIndex === index ? "true" : undefined}
                data-tone={action.tone}
                onClick={() => onSelect(index)}
              >
                <span>
                  <Icon size={23} />
                </span>
                <span className="sentinel-ui-recommend-copy">
                  <strong>{action.title}</strong>
                  <em>
                    <b>{action.tag}</b>
                    <i>Complete within {action.due}</i>
                  </em>
                  <small>{action.body}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <SentinelTabbar active="History" />
    </div>
  );
}

function WeatherTimelineScene() {
  return (
    <div className="sentinel-phone-scene sentinel-phone-scene--timeline">
      <SentinelStatusBar time="9:03" />
      <header className="sentinel-ui-title-row">
        <h3>Historical Timeline</h3>
      </header>
      <section className="sentinel-ui-timeline-summary" aria-label="Historical exposure summary">
        <span>
          <em>Total Events (15 years)</em>
          <strong>8</strong>
        </span>
        <span>
          <em>Exposure Level</em>
          <strong>High</strong>
        </span>
        <i aria-hidden="true" />
      </section>
      <h4 className="sentinel-ui-section-title">Historical Events</h4>
      <div className="sentinel-ui-weather-card">
        <span className="sentinel-ui-weather-icon">
          <Waves size={25} />
        </span>
        <span>
          <strong>Flood</strong>
          <em>February 24, 2025</em>
        </span>
        <b>Moderate</b>
      </div>
      <div className="sentinel-ui-timeline">
        <span aria-hidden="true" />
        <div>
          <strong>Heavy rainfall</strong>
          <p>Heavy rainfall led to flash flooding.</p>
        </div>
      </div>
      <div className="sentinel-ui-timeline sentinel-ui-timeline--green">
        <span aria-hidden="true" />
        <div>
          <strong>Hailstorm</strong>
          <p>Severe thunderstorm with golf ball-sized hail.</p>
        </div>
      </div>
      <div className="sentinel-ui-weather-card sentinel-ui-weather-card--alert">
        <span className="sentinel-ui-weather-icon">
          <Wind size={25} />
        </span>
        <span>
          <strong>Hurricane</strong>
          <em>October 24, 2023</em>
        </span>
        <b>Severe</b>
      </div>
      <SentinelTabbar active="History" />
    </div>
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
      className="project-ui-artifact sentinel-artifact"
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      aria-label="Sentinel interface board"
    >
      <div className="project-ui-board project-ui-board--sentinel">
        <SentinelTile className="sentinel-ui-tile--dashboard" label="Sentinel dashboard interface">
          <DashboardScene
            expanded={alertOpen}
            onRefresh={refreshScore}
            onToggleAlert={() => setAlertOpen((value) => !value)}
            refreshing={refreshing}
            score={score}
          />
        </SentinelTile>
        <SentinelTile className="sentinel-ui-tile--tasks" label="Sentinel action plan interface">
          <ActionPlanScene filter={filter} onFilterChange={setFilter} />
        </SentinelTile>
        <SentinelTile className="sentinel-ui-tile--recommendations" label="Sentinel recommendations interface">
          <RecommendationScene activeIndex={activeRecommendation} onSelect={setActiveRecommendation} />
        </SentinelTile>
        <SentinelTile className="sentinel-ui-tile--timeline" label="Sentinel weather timeline interface">
          <WeatherTimelineScene />
        </SentinelTile>
      </div>
    </motion.section>
  );
}
