export const siteConfig = {
  name: "Ajay",
  shortName: "Ajay",
  title: "Distributed Systems and AI Infrastructure Engineer",
  description:
    "I build failure-aware backend and AI systems that engineers can inspect, run, break, and verify through tests, traces, and honest limitations.",
  location: "Bengaluru, India",
  url: "https://ajaykr-engineering-portfolio.vercel.app",
  website: "https://ajaykr-engineering-portfolio.vercel.app",
  email: "ajaykumar.rob27@gmail.com",
  emailHref: "mailto:ajaykumar.rob27@gmail.com?subject=Portfolio%20conversation",
  gmailComposeUrl:
    "https://mail.google.com/mail/?view=cm&fs=1&to=ajaykumar.rob27%40gmail.com&su=Portfolio%20conversation",
  github: "https://github.com/ajaykr0905",
  linkedin: "https://www.linkedin.com/in/ajay-kumar-pondugala-3b3b711b8/",
  resumePath: "/Ajay_Kumar_Pondugala_Resume.pdf",
} as const;

export const primaryNavigation = [
  { href: "/projects/fault-tolerant-transformer-lab", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Résumé" },
] as const;

export const stack = [
  "Go",
  "Java",
  "Python",
  "Kubernetes",
  "OpenTelemetry",
  "PostgreSQL",
  "PyTorch",
] as const;
