"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Calculator,
  ChevronDown,
  Command,
  Copy,
  Home,
  Inbox,
  Info,
  Mail,
  MessageCircle,
  Plus,
  Search,
  User,
} from "lucide-react";
import { tweens } from "@/lib/material/motion";

function ProjectUiTile({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <article className={`project-ui-tile ${className}`} aria-label={label}>
      {children}
    </article>
  );
}

const portfolioCommands = [
  { icon: Search, label: "view work", meta: "enter" },
  { icon: MessageCircle, label: "ask about this portfolio", meta: "ai" },
  { icon: Mail, label: "copy email", meta: "copy" },
  { icon: Copy, label: "copy current link", meta: "url" },
] as const;

export function PortfolioAiInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(1);
  const activeCommand = portfolioCommands[activeIndex] ?? portfolioCommands[0];

  return (
    <motion.section
      className="project-ui-artifact portfolio-artifact"
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      aria-label="Portfolio AI interface board"
    >
      <div className="project-ui-board project-ui-board--portfolio">
        <ProjectUiTile className="portfolio-ui-tile--command" label="Portfolio command interface">
          <div className="portfolio-command-ui">
            <label className="portfolio-command-ui__search">
              <Search size={18} />
              <input readOnly value="" placeholder="search index commands" aria-label="Search index commands" />
              <span>esc</span>
            </label>
            <div className="portfolio-command-ui__rows">
              {portfolioCommands.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    className="micro-focus micro-pressable"
                    data-active={activeIndex === index ? "true" : undefined}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    <em>{item.meta}</em>
                  </button>
                );
              })}
            </div>
          </div>
        </ProjectUiTile>

        <ProjectUiTile className="portfolio-ui-tile--chat" label="Portfolio AI chat interface">
          <div className="portfolio-chat-ui">
            <div className="portfolio-chat-ui__bubble portfolio-chat-ui__bubble--user">
              {activeCommand.label}
            </div>
            <div className="portfolio-chat-ui__bubble">
              i route visitors to the right proof instead of turning the site into a chatbot.
            </div>
            <label className="portfolio-chat-ui__input">
              <span>ask about this portfolio</span>
              <ArrowRight size={17} />
            </label>
          </div>
        </ProjectUiTile>

        <ProjectUiTile className="portfolio-ui-tile--routes" label="Portfolio public route interface">
          <div className="portfolio-routes-ui">
            {["/work/atlas", "/design-system", "/portfolio.md", "/resume.json"].map((route) => (
              <button key={route} type="button" className="micro-focus micro-pressable">
                <span>{route}</span>
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </ProjectUiTile>

        <ProjectUiTile className="portfolio-ui-tile--system" label="Portfolio system contract interface">
          <div className="portfolio-system-ui">
            <Command size={18} />
            <code>intent.view.work</code>
            <code>intent.copy.email</code>
            <code>intent.ask.portfolio</code>
          </div>
        </ProjectUiTile>
      </div>
    </motion.section>
  );
}

const mindlineMoods = [
  "Guilty",
  "Overwhelmed",
  "Anxious",
  "Lost",
  "Ashamed",
  "Neutral",
  "Hopeful",
  "Excited",
  "Distracted",
  "Tired",
] as const;

type MindlineMood = (typeof mindlineMoods)[number];

function MindlineStatusBar() {
  return (
    <div className="mindline-statusbar" aria-hidden="true">
      <span>9:41</span>
      <span className="mindline-statusbar__system">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

function MindlineToolbar() {
  return (
    <div className="mindline-toolbar">
      <button type="button" className="mindline-date-pill micro-focus micro-pressable">
        Today, May 10
      </button>
      <button type="button" className="mindline-icon-button micro-focus micro-pressable" aria-label="open calendar">
        <CalendarDays size={16} />
      </button>
      <span className="mindline-toolbar__spacer" />
      <button type="button" className="mindline-bare-icon micro-focus micro-pressable" aria-label="search">
        <Search size={23} />
      </button>
      <button type="button" className="mindline-bare-icon mindline-bare-icon--inbox micro-focus micro-pressable" aria-label="inbox">
        <Inbox size={23} />
      </button>
    </div>
  );
}

function MindlineBottomNav() {
  return (
    <nav className="mindline-tabbar" aria-label="Mindline app navigation">
      <button type="button" className="mindline-tabbar__item micro-focus micro-pressable" data-active="true" aria-label="home">
        <Home size={25} />
      </button>
      <button type="button" className="mindline-tabbar__item micro-focus micro-pressable" aria-label="tools">
        <Calculator size={24} />
      </button>
      <button type="button" className="mindline-tabbar__item mindline-tabbar__calendar micro-focus micro-pressable" aria-label="schedule">
        <span>12</span>
      </button>
      <button type="button" className="mindline-tabbar__item mindline-tabbar__ratio micro-focus micro-pressable" aria-label="odds">
        <span>2:0</span>
      </button>
      <button type="button" className="mindline-tabbar__item micro-focus micro-pressable" aria-label="profile">
        <User size={24} />
      </button>
    </nav>
  );
}

function MindlineProgress({ value }: { value?: number }) {
  if (value === undefined) {
    return null;
  }

  return (
    <div
      className="mindline-progress"
      style={{ "--mindline-progress": `${value}%` } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}

function MindlineFrame({
  children,
  className = "",
  progress,
}: {
  children: React.ReactNode;
  className?: string;
  progress?: number;
}) {
  return (
    <div className={`mindline-app-frame ${className}`}>
      <MindlineStatusBar />
      <MindlineToolbar />
      <MindlineProgress value={progress} />
      <main className="mindline-app-content">{children}</main>
      <MindlineBottomNav />
    </div>
  );
}

function MindlineFigure({ variant = "heart" }: { variant?: "heart" | "meditate" | "runner" }) {
  return (
    <div className={`mindline-figure mindline-figure--${variant}`} aria-hidden="true">
      <span className="mindline-figure__head" />
      <span className="mindline-figure__body" />
      <span className="mindline-figure__arm mindline-figure__arm--left" />
      <span className="mindline-figure__arm mindline-figure__arm--right" />
      <span className="mindline-figure__leg mindline-figure__leg--left" />
      <span className="mindline-figure__leg mindline-figure__leg--right" />
      {variant === "heart" && <span className="mindline-figure__heart" />}
    </div>
  );
}

function MindlineCheckInScene({ started, onStart }: { started: boolean; onStart: () => void }) {
  return (
    <MindlineFrame className="mindline-app-frame--checkin">
      <h3>
        Welcome Back John,
        <br />
        how&apos;s it going?
      </h3>
      <section className="mindline-checkin-card" data-started={started ? "true" : undefined}>
        <MindlineFigure variant="heart" />
        <h4>Let&apos;s check in about last night</h4>
        <p>Had a big game with the gang? Take a moment to reflect and see how you&apos;re doing today</p>
        <div className="mindline-event-strip">
          <span className="mindline-event-date">
            <em>MAY</em>
            <strong>10</strong>
          </span>
          <span className="mindline-event-copy">
            <strong>Game Night with the Gang</strong>
            <em>Sideline Social Bar</em>
            <small>Repeat event from past schedule</small>
          </span>
          <time>11:00 PM</time>
        </div>
        <div className="mindline-checkin-actions">
          <button type="button" className="micro-focus micro-pressable">
            Not right now
          </button>
          <button type="button" className="micro-focus micro-pressable" onClick={onStart}>
            {started ? "Started" : "Let’s do it!"}
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </MindlineFrame>
  );
}

function MindlineReflectionScene({ onNext }: { onNext: () => void }) {
  return (
    <MindlineFrame className="mindline-app-frame--reflection" progress={5}>
      <h3>Emotional Reflection</h3>
      <button type="button" className="mindline-select-pill micro-focus micro-pressable">
        How you feel overall today
        <ChevronDown size={15} />
      </button>
      <div className="mindline-reflection-figure">
        <MindlineFigure variant="meditate" />
      </div>
      <p className="mindline-reflection-copy">Let&apos;s start with how you&apos;ve been feeling recently.</p>
      <p className="mindline-reflection-copy mindline-reflection-copy--secondary">
        Getting in touch with your previous emotions will make reflecting way easier.
      </p>
      <div className="mindline-flow-controls">
        <button type="button" className="micro-focus micro-pressable">
          <ArrowLeft size={22} />
          Back
        </button>
        <button type="button" className="micro-focus micro-pressable" onClick={onNext}>
          Next
          <ArrowRight size={23} />
        </button>
      </div>
    </MindlineFrame>
  );
}

function MindlineMoodScene({
  selectedMood,
  onSelect,
}: {
  selectedMood: MindlineMood;
  onSelect: (mood: MindlineMood) => void;
}) {
  return (
    <MindlineFrame className="mindline-app-frame--mood" progress={38}>
      <div className="mindline-mood-heading">
        <h3>Let&apos;s Start the Log!</h3>
        <Info size={21} />
      </div>
      <div className="mindline-mood-controls">
        <button type="button" className="mindline-select-pill micro-focus micro-pressable">
          How you feel overall today
          <ChevronDown size={15} />
        </button>
        <button type="button" className="mindline-icon-button mindline-icon-button--green micro-focus micro-pressable" aria-label="add mood">
          <Plus size={24} />
        </button>
      </div>
      <span className="mindline-helper-copy">Select all that applies</span>
      <div className="mindline-mood-cloud">
        <div className="mindline-mood-orb">
          <MindlineFigure variant="runner" />
        </div>
        {mindlineMoods.map((mood, index) => (
          <button
            key={mood}
            type="button"
            className="mindline-mood-chip micro-focus micro-pressable"
            data-index={index}
            data-active={selectedMood === mood ? "true" : undefined}
            onClick={() => onSelect(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      <button type="button" className="mindline-show-more micro-focus micro-pressable">
        Show more options
        <ArrowRight size={16} />
      </button>
      <div className="mindline-flow-controls">
        <button type="button" className="micro-focus micro-pressable">
          <ArrowLeft size={22} />
          Back
        </button>
        <button type="button" className="micro-focus micro-pressable" data-disabled={selectedMood ? undefined : "true"}>
          Next
          <ArrowRight size={23} />
        </button>
      </div>
    </MindlineFrame>
  );
}

function MindlineDashboardScene({ selectedMood }: { selectedMood: MindlineMood }) {
  return (
    <MindlineFrame className="mindline-app-frame--dashboard">
      <h3>
        Welcome Back John,
        <br />
        Glad you are here!
      </h3>
      <div className="mindline-streak-track" aria-hidden="true">
        <span>1</span>
        <strong>
          Starter
          <em>2 Day</em>
          Streak
        </strong>
        <span>3</span>
        <strong>
          Made Team
          <em>7</em>
          days
        </strong>
      </div>
      <section className="mindline-risk-card">
        <strong>Possible Risk Tomorrow - 11PM</strong>
        <em>Based on your past data</em>
        <p>tomorrow night has a high likelihood of impulsive betting.</p>
        <button type="button" className="micro-focus micro-pressable">
          View Alternative Options
          <ArrowRight size={15} />
        </button>
      </section>
      <section className="mindline-state-card">
        <div className="mindline-state-card__orb">
          <MindlineFigure variant="runner" />
        </div>
        <div>
          <strong>State of Mind</strong>
          <span>{selectedMood} logged for today</span>
          <button type="button" className="micro-focus micro-pressable">
            Update Log
          </button>
        </div>
      </section>
    </MindlineFrame>
  );
}

export function MindlineInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [selectedMood, setSelectedMood] = useState<MindlineMood>("Hopeful");
  const [started, setStarted] = useState(false);

  return (
    <motion.section
      className="project-ui-artifact mindline-artifact"
      initial={reduceMotion ? false : { opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? tweens.none : tweens.fast}
      aria-label="Mindline interface board"
    >
      <div className="project-ui-board project-ui-board--mindline">
        <ProjectUiTile className="mindline-ui-tile--log" label="Mindline log interface">
          <MindlineCheckInScene started={started} onStart={() => setStarted(true)} />
        </ProjectUiTile>

        <ProjectUiTile className="mindline-ui-tile--suggestion" label="Mindline suggestion interface">
          <MindlineReflectionScene onNext={() => setStarted(true)} />
        </ProjectUiTile>

        <ProjectUiTile className="mindline-ui-tile--insight" label="Mindline insight interface">
          <MindlineMoodScene selectedMood={selectedMood} onSelect={setSelectedMood} />
        </ProjectUiTile>

        <ProjectUiTile className="mindline-ui-tile--calendar" label="Mindline calendar interface">
          <MindlineDashboardScene selectedMood={selectedMood} />
        </ProjectUiTile>
      </div>
    </motion.section>
  );
}
