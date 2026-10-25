/** Dress-code colour swatches for the groom's and bride's sides. */
const SIDES = [
  { label: "Groom", colors: ["#B5403A", "#8B2E2A", "#D4604A"] },
  { label: "Bride", colors: ["#3A7D7B", "#2E5C8A", "#4A8C6F"] },
] as const;

export function DressCode({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <p className="script-line text-[2.2rem] md:text-4xl">Dress code</p>
      <div className="mt-2 flex items-center justify-center gap-6">
        {SIDES.map((side) => (
          <div key={side.label} className="flex items-center gap-1.5">
            {side.colors.map((c) => (
              <span key={c} className="w-4 h-4 rounded-full border border-accent/20" style={{ backgroundColor: c }} />
            ))}
            <span className="text-cream text-lg md:text-base ml-1">{side.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
