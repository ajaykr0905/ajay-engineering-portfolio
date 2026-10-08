export const siteConfig = {
  name: "Ajay Kumar Pondugala",
  shortName: "Ajay",
  title: "Software Engineer II at Cisco | Backend & Distributed Systems | Go, Java, PostgreSQL, Kubernetes",
  focus: "Backend & Distributed Systems",
  description:
    "Software Engineer II at Cisco in Bengaluru. Go/Java services, PostgreSQL, messaging, and failure recovery, with merged NATS and Prometheus fixes and reproducible public labs.",
  location: "Bengaluru, India",
  url: "https://ajaykr-engineering-portfolio.vercel.app",
  website: "https://ajaykr-engineering-portfolio.vercel.app",
  email: "ajaykumar.rob27@gmail.com",
  emailHref: "mailto:ajaykumar.rob27@gmail.com?subject=Portfolio%20conversation",
  gmailComposeUrl:
    "https://mail.google.com/mail/?view=cm&fs=1&to=ajaykumar.rob27%40gmail.com&su=Portfolio%20conversation",
  github: "https://github.com/ajaykr0905",
  linkedin: "https://www.linkedin.com/in/ajay-kumar-pondugala-3b3b711b8/",
  openSourceTrackerPath: "/opensource_dev",
  openSourceTrackerUrl: "https://ajaykr-engineering-portfolio.vercel.app/opensource_dev",
  resumePath: "/Ajay_Kumar_Pondugala_Resume.pdf",
  recruitingPath: "/recruiting",
  proofPacketPath: "/Ajay_Backend_Proof_Packet.pdf",
} as const;

export const primaryNavigation = [
  { href: "/#projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Résumé" },
] as const;

export const stack = [
  "Go",
  "Java",
  "PostgreSQL",
  "RabbitMQ",
  "NATS",
  "Kubernetes",
  "Prometheus",
  "OpenTelemetry",
] as const;
