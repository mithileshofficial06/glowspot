'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackgroundAnimation() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Track mouse movement globally to handle pointer-events overlays smoothly
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Resize handler
    const resizeCanvas = () => {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 45;
    const particles = [];

    const createParticle = (yOffset = null) => {
      const width = canvas.width || window.innerWidth;
      const height = canvas.height || window.innerHeight;
      return {
        x: Math.random() * width,
        y: yOffset !== null ? yOffset : Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        vy: -(Math.random() * 0.4 + 0.1), // Float upwards
        vx: (Math.random() * 0.2 - 0.1),
        opacity: 0,
        maxOpacity: Math.random() * 0.45 + 0.15,
        fadeSpeed: Math.random() * 0.005 + 0.002,
        fadeIn: true,
        swaySpeed: Math.random() * 0.01 + 0.005,
        swayAmplitude: Math.random() * 0.5 + 0.2,
      };
    };

    // Populate initial particles across the screen height
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    // Animation loop
    const animate = () => {
      time += 0.005;
      const width = canvas.width;
      const height = canvas.height;

      // Clear with subtle dark background color to prevent trailing
      ctx.fillStyle = '#080608';
      ctx.fillRect(0, 0, width, height);

      // 1. Mouse glow effect (Spotlight)
      // Smoothly interpolate current position towards target
      const mouse = mouseRef.current;
      if (!mouse.active) {
        // Softly drift target back to center if inactive
        mouse.targetX = width / 2;
        mouse.targetY = height * 0.4;
      }
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Draw interactive radial glow
      const radialGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        Math.max(width * 0.45, 400)
      );
      radialGlow.addColorStop(0, 'rgba(212, 169, 106, 0.065)'); // Very soft gold center
      radialGlow.addColorStop(0.5, 'rgba(155, 107, 138, 0.02)');   // Mauve outer ring
      radialGlow.addColorStop(1, 'rgba(8, 6, 8, 0)');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Moving Silk Waves
      const drawMovingWave = (yOffset, amplitude, wavelength, opacity, colorStr, speedMultiplier) => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 6) {
          // Double sine superposition for organic ribbon look
          const sinTerm = Math.sin(x / wavelength + time * speedMultiplier);
          const cosTerm = Math.cos(x / (wavelength * 0.6) - time * speedMultiplier * 0.8) * 0.35;
          const y = yOffset + (sinTerm + cosTerm) * amplitude;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, yOffset + amplitude * 3);
        gradient.addColorStop(0, `rgba(${colorStr}, 0)`);
        gradient.addColorStop(0.3, `rgba(${colorStr}, ${opacity})`);
        gradient.addColorStop(0.8, `rgba(${colorStr}, ${opacity * 0.15})`);
        gradient.addColorStop(1, 'rgba(8, 6, 8, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      };

      // Layer 1: Warm Gold (Upper/Mid section)
      drawMovingWave(height * 0.32, 60, 480, 0.045, '212, 169, 106', 0.85);

      // Layer 2: Luxurious Mauve (Mid/Lower section)
      drawMovingWave(height * 0.52, 50, 390, 0.035, '155, 107, 138', -0.6);

      // Layer 3: Soft Ivory (Bottom section)
      drawMovingWave(height * 0.72, 40, 430, 0.025, '242, 237, 232', 0.4);

      // 3. Draw & Update Particles
      particles.forEach((p, idx) => {
        // Particle motion logic
        p.y += p.vy;
        p.x += p.vx + Math.sin(time * p.swaySpeed + idx) * p.swayAmplitude;

        // Interactive mouse interaction (repel particles slightly when close)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 160;
        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          const angle = Math.atan2(dy, dx);
          // Apply gentle acceleration away from cursor
          p.x += Math.cos(angle) * force * 0.85;
          p.y += Math.sin(angle) * force * 0.85;
        }

        // Opacity fade logic
        if (p.fadeIn) {
          p.opacity += p.fadeSpeed;
          if (p.opacity >= p.maxOpacity) {
            p.fadeIn = false;
          }
        } else {
          p.opacity -= p.fadeSpeed * 0.6;
        }

        // Render particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Soft glowing particle styling
        ctx.fillStyle = `rgba(212, 169, 106, ${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = 'rgba(212, 169, 106, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadowBlur for other drawings

        // Recycle particle if it exits boundaries or fades completely out
        if (p.y < -10 || p.x < -10 || p.x > width + 10 || p.opacity <= 0) {
          particles[idx] = createParticle(height + 5);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup listeners and animation frame on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        aria-hidden="true"
      />
      {/* Subtle overlay gradients for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080608] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080608] via-transparent to-transparent opacity-85 pointer-events-none" />
    </div>
  );
}
