"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Terminal } from "lucide-react";
import { siteConfig } from "@/config/site";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Home", href: routes.home, activePaths: [routes.home] },
  { label: "Skills", href: "/#skills", activePaths: [] },
  { label: "Projects", href: routes.projects, activePaths: [routes.projects] },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-surface/75 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <Link
          className="text-sm font-bold tracking-normal text-foreground transition-[color,transform] duration-200 hover:text-primary active:scale-[0.98] motion-reduce:active:scale-100 sm:text-base"
          href={routes.home}
        >
          {siteConfig.author}
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {[
            ...navItems,
            {
              label: "Contact",
              href:
                pathname === routes.home || pathname === routes.projects
                  ? "#contact"
                  : "/#contact",
              activePaths: [],
            },
          ].map((item) => {
            const isActive =
              item.activePaths.includes(pathname) ||
              (item.href === routes.projects &&
                pathname.startsWith(`${routes.projects}/`));

            return (
              <Link
                className={cn(
                  "rounded px-3 py-2 text-sm text-muted transition-[color,background-color,transform] duration-200 hover:bg-white/[0.05] hover:text-foreground active:scale-[0.97] motion-reduce:active:scale-100",
                  isActive &&
                    "border-b-2 border-primary text-primary hover:text-primary",
                )}
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            aria-label="Open terminal reference"
            className="inline-flex size-9 items-center justify-center rounded border border-transparent text-muted transition-[color,background-color,border-color,transform] duration-200 hover:border-border hover:bg-white/[0.05] hover:text-primary active:scale-95 motion-reduce:active:scale-100"
            href="#"
          >
            <Terminal aria-hidden="true" size={17} strokeWidth={2} />
          </Link>
          <Link
            aria-label="Open code reference"
            className="inline-flex size-9 items-center justify-center rounded border border-transparent text-muted transition-[color,background-color,border-color,transform] duration-200 hover:border-border hover:bg-white/[0.05] hover:text-primary active:scale-95 motion-reduce:active:scale-100"
            href="#"
          >
            <Code2 aria-hidden="true" size={17} strokeWidth={2} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
