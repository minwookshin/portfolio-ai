type DotRingProps = {
  variant?: "circle" | "pill" | "squircle";
  className?: string;
  connect?: boolean;
};

const SQUIRCLE_PATH =
  "M28 1.5C45.8 1.5 54.5 10.2 54.5 28C54.5 45.8 45.8 54.5 28 54.5C10.2 54.5 1.5 45.8 1.5 28C1.5 10.2 10.2 1.5 28 1.5Z";

// Evenly spaced round dots drawn with SVG, so circular controls share the same
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
        <rect x="0" y="0" width="100%" height="100%" rx="27" {...dots} />
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
      <circle cx="28" cy="28" r="27" {...dots} />
    </svg>
  );
}
