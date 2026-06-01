'use client';

import { useState, useEffect } from 'react';
import FacePreview from '@/components/FacePreview';
import { Sparkles, Camera, Shield, Scan, Palette, Scissors, ChevronDown, Zap, Star, Eye } from 'lucide-react';

export default function Preview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen pt-20 relative z-10">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <div className="relative overflow-hidden min-h-[540px] flex items-center">

        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-noir via-noir-50 to-noir" />

          {/* Animated gold orb */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] animate-float"
            style={{
              background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
              top: '-15%',
              right: '-10%',
            }}
          />
          {/* Animated emerald orb */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] animate-float"
            style={{
              background: 'radial-gradient(circle, #00E676 0%, transparent 70%)',
              bottom: '-20%',
              left: '-5%',
              animationDelay: '2s',
            }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px] animate-float"
            style={{
              background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)',
              top: '30%',
              left: '40%',
              animationDelay: '4s',
            }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,215,0,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,215,0,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Sparkle particles */}
          {mounted && (
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gold rounded-full animate-sparkle"
                  style={{
                    left: `${8 + (i * 7.5)}%`,
                    top: `${15 + ((i * 23) % 70)}%`,
                    animationDelay: `${i * 0.3}s`,
                    opacity: 0.3 + (i % 3) * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column */}
            <div className={`space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.06]">
                <div className="relative">
                  <Zap className="w-3.5 h-3.5 text-gold" />
                </div>
                <span className="text-xs font-medium text-gold/80 tracking-wide">
                  Powered by Llama 3.2 Vision AI
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold font-display text-white leading-[1.1] mb-4">
                  Your Perfect Style,{' '}
                  <span className="gradient-text">
                    Discovered by AI
                  </span>
                </h1>
                <p className="text-base md:text-lg text-white/35 leading-relaxed max-w-lg">
                  Upload a photo and our Vision AI analyzes your unique features to recommend hairstyles, grooming, and colors tailored <em className="text-white/50 not-italic">specifically</em> to you.
                </p>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap gap-5 pt-2">
                {[
                  { icon: Shield, label: 'Photos never stored', color: 'text-mauve' },
                  { icon: Zap, label: 'Results in seconds', color: 'text-gold' },
                  { icon: Star, label: '100% personalized', color: 'text-gold-light' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2 text-white/30">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className="text-xs">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column — Feature Cards */}
            <div className={`hidden lg:block transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="relative">
                <div className="relative bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/[0.05] p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gold/[0.04] rounded-full blur-[60px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-mauve/[0.03] rounded-full blur-[50px]" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gold to-mauve flex items-center justify-center shadow-glow">
                        <Eye className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold font-display">AI Vision Analysis</h3>
                        <p className="text-white/30 text-[11px]">What our AI detects in your photo</p>
                      </div>
                    </div>

                    {[
                      { icon: Scan, label: 'Face Shape Detection', desc: 'Oval, Round, Square, Heart, Diamond', color: 'from-violet-500/15 to-purple-600/15', iconColor: 'text-violet-400' },
                      { icon: Palette, label: 'Skin Tone Analysis', desc: 'Undertones & color matching', color: 'from-gold/15 to-gold-light/15', iconColor: 'text-gold' },
                      { icon: Scissors, label: 'Personalized Styles', desc: 'Hairstyles, grooming & colors', color: 'from-mauve/10 to-green-500/10', iconColor: 'text-mauve' },
                      { icon: Sparkles, label: 'AI Style Consultant', desc: 'Chat about your results live', color: 'from-cyan-400/10 to-blue-500/10', iconColor: 'text-cyan-400' },
                    ].map((feature, i) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-gold/10 hover:bg-white/[0.03] transition-all duration-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                          style={{ transitionDelay: `${600 + i * 150}ms` }}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shrink-0`}>
                            <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-semibold">{feature.label}</p>
                            <p className="text-white/25 text-[10px]">{feature.desc}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-mauve/50 animate-glow-pulse shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Floating stats badge */}
                <div className="absolute -bottom-4 -left-4 bg-noir-100/80 backdrop-blur-md rounded-2xl border border-white/[0.06] px-4 py-3 animate-bounce-gentle shadow-glow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                      <Camera className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-gold text-[11px] font-bold font-display">90B Vision</p>
                      <p className="text-white/25 text-[9px]">Parameters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className={`flex justify-center mt-10 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center gap-1.5 animate-bounce-gentle">
              <span className="text-[10px] text-white/15 tracking-widest uppercase font-medium">Upload below</span>
              <ChevronDown className="w-4 h-4 text-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Component */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FacePreview />
      </div>
    </div>
  );
}
