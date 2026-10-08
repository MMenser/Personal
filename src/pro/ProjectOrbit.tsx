import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { projectHref } from "./route";

interface OrbitItem {
  id: string;    // project page the link opens
  title: string;
}

// Wide enough that the orbit plus its labels fits beside the max-w-2xl column.
const WIDE_QUERY = "(min-width: 1280px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Path is a superellipse |x/a|^N + |y/b|^N = 1: a rounded rectangle that hugs the body
// closer than an ellipse would, so it needs less room around it.
const N = 4;
const CORNER = 2 ** (1 / N); // scale so the path clears the body's corners
const GAP = 16;              // px between the body and the path
const LABEL_ROOM = 48;       // px above/below the path for (up to two-line) labels
const SECONDS_PER_LAP = 120;

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
};

// sign(v) * |v|^p, the superellipse's parametric form
const spow = (v: number, p: number) => Math.sign(v) * Math.abs(v) ** p;

// Project titles that drift around `children` as links to each project's page.
// Below WIDE_QUERY there's no room, so the links sit in a plain row under `children`.
const ProjectOrbit = ({ items, children }: { items: OrbitItem[]; children: ReactNode }) => {
  const wide = useMediaQuery(WIDE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const bodyRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const paused = useRef(false);
  const angle = useRef(0);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!wide || !body) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(body);
    return () => observer.disconnect();
  }, [wide]);

  const a = (size.w / 2 + GAP) * CORNER;
  const b = (size.h / 2 + GAP) * CORNER;

  useLayoutEffect(() => {
    if (!wide || !size.w) return;

    const place = () => {
      labelRefs.current.forEach((el, i) => {
        if (!el) return;
        const t = angle.current + (2 * Math.PI * i) / items.length;
        const cos = Math.cos(t);
        const sin = Math.sin(t);
        const x = a * spow(cos, 2 / N);
        const y = b * spow(sin, 2 / N);
        // Shift each label outward so its inner edge sits on the path, not its center.
        el.style.transform =
          `translate(${x}px, ${y}px) translate(${-50 + 50 * cos}%, ${-50 + 50 * sin}%)`;
      });
    };

    place();
    if (reducedMotion) return;

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      if (!paused.current) angle.current += ((now - last) / 1000) * ((2 * Math.PI) / SECONDS_PER_LAP);
      last = now;
      place();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [wide, reducedMotion, size, a, b, items.length]);

  if (!wide) {
    return (
      <>
        {children}
        <nav aria-label="Projects" className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">
            Projects
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[15px]">
            {items.map(item => (
              <a key={item.id} href={projectHref(item.id)}
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                {item.title}
              </a>
            ))}
          </div>
        </nav>
      </>
    );
  }

  const padY = Math.max(0, b - size.h / 2 + LABEL_ROOM);

  return (
    <div className="relative" style={{ paddingTop: padY, paddingBottom: padY }}>
      <div ref={bodyRef}>{children}</div>
      <nav
        aria-label="Projects"
        className="pointer-events-none absolute inset-0"
        style={{ visibility: size.w ? undefined : "hidden" }} // until the body is measured
      >
        {items.map((item, i) => (
          <a
            key={item.id}
            ref={el => { labelRefs.current[i] = el; }}
            href={projectHref(item.id)}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
            onFocus={() => { paused.current = true; }}
            onBlur={() => { paused.current = false; }}
            className="pointer-events-auto absolute left-1/2 top-1/2 w-max max-w-40 text-center text-sm font-semibold leading-snug text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {item.title}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default ProjectOrbit;
