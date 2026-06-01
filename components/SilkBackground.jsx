'use client';

import { useEffect, useRef } from 'react';

export default function SilkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const drawStaticWave = (yOffset, amplitude, wavelength, opacity, color) => {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            yOffset +
            Math.sin(x / wavelength) * amplitude +
            Math.sin(x / (wavelength * 0.5)) * (amplitude * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude * 2);
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(0.5, `rgba(${color}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${color}, ${opacity * 0.2})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Warm gold wave
      drawStaticWave(canvas.height * 0.35, 40, 420, 0.03, '212, 169, 106');
      // Mauve wave
      drawStaticWave(canvas.height * 0.55, 35, 350, 0.025, '155, 107, 138');
      // Subtle ivory wave
      drawStaticWave(canvas.height * 0.75, 30, 380, 0.02, '242, 237, 232');
    };

    draw();

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 200);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
}
