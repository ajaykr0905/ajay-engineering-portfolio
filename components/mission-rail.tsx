"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "contact", label: "Contact" },
] as const;

export function MissionRail() {
  const [activeSection, setActiveSection] = useState<(typeof sections)[number]["id"] | null>(null);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((target): target is HTMLElement => target !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (visible?.target.id) {
        setActiveSection(visible.target.id as (typeof sections)[number]["id"]);
      }
    }, {
      rootMargin: "-10% 0px -70% 0px",
      threshold: [0.05, 0.2, 0.45],
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Homepage sections" className="mission-rail">
      <ol>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              aria-current={activeSection === section.id ? "location" : undefined}
              href={`#${section.id}`}
            >
              <span className="mission-index" aria-hidden="true">0{index + 1}</span>
              <span className="mission-node" aria-hidden="true" />
              <span className="mission-label">{section.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
