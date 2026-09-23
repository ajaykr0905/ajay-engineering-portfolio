"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/site";

function isCurrentDestination(pathname: string, href: string) {
  if (href === "/#projects") {
    return pathname === "/" || pathname.startsWith("/projects/");
  }

  if (href === "/writing") {
    return pathname === "/writing" || pathname.startsWith("/writing/");
  }

  return pathname === href;
}

export function PrimaryNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation">
      <ul className="nav-list">
        {primaryNavigation.map((item) => {
          const isCurrent = isCurrentDestination(pathname, item.href);

          return (
            <li key={item.href}>
              <Link
                aria-current={isCurrent ? "page" : undefined}
                data-spectrum-option
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
