"use client";

import { motion } from "framer-motion";
import { useParametricStore } from "@/store/useParametricStore";
import { Palette, Code2, TrendingUp, RotateCcw, Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";

export default function ControlPanel() {
  const { creativity, logic, business, setCreativity, setLogic, setBusiness, reset } = useParametricStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const sliders = [
    {
      label: "Creativity",
      value: creativity,
      setValue: setCreativity,
      icon: Palette,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Logic",
      value: logic,
      setValue: setLogic,
      icon: Code2,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Business",
      value: business,
      setValue: setBusiness,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ];

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-6 z-50"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-foreground text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-50 bg-white/95 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl w-80"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-lg">Parametric Control</h3>
          <p className="text-xs text-muted font-mono">Adjust your experience</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-light transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-light transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sliders.map((slider) => (
          <div key={slider.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <slider.icon className="w-4 h-4 text-muted" />
                <label className="text-sm font-semibold">{slider.label}</label>
              </div>
              <span className="text-sm font-mono text-muted">{slider.value}%</span>
            </div>

            <div className="relative h-2 bg-light rounded-full overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${slider.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${slider.value}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={slider.value}
              onChange={(e) => slider.setValue(Number(e.target.value))}
              className="w-full h-2 opacity-0 absolute cursor-pointer"
              style={{ marginTop: '-8px' }}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted font-mono mb-3">Quick Modes</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Design", mode: "design" as const },
            { label: "Dev", mode: "dev" as const },
            { label: "Investor", mode: "investor" as const },
          ].map((preset) => (
            <button
              key={preset.mode}
              onClick={() => useParametricStore.getState().setMode(preset.mode)}
              className="px-3 py-2 text-xs font-mono bg-light hover:bg-accent hover:text-white border border-border rounded-lg transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
