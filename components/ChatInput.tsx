"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";
import { useThemeStore } from "@/lib/theme-store";

interface ChatInputProps {
  onSend: (message: string) => void;
  hasStarted?: boolean;
}

export default function ChatInput({ onSend, hasStarted = true }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { activeThemeColor } = useThemeStore();

  useEffect(() => {
    // Check if browser supports speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    // Cleanup function: Stop microphone when component unmounts or user leaves page
    const handleBeforeUnload = () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isListening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      // Stop microphone if it's still recording
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Get border color based on active theme
  const getBorderStyle = () => {
    if (!activeThemeColor) {
      return "border-gray-200";
    }
    return "";
  };

  const getInlineBorderStyle = () => {
    if (!activeThemeColor) {
      return {};
    }
    // Convert hex to RGB and apply subtle opacity
    const hex = activeThemeColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return {
      borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`,
    };
  };

  return (
    <>
      {/* Gradient Fade Background - only show when hasStarted */}
      {hasStarted && (
        <div className="fixed bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-[#F2F2F2] via-[#F2F2F2] to-transparent pointer-events-none z-40" />
      )}

      {/* Floating Input Container */}
      <motion.div
        className={`w-full max-w-2xl px-8 sm:px-4 z-50 ${hasStarted ? 'fixed' : 'mx-auto'}`}
        style={{
          bottom: hasStarted ? "1.5rem" : undefined,
          left: hasStarted ? "50%" : undefined,
          transform: hasStarted ? "translateX(-50%)" : undefined,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            {/* Input Container - Floating Island Style */}
            <div
              className="relative bg-white border border-gray-200 transition-all duration-300 rounded-3xl overflow-visible"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ask anything"
                className="w-full px-6 py-4 pr-28 bg-transparent outline-none text-[#292A2E] placeholder:text-gray-400 rounded-3xl text-base"
              />
            </div>

            {/* Right Side Buttons */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
              {/* Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  input.trim()
                    ? "bg-[#292A2E] hover:bg-[#3C3C3C] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
}
