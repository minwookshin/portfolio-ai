"use client";

import { useEffect, useRef } from "react";

type LottieMotionProofProps = {
  className?: string;
  path: string;
};

export default function LottieMotionProof({ className = "", path }: LottieMotionProofProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let destroyed = false;
    let animation: { destroy: () => void; goToAndStop: (value: number, isFrame?: boolean) => void } | null = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    void import("lottie-web").then((mod) => {
      if (destroyed || !container) return;

      animation = mod.default.loadAnimation({
        autoplay: !reduceMotion,
        container,
        loop: !reduceMotion,
        path,
        renderer: "svg",
        rendererSettings: {
          progressiveLoad: true,
          preserveAspectRatio: "xMidYMid meet",
        },
      });

      if (reduceMotion) {
        animation.goToAndStop(72, true);
      }
    });

    return () => {
      destroyed = true;
      animation?.destroy();
    };
  }, [path]);

  return (
    <div aria-hidden="true" className={`motion-proof-lottie ${className}`.trim()}>
      <div ref={containerRef} className="motion-proof-lottie__stage" />
    </div>
  );
}
