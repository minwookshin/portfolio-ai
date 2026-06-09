"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties } from "react";

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

function formatVideoTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function safePlay(video: HTMLVideoElement, onPlaying: (playing: boolean) => void) {
  if (typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("jsdom")) {
    onPlaying(false);
    return;
  }

  try {
    const result = video.play();
    if (result && typeof result.then === "function") {
      result.then(() => onPlaying(true)).catch(() => onPlaying(false));
      return;
    }
    onPlaying(!video.paused);
  } catch {
    onPlaying(false);
  }
}

function PauseGlyph() {
  return (
    <span className="studio-video-pause-glyph" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timelineId = useId();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(muted);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = muted;
    setIsMuted(video.muted);
    setCurrentTime(0);
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);

    if (autoPlay) {
      safePlay(video, setIsPlaying);
    } else {
      setIsPlaying(false);
    }
  }, [autoPlay, muted, src]);

  const syncVideoState = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setIsMuted(video.muted);
    setIsPlaying(!video.paused && !video.ended);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      safePlay(video, setIsPlaying);
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    video.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;
  const timelineStyle = { "--video-progress": `${progress}%` } as CSSProperties;

  return (
    <div className={`studio-video-player ${className}`}>
      <video
        ref={videoRef}
        loop={loop}
        muted={isMuted}
        playsInline
        preload={preload}
        poster={poster}
        className={videoClassName}
        onClick={togglePlayback}
        onEnded={syncVideoState}
        onLoadedMetadata={syncVideoState}
        onPause={syncVideoState}
        onPlay={syncVideoState}
        onTimeUpdate={syncVideoState}
        onVolumeChange={syncVideoState}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="studio-video-controls" aria-label={`${label} video controls`}>
        <button
          type="button"
          className="studio-video-control-button micro-focus"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <PauseGlyph /> : <Play aria-hidden="true" strokeWidth={1.7} />}
        </button>

        <label className="sr-only" htmlFor={timelineId}>
          {label} timeline
        </label>
        <input
          id={timelineId}
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={duration ? Math.min(currentTime, duration) : 0}
          disabled={!duration}
          onChange={(event) => seek(Number(event.currentTarget.value))}
          className="studio-video-timeline"
          style={timelineStyle}
        />
        <span className="studio-video-time">
          {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
        </span>

        <button
          type="button"
          className="studio-video-control-button micro-focus"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX aria-hidden="true" strokeWidth={1.7} /> : <Volume2 aria-hidden="true" strokeWidth={1.7} />}
        </button>
      </div>
    </div>
  );
}
