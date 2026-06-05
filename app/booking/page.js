'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Calendar, Clock, MapPin, Home } from 'lucide-react';
import salons from '@/data/salons.json';
import dynamic from 'next/dynamic';

const BookingConfirmation = dynamic(() => import('@/components/BookingConfirmation'), {
  ssr: false,
});

function downloadICS(salonName, serviceName, dateStr, timeStr, address) {
  let startDate = new Date();
  if (dateStr) {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      startDate = parsedDate;
    }
  }
  
  let hours = 12;
  let minutes = 0;
  if (timeStr) {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      hours = parseInt(match[1]);
      minutes = parseInt(match[2]);
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }
  
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  
  const formatDateForICS = (date) => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };
  
  const startICS = formatDateForICS(startDate);
  const endICS = formatDateForICS(endDate);
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GlowSpot Hyderabad//NONSGML Event//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@glowspothyderabad.com`,
    `DTSTAMP:${formatDateForICS(new Date())}`,
    `DTSTART:${startICS}`,
    `DTEND:${endICS}`,
    `SUMMARY:Beauty Appointment - ${serviceName || 'Service'} at ${salonName}`,
    `DESCRIPTION:Your beauty appointment at ${salonName} for ${serviceName || 'services'}.`,
    `LOCATION:${address || 'Hyderabad, India'}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `appointment-${salonName.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function BookingContent() {
  const searchParams = useSearchParams();
  const salonId = searchParams.get('salon');
  const serviceParam = searchParams.get('service');
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');

  const salon = salons.find((s) => s.id === salonId);

  return (
    <div className="max-w-lg w-full text-center animate-fade-in py-16">
      {/* Gold animated checkmark and burst */}
      <BookingConfirmation salonName={salon?.name || 'the salon'} />

      {salon && (
        <div className="bg-white/[0.02] border border-white/[0.05] p-6 text-left space-y-4 mb-8 mt-6 rounded-2xl">
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
        {salon && (
          <button
            onClick={() => downloadICS(salon.name, serviceParam, dateParam, timeParam, salon.address)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-gold" />
            Add to Calendar
          </button>
        )}
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
