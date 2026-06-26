"use client";

type StudioVideoPlayerProps = {
  autoPlay?: boolean;
  className?: string;
  label: string;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  preload?: "none" | "metadata" | "auto";
  src: string;
  videoClassName?: string;
};

export default function StudioVideoPlayer({
  autoPlay = false,
  className = "",
  label,
  loop = false,
  muted = true,
  poster,
  preload = "metadata",
  src,
  videoClassName = "block h-auto w-full",
}: StudioVideoPlayerProps) {
  return (
    <div className={`studio-video-player ${className}`}>
      <video
        aria-label={label}
        autoPlay={autoPlay}
        controls
        loop={loop}
        muted={muted}
        playsInline
        preload={preload}
        poster={poster}
        className={videoClassName}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
