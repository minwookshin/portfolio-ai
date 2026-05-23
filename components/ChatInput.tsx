"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ArrowRight, ListFilter, Code2, Sparkles, PenTool, User } from "lucide-react";
import { LinkedInIcon } from "./LinkedInIcon";
import { IconButton } from "@/components/material/IconButton";
import { springs } from "@/lib/material/motion";

type ConnectorKind = "profile" | "project" | "chat" | null;

interface ChatInputProps {
  onSend: (message: string) => void;
  hasStarted?: boolean;
  connectorKind?: ConnectorKind;
  connectorSrc?: string;
  linkedinUrl?: string;
  onClose?: () => void;
  onProfile?: () => void;
  onFilter?: () => void;
  filterOpen?: boolean;
  filters?: readonly string[];
  activeCategory?: string | null;
  onSelectCategory?: (category: string | null) => void;
  onFocusInput?: () => void;
}

const outsideBtn =
  "glass-stroke bg-surface shrink-0 w-14 h-14 rounded-full text-on-surface flex items-center justify-center transition-colors";

// Stickier than the shared springs (more mass, gentler damping) so the filter
// pill opens and closes with a smooth, weighted settle.
const filterMorph = { type: "spring", stiffness: 220, damping: 30, mass: 1.7 } as const;

