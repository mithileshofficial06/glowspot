'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, Eye, Calendar, MessageCircle, Star, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Style Advisor',
    desc: 'Describe your occasion and get personalized style recommendations from AI',
    href: '/advisor',
    color: 'from-neon-gold to-neon-amber',
  },
  {
    icon: Eye,
    title: 'Face Style Preview',
    desc: 'Upload a selfie and see how hairstyles and makeup look on your face',
    href: '/preview',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Calendar,
    title: 'Wedding Planner',
    desc: 'AI builds your complete bridal beauty schedule day by day',
    href: '/planner',
    color: 'from-emerald-glow to-green-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Booking',
    desc: 'Just type what you need — AI finds and books the right salon instantly',
    href: '/advisor',
    color: 'from-cyan-400 to-blue-500',
  },
];

const heroWords = ['Bridal Look', 'Hair Color', 'Perfect Style', 'Wedding Glow'];

// ═══ Particle Text Engine ═══
class Particle {
  constructor(x, y, color) {
    this.originX = x;
    this.originY = y;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 1.8;
    // Scatter properties
    this.scatterX = x + (Math.random() - 0.5) * 500;
    this.scatterY = y + (Math.random() - 0.5) * 300;
    this.scatterAngle = Math.random() * Math.PI * 2;
    this.scatterSpeed = 1 + Math.random() * 3;
    this.opacity = 1;
    this.life = 1;
  }

