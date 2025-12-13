"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Bold,
  Italic,
  AlignLeft,
  Circle,
  Play,
} from "lucide-react";

interface MagicInputProps {
  onExecute: (command: string) => void;
}

export default function MagicInput({ onExecute }: MagicInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleExecute = () => {
    if (input.trim()) {
      onExecute(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleExecute();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl text-gray-600 font-light">Magic Canvas</h2>
        </div>

        {/* Glassmorphism Toolbar */}
        <motion.div
          animate={{
            scale: isFocused ? 1.01 : 1,
            boxShadow: isFocused
              ? "0 20px 60px rgba(0, 0, 0, 0.15)"
              : "0 10px 30px rgba(0, 0, 0, 0.08)",
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-[2rem] p-2 shadow-xl">
            <div className="flex items-center gap-2">
              {/* Style Selector */}
              <button className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100/50 rounded-2xl transition-colors">
                <span className="text-sm text-gray-600 font-medium">
                  Style 01
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200" />

              {/* Formatting Icons */}
              <div className="flex items-center gap-1">
                <button
                  className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                  title="Bold"
                >
                  <Bold className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                  title="Italic"
                >
                  <Italic className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  className="p-2.5 hover:bg-gray-100/50 rounded-xl transition-colors"
                  title="Align"
                >
                  <AlignLeft className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Color Dot */}
              <button
                className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                title="Color"
              >
                <Circle className="w-5 h-5 text-white fill-current" />
              </button>

              {/* Execute Button */}
              <motion.button
                onClick={handleExecute}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center hover:from-gray-500 hover:to-gray-600 transition-all shadow-lg"
                title="Execute (⌘+Enter)"
              >
                <Play className="w-5 h-5 text-white fill-current ml-0.5" />
              </motion.button>
            </div>
          </div>

          {/* Hint Text */}
          {!isFocused && !input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-full left-8 mt-2 text-xs text-gray-400 font-mono"
            >
              Type commands like 'projects', 'about', or 'contact'
            </motion.div>
          )}
        </motion.div>

        {/* Text Input Area */}
        <motion.div
          animate={{
            scale: isFocused ? 1.005 : 1,
          }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg min-h-[200px]"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder="Type your command here..."
            className="w-full h-full min-h-[150px] bg-transparent outline-none text-gray-800 text-lg leading-relaxed resize-none placeholder:text-gray-400"
            style={{
              fontFamily: "inherit",
            }}
          />

          {/* Character Count & Hint */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-400 font-mono">
            <span>{input.length} characters</span>
            <span>⌘ + Enter to execute</span>
          </div>
        </motion.div>

        {/* Command Examples */}
        <div className="flex flex-wrap gap-2 justify-center">
          {["projects", "about", "skills", "contact"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                setInput(cmd);
                setTimeout(() => handleExecute(), 100);
              }}
              className="px-4 py-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-sm text-gray-600 hover:text-gray-900 transition-all font-medium"
            >
              {cmd}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
