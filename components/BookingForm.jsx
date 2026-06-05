'use client';

import { useState } from 'react';
import { Calendar, Clock, Check, ChevronRight, Sparkles, User, Phone, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const BookingConfirmation = dynamic(() => import('./BookingConfirmation'), {
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

export default function BookingForm({ salon }) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  if (!salon) return null;

  const availableDates = Object.keys(salon.availability || {});
  const availableTimes = selectedDate ? (salon.availability?.[selectedDate] || []) : [];

  const handleConfirm = () => {
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="text-center py-12 animate-fade-in text-white/90">
        <BookingConfirmation salonName={salon.name} />

        <div className="bg-white/[0.02] border border-white/[0.05] p-6 max-w-md mx-auto text-left space-y-3 mb-8 rounded-2xl">
          <div className="flex justify-between">
            <span className="text-sm text-white/40">Salon</span>
            <span className="text-sm font-bold text-white">{salon.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/40">Service</span>
            <span className="text-sm font-bold text-white">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/40">Date</span>
            <span className="text-sm font-bold text-white">
              {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/40">Time</span>
            <span className="text-sm font-bold text-white">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/40">Duration</span>
            <span className="text-sm font-bold text-white">{selectedService?.duration}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-white/[0.05]">
            <span className="text-sm font-semibold text-white/60">Total</span>
            <span className="text-lg font-bold text-gold">₹{selectedService?.price?.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => downloadICS(salon.name, selectedService?.name, selectedDate, selectedTime, salon.address)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-gold" />
            Add to Calendar
          </button>
          <Link href="/salons" className="btn-secondary">
            Browse More Salons
          </Link>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white/90">
      <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gold" />
        Book Appointment
      </h3>

      {/* Step 1: Select Service */}
      <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
        <h4 className="text-sm font-semibold text-white/60 mb-3">1. Choose a Service</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {salon.services?.map((service, i) => (
            <button
              key={i}
              onClick={() => { setSelectedService(service); setStep(Math.max(step, 2)); }}
              id={`service-${i}`}
              className={`p-3 rounded-xl text-left transition-all duration-300 border ${
                selectedService?.name === service.name
                  ? 'border-gold bg-gold/5'
                  : 'border-white/10 hover:border-gold/30 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{service.name}</p>
                  <p className="text-xs text-white/40">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gold">₹{service.price?.toLocaleString()}</p>
                  {selectedService?.name === service.name && (
                    <Check className="w-4 h-4 text-gold ml-auto mt-1" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Date */}
      <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <h4 className="text-sm font-semibold text-white/60 mb-3">2. Pick a Date</h4>
        <div className="flex gap-2 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar">
          {availableDates.map((date) => {
            const d = new Date(date);
            return (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setSelectedTime(''); setStep(Math.max(step, 3)); }}
                className={`px-4 py-3 rounded-xl text-center transition-all duration-300 border min-w-[85px] snap-start shrink-0 ${
                  selectedDate === date
                    ? 'border-gold bg-gold text-black shadow-glow font-medium'
                    : 'border-white/10 hover:border-gold/30 bg-white/[0.02] text-white/70'
                }`}
              >
                <p className="text-xs font-medium opacity-85">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                <p className="text-lg font-bold my-0.5">{d.getDate()}</p>
                <p className="text-xs opacity-85">{d.toLocaleDateString('en-IN', { month: 'short' })}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Select Time */}
      <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <h4 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold" />
          3. Choose Time Slot
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => { setSelectedTime(time); setStep(Math.max(step, 4)); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                selectedTime === time
                  ? 'border-gold bg-gold text-black'
                  : 'border-white/10 hover:border-gold/30 bg-white/[0.02] text-white/70'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: Your Details */}
      <div className={`transition-all duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <h4 className="text-sm font-semibold text-white/60 mb-3">4. Your Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your full name"
                id="booking-name"
                className="input-styled pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-white/30" />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                id="booking-phone"
                className="input-styled pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary & Confirm */}
      {step >= 4 && selectedService && selectedDate && selectedTime && (
        <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl animate-fade-in">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Booking Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-white/40">Service</span><span className="font-medium text-white/80">{selectedService.name}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Date</span><span className="font-medium text-white/80">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Time</span><span className="font-medium text-white/80">{selectedTime}</span></div>
            <div className="flex justify-between"><span className="text-white/40">Duration</span><span className="font-medium text-white/80">{selectedService.duration}</span></div>
            <div className="flex justify-between pt-2 border-t border-white/[0.05]"><span className="font-bold text-white/60">Total</span><span className="font-bold text-lg text-gold">₹{selectedService.price?.toLocaleString()}</span></div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!customerName || !customerPhone}
            id="confirm-booking-btn"
            className={`w-full mt-4 py-3 rounded-none font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
              customerName && customerPhone
                ? 'btn-primary'
                : 'bg-white/[0.04] text-white/20 border border-white/10 cursor-not-allowed'
            }`}
          >
            <Check className="w-5 h-5" />
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
