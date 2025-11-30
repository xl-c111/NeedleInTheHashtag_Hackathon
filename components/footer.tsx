import { Heart, Phone } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    title: "Support",
    links: [
      { name: "Start a conversation", href: "/village/chat" },
      { name: "Read stories", href: "/village/stories" },
      { name: "How it works", href: "#features" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Our mission", href: "/village/about" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

const crisisResources = [
  { name: "Lifeline", number: "13 11 14" },
  { name: "Beyond Blue", number: "1300 22 4636" },
  { name: "Emergency", number: "000" },
];

export function Footer() {
  const currentYear = new Date().getFullYear().toString();

  return (
    <footer className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
      <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm flex-shrink-0">
          <Link
            className="flex items-center gap-2 font-semibold text-2xl text-black tracking-tight transition-opacity hover:opacity-80 dark:text-white"
            href="/"
          >
            <Heart className="h-6 w-6 text-primary fill-primary/20" />
            Village
          </Link>
          <p className="mt-4 text-base text-black/60 leading-relaxed tracking-tight dark:text-white/60">
            A safe space for young men to share, listen, and find their way
            forward. You're not alone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 md:gap-16">
          {footerLinks.map((section) => (
            <div className="space-y-4" key={section.title}>
              <h3 className="font-semibold text-black text-sm tracking-tight dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      className="text-black/60 text-sm leading-relaxed tracking-tight transition-colors hover:text-black dark:text-white/60 dark:hover:text-white"
                      href={link.href}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Crisis Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-black text-sm tracking-tight dark:text-white">
              Crisis Support
            </h3>
            <p className="text-black/60 text-xs leading-relaxed tracking-tight dark:text-white/60">
              If you're in crisis, please reach out:
            </p>
            <ul className="space-y-2">
              {crisisResources.map((resource) => (
                <li key={resource.name}>
                  <a
                    className="flex items-center gap-2 text-primary text-sm font-medium tracking-tight transition-colors hover:text-primary/80"
                    href={`tel:${resource.number.replace(/\s/g, "")}`}
                  >
                    <Phone className="h-3 w-3" />
                    {resource.name}: {resource.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col justify-between gap-4 border-black/10 border-t pt-8 text-black/50 text-xs tracking-tight sm:flex-row sm:items-center dark:border-white/10 dark:text-white/50">
        <p>© {currentYear} Village. Made with care in Melbourne.</p>
        <div className="flex gap-6">
          <Link
            className="transition-colors hover:text-black dark:hover:text-white"
            href="/terms"
          >
            Terms
          </Link>
          <Link
            className="transition-colors hover:text-black dark:hover:text-white"
            href="/privacy"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
