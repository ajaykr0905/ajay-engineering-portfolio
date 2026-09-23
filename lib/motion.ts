export const MOTION_STORAGE_KEY = "portfolio-motion";

export const motionPreferences = ["auto", "paused"] as const;

export type MotionPreference = (typeof motionPreferences)[number];

export function parseMotionPreference(value: string | null | undefined): MotionPreference {
  return value === "paused" ? "paused" : "auto";
}

export function isMotionPaused(preference: MotionPreference, systemReducedMotion: boolean) {
  return systemReducedMotion || preference === "paused";
}
