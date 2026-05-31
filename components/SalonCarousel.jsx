'use client';

import { useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Star, MapPin, Home, ChevronRight } from 'lucide-react';

// Curated stock salon/beauty images from Unsplash
const SALON_IMAGES = [
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1521590832167-7228f29e9aab?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1633681122611-d87d2a2b4e5d?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470259078422-826894b933aa?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=500&h=350&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=500&h=350&fit=crop&q=80',
];

// Simple hash from salon id to get a consistent image index
function getSalonImageIndex(salonId) {
  let hash = 0;
  if (!salonId) return 0;
  for (let i = 0; i < salonId.length; i++) {
    hash = ((hash << 5) - hash + salonId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % SALON_IMAGES.length;
}

function getSalonImage(salonId) {
  return SALON_IMAGES[getSalonImageIndex(salonId)];
}

export default function SalonCarousel({ salons }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);

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
      const scale = 0.78 + normalizedDistance * 0.30;

      // Opacity: center slightly dimmer, edges brighter
      const opacity = 0.5 + normalizedDistance * 0.5;

      // Z-index: edges on top
      const zIndex = Math.round(normalizedDistance * 10);

      card.style.transform = `scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    }
  }, []);

  useEffect(() => {
    // Initial run
    updateCardTransforms();

    const handleResize = () => {
      updateCardTransforms();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateCardTransforms]);

  return (
    <div
      ref={containerRef}
      onScroll={updateCardTransforms}
      className="relative w-full overflow-x-auto py-12 no-scrollbar snap-x snap-mandatory select-none scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {/* Edge fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #0a0a0a, #0a0a0acc, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-20 pointer-events-none" style={{ background: 'linear-gradient(to left, #0a0a0a, #0a0a0acc, transparent)' }} />

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-6 px-[26vw] sm:px-[38vw] lg:px-[42vw]"
        style={{ willChange: 'transform' }}
      >
        {salons.map((salon, i) => {
          return (
            <div
              key={`${salon.id}-${i}`}
              className="shrink-0 snap-center w-[calc((100vw-20px)/2)] sm:w-[calc((100vw-60px)/4)] lg:w-[calc((100vw-100px)/6)]"
              style={{
                transform: 'scale(0.85)',
                opacity: 0.7,
                transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
                willChange: 'transform, opacity',
              }}
            >
              <Link
                href={`/salons/${salon.id}`}
                className="block rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-neon-gold/30 transition-colors duration-500 group shadow-lg"
              >
                {/* Stock Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getSalonImage(salon.id)}
                    alt={salon.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
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
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white/80 text-[10px] font-medium border border-white/5">
                      {salon.priceRange}
                    </span>
                  </div>

                  {/* Salon initial overlay */}
                  <div className="absolute bottom-3 left-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15">
                      <span className="text-base font-bold text-white font-display">
                        {salon.name.charAt(0)}
                      </span>
                    </div>
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
                    <span className="text-white/25 shrink-0">{salon.reviewCount} reviews</span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
