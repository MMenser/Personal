import React, { useState, useEffect } from "react";
import InfoSection from "./InfoSection";

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

  const generateStars = (count: number = 50): Star[] => {
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

  useEffect(() => {
    setMountains(generateMountains(layers));
    setStars(generateStars());
  }, [layers]);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-black ${className}`}
    >
      {/* Stars SVG - Takes up more space now */}
      <svg
        className="inset-0 w-full h-1/4"
        viewBox="0 0 1200 300"
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
                values={`${star.brightness};${star.brightness * 0.3};${star.brightness
                  }`}
                dur={`${2 + Math.random() * 3}s`}
                repeatCount="indefinite"
              />
            )}
          </circle>
        ))}
      </svg>
      {/* Your Name - Adjusted position for new viewBox */}
      <div className="absolute left-1/2 -translate-x-1/2 text-5xl font-bold text-white">
        Mason Menser
      </div>

      {/* Mountains SVG - Now only takes up bottom 1/4 of screen */}
      <svg
        className="absolute bottom-0 left-0 w-full h-1/4"
        viewBox="0 0 1200 400"
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

      {/* Content overlay */}
      <InfoSection></InfoSection>
    </div>
  );
};

export default MountainBackground;