import Link from "next/link";
import { Heart } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center">
      <Link aria-label="Village" className="flex items-center gap-2" href="/">
        <Heart className="h-6 w-6 text-primary fill-primary/20" />
        <span className="font-bold text-2xl text-black tracking-tighter transition-colors dark:text-white">
          Village
        </span>
      </Link>
    </div>
  );
}
