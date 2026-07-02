"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  Command,
  Copy,
  Mail,
  MessageCircle,
  Search,
  Sparkles,
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

const mindlineStates = [
  { label: "urge", value: "high", tone: "red" },
  { label: "stress", value: "rising", tone: "orange" },
  { label: "support", value: "nearby", tone: "green" },
] as const;

export function MindlineInteractiveArtifact() {
  const reduceMotion = useReducedMotion();
  const [activeState, setActiveState] = useState(0);
  const state = mindlineStates[activeState] ?? mindlineStates[0];

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
          <div className="mindline-phone-ui">
            <header>
              <span>Mindline</span>
              <Brain size={18} />
            </header>
            <section className="mindline-log-card">
              <span>current state</span>
              <strong>{state.label}</strong>
              <em>{state.value}</em>
            </section>
            <div className="mindline-state-row">
              {mindlineStates.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  className="micro-focus micro-pressable"
                  data-active={index === activeState ? "true" : undefined}
                  data-tone={item.tone}
                  onClick={() => setActiveState(index)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </ProjectUiTile>

        <ProjectUiTile className="mindline-ui-tile--suggestion" label="Mindline suggestion interface">
          <div className="mindline-suggestion-ui">
            <Sparkles size={19} />
            <strong>pause before the bet</strong>
            <span>walk for 10 minutes, then write the trigger.</span>
            <button type="button" className="micro-focus micro-pressable">
              start reflection
            </button>
          </div>
        </ProjectUiTile>

        <ProjectUiTile className="mindline-ui-tile--insight" label="Mindline insight interface">
          <div className="mindline-insight-ui">
            <Activity size={18} />
            <div className="mindline-insight-ui__bars" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
            <p>late night stress is the strongest pattern.</p>
          </div>
        </ProjectUiTile>

        <ProjectUiTile className="mindline-ui-tile--calendar" label="Mindline calendar interface">
          <div className="mindline-calendar-ui">
            <CalendarDays size={17} />
            <div>
              {Array.from({ length: 21 }).map((_, index) => (
                <span key={index} data-active={index % 5 === 0 || index === 13 ? "true" : undefined} />
              ))}
            </div>
          </div>
        </ProjectUiTile>
      </div>
    </motion.section>
  );
}
