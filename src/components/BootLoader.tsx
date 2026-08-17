import { cn } from "@/lib/utils";

export function BootLoader({ message = "INITIALIZING ORBITAL ENGINE…" }: { message?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-primary/20" />
        <span className="absolute inset-0 animate-spin rounded-full border border-t-primary border-r-transparent border-b-transparent border-l-transparent duration-1000" />
        <span className="absolute inset-[6px] rounded-full border border-primary/30" />
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(255,255,255,0.35)]" />
      </div>
      <p className="tech-label mt-6 animate-pulse tracking-[0.22em]">{message}</p>
      <div className="mt-3 flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-primary/60"
            style={{ animation: "pulse 1.5s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
