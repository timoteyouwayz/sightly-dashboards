import { useEffect, useRef } from 'react';

interface Shape {
  x: number; y: number; z: number;
  size: number; speedX: number; speedY: number; speedZ: number;
  rotation: number; rotationSpeed: number;
  type: 'circle' | 'triangle' | 'hexagon' | 'ring' | 'diamond';
  opacity: number; pulsePhase: number;
}

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const shapes: Shape[] = [];
    const PERSPECTIVE = 800;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const types: Shape['type'][] = ['circle', 'triangle', 'hexagon', 'ring', 'diamond'];
    for (let i = 0; i < 50; i++) {
      shapes.push({
        x: (Math.random() - 0.5) * canvas.width * 1.5,
        y: (Math.random() - 0.5) * canvas.height * 1.5,
        z: Math.random() * 600 + 100,
        size: Math.random() * 40 + 12,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        speedZ: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        type: types[Math.floor(Math.random() * types.length)],
        opacity: Math.random() * 0.18 + 0.06,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const drawHexagon = (size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = size * Math.cos(angle);
        const py = size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawTriangle = (size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
        const px = size * Math.cos(angle);
        const py = size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawDiamond = (size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
    };

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      const isDark = document.documentElement.classList.contains('dark');
      const hue1 = isDark ? '168, 65%, 50%' : '168, 65%, 40%';
      const hue2 = isDark ? '200, 60%, 50%' : '200, 60%, 40%';
      const hue3 = isDark ? '28, 80%, 55%' : '28, 80%, 50%';

      // Sort by z for depth ordering (far first)
      const sorted = [...shapes].sort((a, b) => b.z - a.z);

      sorted.forEach(shape => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.z += shape.speedZ;
        shape.rotation += shape.rotationSpeed;
        shape.pulsePhase += 0.02;

        // Wrap z
        if (shape.z < 50) { shape.z = 700; shape.opacity = 0; }
        if (shape.z > 700) { shape.z = 50; shape.opacity = 0; }

        // Wrap x/y
        const halfW = canvas.width;
        const halfH = canvas.height;
        if (shape.x < -halfW) shape.x = halfW;
        if (shape.x > halfW) shape.x = -halfW;
        if (shape.y < -halfH) shape.y = halfH;
        if (shape.y > halfH) shape.y = -halfH;

        // Perspective projection
        const scale = PERSPECTIVE / (PERSPECTIVE + shape.z);
        const screenX = canvas.width / 2 + shape.x * scale;
        const screenY = canvas.height / 2 + shape.y * scale;
        const screenSize = shape.size * scale;

        // Depth-based opacity with pulse
        const depthOpacity = shape.opacity * scale * 1.5;
        const pulse = 1 + Math.sin(shape.pulsePhase) * 0.2;
        const finalOpacity = Math.min(depthOpacity * pulse, 0.35);

        // Pick color based on type
        const color = shape.type === 'diamond' || shape.type === 'ring' ? hue3
          : shape.type === 'hexagon' ? hue2 : hue1;

        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = `hsla(${color}, ${finalOpacity})`;
        ctx.lineWidth = Math.max(0.5, 1.5 * scale);

        if (shape.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, screenSize, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shape.type === 'triangle') {
          drawTriangle(screenSize);
          ctx.stroke();
        } else if (shape.type === 'hexagon') {
          drawHexagon(screenSize);
          ctx.stroke();
        } else if (shape.type === 'ring') {
          ctx.beginPath();
          ctx.arc(0, 0, screenSize, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, screenSize * 0.6, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          drawDiamond(screenSize);
          ctx.stroke();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
