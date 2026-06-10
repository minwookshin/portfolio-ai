"use client";

import { useEffect, useState } from "react";
import { BUILD_UPDATED_AT, BUILD_VERSION } from "@/lib/buildMeta";

type BuildMetaState = {
  updatedAt: string;
  version: string;
};

type BuildMetaProps = {
  className?: string;
};

function formatElapsedBefore(from: string, now: number) {
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(from).getTime()) / 1000));
  const days = Math.floor(elapsedSeconds / 86400);
  const hours = Math.floor((elapsedSeconds % 86400) / 3600);
  const minutes = Math.floor((elapsedSeconds % 3600) / 60);
  const seconds = elapsedSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s before`;
}

function getInitialNow(updatedAt: string) {
  const timestamp = new Date(updatedAt).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export default function BuildMeta({ className = "" }: BuildMetaProps) {
  const [meta, setMeta] = useState<BuildMetaState>({
    updatedAt: BUILD_UPDATED_AT,
    version: BUILD_VERSION,
  });
  const [now, setNow] = useState(() => getInitialNow(BUILD_UPDATED_AT));

  useEffect(() => {
    let cancelled = false;

    const loadMeta = () => {
      fetch("/api/build-meta", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((nextMeta: Partial<BuildMetaState> | null) => {
          if (cancelled || !nextMeta?.updatedAt || !nextMeta?.version) return;
          setMeta({ updatedAt: nextMeta.updatedAt, version: nextMeta.version });
        })
        .catch(() => {});
    };

    const syncNow = () => setNow(Date.now());

    loadMeta();
    const initialTimer = window.setTimeout(syncNow, 0);
    const timer = window.setInterval(syncNow, 1000);
    const metaTimer = window.setInterval(loadMeta, 15000);
    return () => {
      cancelled = true;
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
      window.clearInterval(metaTimer);
    };
  }, []);

  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--text-muted)] ${className}`}>
      <span>{meta.version}</span>
      <span aria-hidden>·</span>
      <span>updated {formatElapsedBefore(meta.updatedAt, now)}</span>
    </div>
  );
}
