'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, PartyPopper, Calendar, Clock, MapPin, ArrowRight, Home } from 'lucide-react';
import salons from '@/data/salons.json';

function BookingContent() {
  const searchParams = useSearchParams();
  const salonId = searchParams.get('salon');
  const serviceParam = searchParams.get('service');
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');

  const salon = salons.find((s) => s.id === salonId);

  return (
    <div className="max-w-lg w-full text-center animate-fade-in py-16">
      {/* Success Animation */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-mauve/10 border border-mauve/20 flex items-center justify-center mx-auto animate-bounce-gentle">
          <PartyPopper className="w-12 h-12 text-mauve" />
        </div>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-sparkle"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
              backgroundColor: ['#FFD700', '#00E676', '#FFBF00', '#FFFFFF'][i % 4],
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
        Booking Confirmed
      </h1>
      <p className="text-white/40 mb-8">
        {salon
          ? `Your appointment at ${salon.name} has been confirmed.`
          : 'Your salon appointment has been confirmed.'}
      </p>

      {salon && (
        <div className="bg-white/[0.02] border border-white/[0.05] p-6 text-left space-y-4 mb-8 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold-light/20 border border-gold/15 flex items-center justify-center">
              <span className="text-lg font-bold text-white font-display">{salon.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-bold text-white">{salon.name}</h3>
              <p className="text-sm text-white/40 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold" />
                {salon.area}, Hyderabad
              </p>
            </div>
          </div>

          {(serviceParam || dateParam || timeParam) && (
            <div className="pt-4 border-t border-white/[0.05] space-y-2">
              {serviceParam && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Service</span>
                  <span className="font-semibold text-white">{serviceParam}</span>
                </div>
              )}
              {dateParam && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-white/30" /> Date
                  </span>
                  <span className="font-semibold text-white">{dateParam}</span>
                </div>
              )}
              {timeParam && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/30" /> Time
                  </span>
                  <span className="font-semibold text-white">{timeParam}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/salons" className="btn-secondary flex items-center justify-center gap-2">
          Browse More Salons
        </Link>
        <Link href="/" className="btn-primary flex items-center justify-center gap-2">
          <Home className="w-4 h-4 animate-pulse" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <div className="min-h-screen pt-20 bg-noir flex items-center justify-center px-4 text-white/90">
      <Suspense fallback={
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Check className="w-8 h-8 text-gold" />
          </div>
          <p className="text-white/40">Loading booking details...</p>
        </div>
      }>
        <BookingContent />
      </Suspense>
    </div>
  );
}
