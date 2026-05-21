"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, ArrowRight } from "lucide-react";
import { TextField } from "@/components/material/TextField";
import { IconButton } from "@/components/material/IconButton";

interface ChatInputProps {
  onSend: (message: string) => void;
  hasStarted?: boolean;
}

export default function ChatInput({ onSend, hasStarted = true }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
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

  return (
    <>
      {/* Gradient Fade Background - only show when hasStarted */}
      {hasStarted && (
        <div className="fixed bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-surface via-surface to-transparent pointer-events-none z-40" />
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
        <TextField
          value={input}
          onChange={setInput}
          onSubmit={() => handleSubmit()}
          placeholder="What projects have you built?"
          trailing={
            <>
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
            </>
          }
        />
      </motion.div>
    </>
  );
}
