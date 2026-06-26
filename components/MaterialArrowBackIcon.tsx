type MaterialArrowBackIconProps = {
  className?: string;
};

export default function MaterialArrowBackIcon({ className = "" }: MaterialArrowBackIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox="0 0 24 24"
    >
      <path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2Z"
        fill="currentColor"
      />
    </svg>
  );
}
