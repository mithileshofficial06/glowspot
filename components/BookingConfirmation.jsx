'use client';

import { useEffect, useRef } from 'react';

// Self-drawing gold checkmark SVG + gold particle burst
export default function BookingConfirmation({ salonName }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.parentElement?.clientWidth || 200;
    canvas.height = canvas.parentElement?.clientHeight || 200;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#D4A96A', '#E3C48F', '#B08A4E', '#9B6B8A', '#F2EDE8'];

    // Gold particles burst
    const particles = [];
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.012 + Math.random() * 0.015,
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = 0;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.vx *= 0.985;
        p.life -= p.decay;

        if (p.life > 0) {
          alive++;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();

          // Glow
          ctx.shadowBlur = p.radius * 3;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      ctx.globalAlpha = 1;

      if (alive > 0) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center py-6">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Self-drawing checkmark */}
      <div className="relative z-20 w-16 h-16 mb-4">
        <svg
          viewBox="0 0 52 52"
          className="w-full h-full"
        >
          {/* Circle */}
          <circle
            cx="26"
            cy="26"
            r="24"
            fill="none"
            stroke="#D4A96A"
            strokeWidth="1.5"
            className="animate-draw-circle"
            style={{
              strokeDasharray: 151,
              strokeDashoffset: 151,
              animation: 'drawCircle 0.6s ease-out 0.2s forwards',
            }}
          />
          {/* Checkmark */}
          <path
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
            fill="none"
            stroke="#D4A96A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 36,
              strokeDashoffset: 36,
              animation: 'drawCheck 0.4s ease-out 0.7s forwards',
            }}
          />
        </svg>
      </div>

      {/* Text */}
      <h4
        className="text-lg font-display font-light text-ivory mb-1 opacity-0"
        style={{ animation: 'fadeIn 0.5s ease-out 1s forwards' }}
      >
        Appointment Confirmed!
      </h4>
      <p
        className="text-xs text-ivory/40 font-light opacity-0"
        style={{ animation: 'fadeIn 0.5s ease-out 1.2s forwards' }}
      >
        Your reservation at {salonName} is scheduled.
      </p>
    </div>
  );
}
