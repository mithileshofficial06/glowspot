'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Home, ChevronRight } from 'lucide-react';

const SALON_PHOTO_IDS = [
  'photo-1560066984-138dadb4c035',
  'photo-1522337360788-8b13dee7a37e',
  'photo-1521590832167-7bcbfaa6381f',
  'photo-1487412947147-5cebf100ffc2',
  'photo-1570172619644-dfd03ed5d881'
];

function getSalonImageUrl(salonId) {
  let hash = 0;
  if (!salonId) return `https://images.unsplash.com/${SALON_PHOTO_IDS[0]}?w=600&auto=format&fit=crop&q=80`;
  for (let i = 0; i < salonId.length; i++) {
    hash = ((hash << 5) - hash + salonId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % SALON_PHOTO_IDS.length;
  return `https://images.unsplash.com/${SALON_PHOTO_IDS[index]}?w=600&auto=format&fit=crop&q=80`;
}

function CarouselItem({ salon }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getSalonImageUrl(salon.id);

  return (
    <Link
      href={`/salons/${salon.id}`}
      className="block rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-neon-gold/30 transition-colors duration-500 group shadow-lg"
    >
      {/* Stock Image */}
      <div className="relative h-48 overflow-hidden bg-noir-100">
        {imgError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-noir-50 via-noir-100 to-noir-200 flex flex-col items-center justify-center p-4 border border-white/[0.04] transition-all duration-300">
            <span className="text-sm font-bold text-neon-gold font-display text-center drop-shadow-md truncate max-w-full">
              {salon.name}
            </span>
            <span className="text-[9px] text-white/35 tracking-wider uppercase font-semibold mt-1">
              {salon.area}
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={salon.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {salon.homeService && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-glow/90 text-black text-[10px] font-semibold backdrop-blur-sm shadow-md">
              <Home className="w-3 h-3" />
              Home
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md bg-black/60 border border-white/5 backdrop-blur-sm text-white/80 text-[10px] font-medium">
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
          <div className="flex items-center gap-0.5 shrink-0 ml-1.5">
            <Star className="w-3.5 h-3.5 text-neon-gold fill-neon-gold" />
            <span className="text-xs font-bold text-white">{salon.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/35 text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{salon.area}</span>
          <span className="mx-0.5">•</span>
          <span className="text-white/25 shrink-0">{salon.reviewCount}</span>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1 mb-3">
          {salon.specializations.slice(0, 2).map((spec, j) => (
            <span
              key={j}
              className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/40 text-[10px] font-medium"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <span className="text-xs text-white/25 truncate">{salon.openHours}</span>
          <span className="text-neon-gold text-xs font-medium flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-300 shrink-0">
            View
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SalonCarousel({ salons }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const rafId = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const momentumRaf = useRef(null);

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

      const maxDistance = containerRect.width / 2;
      const distance = Math.abs(cardCenterX - centerX);
      const normalizedDistance = Math.min(distance / maxDistance, 1);

      // Concave effect: center = smaller, edges = bigger
      const scale = 0.78 + normalizedDistance * 0.30;
      const opacity = 0.5 + normalizedDistance * 0.5;
      const zIndex = Math.round(normalizedDistance * 10);

      card.style.transform = `scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    }
  }, []);

  // rAF-throttled scroll handler for smooth 60fps updates
  const handleScroll = useCallback(() => {
    if (rafId.current) return; // already scheduled
    rafId.current = requestAnimationFrame(() => {
      updateCardTransforms();
      rafId.current = null;
    });
  }, [updateCardTransforms]);

  // Mouse drag handlers for desktop smooth drag-to-scroll
  const handleMouseDown = useCallback((e) => {
    if (momentumRaf.current) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = null;
    }
    isDragging.current = true;
    startX.current = e.pageX;
    scrollStart.current = containerRef.current.scrollLeft;
    lastX.current = e.pageX;
    lastTime.current = Date.now();
    velocity.current = 0;
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.scrollSnapType = 'none'; // disable snap while dragging
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const now = Date.now();
    const dt = now - lastTime.current;
    const dx = e.pageX - lastX.current;
    if (dt > 0) {
      velocity.current = dx / dt; // px/ms
    }
    lastX.current = e.pageX;
    lastTime.current = now;

    const walk = e.pageX - startX.current;
    containerRef.current.scrollLeft = scrollStart.current - walk;
  }, []);

  const applyMomentum = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const friction = 0.95;
    velocity.current *= friction;

    if (Math.abs(velocity.current) < 0.1) {
      // Momentum finished — re-enable snap
      container.style.scrollSnapType = 'x mandatory';
      momentumRaf.current = null;
      return;
    }

    container.scrollLeft -= velocity.current * 16; // ~16ms per frame
    momentumRaf.current = requestAnimationFrame(applyMomentum);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    containerRef.current.style.cursor = 'grab';

    // If there's meaningful velocity, apply momentum
    if (Math.abs(velocity.current) > 0.3) {
      momentumRaf.current = requestAnimationFrame(applyMomentum);
    } else {
      // Re-enable snap immediately
      containerRef.current.style.scrollSnapType = 'x mandatory';
    }
  }, [applyMomentum]);

  useEffect(() => {
    updateCardTransforms();

    const container = containerRef.current;
    if (!container) return;

    // Passive scroll listener for best perf
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Mouse drag listeners
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const handleResize = () => updateCardTransforms();
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      if (momentumRaf.current) cancelAnimationFrame(momentumRaf.current);
    };
  }, [updateCardTransforms, handleScroll, handleMouseDown, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-x-auto py-12 no-scrollbar snap-x snap-mandatory select-none"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        cursor: 'grab',
        WebkitOverflowScrolling: 'touch', // iOS momentum scrolling
      }}
    >
      {/* Edge fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #0a0a0a, #0a0a0acc, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to left, #0a0a0a, #0a0a0acc, transparent)' }} />

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-6 px-[26vw] sm:px-[38vw] lg:px-[42vw]"
      >
        {salons.map((salon, i) => {
          return (
            <div
              key={`${salon.id}-${i}`}
              className="shrink-0 snap-center w-[calc((100vw-20px)/2)] sm:w-[calc((100vw-60px)/4)] lg:w-[calc((100vw-100px)/6)]"
              style={{
                transform: 'scale(0.85)',
                opacity: 0.7,
                willChange: 'transform, opacity',
              }}
            >
              <CarouselItem salon={salon} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
