"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight, Globe, User, ArrowLeft, X } from "lucide-react";
import { IconButton } from "@/components/material/IconButton";
import { springs } from "@/lib/material/motion";

type ConnectorKind = "profile" | "globe" | "project" | "chat" | null;

interface ChatInputProps {
  onSend: (message: string) => void;
  hasStarted?: boolean;
  connectorKind?: ConnectorKind;
  connectorSrc?: string;
  onConnector?: () => void;
  onProfile?: () => void;
  onToggleAll?: () => void;
  onFocusInput?: () => void;
}

const outsideBtn =
  "shrink-0 w-14 h-14 rounded-full bg-surface-container border border-outline-variant text-on-surface flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-surface-container-high transition-colors";

export default function ChatInput({
  onSend,
  hasStarted = true,
  connectorKind = null,
  connectorSrc,
  onConnector,
  onProfile,
  onToggleAll,
  onFocusInput,
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [focused, setFocused] = useState(false);
  const recognitionRef = useRef<any>(null);
  const watchdogRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        {/* Composer - narrower when idle, widens when focused */}
        <motion.div
          initial={false}
          animate={{ width: focused ? 480 : 300 }}
          transition={springs.spatialDefault}
          style={{ maxWidth: "100%" }}
          className="min-w-0 flex items-center gap-1 h-14 rounded-full bg-surface-container border border-outline-variant pl-2 pr-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
        >
          {/* Active connector - lives INSIDE the bar once a nav icon is clicked */}
          {connectorKind === "chat" && (
            <motion.button
              layoutId="nav-back"
              type="button"
              onClick={onConnector}
              aria-label="Back to home"
              whileTap={{ scale: 0.92 }}
              transition={springs.spatialDefault}
              className="shrink-0 w-10 h-10 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center"
            >
              <ArrowLeft className="w-[18px] h-[18px]" />
            </motion.button>
          )}
          {connectorKind === "project" && connectorSrc && (
            <motion.button
              layoutId="nav-project"
              type="button"
              onClick={onConnector}
              aria-label="Back"
              title="Back"
              whileTap={{ scale: 0.92 }}
              transition={springs.spatialDefault}
              className="group relative shrink-0 w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant flex items-center justify-center"
            >
              <img
                src={connectorSrc}
                alt="current project"
                className="w-full h-full object-cover"
                style={{ filter: "grayscale(1) contrast(1.03)" }}
              />
              {/* Hover affordance: dim the icon and show a white X so it reads as "go back" */}
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <X className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
              </span>
            </motion.button>
          )}
          {connectorKind === "globe" && (
            <motion.button
              layoutId="nav-globe"
              type="button"
              onClick={onConnector}
              aria-label="Back to projects"
              whileTap={{ scale: 0.92 }}
              transition={springs.spatialDefault}
              className="shrink-0 w-10 h-10 rounded-full bg-on-surface text-surface flex items-center justify-center"
            >
              <Globe className="w-[18px] h-[18px]" />
            </motion.button>
          )}
          {connectorKind === "profile" && (
            <motion.button
              layoutId="nav-profile"
              type="button"
              onClick={onConnector}
              aria-label="Close profile"
              whileTap={{ scale: 0.92 }}
              transition={springs.spatialDefault}
              className="shrink-0 w-10 h-10 rounded-full bg-on-surface text-surface flex items-center justify-center"
            >
              <User className="w-[18px] h-[18px]" />
            </motion.button>
          )}

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            onFocus={() => { setFocused(true); onFocusInput?.(); }}
            onBlur={() => setFocused(false)}
            placeholder="Ask anything"
            aria-label="Ask anything"
            className="flex-1 min-w-0 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant text-sm px-2"
          />

          <IconButton
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            selected={isListening}
            size="sm"
            onClick={toggleListening}
          >
            <Mic className="w-4 h-4" />
          </IconButton>
          <IconButton
            aria-label="Send"
            size="sm"
            selected={!!input.trim()}
            disabled={!input.trim()}
            onClick={() => handleSubmit()}
          >
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </IconButton>
        </motion.div>

        {/* Nav icons - OUTSIDE the bar until clicked */}
        {!connectorKind && onToggleAll && (
          <motion.button
            layoutId="nav-globe"
            type="button"
            onClick={onToggleAll}
            aria-label="See all projects"
            whileTap={{ scale: 0.94 }}
            transition={springs.spatialDefault}
            className={outsideBtn}
          >
            <Globe className="w-5 h-5" />
          </motion.button>
        )}
        {!connectorKind && onProfile && (
          <motion.button
            layoutId="nav-profile"
            type="button"
            onClick={onProfile}
            aria-label="View profile"
            whileTap={{ scale: 0.94 }}
            transition={springs.spatialDefault}
            className={outsideBtn}
          >
            <User className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </>
  );
}
