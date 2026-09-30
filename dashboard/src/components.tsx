import { useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { CircleCheck, OctagonAlert, TriangleAlert } from "lucide-react";
import { formatAgo } from "./format";
import type { Level } from "./types";

const LEVEL_COLOR: Record<Level, string> = {
  ok: "var(--accent)",
  warning: "var(--status-warning)",
  critical: "var(--status-critical)",
};

export const Tile = ({
  icon,
  label,
  children,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`tile rounded-xl p-5 flex flex-col gap-4 ${className}`}>
    <h2 className="flex items-center gap-2 text-sm font-medium text-secondary">
      <span className="text-muted" aria-hidden="true">
        {icon}
      </span>
      {label}
    </h2>
    {children}
  </section>
);

export const BigValue = ({ value, unit, detail }: { value: string; unit?: string; detail?: ReactNode }) => (
  <div className="flex items-baseline gap-2 flex-wrap">
    <span className="text-4xl font-semibold text-primary">
      {value}
      {unit && <span className="text-xl font-medium text-secondary ml-0.5">{unit}</span>}
    </span>
    {detail && <span className="text-sm text-secondary">{detail}</span>}
  </div>
);

// Status is never carried by color alone: icon + text label always accompany it.
export const StatusLabel = ({ level, text }: { level: Level; text?: string }) => {
  const Icon = level === "ok" ? CircleCheck : level === "warning" ? TriangleAlert : OctagonAlert;
  const color = level === "ok" ? "var(--status-good)" : LEVEL_COLOR[level];
  const fallback = level === "ok" ? "Normal" : level === "warning" ? "Elevated" : "Critical";
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-secondary">
      <Icon size={16} style={{ color }} aria-hidden="true" />
      {text ?? fallback}
    </span>
  );
};

export const Meter = ({
  percent,
  level,
  label,
  thin = false,
}: {
  percent: number;
  level: Level;
  label: string;
  thin?: boolean;
}) => {
  const fill = LEVEL_COLOR[level];
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={`meter rounded-full overflow-hidden ${thin ? "h-1.5" : "h-2.5"}`}
      style={{ "--fill": fill } as CSSProperties}
    >
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${clamped}%`, background: fill }} />
    </div>
  );
};

const SPARK_W = 300;
const SPARK_H = 56;

// Single-series trend line with a hover crosshair and readout.
export const Sparkline = ({
  values,
  timestamps,
  domain,
  format,
  label,
}: {
  values: (number | null)[];
  timestamps: number[];
  domain: [number, number];
  format: (v: number) => string;
  label: string;
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const n = values.length;
  if (n < 2) return <div className="text-sm text-muted" style={{ height: SPARK_H }}>Collecting data…</div>;

  const [lo, hi] = domain;
  const x = (i: number) => (i / (n - 1)) * SPARK_W;
  const y = (v: number) => SPARK_H - 2 - ((v - lo) / (hi - lo || 1)) * (SPARK_H - 4);

  let d = "";
  values.forEach((v, i) => {
    if (v == null) return;
    d += `${d && values[i - 1] != null ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
  });

  const active = hover ?? n - 1;
  const activeValue = values[active];
  const now = timestamps[n - 1];

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - rect.left) / rect.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="text-secondary">
          {activeValue != null ? format(activeValue) : "—"}{" "}
          <span className="text-muted">· {hover == null ? "now" : formatAgo(now - timestamps[active])}</span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
        preserveAspectRatio="none"
        className="w-full touch-none cursor-crosshair"
        style={{ height: SPARK_H }}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`${label}, latest ${activeValue != null ? format(activeValue) : "unknown"}`}
      >
        <line x1={0} x2={SPARK_W} y1={SPARK_H - 1} y2={SPARK_H - 1} stroke="var(--baseline)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {hover != null && (
          <line x1={x(hover)} x2={x(hover)} y1={0} y2={SPARK_H} stroke="var(--text-muted)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
        )}
      </svg>
    </div>
  );
};
