'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Clock, Phone, Home, ChevronLeft, Scissors, Users, MessageSquare, Camera, ArrowRight } from 'lucide-react';
import salons from '@/data/salons.json';
import BookingForm from '@/components/BookingForm';
import ReviewSummary from '@/components/ReviewSummary';

const tabs = [
  { id: 'services', label: 'Services', icon: Scissors },
  { id: 'stylists', label: 'Stylists', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'booking', label: 'Book Now', icon: Clock },
];

export default function SalonDetail() {
  const params = useParams();
  const salon = salons.find((s) => s.id === params.id);
  const [activeTab, setActiveTab] = useState('services');

  if (!salon) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-cream">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-display text-gray-800 mb-4">Salon Not Found</h1>
          <Link href="/salons" className="btn-primary">Browse All Salons</Link>
        </div>
      </div>
    );
  }

  const serviceCategories = [...new Set(salon.services?.map((s) => s.category))];

  return (
    <div className="min-h-screen pt-20 bg-cream">
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <div className="absolute inset-0 bg-gradient-to-br from-plum/90 via-rose-gold/70 to-champagne/80 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white font-display">{salon.name.charAt(0)}</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />

        {/* Back Button */}
        <Link
          href="/salons"
          className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-sm hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          All Salons
        </Link>
      </div>

      {/* Salon Info Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-display text-gray-900 mb-2">{salon.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-rose-gold" />
                  {salon.address}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 font-bold text-gray-800">
                  <Star className="w-4 h-4 text-gold fill-gold" />
                  {salon.rating}
                </span>
                <span className="text-gray-400">({salon.reviewCount} reviews)</span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  {salon.openHours}
                </span>
                {salon.closedDay !== 'None' && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    Closed on {salon.closedDay}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="text-lg font-bold gradient-text">{salon.priceRange}</span>
              <div className="flex gap-2">
                {salon.homeService && (
                  <span className="tag text-xs flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    Home Service
                  </span>
                )}
                {salon.phone && (
                  <a href={`tel:${salon.phone}`} className="tag text-xs flex items-center gap-1 hover:bg-rose-gold/20 transition-colors">
                    <Phone className="w-3 h-3" />
                    Call
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Specialization Tags */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {salon.specializations?.map((spec, i) => (
              <span key={i} className="tag">{spec}</span>
            ))}
            {salon.tags?.map((tag, i) => (
              <span key={i} className="tag-gold capitalize">{tag.replace('-', ' ')}</span>
            ))}
          </div>
        </div>

        {/* AI Review Summary */}
        <div className="mt-6">
          <ReviewSummary reviews={salon.reviews} salonName={salon.name} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                id={`tab-${tab.id}`}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-rose-gold text-white shadow-glow'
                    : 'bg-white text-gray-600 hover:bg-rose-gold/5 border border-gray-100'
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
                  <h3 className="text-lg font-bold font-display text-gray-800 mb-3">{cat}</h3>
                  <div className="space-y-2">
                    {salon.services?.filter((s) => s.category === cat).map((service, i) => (
                      <div key={i} className="card p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{service.name}</p>
                          <p className="text-sm text-gray-400">{service.duration}</p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <span className="font-bold text-rose-gold">₹{service.price?.toLocaleString()}</span>
                          <button
                            onClick={() => setActiveTab('booking')}
                            className="text-xs btn-primary py-2 px-3"
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

          {/* Stylists Tab */}
          {activeTab === 'stylists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {salon.stylists?.map((stylist, i) => (
                <div key={i} className="card p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-plum/60 to-rose-gold/60 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white font-display">{stylist.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">{stylist.name}</h4>
                  <p className="text-sm text-rose-gold font-medium">{stylist.specialization}</p>
                  <p className="text-xs text-gray-400 mt-1">{stylist.experience} experience</p>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {salon.reviews?.map((review, i) => (
                <div key={i} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold/40 to-plum/40 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{review.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                        <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className={`w-3.5 h-3.5 ${j < review.rating ? 'text-gold fill-gold' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <div className="card p-6">
              <BookingForm salon={salon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
