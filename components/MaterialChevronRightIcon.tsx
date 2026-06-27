type MaterialChevronRightIconProps = {
  className?: string;
};

export default function MaterialChevronRightIcon({ className = "" }: MaterialChevronRightIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        className="site-caret-stroke"
        d="m9 6 6 6-6 6"
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
