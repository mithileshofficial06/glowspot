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

const heroWords = [];

// ═══ React Component ═══
export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-tight mb-6 max-w-4xl mx-auto">
            Discover Your <span className="bg-gradient-to-r from-neon-gold via-neon-amber to-emerald-glow bg-clip-text text-transparent">Perfect Look</span> in Hyderabad
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
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
