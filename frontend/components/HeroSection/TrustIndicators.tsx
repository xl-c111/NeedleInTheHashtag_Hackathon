import { Shield, Lock, Heart } from "lucide-react";

export function TrustIndicators() {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4">
      {/* Anonymous */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 sm:h-7 sm:w-7">
          <Lock className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
        </div>
        <span className="text-[11px] text-black/50 tracking-tight sm:text-xs dark:text-white/50">
          <span className="font-medium text-black dark:text-white">100%</span>{" "}
          anonymous
        </span>
      </div>

      {/* Divider */}
      <div className="hidden h-3 w-px bg-black/10 sm:block dark:bg-white/10" />

      {/* Safe */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 sm:h-7 sm:w-7">
          <Shield className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
        </div>
        <span className="text-[11px] text-black/50 tracking-tight sm:text-xs dark:text-white/50">
          <span className="font-medium text-black dark:text-white">Safe</span>{" "}
          space
        </span>
      </div>

      {/* Divider */}
      <div className="hidden h-3 w-px bg-black/10 sm:block dark:bg-white/10" />

      {/* Free */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 sm:h-7 sm:w-7">
          <Heart className="h-3 w-3 text-primary sm:h-3.5 sm:w-3.5" />
        </div>
        <span className="text-[11px] text-black/50 tracking-tight sm:text-xs dark:text-white/50">
          <span className="font-medium text-black dark:text-white">Free</span>{" "}
          forever
        </span>
      </div>
    </div>
  );
}
