import { useEffect } from "react";

export function FadeIn({ children, className }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    // small hydration-safe delay handled by CSS animation
  }, []);
  return (
    <div
      className={className}
      style={{ animation: "fadeIn 0.4s ease-out both" }}
    >
      {children}
    </div>
  );
}
