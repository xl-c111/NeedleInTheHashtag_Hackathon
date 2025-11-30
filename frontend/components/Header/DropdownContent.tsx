import Link from "next/link";
import type { NavigationCategory, NavigationItem } from "./NavigationData";

type DropdownContentProps = {
  items?: NavigationItem[];
  categories?: NavigationCategory[];
};

export function DropdownContent({ items, categories }: DropdownContentProps) {
  return (
    <div className="fade-in slide-in-from-top-2 absolute top-full left-0 animate-in pt-2 duration-200">
      <div className="min-w-[200px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg dark:border-white/10 dark:bg-black">
        <div className="group/dropdown p-1.5">
          {categories
            ? categories.map((category) => (
                <div className="py-1" key={category.name}>
                  <div className="px-3 py-1.5">
                    <span className="font-medium text-black/40 text-xs uppercase tracking-tight dark:text-white/40">
                      {category.name}
                    </span>
                  </div>
                  {category.items.map((subItem) => (
                    <Link
                      className="group hover:!opacity-100 flex items-center justify-between rounded-lg px-3 py-2.5 text-black text-sm tracking-tight transition-all duration-200 hover:bg-black/5 group-hover/dropdown:opacity-40 dark:text-white dark:hover:bg-white/5"
                      href={subItem.href}
                      key={subItem.name}
                    >
                      <span>{subItem.name}</span>
                      {subItem.icon && (
                        <subItem.icon className="h-4 w-4 text-black/30 transition-colors group-hover:text-black/50 dark:text-white/30 dark:group-hover:text-white/50" />
                      )}
                    </Link>
                  ))}
                </div>
              ))
            : items?.map((subItem) => (
                <Link
                  className="group hover:!opacity-100 flex items-center justify-between rounded-lg px-3 py-2.5 text-black text-sm tracking-tight transition-all duration-200 hover:bg-black/5 group-hover/dropdown:opacity-40 dark:text-white dark:hover:bg-white/5"
                  href={subItem.href}
                  key={subItem.name}
                >
                  <span>{subItem.name}</span>
                  {subItem.icon && (
                    <subItem.icon className="h-4 w-4 text-black/30 transition-colors group-hover:text-black/50 dark:text-white/30 dark:group-hover:text-white/50" />
                  )}
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
