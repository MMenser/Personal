import { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generates random mountain data
  const generateNoise = (length: number, scale: number) => {
    const noise: number[] = [];
    let value = Math.random();
    for (let i = 0; i < length; i++) {
      value += (Math.random() - 0.5) * scale;
      noise.push(value);
    }
    return noise;
  };

  class MountainLayer {
    offset: number;
    points: number[];
    constructor(
      public color: string,
      public baseHeight: number,
      public amplitude: number,
      public speed: number,
      width: number
    ) {
      this.offset = 0;
      this.points = generateNoise(Math.floor(width / 5), 0.2);
    }

    draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i < this.points.length; i++) {
        const x = (i * 5 + this.offset) % (width + 100) - 100;
        const y = height - (this.baseHeight + this.points[i] * this.amplitude);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update(width: number) {
      this.offset += this.speed;
      if (this.offset > width) this.offset = 0;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const initLayers = () => [
      new MountainLayer('#2b3a42', 250, 40, 0.2, width),
      new MountainLayer('#3f5866', 200, 60, 0.5, width),
      new MountainLayer('#6e8898', 150, 80, 0.8, width),
    ];

    let layers = initLayers();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      layers = initLayers();
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (const layer of layers) {
        layer.draw(ctx, width, height);
        layer.update(width);
      }
      requestAnimationFrame(animate);
    };
    animate();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      />
      
      {/* Foreground content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        textAlign: 'center',
        paddingTop: '40vh'
      }}>
        <h1>Mason Menser</h1>
        <p>Welcome to my personal website</p>
      </div>
    </div>
  );
}

export default App;
