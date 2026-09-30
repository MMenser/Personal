import { useEffect, useState, type ReactNode } from "react";
import { Activity, Cpu, HardDrive, MemoryStick, Thermometer, Zap } from "lucide-react";
import { BigValue, Meter, Sparkline, StatusLabel, Tile } from "./components";
import { formatAgo, formatBytes, formatUptime, levelFor } from "./format";
import type { Level, Stats, ThrottleFlags } from "./types";

const POLL_MS = 2000;
const STALE_MS = 10000;

// Pi 4/5 start soft-throttling at 80°C and hard-throttle at 85°C.
const TEMP_WARN = 70;
const TEMP_CRITICAL = 80;
const TEMP_METER_MAX = 85;

function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Stats = await res.json();
        if (!cancelled) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
      if (!cancelled) setNow(Date.now());
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return { stats, error, now };
}

const Header = ({ stats, error, now }: { stats: Stats | null; error: string | null; now: number }) => {
  const stale = error != null || (stats != null && now - stats.timestamp > STALE_MS);
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-muted">Command center</p>
        <h1 className="text-2xl font-semibold text-primary">{stats?.hostname ?? "Raspberry Pi"}</h1>
        {stats?.model && <p className="text-sm text-secondary">{stats.model}</p>}
      </div>
      <div className="flex items-center gap-2 text-sm text-secondary" role="status">
        <span
          className={`h-2 w-2 rounded-full ${stale ? "" : "animate-pulse"}`}
          style={{ background: stale ? "var(--status-critical)" : "var(--status-good)" }}
          aria-hidden="true"
        />
        {stats == null && error == null && "Connecting…"}
        {stale && `Connection lost${stats ? ` · last update ${formatAgo(now - stats.timestamp)}` : ""}`}
        {stats && !stale && `Live · up ${formatUptime(stats.uptimeSeconds)}`}
      </div>
    </header>
  );
};

const UsageTile = ({
  icon,
  label,
  used,
  total,
  warn,
  critical,
  extra,
}: {
  icon: ReactNode;
  label: string;
  used: number;
  total: number;
  warn: number;
  critical: number;
  extra?: ReactNode;
}) => {
  const percent = total > 0 ? (used / total) * 100 : 0;
  const level = levelFor(percent, warn, critical);
  return (
    <Tile icon={icon} label={label}>
      <BigValue value={percent.toFixed(0)} unit="%" detail={`${formatBytes(used)} of ${formatBytes(total)}`} />
      <Meter percent={percent} level={level} label={`${label} used`} />
      <StatusLabel level={level} />
      {extra}
    </Tile>
  );
};

const describeThrottle = (flags: ThrottleFlags): string[] =>
  [
    flags.underVoltage && "under-voltage",
    flags.freqCapped && "frequency capped",
    flags.throttled && "throttled",
    flags.softTempLimit && "soft temperature limit",
  ].filter((s): s is string => Boolean(s));

const PowerTile = ({ throttled }: { throttled: NonNullable<Stats["throttled"]> }) => {
  const now = describeThrottle(throttled.now);
  const sinceBoot = describeThrottle(throttled.sinceBoot);
  const level: Level = now.length ? "critical" : sinceBoot.length ? "warning" : "ok";
  return (
    <Tile icon={<Zap size={16} />} label="Power & throttling">
      <StatusLabel
        level={level}
        text={now.length ? `Now: ${now.join(", ")}` : sinceBoot.length ? "OK now, but issues since boot" : "No issues since boot"}
      />
      {sinceBoot.length > 0 && <p className="text-sm text-secondary">Since boot: {sinceBoot.join(", ")}</p>}
      <p className="text-xs text-muted">vcgencmd get_throttled = {throttled.raw}</p>
    </Tile>
  );
};

export default function Dashboard() {
  const { stats, error, now } = useStats();

  if (!stats) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-6">
        <Header stats={null} error={error} now={now} />
        {error && <p className="text-secondary">Can't reach the stats server ({error}). Is it running?</p>}
      </main>
    );
  }

  const { cpu, temperatureC, memory, swap, disk, load, history, throttled } = stats;
  const cpuLevel = levelFor(cpu.usagePercent, 75, 90);
  const tempLevel = temperatureC != null ? levelFor(temperatureC, TEMP_WARN, TEMP_CRITICAL) : null;

  const temps = history.temperatureC.filter((t): t is number => t != null);
  const tempDomain: [number, number] = temps.length
    ? [Math.floor(Math.min(...temps) - 3), Math.ceil(Math.max(...temps) + 3)]
    : [0, 100];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 flex flex-col gap-6">
      <Header stats={stats} error={error} now={now} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile icon={<Cpu size={16} />} label="CPU">
          <BigValue value={cpu.usagePercent.toFixed(0)} unit="%" detail={`${cpu.cores} cores`} />
          <Meter percent={cpu.usagePercent} level={cpuLevel} label="CPU usage" />
          <Sparkline
            label="Last 5 minutes"
            values={history.cpuPercent}
            timestamps={history.timestamps}
            domain={[0, 100]}
            format={(v) => `${v.toFixed(0)}%`}
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {cpu.perCore.map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted">
                <span className="w-12 shrink-0 whitespace-nowrap">Core {i}</span>
                <div className="flex-1">
                  <Meter thin percent={p} level={levelFor(p, 75, 90)} label={`Core ${i} usage`} />
                </div>
                <span className="w-8 text-right tabular-nums text-secondary">{p.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Tile>

        <Tile icon={<Thermometer size={16} />} label="Temperature">
          {temperatureC != null && tempLevel != null ? (
            <>
              <BigValue value={temperatureC.toFixed(1)} unit="°C" />
              <Meter percent={(temperatureC / TEMP_METER_MAX) * 100} level={tempLevel} label="CPU temperature" />
              <StatusLabel
                level={tempLevel}
                text={tempLevel === "ok" ? "Normal" : tempLevel === "warning" ? "Warm" : "Hot: throttling likely"}
              />
              <Sparkline
                label="Last 5 minutes"
                values={history.temperatureC}
                timestamps={history.timestamps}
                domain={tempDomain}
                format={(v) => `${v.toFixed(1)}°C`}
              />
            </>
          ) : (
            <p className="text-sm text-muted">No thermal sensor found.</p>
          )}
        </Tile>

        <Tile icon={<Activity size={16} />} label="Load average">
          <table className="text-sm">
            <tbody>
              {(["1 min", "5 min", "15 min"] as const).map((span, i) => (
                <tr key={span}>
                  <th scope="row" className="py-1 pr-6 text-left font-normal text-muted">{span}</th>
                  <td className="py-1 tabular-nums text-primary font-medium">{load[i].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted">
            A load at or above {cpu.cores} (the core count) means the CPU is saturated.
          </p>
        </Tile>

        <UsageTile
          icon={<MemoryStick size={16} />}
          label="Memory"
          used={memory.usedBytes}
          total={memory.totalBytes}
          warn={80}
          critical={92}
          extra={
            swap && (
              <p className="text-sm text-secondary">
                Swap: {formatBytes(swap.usedBytes)} of {formatBytes(swap.totalBytes)}
              </p>
            )
          }
        />

        {disk && (
          <UsageTile
            icon={<HardDrive size={16} />}
            label={`Disk (${disk.path})`}
            used={disk.usedBytes}
            total={disk.totalBytes}
            warn={80}
            critical={90}
          />
        )}

        {throttled && <PowerTile throttled={throttled} />}
      </div>
    </main>
  );
}
