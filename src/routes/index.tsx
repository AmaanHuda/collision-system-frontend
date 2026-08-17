import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { BootLoader } from "@/components/BootLoader";
import { ClientOnly } from "@/components/ClientOnly";
import {
  DEFAULT_GLOBE_FILTERS,
  LiveOrbitalScene,
  type GlobeFilters,
} from "@/components/orbital/LiveOrbitalScene";
import { ControlDock } from "@/components/controls/ControlDock";
import { IntelPanel } from "@/components/panels/IntelPanel";
import { fetchSatellites, type FeedStatus } from "@/services/satelliteService";
import { loadSgp4, type SatelliteObject } from "@/utils/orbitalPropagation";
import type { ConjunctionResult } from "@/utils/collisionAnalysis";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Orbital AI — Live Satellite Conjunction Screening" },
      {
        name: "description",
        content:
          "Full-screen orbital command interface: real CelesTrak element sets propagated in-browser with SGP4 and prototype conjunction screening.",
      },
      { property: "og:title", content: "Orbital AI — Live Satellite Conjunction Screening" },
      {
        property: "og:description",
        content:
          "Real satellite orbits, live tracking and prototype collision-risk screening in a single full-screen orbital interface.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrbitalCommand,
});

function OrbitalCommand() {
  const [satellites, setSatellites] = useState<SatelliteObject[]>([]);
  const [status, setStatus] = useState<FeedStatus>("loading");
  const [statusMsg, setStatusMsg] = useState("ACQUIRING ORBITAL DATA...");
  const [source, setSource] = useState("CELESTRAK GP");
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const dataAgeMinutes = lastSync ? Math.floor((now - lastSync.getTime()) / 60000) : null;
  const dataStale = dataAgeMinutes !== null && dataAgeMinutes > 120;


  const [filters, setFilters] = useState<GlobeFilters>(DEFAULT_GLOBE_FILTERS);


  const [satA, setSatA] = useState<SatelliteObject | null>(null);
  const [satB, setSatB] = useState<SatelliteObject | null>(null);
  const [awaitingB, setAwaitingB] = useState(false);
  const [conjunction, setConjunction] = useState<ConjunctionResult | null>(null);

  const load = useCallback(async (force: boolean) => {
    setRefreshing(true);
    setStatusMsg("ACQUIRING ORBITAL DATA...");
    await loadSgp4();
    const feed = await fetchSatellites(force);
    setSatellites(feed.satellites);
    setStatus(feed.status);
    setSource(feed.source);
    setStatusMsg(feed.message);
    setLastSync(new Date());
    setRefreshing(false);
    window.setTimeout(() => {
      setStatusMsg("");
    }, 4000);

  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const pick = useCallback(
    (s: SatelliteObject) => {
      setSatA((prevA) => {
        if (!prevA) return s;
        if (awaitingB && s.id !== prevA.id) {
          setSatB(s);
          setAwaitingB(false);
          return prevA;
        }
        if (s.id === prevA.id) return prevA;
        setSatB(null);
        setConjunction(null);
        return s;
      });
    },
    [awaitingB],
  );

  const closePanel = () => {
    setSatA(null);
    setSatB(null);
    setAwaitingB(false);
    setConjunction(null);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 z-10 [background:radial-gradient(circle_at_center,transparent_50%,var(--background)_120%)]" />
      <ClientOnly
        fallback={
          <div className="h-full w-full">
            <BootLoader message="ACQUIRING ORBITAL DATA…" />
          </div>
        }
      >


        <LiveOrbitalScene
          className="absolute inset-0 h-full w-full"
          satellites={satellites}
          filters={filters}
          selectedA={satA}
          selectedB={satB}
          conjunction={conjunction}
          onPick={pick}
        />
      </ClientOnly>

      {/* system status — top left */}
      <div className="pointer-events-none absolute left-4 top-4 z-20">
        <h1 className="font-mono text-[11px] tracking-[0.34em] text-foreground">ORBITAL AI</h1>
        <p
          className={cn(
            "mt-1 flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em]",
            status === "live"
              ? "text-risk-low"
              : status === "fallback"
                ? "text-risk-moderate"
                : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              status === "live"
                ? "animate-pulse bg-risk-low"
                : status === "fallback"
                  ? "bg-risk-moderate"
                  : "animate-pulse bg-muted-foreground",
            )}
          />
          {status === "live" ? "LIVE" : status === "fallback" ? "FALLBACK" : "SYNCING"} · {source}
          {dataStale && (
            <span className="ml-1.5 border border-risk-moderate/50 px-1 font-mono text-[8px] text-risk-moderate">
              STALE
            </span>
          )}
        </p>
        <p className="mt-0.5 font-mono text-[9px] tracking-[0.2em] text-muted-foreground">
          {satellites.length.toLocaleString()} OBJECTS TRACKED
        </p>

        {statusMsg && (
          <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-primary">{statusMsg}</p>
        )}
        <span className="mt-2 inline-block border border-primary/25 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.16em] text-primary/70">
          V2.4.1-PROTOTYPE
        </span>
        {lastSync && (
          <p className="mt-1 font-mono text-[8px] tracking-[0.16em] text-muted-foreground/70">
            SYNC {lastSync.toISOString().slice(11, 19)} UTC
          </p>
        )}
      </div>



      <ControlDock
        satellites={satellites}
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={() => void load(true)}
        refreshing={refreshing}
        onSelectSatellite={pick}
      />

      <IntelPanel
        satA={satA}
        satB={satB}
        awaitingB={awaitingB}
        onRequestSecond={() => setAwaitingB(true)}
        onClearB={() => {
          setSatB(null);
          setConjunction(null);
        }}
        onClose={closePanel}
        onConjunction={setConjunction}
      />
    </main>
  );
}
