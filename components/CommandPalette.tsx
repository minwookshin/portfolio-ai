"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useParametricStore } from "@/store/useParametricStore";
import { Terminal, Palette, Code2, TrendingUp, RotateCcw } from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { setMode, reset, creativity, logic, business } = useParametricStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <Command
        className="bg-white rounded-2xl shadow-2xl border border-border w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Terminal className="w-5 h-5 text-muted" />
          <Command.Input
            placeholder="Type a command or search..."
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <kbd className="px-2 py-1 bg-light rounded text-xs font-mono text-muted">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2">
          <Command.Empty className="py-12 text-center text-sm text-muted">
            No results found.
          </Command.Empty>

          <Command.Group heading="Modes" className="px-2 py-2">
            <p className="text-xs text-muted font-mono mb-2 px-2">Switch personality mode</p>

            <Command.Item
              onSelect={() => {
                setMode("design");
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-light transition-colors mb-1"
            >
              <Palette className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Design Mode</div>
                <div className="text-xs text-muted font-mono">mode design</div>
              </div>
              <div className="text-xs text-muted">Creativity: 100%</div>
            </Command.Item>

            <Command.Item
              onSelect={() => {
                setMode("dev");
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-light transition-colors mb-1"
            >
              <Code2 className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Developer Mode</div>
                <div className="text-xs text-muted font-mono">mode dev</div>
              </div>
              <div className="text-xs text-muted">Logic: 100%</div>
            </Command.Item>

            <Command.Item
              onSelect={() => {
                setMode("investor");
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-light transition-colors mb-1"
            >
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Investor Mode</div>
                <div className="text-xs text-muted font-mono">mode investor</div>
              </div>
              <div className="text-xs text-muted">Business: 100%</div>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-border my-2" />

          <Command.Group heading="Actions" className="px-2 py-2">
            <p className="text-xs text-muted font-mono mb-2 px-2">Control actions</p>

            <Command.Item
              onSelect={() => {
                reset();
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-light transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-muted" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Reset All</div>
                <div className="text-xs text-muted font-mono">reset</div>
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="h-px bg-border my-2" />

          <Command.Group heading="Current State" className="px-2 py-2">
            <div className="px-4 py-3 bg-light rounded-lg font-mono text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted">Creativity:</span>
                <span className="font-semibold">{creativity}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Logic:</span>
                <span className="font-semibold">{logic}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Business:</span>
                <span className="font-semibold">{business}%</span>
              </div>
            </div>
          </Command.Group>
        </Command.List>

        <div className="px-4 py-3 border-t border-border bg-light/50">
          <div className="flex items-center gap-4 text-xs text-muted font-mono">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded">⌘K</kbd> to close</span>
            <span>•</span>
            <span>Navigate with <kbd className="px-1.5 py-0.5 bg-white rounded">↑↓</kbd></span>
          </div>
        </div>
      </Command>
    </div>
  );
}
