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

export const NAVIGATION_ITEMS: NavigationMenu[] = [];
