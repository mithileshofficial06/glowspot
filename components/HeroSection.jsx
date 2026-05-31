'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Eye, Calendar, MessageCircle, Star, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Style Advisor',
    desc: 'Describe your occasion and get personalized style recommendations from AI',
    href: '/advisor',
    color: 'from-rose-gold to-pink-400',
  },
  {
    icon: Eye,
    title: 'Face Style Preview',
    desc: 'Upload a selfie and see how hairstyles and makeup look on your face',
    href: '/preview',
    color: 'from-purple-500 to-plum',
  },
  {
    icon: Calendar,
    title: 'Wedding Planner',
    desc: 'AI builds your complete bridal beauty schedule day by day',
    href: '/planner',
    color: 'from-gold to-amber-500',
  },
  {
    icon: Sparkles,
    title: 'Smart Booking',
    desc: 'Just type what you need — AI finds and books the right salon instantly',
    href: '/advisor',
    color: 'from-emerald-500 to-teal-500',
  },
];

const heroWords = ['Bridal Look', 'Hair Color', 'Perfect Style', 'Wedding Glow'];

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % heroWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-plum-deep via-plum to-rose-gold/30" />

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-rose-gold/10 blur-3xl -top-20 -right-20 animate-float" />
        <div className="absolute w-72 h-72 rounded-full bg-gold/10 blur-3xl bottom-20 -left-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute w-64 h-64 rounded-full bg-purple-500/10 blur-3xl top-1/3 left-1/3 animate-float" style={{ animationDelay: '4s' }} />

        {/* Sparkle Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-sparkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-gold-light" />
            <span className="text-sm text-white/80 font-medium">AI-Powered Beauty Platform</span>
            <span className="text-xs text-white/50">• Hyderabad</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white leading-tight mb-6">
            Discover Your
            <br />
            <span className="relative inline-block">
              <span
                className="gradient-text transition-all duration-500"
                key={currentWord}
                style={{
                  background: 'linear-gradient(135deg, #F4C2C2, #D4AF37, #F4C2C2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {heroWords[currentWord]}
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
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
              className="group px-8 py-4 rounded-xl text-lg font-semibold text-white border-2 border-white/20 hover:border-rose-gold/50 hover:bg-white/5 transition-all duration-300 flex items-center gap-3"
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
                  className="group p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-rose-gold/30 hover:bg-white/10 transition-all duration-500 text-left"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{feature.desc}</p>
                  <ChevronRight className="w-4 h-4 text-white/30 mt-2 group-hover:text-rose-gold group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span>25+ Verified Salons</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div>10 Hyderabad Neighborhoods</div>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <div>5 AI-Powered Features</div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />
    </section>
  );
}
