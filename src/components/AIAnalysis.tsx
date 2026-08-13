import { useEffect, useRef, useState } from "react";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { ANALYSIS_STAGES, PRIMARY_EVENT, riskClasses } from "@/lib/orbital-data";
import { cn } from "@/lib/utils";
import { Cpu } from "lucide-react";

const METRICS = [
  { k: "Predicted Collision Probability", v: "8.7%", tone: "text-risk-critical" },
  { k: "Time of Closest Approach", v: "14m 32s", tone: "text-foreground" },
  { k: "Estimated Miss Distance", v: "184 m", tone: "text-risk-high" },
  { k: "Relative Velocity", v: "7.42 km/s", tone: "text-foreground" },
  { k: "Prediction Confidence", v: "96.8%", tone: "text-primary" },
];

const CINEMATIC = [
  "SCANNING ORBIT",
  "PROPAGATING TRAJECTORY",
  "ANALYZING UNCERTAINTY",
  "CALCULATING COLLISION PROBABILITY",
  "RISK ASSESSMENT COMPLETE",
];

export function AIAnalysis({ className }: { className?: string | undefined }) {
  const [stage, setStage] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setStage(0);
    ANALYSIS_STAGES.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setStage(i);
          if (i === ANALYSIS_STAGES.length - 1) {
            timers.current.push(setTimeout(() => setRunning(false), 900));
          }
        }, i * 900),
      );
    });
  };

  const r = riskClasses[PRIMARY_EVENT.risk];

  return (
    <Panel className={cn("flex flex-col", className)}>
      <PanelHeader
        title="AI ORBITAL ANALYSIS"
        meta={running ? "PROCESSING" : "MODEL v4.2 · READY"}
        action={<Cpu className={cn("h-3.5 w-3.5 text-primary", running && "animate-pulse")} />}
      />

      <div className="space-y-4 p-4">
        <div className={cn("border-l-2 px-3 py-2", r.border.replace("border-", "border-l-"), r.bg)}>
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Potential conjunction detected between{" "}
            <span className="font-mono text-risk-critical">{PRIMARY_EVENT.primary}</span> and{" "}
            <span className="font-mono text-risk-critical">{PRIMARY_EVENT.secondary}</span>.
          </p>
        </div>

        <dl className="divide-y divide-border border border-border">
          {METRICS.map((m) => (
            <div key={m.k} className="flex items-center justify-between px-3 py-2">
              <dt className="text-[11px] text-muted-foreground">{m.k}</dt>
              <dd className={cn("font-mono text-[13px]", m.tone)}>{m.v}</dd>
            </div>
          ))}
        </dl>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Trajectory propagation indicates increasing positional convergence. Uncertainty
          analysis suggests a 68% confidence interval of ±74 m around the predicted miss
          distance.
        </p>

        <button
          type="button"
          onClick={run}
          disabled={running}
          className="relative w-full overflow-hidden border border-primary/50 bg-primary/10 py-2.5 font-mono text-[11px] tracking-[0.24em] text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
        >
          {running ? "ANALYSIS IN PROGRESS…" : "RUN DEEP ANALYSIS"}
          {running && (
            <span className="scanline animate-sweep absolute inset-y-0 left-0 w-1/3 opacity-70" />
          )}
        </button>

        {stage >= 0 && (
          <ol className="space-y-1.5">
            {ANALYSIS_STAGES.map((s, i) => {
              const done = i < stage || (!running && stage === ANALYSIS_STAGES.length - 1);
              const active = i === stage && running;
              return (
                <li key={s} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center border font-mono text-[8px]",
                      done
                        ? "border-risk-low/60 bg-risk-low/15 text-risk-low"
                        : active
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.16em]",
                      active ? "text-primary" : done ? "text-foreground/80" : "text-muted-foreground/60",
                    )}
                  >
                    {CINEMATIC[i] ?? s}
                  </span>
                  {active && (
                    <span className="h-px flex-1 overflow-hidden bg-border">
                      <span className="scanline animate-sweep block h-px w-1/2" />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </Panel>
  );
}
