type DotRingProps = {
  variant?: "circle" | "pill" | "squircle";
  className?: string;
  connect?: boolean;
};

const SQUIRCLE_PATH =
  "M1.5 1.5H54.5V54.5H1.5V1.5Z";

// Evenly spaced dots drawn with SVG, so rectangular controls share the same
// outline instead of relying on browser-specific CSS dotted borders.
export function DotRing({ variant = "circle", className = "", connect = true }: DotRingProps) {
  const dots = connect
    ? {
        className: "dot-connect",
        fill: "none",
        stroke: "currentColor",
        strokeLinecap: "round" as const,
        vectorEffect: "non-scaling-stroke" as const,
      }
    : {
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeDasharray: "0.01 9",
        vectorEffect: "non-scaling-stroke" as const,
        style: { opacity: 0.9 },
      };

  if (variant === "pill") {
    return (
      <svg className={`absolute inset-[1px] w-[calc(100%-2px)] h-[calc(100%-2px)] pointer-events-none overflow-visible ${className}`} fill="none" aria-hidden>
        <rect x="0" y="0" width="100%" height="100%" rx="0" {...dots} />
      </svg>
    );
  }

  if (variant === "squircle") {
    return (
      <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 56 56" fill="none" aria-hidden>
        <path d={SQUIRCLE_PATH} {...dots} />
      </svg>
    );
  }

  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d={SQUIRCLE_PATH} {...dots} />
    </svg>
  );
}
