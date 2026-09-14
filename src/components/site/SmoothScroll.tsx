"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Weighted, smooth page scrolling on desktop. Touch devices and reduced-motion users keep native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -72 } });
    return () => lenis.destroy();
  }, []);
  return null;
}
