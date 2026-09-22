export const siteConfig = {
  name: "Ajay Kumar Pondugala",
  shortName: "Ajay",
  title: "Distributed Systems and AI Infrastructure Engineer",
  description:
    "Building reliable backend platforms, observable cloud systems, and reproducible ML infrastructure.",
  location: "Bengaluru, India",
  url: "https://ajay-dev-engineer.vercel.app",
  email: "ajaykumar.rob27@gmail.com",
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
