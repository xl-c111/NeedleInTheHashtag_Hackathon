import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center">
      <Link aria-label="been there" className="flex items-center gap-2" href="/">
        <Image 
          src="/favicon.svg" 
          alt="Logo" 
          width={24} 
          height={24} 
          className="h-6 w-6"
        />
        <span className="font-bold text-2xl text-black tracking-tighter transition-colors dark:text-white">
          been there
        </span>
      </Link>
    </div>
  );
}
