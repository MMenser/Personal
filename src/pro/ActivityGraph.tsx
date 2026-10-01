import { useEffect, useMemo, useState } from "react";

// Shape of /activity.json (see strava/activity.mjs)
interface ActivityDay {
  minutes: number;
  count: number;
  sports: string[];
}

interface ActivityData {
  generatedAt: string;
  days: Record<string, ActivityDay>;
}

interface Cell {
  date: string;
  day: ActivityDay | null;
  future: boolean;
}

const WEEKS = 53;
// Leading column for day labels; shared by the month row and the cell grid so they line up.
const COLUMNS = `1.75rem repeat(${WEEKS}, minmax(0, 1fr))`;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

// Sequential single-hue ramp, empty -> most active
const LEVEL_CLASSES = ["bg-neutral-100", "bg-blue-200", "bg-blue-400", "bg-blue-600", "bg-blue-800"];
const LEVEL_LABELS = ["No activity", "Under 30 min", "30-59 min", "60-89 min", "90+ min"];

const level = (minutes: number) =>
  minutes <= 0 ? 0 : minutes < 30 ? 1 : minutes < 60 ? 2 : minutes < 90 ? 3 : 4;

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const formatMinutes = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`);

// Columns are Sunday-start weeks, ending with the week that contains today.
function buildWeeks(days: Record<string, ActivityDay>): Cell[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - (WEEKS - 1) * 7);

  const weeks: Cell[][] = [];
  for (let w = 0; w < WEEKS; w++) {
    const week: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = isoDate(date);
      week.push({ date: key, day: days[key] ?? null, future: date > today });
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

  const weeks = useMemo(() => (data ? buildWeeks(data.days) : []), [data]);
  const totals = useMemo(() => {
    const cells = weeks.flat().filter(c => c.day);
    return {
      workouts: cells.reduce((n, c) => n + c.day!.count, 0),
      hours: Math.round(cells.reduce((n, c) => n + c.day!.minutes, 0) / 60),
    };
  }, [weeks]);

  // Stay invisible until data arrives, and entirely if Strava is unavailable.
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
          aria-label={`Workout heatmap: ${totals.workouts} workouts over the past year`}
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
                cell.future ? "invisible" : LEVEL_CLASSES[level(cell.day?.minutes ?? 0)]
              }`}
              onMouseEnter={e => {
                const box = e.currentTarget.getBoundingClientRect();
                const parent = e.currentTarget.parentElement!.getBoundingClientRect();
                setHover({ cell, x: box.left - parent.left + box.width / 2, y: box.top - parent.top });
              }}
            />
          )))}
        </div>

        {hover && !hover.cell.future && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full -mt-1.5 whitespace-nowrap rounded bg-neutral-900 px-2 py-1 text-xs text-white shadow"
            style={{
              left: `clamp(4.5rem, ${hover.x}px, calc(100% - 4.5rem))`,
              top: hover.y,
            }}
          >
            <div className="font-semibold">{formatDate(hover.cell.date)}</div>
            {hover.cell.day ? (
              <div className="text-neutral-300">
                {formatMinutes(hover.cell.day.minutes)} · {hover.cell.day.sports.join(", ")}
              </div>
            ) : (
              <div className="text-neutral-300">Rest day</div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
        <span>
          {totals.workouts} workouts, {totals.hours} hours in the last year · via Strava
        </span>
        <span className="flex items-center gap-1">
          Less
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={cls} title={LEVEL_LABELS[i]} className={`inline-block h-2.5 w-2.5 rounded-[2px] ${cls}`} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
