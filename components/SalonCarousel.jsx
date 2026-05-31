'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Star, MapPin, Home, ChevronRight, Sparkles } from 'lucide-react';

export default function SalonCarousel({ salons }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const offsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [, forceRender] = useState(0);
  const speedRef = useRef(0.5); // px per frame

  // Triple the salons for seamless looping
  const extendedSalons = [...salons, ...salons, ...salons];

  const updateCardTransforms = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    const cards = trackRef.current.children;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;

      // Distance from center (0 = center, 1 = edge)
      const maxDistance = containerRect.width / 2;
      const distance = Math.abs(cardCenterX - centerX);
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      // Concave effect: center = smaller, edges = bigger
      // Scale: 0.78 at center → 1.08 at edges
      const scale = 0.78 + normalizedDistance * 0.30;

      // Opacity: center slightly dimmer, edges brighter
      const opacity = 0.5 + normalizedDistance * 0.5;

      // Z-index: edges on top
      const zIndex = Math.round(normalizedDistance * 10);

      // Apply directly to DOM for performance (no React re-render)
      card.style.transform = `scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    }
  }, []);

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;

    // Wait for layout to settle
    const initTimeout = setTimeout(() => {
      const singleSetWidth = trackRef.current.scrollWidth / 3;
      offsetRef.current = singleSetWidth;

      const animate = () => {
        if (!isPausedRef.current) {
          offsetRef.current += speedRef.current;

          // Seamless loop
          if (offsetRef.current >= singleSetWidth * 2) {
            offsetRef.current -= singleSetWidth;
          }
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }

        updateCardTransforms();
        animFrameRef.current = requestAnimationFrame(animate);
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateCardTransforms]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-8"
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      {/* Edge fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #0a0a0a, #0a0a0acc, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to left, #0a0a0a, #0a0a0acc, transparent)' }} />

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-6"
        style={{ willChange: 'transform' }}
      >
        {extendedSalons.map((salon, i) => (
          <div
            key={`${salon.id}-${i}`}
            className="shrink-0"
            style={{
              width: '320px',
              transform: 'scale(0.85)',
              opacity: 0.7,
              transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
              willChange: 'transform, opacity',
            }}
          >
            <Link
              href={`/salons/${salon.id}`}
              className="block rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-neon-gold/30 transition-colors duration-500 group"
            >
              {/* Image Header */}
              <div className="relative h-44 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-gold/20 via-emerald-glow/10 to-violet-500/15 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                      <span className="text-xl font-bold text-white font-display">
                        {salon.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs">{salon.area}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {salon.homeService && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-glow/90 text-black text-xs font-semibold backdrop-blur-sm">
                      <Home className="w-3 h-3" />
                      Home
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white/80 text-xs font-medium">
                    {salon.priceRange}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-bold font-display text-white group-hover:text-neon-gold transition-colors duration-300 truncate">
                    {salon.name}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <Star className="w-3.5 h-3.5 text-neon-gold fill-neon-gold" />
                    <span className="text-sm font-bold text-white">{salon.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-white/35 text-xs mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{salon.area}, Hyderabad</span>
                  <span className="mx-1">•</span>
                  <span className="text-white/25">{salon.reviewCount} reviews</span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {salon.specializations.slice(0, 3).map((spec, j) => (
                    <span
                      key={j}
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 text-[10px] font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* AI Insight */}
                {salon.reviews && salon.reviews.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-neon-gold/[0.04] border border-neon-gold/[0.08] mb-3">
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-neon-gold" />
                      <span className="text-[10px] font-semibold text-neon-gold">AI Insight</span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed line-clamp-2">
                      {salon.reviews[0].text.substring(0, 90)}...
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05]">
                  <span className="text-[11px] text-white/25">{salon.openHours}</span>
                  <span className="text-neon-gold text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                    View
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
