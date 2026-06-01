'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
      className="block overflow-hidden border border-gold/[0.06] bg-[#111011] hover:border-gold/20 transition-all duration-500 group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-noir-100">
        {imgError ? (
          <div className="absolute inset-0 bg-noir-50 flex flex-col items-center justify-center p-4">
            <span className="text-base font-display font-light text-gold text-center">
              {salon.name}
            </span>
            <span className="text-[10px] text-ivory/30 tracking-[0.2em] uppercase mt-1.5 font-light">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#080608]/80 via-[#080608]/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1.5 gap-2">
          <h3 className="text-sm font-display font-light text-ivory group-hover:text-gold transition-colors duration-300 leading-tight line-clamp-1">
            {salon.name}
          </h3>
          <span className="text-xs text-gold font-display shrink-0">{salon.rating}</span>
        </div>

        <p className="text-xs text-ivory/30 mb-3 font-light">
          {salon.area}
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-1 mb-3">
          {salon.specializations.slice(0, 2).map((spec, j) => (
            <span
              key={j}
              className="text-[10px] text-ivory/25 font-light"
            >
              {j > 0 && <span className="mr-1.5 text-gold/15">/</span>}
              {spec}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gold/[0.06]">
          <span className="text-[11px] text-ivory/20 font-light truncate">{salon.openHours}</span>
          <span className="text-gold/50 text-[11px] tracking-[0.1em] uppercase font-light flex items-center gap-0.5 group-hover:text-gold group-hover:gap-1.5 transition-all duration-300 shrink-0">
            View
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SalonCarousel({ salons }) {
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const duplicated = [...salons, ...salons];

  const CARD_WIDTH = 280;
  const GAP = 20;
  const setWidth = salons.length * (CARD_WIDTH + GAP);
  const duration = salons.length * 4;

  return (
    <div
      className="relative w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Edge fades */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #080608, transparent)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #080608, transparent)' }}
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

      <style jsx>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${setWidth}px); }
        }
      `}</style>
    </div>
  );
}
