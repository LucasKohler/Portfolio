import Link from "next/link";
import { siteConfig } from "@/config/site";

const footerLinks = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Email", href: siteConfig.links.email },
  { label: "Resume", href: siteConfig.links.resume },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-border/60 bg-[#050505] py-16 md:py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <div className="text-2xl font-semibold tracking-normal text-foreground md:text-3xl">
            Lucas Kohler Marques
          </div>
          <p className="mt-2 text-base text-muted">Software Engineer</p>
          <p className="mt-3 text-xs font-medium text-[#ddb7ff]/60">
            Built with modern web technologies.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-5 text-base md:justify-end"
        >
          {footerLinks.map((link) => (
            <Link
              className="text-muted transition-colors hover:text-primary"
              href={link.href}
              key={link.label}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

