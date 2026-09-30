import React, { useState, useEffect } from "react";
import InfoSection from "./InfoSection";
import headshot from "./assets/BlackbgHeadshot.png";
import SiteOriginBadge from "./SiteOriginBadge";

interface Mountain {
  id: number;
  path: string;
  opacity: number;
  color: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
}

interface Planet {
  id: number;
  x: number;
  y: number;
  size: number;
  rings: boolean;
  color: string;
  ringColor: string;
  floatDelay: number;
}

interface MountainBackgroundProps {
  layers?: number;
  className?: string;
}

const MountainBackground: React.FC<MountainBackgroundProps> = ({
  layers = 2,
  className = "",
}) => {
  const [mountains, setMountains] = useState<Mountain[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);

  const planetColor = [
    "#43DF96", // Green
    "#6134CB", // Purple
    "#F251D2", // Pink
    "#7EDBF7", // Teal
    "#D06A2F", // Orange
  ];

  const ringColors = [
    "#FFD700", // Gold
    "#E6E6FA", // Lavender
    "#98FB98", // Pale Green
    "#F0E68C", // Khaki
    "#DDA0DD", // Plum
  ];

  // Must match the mountain <svg>'s viewBox below, or the generated
  // silhouette gets stretched/squashed to fit.
  const MOUNTAIN_WIDTH = 1200;
  const MOUNTAIN_HEIGHT = 250;

  // Smooths a jagged polyline into a gentle ridge using quadratic curves
  // through each segment's midpoint (a cheap Catmull-Rom-style smooth).
  const buildRidgePath = (points: { x: number; y: number }[]): string => {
    let d = `M 0,${MOUNTAIN_HEIGHT} L ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      d += ` Q ${curr.x},${curr.y} ${midX},${midY}`;
    }
    const last = points[points.length - 1];
    d += ` L ${last.x},${last.y} L ${MOUNTAIN_WIDTH},${MOUNTAIN_HEIGHT} Z`;
    return d;
  };

  const generateMountains = (layers: number = 2): Mountain[] => {
    const mountainLayers: Mountain[] = [];

    for (let layer = 0; layer < layers; layer++) {
      // Closer (higher-index) layers sit taller in the frame.
      const baseline = 130 + Math.random() * 60 + layer * 45;
      const peaks = 6 + Math.floor(Math.random() * 4);

      const points: { x: number; y: number }[] = [];
      for (let i = 0; i <= peaks; i++) {
        const x = (MOUNTAIN_WIDTH / peaks) * i;
        // Gentle per-peak variation instead of wide random swings keeps
        // the ridge looking deliberate rather than spiky/noisy.
        const wobble = Math.random() * 70 - 35 - layer * 15;
        const y = Math.min(
          MOUNTAIN_HEIGHT - 10,
          Math.max(10, MOUNTAIN_HEIGHT - baseline + wobble)
        );
        points.push({ x, y });
      }

      mountainLayers.push({
        id: layer,
        path: buildRidgePath(points),
        opacity: 0.7 - layer * 0.15,
        color: `hsl(${200 + layer * 20}, 30%, ${20 + layer * 15}%)`,
      });
    }

    return mountainLayers;
  };

  const generateStars = (count = 50): Star[] => {
    const starArray: Star[] = [];

    for (let i = 0; i < count; i++) {
      starArray.push({
        id: i,
        x: Math.random() * 1200, // Full width
        y: Math.random() * 150, // Keep stars in upper area only
        size: 0.5 + Math.random() * 2, // Size between 0.5-2.5
        brightness: 0.3 + Math.random() * 0.7, // Opacity between 0.3-1.0
      });
    }

    return starArray;
  };

  const generatePlanets = (count = 4): Planet[] => {
    const planetArr: Planet[] = [];
    const svgWidth = 1200;
    const svgHeight = 200;
    const maxAttempts = 30;

    for (let i = 0; i < count; i++) {
      const planetColorIndex = Math.floor(Math.random() * planetColor.length);
      const size = 15 + Math.random() * 4; // Size between 15-19

      // Account for planet radius AND ring size so nothing gets cut off
      const maxRingSize = size + 11; // Your outermost ring radius
      const minX = maxRingSize;
      const maxX = svgWidth - maxRingSize;
      const minY = maxRingSize;
      const maxY = svgHeight - maxRingSize;

      // Rejection-sample a position so planets don't overlap each other.
      let x = minX + Math.random() * (maxX - minX);
      let y = minY + Math.random() * (maxY - minY);
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidateX = minX + Math.random() * (maxX - minX);
        const candidateY = minY + Math.random() * (maxY - minY);
        const overlaps = planetArr.some((p) => {
          const dx = p.x - candidateX;
          const dy = p.y - candidateY;
          const minDist = p.size + maxRingSize + 14;
          return dx * dx + dy * dy < minDist * minDist;
        });
        x = candidateX;
        y = candidateY;
        if (!overlaps) break;
      }

      planetArr.push({
        id: i,
        x,
        y,
        size,
        rings: true,
        color: planetColor[planetColorIndex],
        ringColor: ringColors[Math.floor(Math.random() * ringColors.length)],
        floatDelay: Math.random() * 4,
      });
    }
    return planetArr;
  };

  const renderPlanetWithRings = (planet: Planet) => {
    // Planet with rings
    const ringRadius1 = planet.size + 5;
    const ringRadius2 = planet.size + 8;
    const ringRadius3 = planet.size + 11;

    return (
      <g
        key={`planet-group-${planet.id}`}
        className="planet-float"
        style={{ animationDelay: `${planet.floatDelay}s` }}
      >
        {/* Ring 1 - Outermost */}
        <ellipse
          cx={planet.x}
          cy={planet.y}
          rx={ringRadius3}
          ry={ringRadius3 * 0.2}
          fill="none"
          stroke={planet.ringColor}
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Ring 2 - Middle */}
        <ellipse
          cx={planet.x}
          cy={planet.y}
          rx={ringRadius2}
          ry={ringRadius2 * 0.2}
          fill="none"
          stroke={planet.ringColor}
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Ring 3 - Innermost */}
        <ellipse
          cx={planet.x}
          cy={planet.y}
          rx={ringRadius1}
          ry={ringRadius1 * 0.2}
          fill="none"
          stroke={planet.ringColor}
          strokeWidth="1.5"
          opacity="1"
        />
        {/* The planet itself - rendered on top of rings */}
        <circle
          cx={planet.x}
          cy={planet.y}
          r={planet.size}
          fill={planet.color}
        />
      </g>
    );
  };

  useEffect(() => {
    setMountains(generateMountains(layers));
    setStars(generateStars());
    setPlanets(generatePlanets());
  }, [layers]);

  return (
    <div
      className={`relative min-h-screen w-full overflow-auto bg-black ${className}`}
    >
      {/* Stars SVG - Background positioned at top */}
      <svg
        className="absolute top-0 left-0 w-full z-0 fade-in"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Individual Stars */}
        {stars.map((star) => (
          <circle
            key={`star-${star.id}`}
            cx={star.x}
            cy={star.y}
            r={star.size}
            fill="white"
            opacity={star.brightness}
          >
            {/* Twinkling animation for brighter stars */}
            {star.brightness > 0.7 && (
              <animate
                attributeName="opacity"
                values={`${star.brightness};${star.brightness * 0.3};${
                  star.brightness
                }`}
                dur={`${2 + Math.random() * 3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
        {/* Planets with optional rings */}
        {planets.map(renderPlanetWithRings)}
      </svg>

      {/* Mountains SVG - Background positioned at bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full z-0 fade-in"
        viewBox="0 0 1200 250"
        preserveAspectRatio="none"
      >
        {mountains.map((mountain) => (
          <path
            key={mountain.id}
            d={mountain.path}
            fill={mountain.color}
            opacity={mountain.opacity}
          />
        ))}
      </svg>
      {/* Main Content - Responsive layout */}
      <div className="relative z-10 min-h-[80vh] sm:min-h-screen flex flex-col">
        {/* Header Section - Responsive spacing */}
        <div className="flex-shrink-0 flex flex-col items-center pt-6 px-4 space-y-4 sm:space-y-6">
          {/* Responsive Name */}
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center fade-in">
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] font-mono tracking-wider sm:tracking-widest border-l-2 border-r-2 sm:border-l-4 sm:border-r-4 border-cyan-400 px-2 sm:px-4 py-1 sm:py-2 bg-black/30">
              MASON MENSER
            </span>
          </div>

          {/* Responsive Headshot */}
          <img
            className="rounded-full fade-in ring-2 ring-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.25)]"
            src={headshot}
            width={250}
            height={250}
            alt="Headshot"
          />
        </div>

        {/* Content Section - Responsive and expandable */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-10 md:px-10 pt-6 pb-8">
          <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
            <div className="text-white text-center fade-in">
              <InfoSection />
            </div>
          </div>
        </div>

        {/* On mobile a section can grow taller than the viewport, so the
            corner pill below would float over card text while scrolling.
            Keep an in-flow fallback link here instead of relying on it. */}
        <a
          href="/?pro"
          className="sm:hidden flex-shrink-0 block text-center pb-6 text-xs font-bold text-cyan-100/80 hover:text-cyan-100 transition-colors"
          aria-label="Go back to the serious version"
        >
          Serious version →
        </a>
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-0 text-white/50 text-xs hidden sm:block pointer-events-none">
        Reload the page to regenerate the mountains, planets, and stars!
      </div>
      <div className="hidden sm:block">
        <SiteOriginBadge className="fixed top-4 right-4 z-20 text-white/40 text-xs" />
      </div>
      <a
        href="/?pro"
        className="hidden sm:block fixed bottom-4 right-4 z-20 rounded-full border border-cyan-300/40 bg-black/60 px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.25)] backdrop-blur-sm transition-all hover:border-cyan-200 hover:bg-cyan-950/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label="Go back to the serious version"
      >
        Serious version
      </a>
    </div>
  );
};

export default MountainBackground;
