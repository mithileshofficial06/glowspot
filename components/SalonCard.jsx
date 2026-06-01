'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

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

export default function SalonCard({ salon, onBook }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getSalonImageUrl(salon.id);

  return (
    <Link
      href={`/salons/${salon.id}`}
      id={`salon-card-${salon.id}`}
      className="card group cursor-pointer block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-noir-100">
        {imgError ? (
          <div className="absolute inset-0 bg-noir-50 flex flex-col items-center justify-center p-4">
            <span className="text-lg font-display font-light text-gold text-center">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#080608] via-[#080608]/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-display font-light text-ivory group-hover:text-gold transition-colors duration-300">
            {salon.name}
          </h3>
          <span className="text-sm text-gold font-display shrink-0 ml-2">
            {salon.rating}
          </span>
        </div>

        {/* Location */}
        <p className="text-sm text-ivory/30 font-light mb-3">
          {salon.area}, Hyderabad
          <span className="mx-2 text-ivory/15">|</span>
          <span className="text-xs text-ivory/25">{salon.reviewCount} reviews</span>
        </p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {salon.specializations.slice(0, 3).map((spec, i) => (
            <span key={i} className="text-xs text-ivory/30 font-light">
              {i > 0 && <span className="mr-2 text-gold/20">/</span>}
              {spec}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gold/[0.06]">
          <span className="text-xs text-ivory/25 font-light">{salon.openHours}</span>
          {onBook ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBook(salon);
              }}
              className="px-4 py-1.5 border border-gold text-gold text-xs tracking-[0.1em] uppercase font-light hover:bg-gold hover:text-[#080608] transition-all duration-300 shrink-0"
            >
              Book
            </button>
          ) : (
            <span className="text-gold/60 text-xs tracking-[0.1em] uppercase font-light flex items-center gap-1 group-hover:text-gold group-hover:gap-2 transition-all duration-300">
              View
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
