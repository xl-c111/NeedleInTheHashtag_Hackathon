export function HeroImage() {
  return (
    <div className="relative h-[300px] w-full sm:h-[400px] md:h-[500px] lg:h-[600px]">
      <div className="relative h-full w-full overflow-hidden">
        {/* Background with pathwithfootsteps.svg */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative h-full w-full"
            style={{
              backgroundImage: "url('/pathwithfootsteps.svg')",
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      </div>
    </div>
  );
}
