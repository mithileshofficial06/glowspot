'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Clock, Phone, Home, ChevronLeft, Scissors, Users, MessageSquare, Camera, ArrowRight } from 'lucide-react';
import salons from '@/data/salons.json';
import BookingForm from '@/components/BookingForm';
import ReviewSummary from '@/components/ReviewSummary';
import SalonCard from '@/components/SalonCard';

const SALON_PHOTO_IDS = [
  'photo-1560066984-138dadb4c035',
  'photo-1522337360788-8b13dee7a37e',
  'photo-1521590832167-7bcbfaa6381f',
  'photo-1487412947147-5cebf100ffc2',
  'photo-1570172619644-dfd03ed5d881'
];

function getSalonImageUrl(salonId) {
  let hash = 0;
  if (!salonId) return `https://images.unsplash.com/${SALON_PHOTO_IDS[0]}?w=1000&auto=format&fit=crop&q=80`;
  for (let i = 0; i < salonId.length; i++) {
    hash = ((hash << 5) - hash + salonId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % SALON_PHOTO_IDS.length;
  return `https://images.unsplash.com/${SALON_PHOTO_IDS[index]}?w=1000&auto=format&fit=crop&q=80`;
}

function getSalonGalleryUrls(salonId) {
  const GALLERY_POOL = [
    'photo-1560066984-138dadb4c035',
    'photo-1522337360788-8b13dee7a37e',
    'photo-1521590832167-7bcbfaa6381f',
    'photo-1487412947147-5cebf100ffc2',
    'photo-1570172619644-dfd03ed5d881',
    'photo-1607604276583-eef5d076aa5f',
    'photo-1596178065887-1198b6148b2b',
    'photo-1512290923902-8a9f81dc236c',
    'photo-1600948836101-f9ffda59d250',
    'photo-1516975080664-ed2fc6a32937'
  ];
  
  let hash = 0;
  if (salonId) {
    for (let i = 0; i < salonId.length; i++) {
      hash = ((hash << 5) - hash + salonId.charCodeAt(i)) | 0;
    }
  }
  
  const images = [];
  const usedIndices = new Set();
  let shift = 0;
  while (images.length < 5) {
    const index = Math.abs(hash + shift) % GALLERY_POOL.length;
    if (!usedIndices.has(index)) {
      images.push(`https://images.unsplash.com/${GALLERY_POOL[index]}?w=600&auto=format&fit=crop&q=80`);
      usedIndices.add(index);
    }
    shift++;
  }
  return images;
}

const tabs = [
  { id: 'services', label: 'Services', icon: Scissors },
  { id: 'gallery', label: 'Gallery', icon: Camera },
  { id: 'stylists', label: 'Stylists', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'booking', label: 'Book Now', icon: Clock },
];

export default function SalonDetail() {
  const params = useParams();
  const salon = salons.find((s) => s.id === params.id);
  const [activeTab, setActiveTab] = useState('services');
  const [imgError, setImgError] = useState(false);

  if (!salon) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-noir">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-display text-white mb-4">Salon Not Found</h1>
          <Link href="/salons" className="btn-primary">Browse All Salons</Link>
        </div>
      </div>
    );
  }

  const imageUrl = getSalonImageUrl(salon.id);
  const serviceCategories = [...new Set(salon.services?.map((s) => s.category))];

  // Find similar salons (excluding current)
  const similarSalons = salons
    .filter((s) => s.id !== salon.id)
    .map((s) => {
      let score = 0;
      if (s.area === salon.area) score += 10;
      const overlap = s.specializations.filter(val => salon.specializations?.includes(val)).length;
      score += overlap * 2;
      return { salon: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.salon);

  return (
    <div className="min-h-screen pt-20 bg-noir text-white/90">
      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden bg-noir-100">
        {imgError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-noir-50 via-noir-100 to-noir-200 flex flex-col items-center justify-center p-8 border border-white/[0.04] transition-all duration-300">
            <span className="text-3xl md:text-4xl font-bold text-gold font-display text-center drop-shadow-md">
              {salon.name}
            </span>
            <span className="text-xs md:text-sm text-white/40 tracking-wider uppercase font-semibold mt-3">
              {salon.area}, Hyderabad
            </span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={salon.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-noir via-black/45 to-black/75" />

        {/* Back Button */}
        <Link
          href="/salons"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md text-white text-sm hover:bg-black/60 border border-white/10 transition-all z-10 shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          All Salons
        </Link>
      </div>

      {/* Salon Info Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="p-6 md:p-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] rounded-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display text-white mb-2">{salon.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  {salon.address}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 font-bold text-white">
                  <Star className="w-4 h-4 text-gold fill-gold shrink-0" />
                  {salon.rating}
                </span>
                <span className="text-white/40">({salon.reviewCount} reviews)</span>
                <span className="text-white/20">•</span>
                <span className="flex items-center gap-1.5 text-white/60">
                  <Clock className="w-4 h-4 shrink-0 text-white/40" />
                  {salon.openHours}
                </span>
                {salon.closedDay !== 'None' && (
                  <span className="text-xs text-gold-light bg-gold-light/10 border border-gold-light/20 px-2.5 py-0.5 rounded-lg font-medium">
                    Closed on {salon.closedDay}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 md:text-right shrink-0">
              <span className="text-xl font-bold text-gold">{salon.priceRange}</span>
              <div className="flex flex-wrap gap-2">
                {salon.homeService && (
                  <span className="px-2.5 py-1 rounded-lg bg-mauve/10 border border-mauve/20 text-mauve text-xs font-semibold flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    Home Service
                  </span>
                )}
                {salon.phone && (
                  <a
                    href={`tel:${salon.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/80 hover:bg-white/[0.08] hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Salon
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Specialization Tags */}
          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-white/[0.06]">
            {salon.specializations?.map((spec, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 text-xs font-medium">
                {spec}
              </span>
            ))}
            {salon.tags?.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-semibold capitalize">
                {tag.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* AI Review Summary */}
        <div className="mt-6">
          <ReviewSummary reviews={salon.reviews} salonName={salon.name} />
        </div>

        {/* Tab Navigation (Horizontal Swipe Tray) */}
        <div className="flex gap-2 mt-8 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-${tab.id}`}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 snap-start ${
                  activeTab === tab.id
                    ? 'bg-gold text-black shadow-glow font-bold'
                    : 'bg-white/[0.02] text-white/55 hover:bg-white/[0.05] border border-white/[0.05]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6 mb-16 animate-fade-in">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {serviceCategories.map((cat) => (
                <div key={cat}>
                  <h3 className="text-lg font-bold font-display text-white mb-3 tracking-wide">{cat}</h3>
                  <div className="space-y-2">
                    {salon.services?.filter((s) => s.category === cat).map((service, i) => (
                      <div key={i} className="p-4 bg-white/[0.02] backdrop-blur-sm border border-white/[0.04] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/[0.08] hover:bg-white/[0.03] transition-all duration-300">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white truncate">{service.name}</p>
                          <p className="text-sm text-white/40">{service.duration}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-white/[0.04] sm:border-t-0">
                          <span className="font-bold text-gold">₹{service.price?.toLocaleString()}</span>
                          <button
                            onClick={() => setActiveTab('booking')}
                            className="text-xs px-4 py-2 rounded-xl bg-gold text-black hover:brightness-110 font-bold transition-all"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {getSalonGalleryUrls(salon.id).map((url, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl border border-white/5 group hover:border-gold/30 transition-all duration-300 relative ${
                    i === 0 ? 'col-span-2 md:row-span-2 md:col-span-2 h-[300px] md:h-[400px]' : 'h-[142px] md:h-[192px]'
                  }`}
                >
                  <img
                    src={url}
                    alt={`${salon.name} Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Stylists Tab */}
          {activeTab === 'stylists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {salon.stylists?.map((stylist, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-center hover:border-white/[0.08] transition-colors">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold-light/20 border border-gold/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white font-display">{stylist.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-bold text-white text-lg">{stylist.name}</h4>
                  <p className="text-sm text-gold font-medium mt-0.5">{stylist.specialization}</p>
                  <p className="text-xs text-white/40 mt-1">{stylist.experience} experience</p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {salon.reviews?.map((review, i) => (
                <div key={i} className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl hover:border-white/[0.08] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{review.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{review.name}</p>
                        <p className="text-xs text-white/40">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-gold fill-gold' : 'text-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
              <BookingForm salon={salon} />
            </div>
          )}
        </div>

        {/* Similar Salons Section */}
        <div className="mt-16 pt-10 border-t border-white/[0.06] mb-12">
          <h2 className="text-2xl font-bold font-display text-white mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarSalons.map((similarSalon) => (
              <SalonCard key={similarSalon.id} salon={similarSalon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
