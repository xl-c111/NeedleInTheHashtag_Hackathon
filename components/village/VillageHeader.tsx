"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/village/stories", label: "Stories" },
  { href: "/village/about", label: "About" },
];

export function VillageHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Logo */}
          <Link
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            href="/"
          >
            <Heart className="h-6 w-6 text-teal-500 fill-teal-500/30" />
            <span className="font-semibold text-xl text-white tracking-tight">
              Village
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="rounded-lg px-4 py-2 text-sm text-slate-300 transition-colors hover:text-white hover:bg-slate-800/50"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <Button
              asChild
              className="h-9 bg-teal-600 hover:bg-teal-500 text-white rounded-lg tracking-tight"
              size="sm"
            >
              <Link href="/village/chat">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start talking
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800/50 sm:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            type="button"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden border-t border-slate-800/50 bg-slate-950/95 backdrop-blur-lg sm:hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    className="rounded-lg px-4 py-3 text-slate-300 transition-colors hover:text-white hover:bg-slate-800/50"
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <Button
                  asChild
                  className="w-full h-11 bg-teal-600 hover:bg-teal-500 text-white rounded-lg"
                >
                  <Link href="/village/chat">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start talking
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
