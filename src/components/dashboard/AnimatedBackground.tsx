import { useEffect, useRef } from 'react';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const shapes: Array<{
      x: number; y: number; size: number; speedX: number; speedY: number;
      rotation: number; rotationSpeed: number; type: 'circle' | 'triangle' | 'hexagon';
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create shapes
    for (let i = 0; i < 40; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 55 + 8,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        type: (['circle', 'triangle', 'hexagon'] as const)[Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.15 + 0.05,
      });
    }

    const drawHexagon = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const px = cx + size * Math.cos(angle);
        const py = cy + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const drawTriangle = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
        const px = cx + size * Math.cos(angle);
        const py = cy + size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = document.documentElement.classList.contains('dark');
      const color = isDark ? '168, 65%, 45%' : '168, 65%, 35%';

      shapes.forEach(shape => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.rotation += shape.rotationSpeed;

        if (shape.x < -50) shape.x = canvas.width + 50;
        if (shape.x > canvas.width + 50) shape.x = -50;
        if (shape.y < -50) shape.y = canvas.height + 50;
        if (shape.y > canvas.height + 50) shape.y = -50;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = `hsla(${color}, ${shape.opacity})`;
        ctx.lineWidth = 1.5;

        if (shape.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shape.type === 'triangle') {
          drawTriangle(0, 0, shape.size);
          ctx.stroke();
        } else {
          drawHexagon(0, 0, shape.size);
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
      style={{ opacity: 0.7 }}
    />
  );
};
