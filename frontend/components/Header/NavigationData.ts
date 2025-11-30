import type { LucideIcon } from "lucide-react";
import { MessageCircle, BookOpen, HelpCircle, Heart } from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon?: LucideIcon;
}

export interface NavigationCategory {
  name: string;
  items: NavigationItem[];
}

export interface NavigationMenu {
  name: string;
  items?: NavigationItem[];
  categories?: NavigationCategory[];
}

export const NAVIGATION_ITEMS: NavigationMenu[] = [
  {
    name: "About",
    items: [
      { name: "How it works", href: "#features" },
      { name: "Our mission", href: "/about", icon: Heart },
      { name: "FAQ", href: "#faq", icon: HelpCircle },
    ],
  },
];
