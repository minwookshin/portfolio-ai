import { ReactNode } from "react";

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={[
        "font-mono uppercase tracking-[0.2em] text-xs text-on-surface-variant",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
