type MaterialArrowForwardIconProps = {
  className?: string;
};

export default function MaterialArrowForwardIcon({ className = "" }: MaterialArrowForwardIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        className="site-signal-tail"
        d="M5 12h14"
        fill="none"
        pathLength={1}
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        className="site-signal-head"
        d="m13 6 6 6-6 6"
        fill="none"
        pathLength={1}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
