'use client';

import { useState } from 'react';
import { Calendar, Clock, Check, ChevronRight, Sparkles, User, Phone, PartyPopper } from 'lucide-react';
import Link from 'next/link';

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
      <div className="text-center py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-2xl font-bold font-display text-gray-800 mb-2">Booking Confirmed! 🎉</h3>
        <p className="text-gray-500 mb-6">Your appointment has been booked successfully.</p>

        <div className="card-glass p-6 max-w-md mx-auto text-left space-y-3 mb-8">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Salon</span>
            <span className="text-sm font-bold text-gray-800">{salon.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Service</span>
            <span className="text-sm font-bold text-gray-800">{selectedService?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm font-bold text-gray-800">
              {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Time</span>
            <span className="text-sm font-bold text-gray-800">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Duration</span>
            <span className="text-sm font-bold text-gray-800">{selectedService?.duration}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-lg font-bold gradient-text">₹{selectedService?.price?.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
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
    <div className="space-y-6">
      <h3 className="text-xl font-bold font-display text-gray-800 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-rose-gold" />
        Book Appointment
      </h3>

      {/* Step 1: Select Service */}
      <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">1. Choose a Service</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {salon.services?.map((service, i) => (
            <button
              key={i}
              onClick={() => { setSelectedService(service); setStep(Math.max(step, 2)); }}
              id={`service-${i}`}
              className={`p-3 rounded-xl text-left transition-all duration-300 border ${
                selectedService?.name === service.name
                  ? 'border-rose-gold bg-rose-gold/5'
                  : 'border-gray-100 hover:border-rose-gold/30 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{service.name}</p>
                  <p className="text-xs text-gray-400">{service.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-gold">₹{service.price?.toLocaleString()}</p>
                  {selectedService?.name === service.name && (
                    <Check className="w-4 h-4 text-rose-gold ml-auto" />
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Select Date */}
      <div className={`transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">2. Pick a Date</h4>
        <div className="flex flex-wrap gap-2">
          {availableDates.map((date) => {
            const d = new Date(date);
            return (
              <button
                key={date}
                onClick={() => { setSelectedDate(date); setSelectedTime(''); setStep(Math.max(step, 3)); }}
                className={`px-4 py-3 rounded-xl text-center transition-all duration-300 border min-w-[80px] ${
                  selectedDate === date
                    ? 'border-rose-gold bg-rose-gold text-white'
                    : 'border-gray-100 hover:border-rose-gold/30 bg-white text-gray-700'
                }`}
              >
                <p className="text-xs font-medium">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                <p className="text-lg font-bold">{d.getDate()}</p>
                <p className="text-xs">{d.toLocaleDateString('en-IN', { month: 'short' })}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Select Time */}
      <div className={`transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          3. Choose Time Slot
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => { setSelectedTime(time); setStep(Math.max(step, 4)); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                selectedTime === time
                  ? 'border-rose-gold bg-rose-gold text-white'
                  : 'border-gray-100 hover:border-rose-gold/30 bg-white text-gray-700'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: Your Details */}
      <div className={`transition-all duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">4. Your Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
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
            <label className="text-xs text-gray-500 mb-1 block">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
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
        <div className="card-glass p-5 animate-fade-in">
          <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-gold" />
            Booking Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Service</span><span className="font-medium">{selectedService.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedTime}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span className="font-medium">{selectedService.duration}</span></div>
            <div className="flex justify-between pt-2 border-t border-gray-100"><span className="font-bold text-gray-700">Total</span><span className="font-bold text-lg gradient-text">₹{selectedService.price?.toLocaleString()}</span></div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!customerName || !customerPhone}
            id="confirm-booking-btn"
            className={`w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              customerName && customerPhone
                ? 'btn-primary'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
