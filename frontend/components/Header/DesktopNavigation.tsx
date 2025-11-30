"use client";

import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "./NavigationData";
import { NavigationItem } from "./NavigationItem";

export function DesktopNavigation() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  // Only show navigation items on homepage
  if (!isHomepage) {
    return null;
  }

  return (
    <nav className="group/nav flex items-center gap-1">
      {NAVIGATION_ITEMS.map((item) => (
        <NavigationItem item={item} key={item.name} />
      ))}
    </nav>
  );
}
