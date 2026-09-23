"use client";

import { useEffect, useState } from "react";
import {
  isMotionPaused,
  MOTION_STORAGE_KEY,
  parseMotionPreference,
  type MotionPreference,
} from "@/lib/motion";

function applyMotionState(preference: MotionPreference, reducedMotion: boolean) {
  const root = document.documentElement;
  root.dataset.motionPreference = preference;
  root.dataset.reducedMotion = reducedMotion ? "true" : "false";
  root.dataset.motion = isMotionPaused(preference, reducedMotion) ? "paused" : "active";
}

function readMotionPreference() {
  try {
    return parseMotionPreference(window.localStorage.getItem(MOTION_STORAGE_KEY));
  } catch {
    return "auto" as const;
  }
}

export function MotionToggle() {
  const [preference, setPreference] = useState<MotionPreference>("auto");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      const nextPreference = readMotionPreference();
      setPreference(nextPreference);
      setReducedMotion(mediaQuery.matches);
      applyMotionState(nextPreference, mediaQuery.matches);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === MOTION_STORAGE_KEY) sync();
    };

    sync();
    mediaQuery.addEventListener("change", sync);
    window.addEventListener("storage", onStorage);

    return () => {
      mediaQuery.removeEventListener("change", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  function toggleMotion() {
    if (reducedMotion) return;
    const nextPreference: MotionPreference = preference === "paused" ? "auto" : "paused";
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, nextPreference);
    } catch {
      // The control still works for this page when browser storage is unavailable.
    }
    setPreference(nextPreference);
    applyMotionState(nextPreference, false);
  }

  const paused = isMotionPaused(preference, reducedMotion);
  const label = reducedMotion
    ? "Animations paused by system setting"
    : paused
      ? "Resume animations"
      : "Pause animations";

  return (
    <button
      aria-label={label}
      aria-pressed={paused}
      aria-disabled={reducedMotion}
      className="icon-button motion-toggle"
      onClick={toggleMotion}
      title={label}
      type="button"
    >
      <span aria-hidden="true" className={`motion-icon ${paused ? "motion-icon-play" : "motion-icon-pause"}`}>
        <span />
        <span />
      </span>
    </button>
  );
}
