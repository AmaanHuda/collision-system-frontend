import { createFileRoute, Link } from "@tanstack/react-router";
import { OrbitalViewport } from "@/components/orbital/OrbitalViewport";
import { Panel } from "@/components/ui/panel";
import { CONJUNCTIONS, riskClasses } from "@/lib/orbital-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbital AI — Collision Risk Assessment for Mega-Constellations" },
      {
        name: "description",
        content:
          "AI-driven orbital safety platform that tracks satellites, predicts close approaches, assesses collision probability and simulates avoidance maneuvers.",
      },
      { property: "og:title", content: "Orbital AI — AI-Driven Collision Risk Assessment" },
      {
        property: "og:description",
        content:
          "Predict. Assess. Prevent. Real-time conjunction intelligence for mega-constellation operators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PIPELINE = [
  { k: "TRACK", d: "24,681 catalogued objects ingested from multi-sensor fusion." },
  { k: "PREDICT", d: "Propagated ephemerides screened for 7-day conjunction windows." },
  { k: "ASSESS", d: "Monte-Carlo collision probability with covariance realism." },
  { k: "SIMULATE", d: "Candidate maneuvers scored against fuel and mission impact." },
  { k: "MITIGATE", d: "Operator-ready avoidance plan with confidence bounds." },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="grid-overlay pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(100%_70%_at_80%_0%,color-mix(in_oklab,var(--violet)_14%,transparent),transparent_65%)]" />

      <header className="relative z-20 flex items-center justify-between border-b border-border px-5 py-3.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center border border-primary/50">
            <span className="h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-sm tracking-[0.26em]">ORBITAL AI</span>
        </div>
        <nav className="flex items-center gap-5">
          <span className="hidden items-center gap-2 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-risk-low" />
            <span className="tech-label">ALL SYSTEMS NOMINAL</span>
          </span>
          <Link
            to="/mission-control"
            className="border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-primary hover:bg-primary/20"
          >
            LAUNCH MISSION CONTROL
          </Link>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1500px] gap-6 px-5 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:py-12">
        <div className="animate-rise self-center">
          <p className="tech-label flex items-center gap-2">
            <span className="inline-block h-px w-6 bg-primary" />
            ORBITAL INTELLIGENCE SYSTEM
          </p>
          <h1 className="mt-4 text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl xl:text-6xl">
            AI-Driven Collision
            <br />
            <span className="text-primary">Risk Assessment</span>
          </h1>
          <p className="mt-4 font-mono text-sm tracking-[0.3em] text-accent">
            PREDICT. ASSESS. PREVENT.
          </p>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            An intelligent orbital safety platform that analyzes satellite trajectories,
            predicts close approaches, evaluates collision probability, and helps operators
            make faster, safer orbital decisions.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/mission-control"
              className="border border-primary bg-primary/15 px-5 py-3 font-mono text-[11px] tracking-[0.22em] text-primary transition-colors hover:bg-primary/25"
            >
              LAUNCH MISSION CONTROL →
            </Link>
            <Link
              to="/collision-risk"
              className="border border-border px-5 py-3 font-mono text-[11px] tracking-[0.22em] text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
            >
              EXPLORE INTELLIGENCE
            </Link>
          </div>

          <dl className="mt-9 grid grid-cols-3 gap-px border border-border bg-border/50">
            {[
              ["TRACKED OBJECTS", "24,681"],
              ["OPEN CONJUNCTIONS", "127"],
              ["AI CONFIDENCE", "96.8%"],
            ].map(([k, v]) => (
              <div key={k} className="bg-background/60 px-3 py-3">
                <dt className="tech-label">{k}</dt>
                <dd className="mt-1 font-mono text-lg text-primary">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <OrbitalViewport
            className="h-[420px] w-full border border-border sm:h-[520px] lg:h-[640px]"
            showControls={false}
          />
          <div className="pointer-events-none absolute bottom-5 left-5 hidden w-64 sm:block">
            <Panel className="p-3">
              <p className="tech-label">Highest priority event</p>
              <p className="mt-1 font-mono text-[13px] text-risk-critical">
                {CONJUNCTIONS[0]!.primary} × {CONJUNCTIONS[0]!.secondary}
              </p>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Pc 8.7% · MISS 184 m · TCA 14:32 UTC
              </p>
            </Panel>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-border">
        <div className="mx-auto max-w-[1500px] px-5 py-8">
          <p className="tech-label">Operational pipeline</p>
          <div className="mt-4 grid gap-px bg-border/50 md:grid-cols-5">
            {PIPELINE.map((p, i) => (
              <div key={p.k} className="bg-background/60 px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-[12px] tracking-[0.2em] text-primary">
                    {p.k}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  {p.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-border">
        <div className="mx-auto grid max-w-[1500px] gap-4 px-5 py-8 md:grid-cols-3">
          {CONJUNCTIONS.slice(0, 3).map((c) => {
            const r = riskClasses[c.risk];
            return (
              <Panel key={c.id} className={cn("border-l-2 p-4", r.border.replace("border-", "border-l-"))}>
                <div className="flex items-center justify-between">
                  <span className={cn("font-mono text-[10px] tracking-[0.2em]", r.text)}>
                    {c.risk}
                  </span>
                  <span className="tech-label">TCA {c.tca}</span>
                </div>
                <p className="mt-2 font-mono text-[14px]">
                  {c.primary} <span className="text-muted-foreground">×</span> {c.secondary}
                </p>
                <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                  Pc {c.probability}% · MISS {c.missDistance} m · CONF {c.confidence}%
                </p>
              </Panel>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 border-t border-border px-5 py-5">
        <p className="tech-label">
          ORBITAL AI · SPACE SITUATIONAL AWARENESS · SIMULATED DATASET FOR DEMONSTRATION
        </p>
      </footer>
    </div>
  );
}
