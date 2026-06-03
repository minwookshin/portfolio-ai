"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BLUR_DATA_URL } from "@/lib/mediaPlaceholders";

type BlurImageProps = Omit<ImageProps, "blurDataURL" | "placeholder">;

export default function BlurImage({ className = "", onLoad, alt, ...props }: BlurImageProps) {
  const reduceMotion = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const hasCallerTransition = className.split(/\s+/).some((token) => token.startsWith("transition"));

  return (
    <Image
      {...props}
      alt={alt}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={[
        className,
        reduceMotion || hasCallerTransition ? "" : "transition-[filter,opacity] duration-[var(--motion-duration-slow)] ease-[var(--motion-ease-standard)]",
        loaded ? "opacity-100" : "opacity-95",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
