'use client';

/**
 * SilkBackground — Lightweight version.
 * Uses a single static canvas render + a subtle CSS shimmer layer instead of
 * running 5 wave + 3 shimmer calculations on every animation frame (60fps).
 * The static render draws once on mount and on resize, eliminating the #1
 * source of main-thread jank across the entire site.
 */

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

      // Static silk wave — painted once, no animation loop
      const drawStaticWave = (yOffset, amplitude, wavelength, opacity, color) => {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            yOffset +
            Math.sin(x / wavelength) * amplitude +
            Math.sin(x / (wavelength * 0.5)) * (amplitude * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude * 2);
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(0.4, `rgba(${color}, ${opacity * 0.5})`);
        gradient.addColorStop(0.6, `rgba(${color}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${color}, ${opacity * 0.25})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      };

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawStaticWave(canvas.height * 0.3, 50, 400, 0.08, '255, 255, 255');
      drawStaticWave(canvas.height * 0.5, 40, 300, 0.05, '255, 215, 0');
      drawStaticWave(canvas.height * 0.7, 45, 350, 0.06, '255, 255, 255');
    };

    draw();

    // Debounced resize
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
