"use client";

import { useEffect } from "react";

export function PointerTracker() {
  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    let activeSurface: HTMLElement | null = null;

    const clearSurface = () => {
      if (!activeSurface) return;
      delete activeSurface.dataset.pointerActive;
      activeSurface = null;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || root.dataset.motion === "paused") {
        clearSurface();
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const surface = target?.closest<HTMLElement>("[data-pointer-surface]") ?? null;
      if (!surface) {
        clearSurface();
        return;
      }

      // Read layout before changing attributes or custom properties so pointer
      // updates do not force the browser to synchronously recalculate layout.
      const bounds = surface.getBoundingClientRect();

      if (activeSurface !== surface) {
        clearSurface();
        activeSurface = surface;
        activeSurface.dataset.pointerActive = "true";
      }

      surface.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      surface.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    };

    const onWindowBlur = () => clearSurface();
    const onCapabilityChange = () => clearSurface();
    const observer = new MutationObserver(() => {
      if (root.dataset.motion === "paused") clearSurface();
    });

    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    finePointer.addEventListener("change", onCapabilityChange);
    reducedMotion.addEventListener("change", onCapabilityChange);

    return () => {
      observer.disconnect();
      clearSurface();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onWindowBlur);
      finePointer.removeEventListener("change", onCapabilityChange);
      reducedMotion.removeEventListener("change", onCapabilityChange);
    };
  }, []);

  return null;
}
