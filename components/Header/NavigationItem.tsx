"use client";

import { useState } from "react";
import { DropdownContent } from "./DropdownContent";
import { DropdownTrigger } from "./DropdownTrigger";
import type { NavigationMenu } from "./NavigationData";

interface NavigationItemProps {
  item: NavigationMenu;
}

export function NavigationItem({ item }: NavigationItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <DropdownTrigger
        isOpen={isOpen}
        name={item.name}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      />
      {isOpen && (
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <DropdownContent categories={item.categories} items={item.items} />
        </div>
      )}
    </div>
  );
}
