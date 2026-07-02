"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Gauge,
  History,
  Home,
  House,
  ListChecks,
  Plus,
  RefreshCw,
  Search,
  User,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { tweens } from "@/lib/material/motion";

type SentinelScreen = "dashboard" | "tasks" | "history" | "profile";
type TaskFilter = "all" | "active" | "completed";

const screenTabs: Array<{ id: SentinelScreen; icon: ComponentType<{ size?: number }>; label: string }> = [
  { id: "dashboard", icon: Gauge, label: "Dashboard" },
  { id: "tasks", icon: ListChecks, label: "Tasks" },
  { id: "history", icon: History, label: "History" },
  { id: "profile", icon: User, label: "Profile" },
];

const riskStats = [
  { icon: House, label: "Property", tone: "green", value: 48 },
  { icon: Clock3, label: "History", tone: "orange", value: 100 },
  { icon: Zap, label: "Forecast", tone: "red", value: 60 },
];

const recommendedActions = [
  { icon: Wind, title: "Hurricane Preparedness", tag: "High Priority", due: "1 month", body: "Area has high hurricane risk (85/100)", tone: "orange" },
  { icon: Waves, title: "Flood Protection", tag: "Urgent", due: "2 weeks", body: "Area has flood risk (68/100)", tone: "blue" },
  { icon: Home, title: "Roof Inspection & Repair", tag: "Urgent", due: "1 month", body: "Roof is 15 years old", tone: "purple" },
  { icon: AlertTriangle, title: "Emergency Kit & Plan", tag: "High Priority", due: "1 week", body: "Active weather alerts in your area", tone: "orange" },
];

function StatusBar({ time }: { time: string }) {
  return (
    <div className="sentinel-phone-status" aria-hidden="true">
      <span>{time}</span>
      <span className="sentinel-dynamic-island" />
      <span className="sentinel-status-icons">•••• wifi</span>
    </div>
  );
}

