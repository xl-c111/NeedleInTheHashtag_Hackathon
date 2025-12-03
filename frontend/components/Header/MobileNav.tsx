"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { NAVIGATION_ITEMS } from "./NavigationData";

type MobileNavProps = {
  onClose: () => void;
};

export function MobileNav({ onClose }: MobileNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();
  const { user, signOut } = useAuth();

  return (
    <div className="border-black/5 border-t py-4 lg:hidden dark:border-white/5">
      <nav className="flex flex-col gap-2">
        {NAVIGATION_ITEMS.map((item) => (
          <div key={item.name}>
            <button
              className="flex w-full items-center justify-between rounded-md px-3 py-2 font-medium text-black text-sm transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/5"
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === item.name ? null : item.name
                )
              }
              type="button"
            >
              {item.name}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  activeDropdown === item.name ? "rotate-180" : ""
                }`}
              />
            </button>
            {activeDropdown === item.name && (
              <div className="mt-1 ml-4 space-y-1">
                {item.categories
                  ? item.categories.map((category) => (
                      <div className="py-1" key={category.name}>
                        <div className="px-3 py-1">
                          <span className="font-medium text-black/40 text-xs uppercase tracking-tight dark:text-white/40">
                            {category.name}
                          </span>
                        </div>
                        {category.items.map((subItem) => (
                          <Link
                            className="flex items-center justify-between rounded-md px-3 py-2 text-black/70 text-sm tracking-tight transition-colors hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            href={subItem.href}
                            key={subItem.href}
                            onClick={onClose}
                          >
                            <span>{subItem.name}</span>
                            {subItem.icon && (
                              <subItem.icon className="h-4 w-4 text-black/30 dark:text-white/30" />
                            )}
                          </Link>
                        ))}
                      </div>
                    ))
                  : item.items?.map((subItem) => (
                      <Link
                        className="flex items-center justify-between rounded-md px-3 py-2 text-black/70 text-sm tracking-tight transition-colors hover:bg-black/10 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                        href={subItem.href}
                        key={subItem.href}
                        onClick={onClose}
                      >
                        <span>{subItem.name}</span>
                        {subItem.icon && (
                          <subItem.icon className="h-4 w-4 text-black/30 dark:text-white/30" />
                        )}
                      </Link>
                    ))}
              </div>
            )}
          </div>
        ))}
        <div className="mt-4 flex flex-col gap-2 px-3">
          {/* Group 2: Stories & Chat - Always visible (public access) */}
          <Button
            className="w-full tracking-tighter flex items-center justify-center py-6"
            onClick={() => {
              router.push("/stories");
              onClose();
            }}
            size="sm"
            variant="outline"
          >
            <img src="/storiesbtn.svg" alt="stories" className="h-8 w-auto object-contain" />
          </Button>

          <Button
            className="w-full tracking-tighter flex items-center justify-center py-6"
            onClick={() => {
              router.push("/chat");
              onClose();
            }}
            size="sm"
          >
            <img src="/chatbtn.svg" alt="chat" className="h-8 w-auto object-contain" />
          </Button>

          {/* Group 3: Write & Diary - Authenticated routes only */}
          {user && (
            <>
              <Button
                className="w-full tracking-tighter flex items-center justify-center py-6"
                onClick={() => {
                  router.push("/write");
                  onClose();
                }}
                size="sm"
                variant="outline"
              >
                <img src="/storiesbtnfeather.svg" alt="write" className="h-8 w-auto object-contain" />
              </Button>
              <Button
                className="w-full tracking-tighter flex items-center justify-center py-6"
                onClick={() => {
                  router.push("/diary");
                  onClose();
                }}
                size="sm"
                variant="outline"
              >
                <img src="/diarybtn.svg" alt="diary" className="h-8 w-auto object-contain" />
              </Button>
            </>
          )}

          {/* Group 1: Resources - Always visible (public access) */}
          <Button
            className="w-full tracking-tighter"
            onClick={() => {
              router.push("/resources");
              onClose();
            }}
            size="sm"
            variant="outline"
          >
            resources
          </Button>

          {/* Group 4: Auth section - Profile, Sign Out / Login, Sign Up */}
          {user ? (
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 space-y-2">
              <Button
                className="w-full tracking-tighter flex items-center justify-center py-6"
                onClick={() => {
                  router.push("/profile");
                  onClose();
                }}
                size="sm"
                variant="outline"
              >
                <img src="/profilehead.svg" alt="profile" className="h-8 w-auto object-contain" />
              </Button>
              <Button
                className="w-full tracking-tighter flex items-center justify-center py-6"
                onClick={async () => {
                  await signOut();
                  onClose();
                }}
                size="sm"
                variant="outline"
              >
                <img src="/logout.svg" alt="sign out" className="h-8 w-auto object-contain" />
              </Button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 space-y-2">
              <Button
                className="w-full tracking-tighter flex items-center justify-center py-6"
                onClick={() => {
                  router.push("/login");
                  onClose();
                }}
                size="sm"
                variant="outline"
              >
                <img src="/login.svg" alt="log in" className="h-8 w-auto object-contain" />
              </Button>
              <Button
                className="w-full tracking-tighter flex items-center justify-center py-6"
                onClick={() => {
                  router.push("/signup");
                  onClose();
                }}
                size="sm"
              >
                <img src="/signup.svg" alt="sign up" className="h-8 w-auto object-contain" />
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
