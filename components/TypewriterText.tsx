"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TEXTS = [
  "Hi, I'm Minwook Shin.",
  "I am a 0 to 1 Builder.",
  "Ask me to show my work."
];

export default function TypewriterText() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentFullText = TEXTS[currentTextIndex];

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000); // Pause for 2 seconds after completing
      return () => clearTimeout(pauseTimer);
    }

    if (!isDeleting && displayedText === currentFullText) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % TEXTS.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        } else {
          setDisplayedText(displayedText.slice(0, -1));
        }
      },
      isDeleting ? 30 : 80
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, isPaused, currentTextIndex]);

  return (
    <div className="h-8 flex items-center justify-center mb-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xl font-semibold text-gray-900"
      >
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-5 bg-gray-900 ml-1"
        />
      </motion.p>
    </div>
  );
}
