import React, { useState, useEffect } from 'react';

interface MountainPoint {
  x: number;
  y: number;
}

const PersonalWebsite: React.FC = () => {
  const [mountainPath, setMountainPath] = useState<string>('');
  const [gradientColors, setGradientColors] = useState<string[]>([]);

  const generateMountains = () => {
    const width = 1200;
    const height = 600;
    const points: MountainPoint[] = [];
    
    // Generate random mountain peaks
    const numPeaks = Math.floor(Math.random() * 5) + 4; // 4-8 peaks
    
    points.push({ x: 0, y: height * 0.8 }); // Start point
    
    for (let i = 0; i < numPeaks; i++) {
      const x = (width / (numPeaks - 1)) * i + Math.random() * 100 - 50;
      const baseHeight = height * 0.4;
      const peakVariation = Math.random() * height * 0.3;
      const y = baseHeight + peakVariation;
      
      points.push({ x: Math.max(0, Math.min(width, x)), y });
    }
    
    points.push({ x: width, y: height * 0.8 }); // End point
    
    // Create smooth path using quadratic curves
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      const controlY = Math.min(current.y, next.y) - Math.random() * 50;
      
      path += ` Q ${controlX} ${controlY} ${next.x} ${next.y}`;
    }
    
    path += ` L ${width} ${height} L 0 ${height} Z`;
    setMountainPath(path);
    
    // Generate random gradient colors for sky
    const skyColors = [
      ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      ['#96CEB4', '#FFEAA7', '#DDA0DD'],
      ['#74B9FF', '#FD79A8', '#FDCB6E'],
      ['#6C5CE7', '#A29BFE', '#FD79A8'],
      ['#00B894', '#00CEC9', '#74B9FF']
    ];
    
    const selectedColors = skyColors[Math.floor(Math.random() * skyColors.length)];
    setGradientColors(selectedColors);
  };

  useEffect(() => {
    generateMountains();
  }, []);

  const regenerateMountains = () => {
    generateMountains();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Background SVG */}
      <svg 
        className="absolute inset-0 w-full h-full object-cover"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColors[0]} />
            <stop offset="50%" stopColor={gradientColors[1]} />
            <stop offset="100%" stopColor={gradientColors[2]} />
          </linearGradient>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </linearGradient>
        </defs>
        
        {/* Sky */}
        <rect width="1200" height="600" fill="url(#skyGradient)" />
        
        {/* Mountains */}
        <path 
          d={mountainPath}
          fill="url(#mountainGradient)"
          opacity="0.9"
        />
        
        {/* Optional: Add some stars */}
        {Array.from({ length: 20 }, (_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1200}
            cy={Math.random() * 300}
            r={Math.random() * 2 + 0.5}
            fill="white"
            opacity={Math.random() * 0.8 + 0.2}
          />
        ))}
      </svg>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto text-center shadow-xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 mb-6">
            I'm [Your Name]
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            A passionate developer who loves creating beautiful experiences. 
            Welcome to my corner of the internet where creativity meets technology.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
              About Me
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
              My Projects
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold">
              Contact
            </button>
          </div>
          
          <button 
            onClick={regenerateMountains}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            🏔️ Generate New Mountains
          </button>
        </div>
      </div>

      {/* Optional: Floating elements for extra visual appeal */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-white rounded-full opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-white rounded-full opacity-25 animate-pulse delay-500"></div>
    </div>
  );
};

export default PersonalWebsite;