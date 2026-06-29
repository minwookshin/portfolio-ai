"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Check, Copy, Link as LinkIcon } from "lucide-react";

type CopyTextOptions = {
  notify?: boolean;
};

type CopyValue = string | (() => string | null | undefined);

type InlineCopyButtonProps = {
  ariaLabel?: string;
  children?: ReactNode;
  className: string;
  copyText?: (value: string, label: string, options?: CopyTextOptions) => boolean | void | Promise<boolean | void>;
  icon?: "copy" | "link";
  label: string;
  onUnavailable?: () => void;
  resetMs?: number;
  value: CopyValue;
};

export function useCopyFeedback() {
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const copyText = useCallback(async (value: string, label: string, options: CopyTextOptions = {}) => {
    const shouldNotify = options.notify ?? true;

    if (!navigator.clipboard?.writeText) {
      if (shouldNotify) notify("copy unavailable");
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      if (shouldNotify) notify(`${label} copied`);
      return true;
    } catch {
      if (shouldNotify) notify("copy failed");
      return false;
    }
  }, [notify]);

  return { copyText, notify, toast };
}

async function writeClipboard(value: string) {
  if (!navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

function resolveCopyValue(value: CopyValue) {
  return typeof value === "function" ? value() : value;
}

export function InlineCopyButton({
  ariaLabel,
  children = "copy",
  className,
  copyText,
  icon = "copy",
  label,
  onUnavailable,
  resetMs = 1200,
  value,
}: InlineCopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const [liveMessage, setLiveMessage] = useState("");
  const Icon = state === "copied" ? Check : icon === "link" ? LinkIcon : Copy;

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => {
      setState("idle");
      setLiveMessage("");
    }, resetMs);
    return () => window.clearTimeout(timer);
  }, [resetMs, state]);

  const onClick = async () => {
    const targetValue = resolveCopyValue(value);

    if (!targetValue) {
      setState("failed");
      setLiveMessage(`${label} copy unavailable`);
      onUnavailable?.();
      return;
    }

    const copyResult = copyText
      ? await copyText(targetValue, label, { notify: false })
      : await writeClipboard(targetValue);
    const didCopy = copyResult !== false;

    setState(didCopy ? "copied" : "failed");
    setLiveMessage(didCopy ? `${label} copied` : `${label} copy unavailable`);
    if (!didCopy) onUnavailable?.();
  };

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel ?? `copy ${label}`}
      data-copied={state === "copied" ? "true" : undefined}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
      {children && <span>{children}</span>}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </span>
    </button>
  );
}
