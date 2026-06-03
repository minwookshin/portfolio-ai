"use client";

import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, RefObject } from "react";
import { useReducedMotion } from "framer-motion";

type PreviewHandlers = Pick<HTMLAttributes<HTMLElement>, "onMouseEnter" | "onMouseLeave" | "onFocus" | "onBlur">;

export type HoverVideoPreviewState = {
  canPlayVideo: boolean;
  hasVideo: boolean;
  isAlwaysOn: boolean;
  previewHandlers: PreviewHandlers;
  reduceMotion: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

type HoverVideoPreviewOptions = {
  alwaysOn?: boolean;
  videoSrc?: string;
};

type HoverVideoPreviewProps = {
  canPlayVideo: boolean;
  className?: string;
  isAlwaysOn: boolean;
  poster: string;
  preload?: "none" | "metadata" | "auto";
  reduceMotion: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  videoSrc?: string;
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();

    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return canHover;
}

export function useHoverVideoPreview({ alwaysOn = false, videoSrc }: HoverVideoPreviewOptions): HoverVideoPreviewState {
  const reduceMotion = Boolean(useReducedMotion());
  const canHover = useCanHover();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasVideo = Boolean(videoSrc);
  const canPlayVideo = hasVideo && !reduceMotion && (alwaysOn || canHover);
  const isAlwaysOn = alwaysOn && canPlayVideo;

  const playPreview = () => {
    const video = videoRef.current;
    if (!video || !canPlayVideo) return;
    if (!isAlwaysOn) video.currentTime = 0;
    video.muted = true;
    video.play().catch(() => {});
  };

  const stopPreview = () => {
    const video = videoRef.current;
    if (!video || !canPlayVideo || isAlwaysOn) return;
    video.pause();
    video.currentTime = 0;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isAlwaysOn) {
      video.muted = true;
      video.play().catch(() => {});
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [isAlwaysOn, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;

    return () => {
      video?.pause();
    };
  }, []);

  return {
    canPlayVideo,
    hasVideo,
    isAlwaysOn,
    previewHandlers: {
      onMouseEnter: playPreview,
      onMouseLeave: stopPreview,
      onFocus: playPreview,
      onBlur: stopPreview,
    },
    reduceMotion,
    videoRef,
  };
}

export default function HoverVideoPreview({
  canPlayVideo,
  className = "object-cover",
  isAlwaysOn,
  poster,
  preload = "metadata",
  reduceMotion,
  videoRef,
  videoSrc,
}: HoverVideoPreviewProps) {
  if (!videoSrc || reduceMotion) return null;

  return (
    <video
      ref={videoRef}
      data-cursor="play"
      muted
      loop
      playsInline
      autoPlay={isAlwaysOn}
      preload={isAlwaysOn ? "auto" : preload}
      poster={poster}
      className={`absolute inset-0 h-full w-full ${className} ${
        isAlwaysOn
          ? "opacity-100"
          : canPlayVideo
          ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
          : "opacity-0"
      } ${
        reduceMotion ? "" : "transition-opacity duration-[var(--motion-duration-slower)] ease-[var(--motion-ease-standard)]"
      }`}
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}
