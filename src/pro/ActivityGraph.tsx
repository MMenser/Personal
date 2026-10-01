import { useEffect, useMemo, useState } from "react";
import InfoTip from "../InfoTip";

// Shape of /activity.json (see receiver/activity.mjs). Dates are Pacific time.
interface ActivityData {
  generatedAt: string;
  start: string;
  end: string;
  days: Record<string, string[]>; // date -> activity names (HealthKit style, e.g. "traditionalStrengthTraining")
}

interface Cell {
  date: string;
  workouts: string[];
  hidden: boolean; // outside the start..end window
}

const WEEKS = 53;
// Leading column for day labels; shared by the month row and the cell grid so they line up.
const COLUMNS = `1.75rem repeat(${WEEKS}, minmax(0, 1fr))`;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const ACTIVE_CLASS = "bg-orange-500";
const REST_CLASS = "bg-neutral-100";

const ACTIVITY_LABELS: Record<string, string> = {
  traditionalStrengthTraining: "Strength training",
  functionalStrengthTraining: "Strength training",
  highIntensityIntervalTraining: "HIIT",
  downhillSkiing: "Skiing",
};

// "stairClimbing" -> "Stair climbing"
const activityLabel = (name: string) =>
  ACTIVITY_LABELS[name] ??
  name.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase().replace(/^./, c => c.toUpperCase());

// "Climbing ×2, Running"
function describeWorkouts(names: string[]) {
  const counts = new Map<string, number>();
  for (const name of names) {
    const label = activityLabel(name);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts].map(([label, n]) => (n > 1 ? `${label} ×${n}` : label)).join(", ");
}

// Date math stays in UTC on plain YYYY-MM-DD strings so the grid matches the
// file's Pacific dates no matter where the visitor is.
const parseDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const formatDate = (iso: string) =>
  parseDate(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

// Columns are Sunday-start weeks, ending with the week that contains data.end.
function buildWeeks(data: ActivityData): Cell[][] {
  const last = parseDate(data.end);
  const first = new Date(last);
  first.setUTCDate(last.getUTCDate() - last.getUTCDay() - (WEEKS - 1) * 7);

  const weeks: Cell[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(first);
      date.setUTCDate(first.getUTCDate() + w * 7 + d);
      const key = isoDate(date);
      week.push({ date: key, workouts: data.days[key] ?? [], hidden: key < data.start || key > data.end });
    }
    weeks.push(week);
  }
  return weeks;
}

export default function ActivityGraph() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [hover, setHover] = useState<{ cell: Cell; x: number; y: number } | null>(null);

  useEffect(() => {
    fetch("/activity.json")
      .then(res => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const weeks = useMemo(() => (data ? buildWeeks(data) : []), [data]);
  const activeDays = data ? Object.keys(data.days).length : 0;

  // Stay invisible until data arrives, and entirely if activity.json is missing.
  if (!data) return null;

  return (
    <div className="mt-5">
      <div className="grid gap-x-[2px] mb-1 text-[10px] text-neutral-500" style={{ gridTemplateColumns: COLUMNS }}>
        {weeks.map((week, w) => {
          const month = +week[0].date.slice(5, 7) - 1;
          const newMonth = w > 0 && month !== +weeks[w - 1][0].date.slice(5, 7) - 1;
          return (
            <span key={week[0].date} className="whitespace-nowrap" style={{ gridColumn: w + 2 }}>
              {newMonth ? MONTHS[month] : ""}
            </span>
          );
        })}
      </div>

      <div className="relative" onMouseLeave={() => setHover(null)}>
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: COLUMNS }}
          role="img"
          aria-label={`Workout graph: ${activeDays} active days over the past year`}
        >
          {DAY_LABELS.map((label, d) => (
            <span
              key={d}
              className="text-[10px] leading-none text-neutral-500 self-center"
              style={{ gridColumn: 1, gridRow: d + 1 }}
            >
              {label}
            </span>
          ))}
          {weeks.flatMap((week, w) => week.map((cell, d) => (
            <div
              key={cell.date}
              style={{ gridColumn: w + 2, gridRow: d + 1 }}
              className={`aspect-square rounded-[2px] ${
                cell.hidden ? "invisible" : cell.workouts.length ? ACTIVE_CLASS : REST_CLASS
              }`}
              onMouseEnter={e => {
                const box = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget.parentElement!.getBoundingClientRect();
                setHover({ cell, x: box.left - parent.left + box.width / 2, y: box.top - parent.top });
              }}
            />
          )))}
        </div>

        {hover && !hover.cell.hidden && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full -mt-1.5 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white shadow"
            style={{
              left: `clamp(4.5rem, ${hover.x}px, calc(100% - 4.5rem))`,
              top: hover.y,
            }}
          >
            <div className="font-semibold">{formatDate(hover.cell.date)}</div>
            <div className="text-neutral-300">{hover.cell.workouts.length ? describeWorkouts(hover.cell.workouts) : "Rest day"}</div>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-xs text-neutral-500">
        <InfoTip
          align="center"
          content="Days I worked out in the past year, tracked by my Apple Watch. My iPhone sends each workout to my Raspberry Pi, which turns them into this graph. Hover over a square to see the workout."
        >
          Activity
        </InfoTip>
      </div>
    </div>
  );
}
