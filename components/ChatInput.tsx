"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";
import { LinkedInIcon } from "./LinkedInIcon";
import { IconButton } from "@/components/material/IconButton";
import BlurImage from "@/components/BlurImage";
import { tweens } from "@/lib/material/motion";

type ConnectorKind = "profile" | "project" | "chat" | null;

interface ChatInputProps {
  onSend: (message: string) => void;
  hasStarted?: boolean;
  connectorKind?: ConnectorKind;
  connectorSrc?: string;
  linkedinUrl?: string;
  onClose?: () => void;
  onFocusInput?: () => void;
  introReady?: boolean;
}


const darkOutsideBtn =
  `micro-focus micro-focus-tight micro-pressable group shrink-0 w-16 h-16 rounded-[var(--md-shape-sm)] bg-surface-container-high text-on-surface border border-outline-variant flex items-center justify-center relative`;

export default function ChatInput({
  onSend,
  hasStarted = true,
  connectorKind = null,
  connectorSrc,
  linkedinUrl,
  onClose,
  onFocusInput,
  introReady = true,
}: ChatInputProps) {
  const reduceMotion = useReducedMotion();
  const activeMotion = reduceMotion ? tweens.none : tweens.slow;
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // The bar sits collapsed as a compact field until the user taps it; it expands
  // into the full composer while focused, typing, or dictating.
  const expanded = focused || input.length > 0 || isListening;
  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

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

      <motion.div
        className="fixed z-[80] inset-x-0 bottom-6 mx-auto w-full max-w-[700px] px-4 flex min-w-0 items-center justify-center gap-2"
        initial={false}
        animate={{ opacity: introReady ? 1 : 0, y: reduceMotion ? 0 : introReady ? 0 : 36 }}
        transition={activeMotion}
        style={{ pointerEvents: introReady ? undefined : "none" }}
      >
        {/* Close (esc) - OUTSIDE the textbox, slides out from behind the bar */}
        <AnimatePresence mode="popLayout" initial={false}>
          {(connectorKind === "project" || connectorKind === "profile") && onClose && (
            <motion.button
              key="esc"
              layout={reduceMotion ? false : true}
              type="button"
              onClick={onClose}
              aria-label="Close (Esc)"
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: 14 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0, scale: 1, x: 0 } : { opacity: 0, scale: 0.96, x: 14 }}
              transition={activeMotion}
              className="micro-focus micro-focus-tight micro-pressable group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--md-shape-sm)] border border-outline-variant bg-surface-container-high text-xs font-normal lowercase text-on-surface hover:bg-outline-variant"
            >
              <span className="relative">esc</span>
            </motion.button>
          )}
        </AnimatePresence>
        {/* Composer - a compact pill at rest; expands into the full input on tap */}
        <motion.div
          layout={reduceMotion ? false : "position"}
          initial={false}
          animate={{ width: expanded ? 520 : (connectorKind === "project" || connectorKind === "profile") && connectorSrc ? 260 : 240 }}
          transition={activeMotion}
          style={{ maxWidth: "min(100%, calc(100vw - 176px))" }}
          onClick={() => { if (!expanded) setFocused(true); }}
          className={`micro-field group relative flex h-16 min-w-0 items-center gap-1 rounded-[var(--md-shape-sm)] bg-surface-container-high pl-3 pr-2 text-on-surface ${expanded ? "" : "cursor-text"}`}
        >
          {/* Current project / profile icon, inside the textbox on the left */}
          {(connectorKind === "project" || connectorKind === "profile") && connectorSrc && (
            <motion.button
              layoutId={reduceMotion ? undefined : "nav-circle"}
              type="button"
              onClick={onClose}
              aria-label={connectorKind === "profile" ? "Profile" : "Current project"}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              transition={activeMotion}
              className="micro-focus micro-focus-tight micro-pressable relative h-10 w-10 shrink-0 overflow-hidden rounded-[var(--md-shape-sm)] border border-outline-variant"
            >
              <BlurImage
                src={connectorSrc}
                alt=""
                fill
                sizes="40px"
                className="object-cover"
                style={{ filter: "grayscale(1) contrast(1.03)" }}
              />
            </motion.button>
          )}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            onFocus={() => { setFocused(true); onFocusInput?.(); }}
            onBlur={() => setFocused(false)}
            placeholder="ask me"
            aria-label="ask me"
            className="relative z-10 flex-1 min-w-0 bg-transparent outline-none font-light text-on-surface placeholder:text-on-surface-variant text-base pl-3 pr-2"
          />

          <IconButton
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            selected={isListening}
            size="sm"
            className="!w-12 !h-12"
            onClick={toggleListening}
          >
            <Mic className="w-5 h-5" />
          </IconButton>
          {expanded && (
            <IconButton
              aria-label="Send"
              size="sm"
              className="!w-12 !h-12"
              selected={!!input.trim()}
              disabled={!input.trim()}
              onClick={() => handleSubmit()}
            >
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            </IconButton>
          )}
        </motion.div>

        {/* Right cluster - LinkedIn when a project sheet is open. */}
        <AnimatePresence mode="popLayout" initial={false}>
        {connectorKind === "project" && linkedinUrl && (
          <motion.a
            key="linkedin"
            layout={reduceMotion ? false : true}
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn post"
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, x: -14 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0, scale: 1, x: 0 } : { opacity: 0, scale: 0.96, x: -14 }}
            transition={activeMotion}
            className={darkOutsideBtn}
          >
            <LinkedInIcon className="w-6 h-6 relative z-10" />
          </motion.a>
        )}

        </AnimatePresence>
      </motion.div>
    </>
  );
}
