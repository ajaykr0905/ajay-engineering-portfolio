"use client";

import { useEffect, useRef } from "react";
import {
  ambientStarStateAtTime,
  createSeededStars,
  createStarConnections,
  starCountForWidth,
  type AmbientStar,
  type StarConnection,
} from "@/lib/ambient-stars";

const FRAME_INTERVAL = 1000 / 30;
const POINTER_RADIUS = 160;
const CONNECTION_DISTANCE = 120;

export function AmbientConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const root = document.documentElement;
    const finePointer = window.matchMedia("(pointer: fine)");
    let stars: AmbientStar[] = [];
    let connections: StarConnection[] = [];
    let viewportWidth = 0;
    let viewportHeight = 0;
    let animationFrame = 0;
    let previousFrame = 0;
    let pointer: { x: number; y: number } | null = null;

    const draw = (seconds: number) => {
      context.clearRect(0, 0, viewportWidth, viewportHeight);
      const starStates = stars.map((star) => ambientStarStateAtTime(star, viewportWidth, viewportHeight, seconds));

      for (const connection of connections) {
        const from = starStates[connection.from];
        const to = starStates[connection.to];
        const distance = Math.hypot(from.x - to.x, from.y - to.y);
        if (distance > CONNECTION_DISTANCE) continue;
        const proximity = 1 - distance / CONNECTION_DISTANCE;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, proximity) * 0.12})`;
        context.lineWidth = 0.7;
        context.stroke();
      }

      if (pointer && finePointer.matches && root.dataset.motion === "active") {
        const halo = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, POINTER_RADIUS);
        halo.addColorStop(0, "rgba(255, 255, 255, 0.055)");
        halo.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = halo;
        context.fillRect(pointer.x - POINTER_RADIUS, pointer.y - POINTER_RADIUS, POINTER_RADIUS * 2, POINTER_RADIUS * 2);
      }

      for (const star of starStates) {
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        context.fill();
      }
    };

    const isAnimationActive = () => root.dataset.motion !== "paused" && !document.hidden;

    const frame = (timestamp: number) => {
      if (!isAnimationActive()) return;
      animationFrame = window.requestAnimationFrame(frame);
      if (timestamp - previousFrame < FRAME_INTERVAL) return;
      previousFrame = timestamp;
      draw(timestamp / 1000);
    };

    const syncAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      previousFrame = 0;
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
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(viewportWidth * pixelRatio);
      canvas.height = Math.round(viewportHeight * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = createSeededStars(starCountForWidth(viewportWidth));
      connections = createStarConnections(stars, viewportWidth, viewportHeight, CONNECTION_DISTANCE, 2);
      draw(0);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || root.dataset.motion === "paused") return;
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

    resize();
    syncAnimation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, []);

  return <canvas aria-hidden="true" className="ambient-constellation" data-testid="ambient-constellation" ref={canvasRef} />;
}
