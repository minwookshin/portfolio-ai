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
        d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
        fill="currentColor"
      />
    </svg>
  );
}
