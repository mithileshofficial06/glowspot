'use client';

import Link from 'next/link';
import { Star, MapPin, Clock, Home, Sparkles, ChevronRight } from 'lucide-react';

export default function SalonCard({ salon }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating) 
            ? 'text-gold fill-gold' 
            : i < rating 
              ? 'text-gold fill-gold/50' 
              : 'text-gray-300'
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
        <div className="absolute inset-0 bg-gradient-to-br from-plum/80 via-rose-gold/60 to-champagne/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform duration-500">
              <span className="text-2xl font-bold text-white font-display">
                {salon.name.charAt(0)}
              </span>
            </div>
            <p className="text-white/70 text-xs">{salon.area}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {salon.homeService && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-medium backdrop-blur-sm">
              <Home className="w-3 h-3" />
              Home Service
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-medium">
            {salon.priceRange}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold font-display text-gray-900 group-hover:text-rose-gold transition-colors duration-300">
            {salon.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Star className="w-4 h-4 text-gold fill-gold" />
            <span className="text-sm font-bold text-gray-900">{salon.rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>{salon.area}, Hyderabad</span>
          <span className="mx-1">•</span>
          <span className="text-xs text-gray-400">({salon.reviewCount} reviews)</span>
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {salon.specializations.slice(0, 3).map((spec, i) => (
            <span key={i} className="tag text-xs">
              {spec}
            </span>
          ))}
        </div>

        {/* AI Review Summary Snippet */}
        {salon.reviews && salon.reviews.length > 0 && (
          <div className="p-3 rounded-xl bg-gradient-to-r from-rose-blush/50 to-champagne-light/50 border border-rose-gold/10 mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-rose-gold" />
              <span className="text-xs font-semibold text-rose-gold">AI Insight</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {salon.reviews[0].text.substring(0, 100)}...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{salon.openHours}</span>
          </div>
          <span className="text-rose-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
            View Details
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
