"use client";

import { useEffect, useRef } from "react";
import {
  AMBIENT_FRAME_RATE,
  ambientStarStateAtTime,
  cappedCanvasPixelRatio,
  createMeteorSchedule,
  createSeededStars,
  createStarConnections,
  METEOR_HEAD_GLOW_RADIUS,
  meteorStateAtTime,
  MIN_METEOR_VIEWPORT_EDGE,
  STAR_CONNECTION_DISTANCE,
  starCountForWidth,
  type AmbientMeteor,
  type AmbientStar,
  type StarConnection,
} from "@/lib/ambient-stars";

const FRAME_INTERVAL = 1000 / AMBIENT_FRAME_RATE;
const POINTER_RADIUS = 160;

export function AmbientConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const root = document.documentElement;
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stars: AmbientStar[] = [];
    let connections: StarConnection[] = [];
    const meteors: AmbientMeteor[] = createMeteorSchedule();
    let viewportWidth = 0;
    let viewportHeight = 0;
    let animationFrame = 0;
    let previousFrame = 0;
    let loopStartedAt: number | null = null;
    let currentSeconds = 0;
    let pointer: { x: number; y: number } | null = null;

    const draw = (seconds: number) => {
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      const starStates = stars.map((star) => ambientStarStateAtTime(star, viewportWidth, viewportHeight, seconds));

      for (const connection of connections) {
        const from = starStates[connection.from];
        const to = starStates[connection.to];
        const distance = Math.hypot(from.x - to.x, from.y - to.y);
        if (distance > STAR_CONNECTION_DISTANCE) continue;
        const proximity = 1 - distance / STAR_CONNECTION_DISTANCE;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.strokeStyle = `rgba(255, 255, 255, ${Math.pow(Math.max(0, proximity), 0.9) * 0.18})`;
        context.lineWidth = 0.85;
        context.stroke();
      }

      if (pointer && finePointer.matches && !reducedMotion.matches && root.dataset.motion === "active") {
        const halo = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, POINTER_RADIUS);
        halo.addColorStop(0, "rgba(255, 255, 255, 0.055)");
        halo.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = halo;
        context.fillRect(pointer.x - POINTER_RADIUS, pointer.y - POINTER_RADIUS, POINTER_RADIUS * 2, POINTER_RADIUS * 2);
      }

      for (const star of starStates) {
        if (star.radius >= 1.05) {
          context.beginPath();
          context.arc(star.x, star.y, star.radius * 2.8, 0, Math.PI * 2);
          context.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.13})`;
          context.fill();
        }

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        context.fill();
      }

      const drawableMeteors = Math.min(viewportWidth, viewportHeight) >= MIN_METEOR_VIEWPORT_EDGE
        ? meteors
        : [];
      for (const meteor of drawableMeteors) {
        const state = meteorStateAtTime(meteor, viewportWidth, viewportHeight, seconds);
        if (!state || state.alpha <= 0) continue;

        const trail = context.createLinearGradient(state.tailX, state.tailY, state.headX, state.headY);
        trail.addColorStop(0, "rgba(255, 255, 255, 0)");
        trail.addColorStop(0.55, `rgba(255, 255, 255, ${state.alpha * 0.14})`);
        trail.addColorStop(1, `rgba(255, 255, 255, ${state.alpha * 0.92})`);
        context.save();
        context.beginPath();
        context.moveTo(state.tailX, state.tailY);
        context.lineTo(state.headX, state.headY);
        context.strokeStyle = trail;
        context.lineCap = "round";
        context.lineWidth = 1.25;
        context.stroke();

        const glow = context.createRadialGradient(
          state.headX,
          state.headY,
          0,
          state.headX,
          state.headY,
          METEOR_HEAD_GLOW_RADIUS,
        );
        glow.addColorStop(0, `rgba(255, 255, 255, ${state.alpha * 0.62})`);
        glow.addColorStop(0.2, `rgba(255, 255, 255, ${state.alpha * 0.2})`);
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        context.fillStyle = glow;
        context.fillRect(
          state.headX - METEOR_HEAD_GLOW_RADIUS,
          state.headY - METEOR_HEAD_GLOW_RADIUS,
          METEOR_HEAD_GLOW_RADIUS * 2,
          METEOR_HEAD_GLOW_RADIUS * 2,
        );

        context.beginPath();
        context.arc(state.headX, state.headY, 1.2, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${state.alpha})`;
        context.fill();
        context.restore();
      }
    };

    const isAnimationActive = () => (
      root.dataset.motion !== "paused" && !reducedMotion.matches && !document.hidden
    );

    const frame = (timestamp: number) => {
      if (!isAnimationActive()) return;
      animationFrame = window.requestAnimationFrame(frame);
      if (loopStartedAt === null) loopStartedAt = timestamp;
      if (timestamp - previousFrame < FRAME_INTERVAL) return;
      previousFrame = timestamp;
      currentSeconds = (timestamp - loopStartedAt) / 1000;
      draw(currentSeconds);
    };

    const syncAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousFrame = 0;
      loopStartedAt = null;
      currentSeconds = 0;
      if (isAnimationActive()) {
        animationFrame = window.requestAnimationFrame(frame);
      } else {
        pointer = null;
        draw(0);
      }
    };

    const resize = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      const pixelRatio = cappedCanvasPixelRatio(window.devicePixelRatio || 1);
      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = createSeededStars(starCountForWidth(viewportWidth));
      connections = createStarConnections(stars, viewportWidth, viewportHeight, STAR_CONNECTION_DISTANCE, 2);
      draw(isAnimationActive() ? currentSeconds : 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || root.dataset.motion === "paused") return;
      pointer = { x: event.clientX, y: event.clientY };
    };

    const onPointerLeave = () => {
      pointer = null;
      if (!isAnimationActive()) draw(0);
    };

    const observer = new MutationObserver((records) => {
      if (records.some((record) => record.attributeName === "data-motion")) syncAnimation();
    });

    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);

    resize();
    syncAnimation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", syncAnimation);
      reducedMotion.removeEventListener("change", syncAnimation);
    };
  }, []);

  return <canvas aria-hidden="true" className="ambient-constellation" data-testid="ambient-constellation" ref={canvasRef} />;
}
