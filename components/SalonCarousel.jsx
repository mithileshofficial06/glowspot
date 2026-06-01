'use client';

import { useState, useRef, useEffect } from 'react';
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

function CarouselCard({ salon }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getSalonImageUrl(salon.id);

  return (
    <Link
      href={`/salons/${salon.id}`}
      className="block rounded-2xl overflow-hidden border border-white/[0.06] bg-[#111113] hover:border-neon-gold/30 transition-all duration-400 group shadow-lg hover:shadow-neon-gold/5 hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-noir-100">
        {imgError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex flex-col items-center justify-center p-4">
            <span className="text-lg font-bold text-neon-gold font-display text-center drop-shadow-md">
              {salon.name}
            </span>
            <span className="text-[10px] text-white/40 tracking-wider uppercase font-semibold mt-1.5">
              {salon.area}
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={salon.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {salon.homeService && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-glow/90 text-black text-[10px] font-semibold backdrop-blur-sm shadow-md">
              <Home className="w-3 h-3" />
              Home
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded-md bg-black/50 border border-white/10 backdrop-blur-sm text-white/90 text-[10px] font-medium">
            {salon.priceRange}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5 gap-2">
          <h3 className="text-sm font-bold font-display text-white group-hover:text-neon-gold transition-colors duration-300 leading-tight line-clamp-1">
            {salon.name}
          </h3>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="w-3.5 h-3.5 text-neon-gold fill-neon-gold" />
            <span className="text-xs font-bold text-white">{salon.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{salon.area}</span>
          <span className="mx-0.5">·</span>
          <span className="text-white/30 shrink-0">{salon.reviewCount}</span>
        </div>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1 mb-3">
          {salon.specializations.slice(0, 2).map((spec, j) => (
            <span
              key={j}
              className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/45 text-[10px] font-medium"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
          <span className="text-[11px] text-white/30 truncate">{salon.openHours}</span>
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
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate the salon list to create seamless loop
  const duplicated = [...salons, ...salons];

  const CARD_WIDTH = 280;
  const GAP = 20;
  // Total width of one full set
  const setWidth = salons.length * (CARD_WIDTH + GAP);

  // Duration: controls speed. Lower = faster.
  const duration = salons.length * 4; // ~4s per card

  return (
    <div
      className="relative w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Edge fade gradients */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #0a0a0a, transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }}
      />

      {/* Scrolling track */}
      <div
        ref={trackRef}
        className="flex"
        style={{
          gap: `${GAP}px`,
          width: 'fit-content',
          animation: `marquee-scroll ${duration}s linear infinite`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {duplicated.map((salon, i) => (
          <div
            key={`${salon.id}-${i}`}
            className="shrink-0"
            style={{ width: `${CARD_WIDTH}px` }}
          >
            <CarouselCard salon={salon} />
          </div>
        ))}
      </div>

      {/* Keyframes */}
      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${setWidth}px);
          }
        }
      `}</style>
    </div>
  );
}
