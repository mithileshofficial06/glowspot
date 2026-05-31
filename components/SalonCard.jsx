'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, Home, Sparkles, ChevronRight } from 'lucide-react';

// Same curated stock images used in the carousel
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
  for (let i = 0; i < salonId.length; i++) {
    hash = ((hash << 5) - hash + salonId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % SALON_IMAGES.length;
}

export default function SalonCard({ salon }) {
  const imageUrl = SALON_IMAGES[getSalonImageIndex(salon.id)];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating) 
            ? 'text-neon-gold fill-neon-gold' 
            : i < rating 
              ? 'text-neon-gold fill-neon-gold/50' 
              : 'text-white/15'
        }`}
      />
    ));
  };

  return (
    <Link
      href={`/salons/${salon.id}`}
      id={`salon-card-${salon.id}`}
      className="card group cursor-pointer block"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={salon.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Salon Initial */}
        <div className="absolute bottom-3 left-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 group-hover:scale-110 transition-transform duration-500">
            <span className="text-lg font-bold text-white font-display">
              {salon.name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {salon.homeService && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-glow/90 text-black text-xs font-semibold backdrop-blur-sm">
              <Home className="w-3 h-3" />
              Home Service
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
      <div className="p-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold font-display text-white group-hover:text-neon-gold transition-colors duration-300">
            {salon.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-4 h-4 text-neon-gold fill-neon-gold" />
            <span className="text-sm font-bold text-white">{salon.rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-white/40 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{salon.area}, Hyderabad</span>
          <span className="mx-1">•</span>
          <span className="text-xs text-white/30">({salon.reviewCount} reviews)</span>
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {salon.specializations.slice(0, 3).map((spec, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/40 text-xs font-medium">
              {spec}
            </span>
          ))}
        </div>

        {/* AI Review Summary Snippet */}
        {salon.reviews && salon.reviews.length > 0 && (
          <div className="p-3 rounded-xl bg-neon-gold/[0.04] border border-neon-gold/[0.08] mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-neon-gold" />
              <span className="text-xs font-semibold text-neon-gold">AI Insight</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
              {salon.reviews[0].text.substring(0, 100)}...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-1 text-xs text-white/30">
            <Clock className="w-3 h-3" />
            <span>{salon.openHours}</span>
          </div>
          <span className="text-neon-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
            View Details
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