  drawAssembled(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

function getTextParticles(ctx, text, canvasWidth, canvasHeight, fontSize) {
  const particles = [];

  ctx.save();
  ctx.font = `800 ${fontSize}px "Outfit", "Inter", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FFD700';
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const data = imageData.data;
  const gap = 3; // pixel sampling gap

  for (let y = 0; y < canvasHeight; y += gap) {
    for (let x = 0; x < canvasWidth; x += gap) {
      const index = (y * canvasWidth + x) * 4;
      const alpha = data[index + 3];
      if (alpha > 128) {
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        particles.push(new Particle(x, y, `rgb(${r},${g},${b})`));
      }
    }
  }

  return particles;
}

// ═══ React Component ═══
export default function HeroSection() {
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
  const stateRef = useRef({
    phase: 'assembled',    // 'assembled' | 'dispersing' | 'scattered' | 'assembling'
    progress: 0,
    currentIndex: 0,
    particles: [],
    nextParticles: [],
  });

  const getFontSize = useCallback(() => {
    if (typeof window === 'undefined') return 60;
    if (window.innerWidth >= 1024) return 72;
    if (window.innerWidth >= 768) return 56;
    if (window.innerWidth >= 640) return 44;
    return 34;
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Re-generate particles on resize
      const state = stateRef.current;
      const fontSize = getFontSize();
      state.particles = getTextParticles(ctx, heroWords[state.currentIndex], canvas.width, canvas.height, fontSize);
      state.phase = 'assembled';
      state.progress = 0;
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial particle generation
    const fontSize = getFontSize();
    stateRef.current.particles = getTextParticles(ctx, heroWords[0], canvas.width, canvas.height, fontSize);

    // Timing constants
    const HOLD_TIME = 2000;        // How long text stays assembled (ms)
    const DISPERSE_TIME = 1200;    // How long dispersion takes (ms)
    const SCATTER_HOLD = 400;      // Brief pause while scattered
    const ASSEMBLE_TIME = 1200;    // How long assembly takes (ms)

    let lastTime = performance.now();
    let holdTimer = 0;

    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const animate = (timestamp) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      const state = stateRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (state.phase === 'assembled') {
        // Draw particles in their original positions
        state.particles.forEach((p) => {
          p.opacity = 1;
          p.x = p.originX;
          p.y = p.originY;
          p.drawAssembled(ctx);
        });
        ctx.globalAlpha = 1;

        holdTimer += dt;
        if (holdTimer >= HOLD_TIME) {
          holdTimer = 0;
          state.phase = 'dispersing';
          state.progress = 0;
          // Assign new scatter targets
          state.particles.forEach((p) => {
            p.scatterAngle = Math.random() * Math.PI * 2;
            p.scatterSpeed = 80 + Math.random() * 200;
            p.scatterX = p.originX + Math.cos(p.scatterAngle) * p.scatterSpeed;
            p.scatterY = p.originY + Math.sin(p.scatterAngle) * p.scatterSpeed;
          });
        }
      } else if (state.phase === 'dispersing') {
        state.progress += dt / DISPERSE_TIME;
        const t = Math.min(state.progress, 1);
        const ease = easeInOutCubic(t);

        state.particles.forEach((p) => {
          p.x = p.originX + (p.scatterX - p.originX) * ease;
          p.y = p.originY + (p.scatterY - p.originY) * ease;
          p.opacity = 1 - ease * 0.85;
          p.drawAssembled(ctx);
        });
        ctx.globalAlpha = 1;

        if (t >= 1) {
          state.phase = 'scattered';
          state.progress = 0;
          holdTimer = 0;
        }
      } else if (state.phase === 'scattered') {
        // Brief pause — particles barely visible
        holdTimer += dt;
        state.particles.forEach((p) => {
          p.opacity = 0.08;
          p.drawAssembled(ctx);
        });
        ctx.globalAlpha = 1;

        if (holdTimer >= SCATTER_HOLD) {
          holdTimer = 0;
          // Move to next word
          state.currentIndex = (state.currentIndex + 1) % heroWords.length;
          const fontSize = getFontSize();
          state.nextParticles = getTextParticles(ctx, heroWords[state.currentIndex], canvas.width, canvas.height, fontSize);
          
          // Assign scattered start positions for new particles
          state.nextParticles.forEach((p) => {
            p.scatterAngle = Math.random() * Math.PI * 2;
            p.scatterSpeed = 80 + Math.random() * 200;
            p.scatterX = p.originX + Math.cos(p.scatterAngle) * p.scatterSpeed;
            p.scatterY = p.originY + Math.sin(p.scatterAngle) * p.scatterSpeed;
            p.x = p.scatterX;
            p.y = p.scatterY;
            p.opacity = 0;
          });

          state.particles = state.nextParticles;
          state.phase = 'assembling';
          state.progress = 0;
        }
      } else if (state.phase === 'assembling') {
        state.progress += dt / ASSEMBLE_TIME;
        const t = Math.min(state.progress, 1);
        const ease = easeOutExpo(t);

        state.particles.forEach((p) => {
          p.x = p.scatterX + (p.originX - p.scatterX) * ease;
          p.y = p.scatterY + (p.originY - p.scatterY) * ease;
          p.opacity = ease;
          p.drawAssembled(ctx);
        });
        ctx.globalAlpha = 1;

        if (t >= 1) {
          state.phase = 'assembled';
          state.progress = 0;
          holdTimer = 0;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Small delay to ensure fonts are loaded
    setTimeout(() => {
      resize();
      animationRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [getFontSize]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background — relies on the global SilkBackground, just add subtle orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-neon-gold/[0.04] blur-3xl -top-20 -right-20 animate-float" />
        <div className="absolute w-72 h-72 rounded-full bg-emerald-glow/[0.03] blur-3xl bottom-20 -left-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 rounded-full bg-neon-gold/[0.02] blur-3xl top-1/3 left-1/3 animate-float" style={{ animationDelay: '4s' }} />

        {/* Sparkle Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-gold rounded-full animate-sparkle"
            style={{
              top: `${10 + (i * 6)}%`,
              left: `${5 + (i * 6.5)}%`,
              animationDelay: `${i * 0.25}s`,
              animationDuration: `${2 + (i % 3)}s`,
              opacity: 0.2 + (i % 4) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] mb-8">
            <Sparkles className="w-4 h-4 text-neon-gold" />
            <span className="text-sm text-white/70 font-medium">AI-Powered Beauty Platform</span>
            <span className="text-xs text-white/35">• Hyderabad</span>
          </div>

          {/* Headline with Particle Text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-tight mb-2">
            Discover Your
          </h1>

          {/* Particle Canvas for rotating words */}
          <div className="relative w-full max-w-3xl mx-auto" style={{ height: '100px' }}>
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 font-body leading-relaxed mt-4">
            Describe your look. Preview it on your face. Book the perfect Hyderabad salon.
            <br className="hidden sm:block" />
            Powered by AI that understands your style.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/advisor"
              id="hero-cta-advisor"
              className="group btn-primary text-lg px-8 py-4 flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Start Your Beauty Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/preview"
              id="hero-cta-preview"
              className="group px-8 py-4 rounded-xl text-lg font-semibold text-white border-2 border-white/10 hover:border-neon-gold/30 hover:bg-white/[0.03] transition-all duration-300 flex items-center gap-3"
            >
              <Eye className="w-5 h-5" />
              Preview Your Look
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={i}
                  href={feature.href}
                  id={`hero-feature-${i}`}
                  className="group p-5 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-neon-gold/20 hover:bg-white/[0.04] transition-all duration-500 text-left"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/35 leading-relaxed">{feature.desc}</p>
                  <ChevronRight className="w-4 h-4 text-white/15 mt-2 group-hover:text-neon-gold group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/25 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
              <span>25+ Verified Salons</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div>10 Hyderabad Neighborhoods</div>
            <div className="w-1 h-1 rounded-full bg-white/10" />
            <div>5 AI-Powered Features</div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-noir to-transparent" />
    </section>
  );
}
