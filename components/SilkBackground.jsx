'use client';

import { useEffect, useRef } from 'react';

export default function SilkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const drawSilkWave = (yOffset, amplitude, wavelength, speed, opacity, color) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 2) {
        const y =
          yOffset +
          Math.sin((x / wavelength) + time * speed) * amplitude +
          Math.sin((x / (wavelength * 0.5)) + time * speed * 1.3) * (amplitude * 0.4) +
          Math.cos((x / (wavelength * 1.8)) + time * speed * 0.7) * (amplitude * 0.25);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      // Silk gradient fill
      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude * 2);
      gradient.addColorStop(0, `rgba(${color}, 0)`);
      gradient.addColorStop(0.3, `rgba(${color}, ${opacity * 0.6})`);
      gradient.addColorStop(0.5, `rgba(${color}, ${opacity})`);
      gradient.addColorStop(0.7, `rgba(${color}, ${opacity * 0.8})`);
      gradient.addColorStop(1, `rgba(${color}, ${opacity * 0.3})`);

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawShimmer = (yOffset, amplitude, wavelength, speed) => {
      for (let x = 0; x <= canvas.width; x += 8) {
        const y =
          yOffset +
          Math.sin((x / wavelength) + time * speed) * amplitude +
          Math.sin((x / (wavelength * 0.5)) + time * speed * 1.3) * (amplitude * 0.4);

        const shimmerIntensity = Math.abs(Math.sin((x / 120) + time * 1.5)) * 0.08;
        
        if (shimmerIntensity > 0.03) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 215, 0, ${shimmerIntensity})`;
          ctx.fill();
        }
      }
    };

    const animate = () => {
      time += 0.008;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Layer 1 — Deep background wave (dark, large)
      drawSilkWave(
        canvas.height * 0.35,   // y position
        60,                      // amplitude
        400,                     // wavelength
        0.4,                     // speed
        0.12,                    // opacity
        '255, 255, 255'          // white silk
      );

      // Layer 2 — Mid wave (slightly brighter, gold tint)
      drawSilkWave(
        canvas.height * 0.5,
        45,
        300,
        0.55,
        0.07,
        '255, 215, 0'           // gold silk thread
      );

      // Layer 3 — Front wave (more visible)
      drawSilkWave(
        canvas.height * 0.65,
        50,
        350,
        0.35,
        0.09,
        '255, 255, 255'
      );

      // Layer 4 — Subtle emerald accent wave
      drawSilkWave(
        canvas.height * 0.78,
        35,
        500,
        0.3,
        0.04,
        '0, 230, 118'           // emerald thread
      );

      // Layer 5 — Top subtle wave
      drawSilkWave(
        canvas.height * 0.2,
        30,
        450,
        0.25,
        0.05,
        '255, 255, 255'
      );

      // Shimmer highlights on the main waves
      drawShimmer(canvas.height * 0.35, 60, 400, 0.4);
      drawShimmer(canvas.height * 0.5, 45, 300, 0.55);
      drawShimmer(canvas.height * 0.65, 50, 350, 0.35);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ width: '100%', height: '100%' }}
        aria-hidden="true"
      />
      {/* Film grain texture */}
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