export default function ChatInput({
  onSend,
  hasStarted = true,
  connectorKind = null,
  connectorSrc,
  linkedinUrl,
  onClose,
  onProfile,
  onFilter,
  filterOpen,
  filters,
  activeCategory,
  onSelectCategory,
  onFocusInput,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The bar sits collapsed as a pill (placeholder + mic) until the user taps it;
  // it expands into the full composer while focused, typing, or dictating. It
  // also stays collapsed while the filter chips are open, to make room for them.
  const expanded = !filterOpen && (focused || input.length > 0 || isListening);

  // The filter glyph reflects the active category.
  const FilterGlyph =
    activeCategory === "Engineering" ? Code2 :
    activeCategory === "AI" ? Sparkles :
    activeCategory === "Design" ? PenTool : ListFilter;
  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  // Tap anywhere outside the filter pill collapses it (the active category stays).
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!filterOpen) return;
    const onDown = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) onFilter?.();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [filterOpen, onFilter]);

  const clearWatchdog = () => {
    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  };

  // Initialize speech recognition ONCE - re-creating it on every toggle
  // tears down the instance that just started listening. State is driven by
  // the recognizer's own lifecycle events (onstart/onend/onerror) so the
  // button can never get stuck "on" when the user denies the mic permission
  // or recognition silently fails.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      setInput(transcript);
    };
    // Fires on permission denial ('not-allowed'), no speech, or capture failure.
    recognition.onerror = () => { clearWatchdog(); setIsListening(false); };
    recognition.onend = () => { clearWatchdog(); setIsListening(false); };
    recognitionRef.current = recognition;

    return () => {
      clearWatchdog();
      try { recognition.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const stopListening = () => {
    clearWatchdog();
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      if (isListening) stopListening();
      onSend(input.trim());
      setInput("");
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.");
      return;
    }
    if (isListening) {
      stopListening();
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
      // Safety net: if the recognizer never reports back (denied permission,
      // no audio device, silent failure), force it off so it can't stick on.
      clearWatchdog();
      watchdogRef.current = setTimeout(() => {
        try { recognitionRef.current?.stop(); } catch {}
        setIsListening(false);
      }, 10000);
    } catch {
      // start() throws if already running - reset and let onend settle it.
      setIsListening(false);
    }
  };

  return (
    <>
      {hasStarted && (
        <div className="fixed bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none z-40" />
      )}

      <div className="fixed z-[80] left-1/2 bottom-10 -translate-x-1/2 w-full max-w-[700px] px-4 flex items-center justify-center gap-2">
        {/* Close (esc) - OUTSIDE the textbox, slides out from behind the bar */}
        <AnimatePresence mode="popLayout" initial={false}>
          {(connectorKind === "project" || connectorKind === "profile") && onClose && (
            <motion.button
              key="esc"
              layout
              type="button"
              onClick={onClose}
              aria-label="Close (Esc)"
              whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, scale: 0.5, x: 24 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.5, x: 24 }}
              transition={springs.spatialDefault}
              className="shrink-0 w-14 h-14 rounded-full bg-on-surface text-surface flex items-center justify-center text-[11px] font-semibold lowercase tracking-wide"
            >
              esc
            </motion.button>
          )}
        </AnimatePresence>
        {/* Composer - a compact pill at rest; expands into the full input on tap */}
        <motion.div
          layout="position"
          initial={false}
          animate={{ width: expanded ? 480 : (connectorKind === "project" || connectorKind === "profile") && connectorSrc ? 210 : 160 }}
          transition={springs.spatialDefault}
          style={{ maxWidth: "100%" }}
          onClick={() => { if (!expanded) setFocused(true); }}
          className={`glass-stroke bg-surface min-w-0 flex items-center gap-1 h-14 rounded-full pl-2 pr-2 ${expanded ? "" : "cursor-text"} ${filterOpen ? "max-sm:hidden" : ""}`}
        >
          {/* Current project / profile icon, inside the textbox on the left */}
          {(connectorKind === "project" || connectorKind === "profile") && connectorSrc && (
            <motion.button
              layoutId="nav-circle"
              type="button"
              onClick={onClose}
              aria-label={connectorKind === "profile" ? "Profile" : "Current project"}
              whileTap={{ scale: 0.92 }}
              transition={springs.spatialDefault}
              className="shrink-0 ml-1 w-9 h-9 rounded-full overflow-hidden border border-[rgba(34,34,34,0.1)]"
            >
              <img src={connectorSrc} alt="" className="w-full h-full object-cover" style={{ filter: "grayscale(1) contrast(1.03)" }} />
            </motion.button>
          )}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            onFocus={() => { setFocused(true); onFocusInput?.(); }}
            onBlur={() => setFocused(false)}
            placeholder="..."
            aria-label="Ask anything"
            className="flex-1 min-w-0 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-sm pl-3 pr-2"
          />

          <IconButton
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            selected={isListening}
            size="sm"
            onClick={toggleListening}
          >
            <Mic className="w-4 h-4" />
          </IconButton>
          {expanded && (
            <IconButton
              aria-label="Send"
              size="sm"
              selected={!!input.trim()}
              disabled={!input.trim()}
              onClick={() => handleSubmit()}
            >
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </IconButton>
          )}
        </motion.div>

        {/* Right cluster - LinkedIn (project) or filter + profile (home). They
            swap with a sticky slide as the user navigates in/out of a project. */}
        <AnimatePresence mode="popLayout" initial={false}>
        {connectorKind === "project" && linkedinUrl && (
          <motion.a
            key="linkedin"
            layout
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn post"
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0, scale: 0.5, x: -24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -24 }}
            transition={springs.spatialDefault}
            className={outsideBtn}
          >
            <LinkedInIcon className="w-5 h-5" />
          </motion.a>
        )}

        {/* Filter - the chips emerge from / retract into the icon (width 0<->auto,
            clipped) so opening and closing are mirror images. Tap outside closes. */}
        {!connectorKind && onFilter && (
          <motion.div
            key="filter"
            layout="position"
            initial={{ opacity: 0, scale: 0.5, x: -24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -24 }}
            transition={springs.spatialDefault}
            className="shrink-0"
          >
            <div ref={filterRef} className="glass-stroke bg-surface flex items-center rounded-full p-1.5">
              <button
                type="button"
                onClick={onFilter}
                aria-label="Filter projects"
                aria-pressed={filterOpen}
                className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                  filterOpen ? "bg-on-surface text-surface" : "text-on-surface"
                }`}
              >
                <FilterGlyph className="w-5 h-5" strokeWidth={2} />
              </button>
              <motion.div
                initial={false}
                animate={{ width: filterOpen ? "auto" : 0, opacity: filterOpen ? 1 : 0 }}
                transition={filterMorph}
                className="overflow-hidden flex items-center"
              >
                <div className="flex items-center gap-1 pl-1 pr-0.5">
                  {filters?.map((cat) => {
                    const isActive = cat === "All" ? !activeCategory : activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => onSelectCategory?.(cat === "All" ? null : cat)}
                        className={`shrink-0 px-3 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
                          isActive
                            ? "bg-on-surface text-surface"
                            : "text-on-surface-variant hover:text-on-surface hover:bg-black/[0.04]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        {!connectorKind && onProfile && (
          <motion.button
            key="profile"
            layout
            type="button"
            onClick={onProfile}
            aria-label="View profile"
            whileTap={{ scale: 0.94 }}
            initial={{ opacity: 0, scale: 0.5, x: -24 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -24 }}
            transition={springs.spatialDefault}
            className={`${outsideBtn} ${filterOpen ? "max-sm:hidden" : ""}`}
          >
            <User className="w-5 h-5" />
          </motion.button>
        )}
        </AnimatePresence>
      </div>
    </>
  );
}
