import { Heart, Phone } from "lucide-react";
import Link from "next/link";

export function VillageFooter() {
  return (
    <footer className="relative bg-slate-950 pt-16 pb-8">
      {/* Top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Crisis Resources - Prominent */}
        <div className="mb-12 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-600/5 p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
              <Phone className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="mb-2 font-medium text-lg text-white">
              Need immediate support?
            </h3>
            <p className="mb-6 text-slate-400">
              If you're in crisis, please reach out to these services
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
              <a
                className="group flex items-center gap-3 rounded-xl bg-slate-800/50 px-6 py-3 transition-all duration-200 hover:bg-slate-800"
                href="tel:131114"
              >
                <span className="text-amber-400 font-semibold">Lifeline</span>
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  13 11 14
                </span>
              </a>
              <a
                className="group flex items-center gap-3 rounded-xl bg-slate-800/50 px-6 py-3 transition-all duration-200 hover:bg-slate-800"
                href="tel:1300224636"
              >
                <span className="text-amber-400 font-semibold">Beyond Blue</span>
                <span className="text-slate-300 group-hover:text-white transition-colors">
                  1300 22 4636
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Simple footer content */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
            href="/village"
          >
            <Heart className="h-5 w-5 text-teal-500 fill-teal-500/30" />
            <span className="font-semibold text-lg tracking-tight">Village</span>
          </Link>

          {/* Tagline */}
          <p className="max-w-md text-sm text-slate-500">
            A safe space for young men to share, listen, and find their way forward.
            You're not alone.
          </p>

          {/* Copyright */}
          <p className="text-xs text-slate-600">
            Built with care for the eSafety Hackathon 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
