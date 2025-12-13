"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Navigation() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Portfolio
        </Link>

        <div className="flex items-center gap-8">
          <a
            href="#work"
            className="text-muted hover:text-foreground transition-colors font-medium"
          >
            Work
          </a>
          <a
            href="#about"
            className="text-muted hover:text-foreground transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#resume"
            className="text-muted hover:text-foreground transition-colors font-medium"
          >
            Resume
          </a>
          <a
            href="#contact"
            className="px-5 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all font-medium"
          >
            Contact
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
