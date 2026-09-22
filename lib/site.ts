export const siteConfig = {
  name: "Ajay Kumar Pondugala",
  shortName: "Ajay",
  title: "Distributed Systems and AI Infrastructure Engineer",
  description:
    "I build backend and AI projects that recruiters and engineers can inspect, run locally, and verify through tests.",
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
  "Security Engineering",
  "Vulnerability Management",
  "PostgreSQL",
  "PyTorch",
] as const;
