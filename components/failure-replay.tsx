"use client";

import { useEffect, useId, useState } from "react";
import type { ReplayScenario } from "@/lib/projects";

type FailureReplayProps = {
  projectTitle: string;
  scenarios: ReplayScenario[];
};

export function FailureReplay({ projectTitle, scenarios }: FailureReplayProps) {
  const firstScenario = scenarios[0];
  const [activeScenarioId, setActiveScenarioId] = useState(firstScenario?.id ?? "");
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [motionPaused, setMotionPaused] = useState(true);
  const headingId = useId();
  const timelineId = useId();
  const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId) ?? firstScenario;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;

    const syncMotionState = () => {
      const paused = reducedMotion.matches || root.dataset.motion === "paused";
      setMotionPaused(paused);
      if (paused) setIsPlaying(false);
    };

    const observer = new MutationObserver(syncMotionState);
    syncMotionState();
    reducedMotion.addEventListener("change", syncMotionState);
    observer.observe(root, { attributes: true, attributeFilter: ["data-motion"] });

    return () => {
      reducedMotion.removeEventListener("change", syncMotionState);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!activeScenario || !isPlaying || motionPaused) return;
    if (activeStep >= activeScenario.steps.length - 1) return;

    const timeout = window.setTimeout(() => {
      setActiveStep((step) => {
        const nextStep = Math.min(step + 1, activeScenario.steps.length - 1);
        if (nextStep === activeScenario.steps.length - 1) setIsPlaying(false);
        return nextStep;
      });
    }, 720);

    return () => window.clearTimeout(timeout);
  }, [activeScenario, activeStep, isPlaying, motionPaused]);

  if (!activeScenario) return null;

  const currentStep = activeScenario.steps[Math.min(activeStep, activeScenario.steps.length - 1)];

  function selectScenario(scenario: ReplayScenario) {
    setActiveScenarioId(scenario.id);
    setActiveStep(0);
    setIsPlaying(false);
  }

  function replay() {
    setActiveStep(0);
    setIsPlaying(!motionPaused);
  }

  return (
    <section className="failure-replay" id="failure-replay" aria-labelledby={headingId}>
      <header className="failure-replay-header">
        <div>
          <p className="eyebrow">Test-grounded behavior</p>
          <h2 id={headingId}>Replay the verified system path</h2>
        </div>
        <p className="failure-replay-disclosure">
          Deterministic replay of linked tests—not live telemetry.
        </p>
      </header>

      <div className="failure-replay-options" role="group" aria-label={`${projectTitle} replay scenarios`}>
        {scenarios.map((scenario) => (
          <button
            aria-controls={timelineId}
            aria-pressed={scenario.id === activeScenario.id}
            className="failure-replay-option"
            data-spectrum-option
            key={scenario.id}
            onClick={() => selectScenario(scenario)}
            type="button"
          >
            {scenario.label}
            <span aria-hidden="true" className="action-arrow">→</span>
          </button>
        ))}
      </div>

      <div className="failure-replay-stage">
        <div className="failure-replay-summary">
          <p className="eyebrow">Expected test outcome</p>
          <p className="failure-replay-outcome">{activeScenario.outcome}</p>
          <p className="muted">{activeScenario.limitation}</p>
        </div>

        <ol className="failure-replay-timeline" id={timelineId}>
          {activeScenario.steps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep;
            return (
              <li
                aria-current={isActive ? "step" : undefined}
                className="failure-replay-step"
                data-active={isActive ? "true" : "false"}
                data-complete={isComplete ? "true" : "false"}
                data-state={step.state}
                key={`${activeScenario.id}-${step.title}`}
              >
                <span aria-hidden="true" className="failure-replay-step-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="failure-replay-step-copy">
                  <strong>{step.title}</strong>
                  <span>{step.detail}</span>
                </span>
                <span className="failure-replay-step-state">{step.state}</span>
              </li>
            );
          })}
        </ol>

        <div className="failure-replay-navigation" role="group" aria-label="Replay step controls">
          <button
            className="button button-secondary"
            disabled={activeStep === 0}
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((step) => Math.max(0, step - 1));
            }}
            type="button"
          >
            Previous step
          </button>
          <button
            className="button button-secondary"
            disabled={activeStep === activeScenario.steps.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setActiveStep((step) => Math.min(activeScenario.steps.length - 1, step + 1));
            }}
            type="button"
          >
            Next step
          </button>
          <button
            aria-controls={timelineId}
            className="button button-primary"
            data-spectrum-option
            disabled={isPlaying}
            onClick={replay}
            type="button"
          >
            {motionPaused ? "Reset sequence" : isPlaying ? "Replaying…" : "Replay sequence"}
          </button>
        </div>

        <p className="failure-replay-motion-note">
          {motionPaused
            ? "Animation is paused. The Previous and Next controls keep every step available."
            : "Replay advances once through the sequence; every step remains available for manual inspection."}
        </p>
        <a
          className="failure-replay-evidence text-link"
          data-spectrum-option
          href={activeScenario.sourceUrl}
          rel="noreferrer"
        >
          {activeScenario.sourceLabel} <span aria-hidden="true" className="action-arrow">↗</span>
        </a>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {currentStep
          ? `${activeScenario.label}: step ${activeStep + 1} of ${activeScenario.steps.length}. ${currentStep.title}. ${currentStep.detail}`
          : activeScenario.label}
      </p>
    </section>
  );
}
