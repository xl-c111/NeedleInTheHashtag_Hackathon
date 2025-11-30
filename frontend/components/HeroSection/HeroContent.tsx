export function HeroContent() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h1 className="font-semibold text-3xl text-black leading-[1.1] tracking-[-0.02em] sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
          wanna get out?
        </h1>
        <img src="/beentheretextdark.svg" alt="been there" className="block mt-2 h-8 sm:h-10 md:h-12 lg:h-14 dark:hidden" />
        <img src="/beentheretext.svg" alt="been there" className="block mt-2 h-8 sm:h-10 md:h-12 lg:h-14 hidden dark:block" />
      </div>
      <p className="max-w-lg text-sm text-black/70 leading-relaxed tracking-tight sm:text-base md:text-lg dark:text-white/70">
        tell your story.
      </p>
    </div>
  );
}
