import React, { useState, useEffect } from "react";
import InfoSection from "./InfoSection";
import headshot from "./assets/BlackbgHeadshot.png";

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

  const generateMountains = (layers: number = 2): Mountain[] => {
    const mountainLayers: Mountain[] = [];

    for (let layer = 0; layer < layers; layer++) {
      const points: string[] = [];
      const width = 1200; // SVG viewBox width
      const height = 400; // SVG viewBox height
      const mountainHeight = 200 + Math.random() * 150 + layer * 60; // Taller base mountains
      const peaks = 6 + Math.floor(Math.random() * 4);

      // Start from bottom-left corner
      points.push(`0,${height}`);

      // Generate random peaks going up from bottom
      for (let i = 0; i <= peaks; i++) {
        const x = (width / peaks) * i;
        const y = height - mountainHeight + Math.random() * 200 - layer * 30; // Much more variation
        points.push(`${x},${y}`);
      }

      // End at bottom-right corner
      points.push(`${width},${height}`);

      const path = `M ${points.join(" L ")} Z`;

      mountainLayers.push({
        id: layer,
        path,
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

    for (let i = 0; i < count; i++) {
      const planetColorIndex = Math.floor(Math.random() * planetColor.length);
      const size = 15 + Math.random() * 4; // Size between 15-19

      // Account for planet radius AND ring size so nothing gets cut off
      const maxRingSize = size + 11; // Your outermost ring radius
      const minX = maxRingSize;
      const maxX = svgWidth - maxRingSize;
      const minY = maxRingSize;
      const maxY = svgHeight - maxRingSize;

      planetArr.push({
        id: i,
        x: minX + Math.random() * (maxX - minX),
        y: minY + Math.random() * (maxY - minY),
        size: size,
        rings: true,
        color: planetColor[planetColorIndex],
        ringColor: ringColors[Math.floor(Math.random() * ringColors.length)],
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
      <g key={`planet-group-${planet.id}`}>
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
        className="absolute top-0 left-0 w-full z-0"
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
        className="absolute bottom-0 left-0 w-full z-0"
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
            className="rounded-full fade-in"
            src={headshot}
            width={250}
            height={250}
            alt="Headshot"
          />
        </div>

        {/* Content Section - Responsive and expandable */}
        <div className="flex-1 flex justify-center px-4 sm:px-10 md:px-10 pt-6 pb-8">
          <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
            <div className="text-white text-center fade-in">
              <InfoSection />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-white/50 text-xs hidden sm:block">
        Reload the page to regenerate the mountains, planets, and stars!
      </div>
    </div>
  );
};

export default MountainBackground;
