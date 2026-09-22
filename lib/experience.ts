export type Experience = {
  role: string;
  company: string;
  product: string;
  location: string;
  period: string;
  summary: string;
  outcomes: string[];
};

export const experience: Experience[] = [
  {
    role: "Software Engineer II",
    company: "Cisco",
    product: "Kubernetes-native enterprise identity and security platform",
    location: "Bengaluru, India",
    period: "Sep 2025 — Present",
    summary:
      "Own backend delivery and release readiness for authentication, authorization, certificate, and platform-reliability workflows.",
    outcomes: [
      "Lead cross-service changes across Go and Java services for authentication and authorization, certificate lifecycle, TLS and PKI flows, asynchronous messaging, PostgreSQL, OpenSearch, and Kubernetes operations.",
      "Built evidence-driven release qualification across exact container images, service health, contract checks, metrics, traces, and regression pipelines.",
      "Diagnosed dependency and readiness failures across secrets, messaging infrastructure, and downstream services, then documented reusable recovery checks.",
      "Delivered certificate telemetry and API corrections across service boundaries while preserving authorization behavior and redacting internal failure details.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Cisco",
    product: "Cisco Identity Services Engine and certificate-management workflows",
    location: "Bengaluru, India",
    period: "Aug 2024 — Sep 2025",
    summary:
      "Delivered Java and Spring Boot capabilities for Cisco Identity Services Engine and its certificate-management workflows.",
    outcomes: [
      "Owned requirements, implementation, regression validation, release readiness, and cross-team defect resolution for backend features.",
      "Built authentication-adjacent certificate lifecycle, validation, and stale-certificate detection workflows backed by REST APIs and database services.",
      "Integrated Python and Robot Framework validation into CI pipelines and separated product defects from test and environment failures before merge.",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Cisco",
    product: "Enterprise networking policy and validation automation",
    location: "Bengaluru, India",
    period: "Jan 2024 — Jun 2024",
    summary:
      "Built network-policy and validation automation for enterprise networking environments.",
    outcomes: [
      "Developed a QoS calculator that automated enterprise network policy mapping.",
      "Implemented latency analysis to surface configuration bottlenecks.",
      "Contributed Robot Framework validation for Cisco IOS XE, IOS XR, and ACI environments.",
    ],
  },
];
