"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

// ── Types ─────────────────────────────────────────────────────────────

type Level = "INF" | "WRN" | "ERR" | "DBG";
type Field = { k: string; v: string; vc?: string };

const LEVEL_COLOR: Record<Level, string> = {
  INF: "text-primary",
  WRN: "text-[#ffbd2e]",
  ERR: "text-error",
  DBG: "text-tertiary",
};

// ── Primitives ────────────────────────────────────────────────────────

function LogLine({
  time, level, event, fields = [], pulse = false,
}: {
  time: string;
  level: Level;
  event: string;
  fields?: Field[];
  pulse?: boolean;
}) {
  return (
    <div className={`flex flex-wrap gap-x-3 leading-5 font-mono text-[10px] ${pulse ? "animate-pulse" : ""}`}>
      <span className="text-[#494847] shrink-0 select-none tabular-nums">{time}</span>
      <span className={`shrink-0 font-bold ${LEVEL_COLOR[level]}`}>{level}</span>
      <span className="text-on-surface shrink-0">{event}</span>
      {fields.map(({ k, v, vc }) => (
        <span key={k} className="shrink-0">
          <span className="text-[#494847]">{k}=</span>
          <span className={vc ?? "text-on-surface-variant"}>{v}</span>
        </span>
      ))}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1 text-[#494847] text-[10px] font-mono select-none">
      <span className="flex-1 h-px bg-[#494847]/20" />
      <span>{label}</span>
      <span className="flex-1 h-px bg-[#494847]/20" />
    </div>
  );
}

// ── Log data ──────────────────────────────────────────────────────────

// Pure system activity — no API calls
const AMBIENT: { time: string; level: Level; event: string; fields: Field[] }[] = [
  { time: "2026-04-18T00:01:04.113Z", level: "DBG", event: "gc.run",        fields: [{ k: "gen", v: "2" }, { k: "pause_ms", v: "0.41" }, { k: "freed_mb", v: "12" }] },
  { time: "2026-04-18T00:02:00.001Z", level: "DBG", event: "healthcheck",   fields: [{ k: "addr", v: ":8080" }, { k: "status", v: "ok", vc: "text-primary" }, { k: "latency", v: "0ms" }] },
  { time: "2026-04-18T00:02:30.449Z", level: "DBG", event: "metrics.push",  fields: [{ k: "target", v: "prometheus:9090" }, { k: "series", v: "42" }, { k: "ok", v: "true", vc: "text-primary" }] },
  { time: "2026-04-18T00:03:15.871Z", level: "DBG", event: "cache.evict",   fields: [{ k: "key", v: "session:*", vc: "text-secondary" }, { k: "count", v: "3" }, { k: "reason", v: "ttl_expired" }] },
  { time: "2026-04-18T00:04:00.001Z", level: "DBG", event: "healthcheck",   fields: [{ k: "addr", v: ":8080" }, { k: "status", v: "ok", vc: "text-primary" }, { k: "latency", v: "0ms" }] },
  { time: "2026-04-18T00:04:31.220Z", level: "WRN", event: "ratelimit.near", fields: [{ k: "client", v: "66.249.90.x" }, { k: "used", v: "88/100" }, { k: "window", v: "60s" }] },
];

// Previous requests — secret /api/v1/sudo endpoint (Easter egg)
const PREV: { time: string; completeTime: string; ip: string; ua: string; ms: string }[] = [
  { time: "2026-04-17T14:22:18.441Z", completeTime: "2026-04-17T14:22:18.453Z", ip: "66.249.90.x",  ua: '"Googlebot/2.1 (+http://www.google.com/bot.html)"', ms: "12" },
  { time: "2026-04-17T22:11:05.002Z", completeTime: "2026-04-17T22:11:05.017Z", ip: "52.87.201.x",  ua: '"LinkedInBot/1.0 (compatible; LinkedInBot/1.0)"',   ms: "15" },
  { time: "2026-04-18T00:01:30.887Z", completeTime: "2026-04-18T00:01:30.900Z", ip: "104.28.96.x",  ua: '"curl/7.81.0"',                                      ms: "13" },
];

// Current request — /api/v1/identity full middleware trace
const CURRENT: { time: string; level: Level; event: string; fields: Field[] }[] = [
  { time: "2026-04-18T00:04:47.000Z", level: "INF", event: "accepted",           fields: [{ k: "method", v: "GET", vc: "text-tertiary" }, { k: "path", v: "/api/v1/identity", vc: "text-secondary" }, { k: "ip", v: "143.92.71.x" }, { k: "host", v: siteConfig.domain, vc: "text-secondary" }, { k: "ua", v: '"curl/8.4.0"' }] },
  { time: "2026-04-18T00:04:47.001Z", level: "DBG", event: "middleware.auth",    fields: [{ k: "action", v: "validate_headers" }, { k: "header", v: "X-Handle" }] },
  { time: "2026-04-18T00:04:47.002Z", level: "INF", event: "middleware.auth",    fields: [{ k: "status", v: "pass", vc: "text-primary" }, { k: "role", v: "root", vc: "text-primary" }, { k: "handle", v: siteConfig.handle, vc: "text-secondary" }] },
  { time: "2026-04-18T00:04:47.004Z", level: "INF", event: "handler.serve",      fields: [{ k: "handler", v: "IdentityHandler" }, { k: "action", v: "load_record" }] },
  { time: "2026-04-18T00:04:47.006Z", level: "DBG", event: "cache.get",          fields: [{ k: "key", v: "identity:v1", vc: "text-secondary" }, { k: "hit", v: "true", vc: "text-primary" }, { k: "ttl", v: "3600s" }] },
  { time: "2026-04-18T00:04:47.009Z", level: "DBG", event: "response.serialize", fields: [{ k: "format", v: "json" }, { k: "bytes", v: "842", vc: "text-on-surface" }, { k: "content_type", v: "application/json" }] },
  { time: "2026-04-18T00:04:47.011Z", level: "DBG", event: "response.headers",   fields: [{ k: "X-Powered-By", v: siteConfig.branding, vc: "text-secondary" }, { k: "X-Handle", v: siteConfig.handle, vc: "text-secondary" }] },
  { time: "2026-04-18T00:04:47.014Z", level: "INF", event: "request_done",       fields: [{ k: "method", v: "GET", vc: "text-tertiary" }, { k: "path", v: "/api/v1/identity", vc: "text-secondary" }, { k: "status", v: "200", vc: "text-primary" }, { k: "latency", v: siteConfig.stats.latency, vc: "text-on-surface" }, { k: "bytes", v: "842" }] },
];

// ── Component ─────────────────────────────────────────────────────────

export function SystemLog({ triggered = false }: { triggered?: boolean }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reveal current request lines one by one when curl fires
  useEffect(() => {
    if (!triggered) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= CURRENT.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 80);
    return () => clearInterval(timer);
  }, [triggered]);

  // Auto-scroll to bottom as new lines appear — old ones pushed up
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleLines, done]);

  return (
    <div className="mt-6 bg-black border border-[#494847]/10">

      {/* Header bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-2 border-b border-[#494847]/20 font-mono text-[10px]">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-primary font-bold tracking-widest">LIVE_SYSTEM_OUTPUT</span>
        </span>
        <span className="text-[#494847]">pid=8291</span>
        <span className="text-[#494847]">uptime=1452h22m</span>
        <span className="text-[#494847]">addr=:443</span>
        <span className="ml-auto text-[#494847]">req#{PREV.length + 7}</span>
      </div>

      {/* Fixed-height scrollable log body — new lines push old ones up */}
      <div ref={bodyRef} className="h-56 overflow-y-auto p-4 space-y-0.5">

        {/* Pure system activity */}
        {AMBIENT.map((line, i) => (
          <LogLine key={`a${i}`} {...line} />
        ))}

        {/* Previous requests to secret endpoint */}
        {PREV.map((req, i) => (
          <div key={`p${i}`}>
            <LogLine
              time={req.time}
              level="INF"
              event="accepted"
              fields={[
                { k: "method", v: "GET",          vc: "text-tertiary" },
                { k: "path",   v: "/api/v1/sudo", vc: "text-secondary" },
                { k: "ip",     v: req.ip },
                { k: "ua",     v: req.ua },
              ]}
            />
            <LogLine
              time={req.completeTime}
              level="INF"
              event="request_done"
              fields={[
                { k: "method",  v: "GET",          vc: "text-tertiary" },
                { k: "path",    v: "/api/v1/sudo", vc: "text-secondary" },
                { k: "status",  v: "200",          vc: "text-primary" },
                { k: "latency", v: `${req.ms}ms`,  vc: "text-on-surface" },
                { k: "bytes",   v: "318" },
              ]}
            />
          </div>
        ))}

        <Divider label="new request" />

        {/* Current /api/v1/identity trace — lines appear on curl */}
        {CURRENT.slice(0, visibleLines).map((line, i) => (
          <LogLine key={`c${i}`} {...line} />
        ))}

        {/* Awaiting next request */}
        {done && <Divider label="" />}
        <LogLine
          time="2026-04-18T00:04:47.015Z"
          level="INF"
          event="listening"
          fields={[
            { k: "addr",  v: ":443" },
            { k: "tls",   v: "true" },
            { k: "ready", v: "true", vc: "text-primary" },
          ]}
          pulse
        />
      </div>
    </div>
  );
}
