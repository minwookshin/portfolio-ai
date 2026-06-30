"use client";

import { Command } from "lucide-react";
import { openGlobalCommandPalette } from "@/components/GlobalCommandPalette";

type CommandTriggerButtonProps = {
  className?: string;
};

export default function CommandTriggerButton({ className = "" }: CommandTriggerButtonProps) {
  return (
    <button
      type="button"
      className={`command-trigger micro-focus micro-focus-tight micro-pressable${className ? ` ${className}` : ""}`}
      aria-label="Open command palette"
      onClick={openGlobalCommandPalette}
    >
      <Command aria-hidden="true" />
    </button>
  );
}
