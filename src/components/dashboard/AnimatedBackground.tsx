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
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

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
        ctx[i === 0 ? 'moveTo' : 'lineTo'](size * Math.cos(angle), size * Math.sin(angle));
      }
      ctx.closePath();
    };

    const drawTriangle = (size: number) => {
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 / 3) * i - Math.PI / 2;
        ctx[i === 0 ? 'moveTo' : 'lineTo'](size * Math.cos(angle), size * Math.sin(angle));
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
      time += 0.008;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const isDark = document.documentElement.classList.contains('dark');

      // Sort by z for depth ordering
      const sorted = [...shapes].sort((a, b) => b.z - a.z);

      // Precompute screen positions
      const screenPositions = sorted.map((shape) => {
        const scale = PERSPECTIVE / (PERSPECTIVE + shape.z);
        const parallaxStrength = scale * 40;
        return {
          x: canvas.width / 2 + shape.x * scale + mouse.x * parallaxStrength,
          y: canvas.height / 2 + shape.y * scale + mouse.y * parallaxStrength,
          scale,
        };
      });

      // Draw connecting lines between nearby shapes
      const CONNECTION_DIST = 180;
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const dx = screenPositions[i].x - screenPositions[j].x;
          const dy = screenPositions[i].y - screenPositions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.15 * Math.min(screenPositions[i].scale, screenPositions[j].scale);
            const isDark = document.documentElement.classList.contains('dark');
            const lineColor = isDark ? `rgba(120, 200, 220, ${opacity})` : `rgba(40, 100, 120, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(screenPositions[i].x, screenPositions[i].y);
            ctx.lineTo(screenPositions[j].x, screenPositions[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      sorted.forEach((shape, i) => {
        shape.x += shape.speedX;
        shape.y += shape.speedY;
        shape.z += shape.speedZ;
        shape.rotation += shape.rotationSpeed;
        shape.pulsePhase += 0.02;

        if (shape.z < 50) { shape.z = 700; }
        if (shape.z > 700) { shape.z = 50; }
        const halfW = canvas.width;
        const halfH = canvas.height;
        if (shape.x < -halfW) shape.x = halfW;
        if (shape.x > halfW) shape.x = -halfW;
        if (shape.y < -halfH) shape.y = halfH;
        if (shape.y > halfH) shape.y = -halfH;

        const { x: screenX, y: screenY, scale } = screenPositions[i];
        const screenSize = shape.size * scale;

        const isDark = document.documentElement.classList.contains('dark');
        const depthOpacity = shape.opacity * scale * 1.5;
        const pulse = 1 + Math.sin(shape.pulsePhase) * 0.2;
        const finalOpacity = Math.min(depthOpacity * pulse, 0.35);

        const hueShift = (time * 30 + i * 17) % 360;
        const baseHue = 140 + Math.sin(hueShift * Math.PI / 180) * 60;
        const sat = isDark ? '60%' : '55%';
        const lum = isDark ? '50%' : '40%';

        let h = baseHue;
        if (shape.type === 'diamond' || shape.type === 'ring') {
          h = 20 + Math.sin((hueShift + 90) * Math.PI / 180) * 30;
        }

        const color = `${Math.round(h)}, ${sat}, ${lum}`;

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

        // Glowing center dot
        const glowRadius = Math.max(2, 4 * scale);
        const glowGradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, glowRadius * 3);
        glowGradient.addColorStop(0, `hsla(${color}, ${Math.min(finalOpacity * 2.5, 0.6)})`);
        glowGradient.addColorStop(0.4, `hsla(${color}, ${Math.min(finalOpacity * 1.2, 0.3)})`);
        glowGradient.addColorStop(1, `hsla(${color}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Solid center dot
        ctx.fillStyle = `hsla(${color}, ${Math.min(finalOpacity * 3, 0.8)})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, glowRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
