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

  const generatePlanets = (count = 3): Planet[] => {
    const planetArr: Planet[] = [];
    for (let i = 0; i < count; i++) {
      const planetColorIndex = Math.floor(Math.random() * planetColor.length);
      planetArr.push({
        id: i,
        x: Math.random() * 1000, // Less than full width to make sure they appear 100% in view
        y: Math.random() * 100, // Same for height
        size: 15 + Math.random() * 4, // Size between 15-19
        rings: true, // Always have rings
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
      className={`relative h-screen w-screen overflow-hidden bg-black ${className}`}
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

      {/* Main Content - Centered and above background */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-6">
        {/* Your Name */}
        <div className="text-5xl font-bold text-white text-center">
          Mason Menser
        </div>

        {/* Headshot */}
        <img
          className="rounded-full"
          src={headshot}
          width={250}
          height={250}
          alt="Headshot"
        />

        {/* Content overlay */}
        <div className="text-white text-center">
          <InfoSection />
        </div>
      </div>
    </div>
  );
};

export default MountainBackground;
