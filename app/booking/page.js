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
        <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto animate-bounce-gentle">
          <PartyPopper className="w-12 h-12 text-emerald-500" />
        </div>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-sparkle"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
              backgroundColor: ['#B76E79', '#D4AF37', '#4A1942', '#F4C2C2'][i % 4],
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-800 mb-3">
        Booking Confirmed! 🎉
      </h1>
      <p className="text-gray-500 mb-8">
        {salon
          ? `Your appointment at ${salon.name} has been confirmed.`
          : 'Your salon appointment has been confirmed.'}
      </p>

      {salon && (
        <div className="card-glass p-6 text-left space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-plum/80 to-rose-gold/80 flex items-center justify-center">
              <span className="text-lg font-bold text-white font-display">{salon.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{salon.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {salon.area}, Hyderabad
              </p>
            </div>
          </div>

          {(serviceParam || dateParam || timeParam) && (
            <div className="pt-4 border-t border-gray-100 space-y-2">
              {serviceParam && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium text-gray-800">{serviceParam}</span>
                </div>
              )}
              {dateParam && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Date
                  </span>
                  <span className="font-medium text-gray-800">{dateParam}</span>
                </div>
              )}
              {timeParam && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Time
                  </span>
                  <span className="font-medium text-gray-800">{timeParam}</span>
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
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <div className="min-h-screen pt-20 bg-cream flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-rose-gold/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Check className="w-8 h-8 text-rose-gold/50" />
          </div>
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      }>
        <BookingContent />
      </Suspense>
    </div>
  );
}