function DashboardScreen({ isRefreshing, onRefresh }: { isRefreshing: boolean; onRefresh: () => void }) {
  return (
    <div className="sentinel-ios-screen sentinel-ios-screen--dashboard">
      <StatusBar time="8:31" />
      <div className="sentinel-ios-heading-row">
        <h3>Sentinel</h3>
        <button
          type="button"
          className="sentinel-ios-float-button micro-focus micro-pressable"
          aria-label="Refresh Sentinel dashboard"
          onClick={onRefresh}
          data-active={isRefreshing ? "true" : undefined}
        >
          <RefreshCw size={26} />
        </button>
      </div>

      <button type="button" className="sentinel-ios-alert micro-focus micro-pressable">
        <AlertTriangle size={24} />
        <span>Here is a detailed, actionable mitigation plan for your property at 516 Drayton St, Savannah, GA 31401:</span>
        <strong aria-hidden="true">›</strong>
      </button>

      <section className="sentinel-hvs-card" aria-label="Home Vulnerability Score">
        <h4>Home Vulnerability Score</h4>
        <div className="sentinel-hvs-gauge" aria-label="HVS 28 High Risk">
          <div>
            <strong>28</strong>
            <span>HVS</span>
            <em>High Risk</em>
          </div>
        </div>
        <p>Your home has significant vulnerabilities (score: 28). Immediate action is recommended.</p>
      </section>

      <h4 className="sentinel-section-title">Risk Breakdown</h4>
      <div className="sentinel-risk-grid" aria-label="Risk Breakdown">
        {riskStats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="sentinel-risk-card" data-tone={item.tone}>
              <Icon size={27} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
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
      className="sentinel-filter-chip micro-focus micro-pressable"
      data-active={active ? "true" : undefined}
      onClick={onClick}
    >
      {label}
      {typeof count === "number" && <span>{count}</span>}
    </button>
  );
}

function TasksScreen({ filter, onFilterChange }: { filter: TaskFilter; onFilterChange: (filter: TaskFilter) => void }) {
  const isCompleted = filter === "completed";

  return (
    <div className="sentinel-ios-screen sentinel-ios-screen--tasks">
      <StatusBar time="9:29" />
      <div className="sentinel-ios-heading-row">
        <h3>Action Plan</h3>
        <button type="button" className="sentinel-ios-float-button micro-focus micro-pressable" aria-label="Add task">
          <Plus size={28} />
        </button>
      </div>

      <div className="sentinel-filter-row" aria-label="Task filters">
        <FilterChip active={filter === "all"} label="All" onClick={() => onFilterChange("all")} />
        <FilterChip active={filter === "active"} count={1} label="Active" onClick={() => onFilterChange("active")} />
        <FilterChip active={filter === "completed"} count={0} label="Completed" onClick={() => onFilterChange("completed")} />
      </div>

      <label className="sentinel-search-pill">
        <Search size={21} />
        <input aria-label="Search tasks" placeholder="Search tasks..." readOnly value="" />
      </label>

      <div className="sentinel-task-stats" aria-label="Task statistics">
        <div>
          <strong>1</strong>
          <span>Total</span>
        </div>
        <div>
          <strong>1</strong>
          <span>Active</span>
        </div>
        <div>
          <strong>{isCompleted ? "1" : "0"}</strong>
          <span>Done</span>
        </div>
      </div>

      <button type="button" className="sentinel-task-row micro-focus micro-pressable" data-completed={isCompleted ? "true" : undefined}>
        <span className="sentinel-task-circle">
          {isCompleted && <CheckCircle2 size={20} />}
        </span>
        <span className="sentinel-task-copy">
          <strong>Heavy Rain: Check your drains</strong>
          <em>
            <CalendarDays size={16} />
            Maintenance
          </em>
        </span>
        <i aria-hidden="true" />
      </button>
    </div>
  );
}

function HistoryScreen() {
  return (
    <div className="sentinel-ios-screen sentinel-ios-screen--history">
      <StatusBar time="10:52" />
      <h3 className="sentinel-centered-title">Historical Timeline</h3>
      <section className="sentinel-recommend-card">
        <div className="sentinel-recommend-heading">
          <CalendarDays size={24} />
          <h4>Recommended Actions &amp; Deadlines</h4>
        </div>
        <div className="sentinel-recommend-list">
          {recommendedActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.title} type="button" className="sentinel-recommend-row micro-focus micro-pressable" data-tone={action.tone}>
                <span>
                  <Icon size={25} />
                </span>
                <span className="sentinel-recommend-copy">
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
      </section>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="sentinel-ios-screen sentinel-ios-screen--profile">
      <StatusBar time="8:46" />
      <h3>Your Property</h3>
      <section className="sentinel-profile-card">
        <p>516 Drayton St</p>
        <span>Savannah, GA 31401</span>
        <dl>
          <div>
            <dt>roof age</dt>
            <dd>15 years</dd>
          </div>
          <div>
            <dt>foundation</dt>
            <dd>slab</dd>
          </div>
          <div>
            <dt>monitoring</dt>
            <dd>enabled</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

export default function SentinelInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [activeScreen, setActiveScreen] = useState<SentinelScreen>("dashboard");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  function refreshDashboard() {
    setIsRefreshing(true);
    window.setTimeout(() => setIsRefreshing(false), 650);
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
        <div className="sentinel-phone-shell">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -3 }}
              transition={reduceMotion ? tweens.none : tweens.commandLens}
              className="sentinel-phone-screen-wrap"
            >
              {activeScreen === "dashboard" && <DashboardScreen isRefreshing={isRefreshing} onRefresh={refreshDashboard} />}
              {activeScreen === "tasks" && <TasksScreen filter={filter} onFilterChange={setFilter} />}
              {activeScreen === "history" && <HistoryScreen />}
              {activeScreen === "profile" && <ProfileScreen />}
            </motion.div>
          </AnimatePresence>

          <nav className="sentinel-tabbar" aria-label="Sentinel app tabs">
            {screenTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className="micro-focus micro-pressable"
                  data-active={activeScreen === tab.id ? "true" : undefined}
                  onClick={() => setActiveScreen(tab.id)}
                >
                  <Icon size={24} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.section>
  );
}
