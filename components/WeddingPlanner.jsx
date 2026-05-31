'use client';

import { useState } from 'react';
import { Calendar, MapPin, DollarSign, Users, Sparkles, Loader2, Clock, ChevronRight, Check } from 'lucide-react';
import Link from 'next/link';
import salons from '@/data/salons.json';

const roles = ['Bride', 'Bridesmaid', 'Mother of the Bride', 'Guest', 'Groom'];
const areas = ['Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur', 'Gachibowli', 'Kukatpally', 'Secunderabad', 'Begumpet', 'Ameerpet', 'Kondapur'];

export default function WeddingPlanner() {
  const [formData, setFormData] = useState({
    role: '',
    weddingDate: '',
    budget: 25000,
    areas: [],
    notes: '',
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const toggleArea = (area) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }));
  };

  const generatePlan = async () => {
    setLoading(true);

    try {
      const salonContext = salons
        .filter((s) => formData.areas.length === 0 || formData.areas.includes(s.area))
        .map((s) => `${s.name} (${s.area}) - ${s.specializations.join(', ')} - ${s.priceRange}`)
        .join('\n');

      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          weddingDate: formData.weddingDate,
          budget: formData.budget,
          areas: formData.areas,
          notes: formData.notes,
          salonContext,
        }),
      });

      const data = await res.json();

      if (data.plan) {
        setPlan(data.plan);
      } else if (data.choices && data.choices[0]) {
        // Parse the AI response into structured plan
        const text = data.choices[0].message.content;
        setPlan({ raw: text, items: parseAIPlan(text) });
      } else {
        setPlan(generateFallbackPlan());
      }
    } catch (error) {
      setPlan(generateFallbackPlan());
    } finally {
      setLoading(false);
    }
  };

  const parseAIPlan = (text) => {
    // Simple parse: return raw text as structured items
    const lines = text.split('\n').filter((l) => l.trim());
    return lines;
  };

  const generateFallbackPlan = () => {
    const wDate = new Date(formData.weddingDate);
    const relevantSalons = salons.filter(
      (s) => formData.areas.length === 0 || formData.areas.includes(s.area)
    );
    const bridalSalon = relevantSalons.find((s) => s.tags.includes('bridal')) || relevantSalons[0];
    const skinSalon = relevantSalons.find((s) => s.specializations.some((sp) => sp.toLowerCase().includes('skin'))) || relevantSalons[1] || bridalSalon;
    const hairSalon = relevantSalons.find((s) => s.specializations.some((sp) => sp.toLowerCase().includes('hair'))) || relevantSalons[2] || bridalSalon;

    const items = [];
    const isBride = formData.role === 'Bride';

    if (isBride) {
      const d6 = new Date(wDate); d6.setDate(d6.getDate() - 42);
      items.push({ date: d6.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '6 weeks before', title: 'Start Pre-Bridal Skincare', desc: 'Begin monthly facials for glowing skin on your big day', salon: skinSalon?.name || 'Recommended Salon', area: skinSalon?.area || '', service: 'Pre-Bridal Facial', cost: 2000 });

      const d5 = new Date(wDate); d5.setDate(d5.getDate() - 28);
      items.push({ date: d5.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '4 weeks before', title: 'Hair Treatment Session', desc: 'Deep conditioning and hair spa to prep for styling', salon: hairSalon?.name || 'Recommended Salon', area: hairSalon?.area || '', service: 'Hair Spa + Treatment', cost: 2500 });

      const d4 = new Date(wDate); d4.setDate(d4.getDate() - 21);
      items.push({ date: d4.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '3 weeks before', title: 'Second Facial Session', desc: 'Follow-up facial for continued skin preparation', salon: skinSalon?.name || 'Recommended Salon', area: skinSalon?.area || '', service: 'Gold/Diamond Facial', cost: 2500 });

      const d3 = new Date(wDate); d3.setDate(d3.getDate() - 14);
      items.push({ date: d3.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '2 weeks before', title: 'Bridal Makeup Trial', desc: 'Test your bridal look and make adjustments', salon: bridalSalon?.name || 'Recommended Salon', area: bridalSalon?.area || '', service: 'Trial Makeup Session', cost: 3000 });

      const d2 = new Date(wDate); d2.setDate(d2.getDate() - 3);
      items.push({ date: d2.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '3 days before', title: 'Mehndi Application', desc: 'Bridal mehndi ceremony preparation', salon: bridalSalon?.name || 'Recommended Salon', area: bridalSalon?.area || '', service: 'Bridal Mehndi', cost: 4000 });

      const d1 = new Date(wDate); d1.setDate(d1.getDate() - 1);
      items.push({ date: d1.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '1 day before', title: 'Final Skin Prep & Threading', desc: 'Last-minute grooming and skin prep', salon: skinSalon?.name || 'Recommended Salon', area: skinSalon?.area || '', service: 'Cleanup + Threading + Waxing', cost: 1500 });

      items.push({ date: wDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: 'Wedding Day! 💍', title: 'Bridal Makeup & Styling', desc: 'The big day — complete bridal transformation', salon: bridalSalon?.name || 'Recommended Salon', area: bridalSalon?.area || '', service: 'Complete Bridal Package', cost: 12000 });
    } else {
      const d2 = new Date(wDate); d2.setDate(d2.getDate() - 7);
      items.push({ date: d2.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '1 week before', title: 'Hair & Skin Prep', desc: 'Hair spa and facial for event-ready look', salon: hairSalon?.name || 'Recommended Salon', area: hairSalon?.area || '', service: 'Hair Spa + Facial', cost: 2500 });

      const d1 = new Date(wDate); d1.setDate(d1.getDate() - 1);
      items.push({ date: d1.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: '1 day before', title: 'Grooming & Threading', desc: 'Final grooming and waxing session', salon: skinSalon?.name || 'Recommended Salon', area: skinSalon?.area || '', service: 'Threading + Waxing + Cleanup', cost: 1000 });

      items.push({ date: wDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), daysLeft: 'Event Day! 🎉', title: 'Party/Event Makeup', desc: `${formData.role} styling and makeup`, salon: bridalSalon?.name || 'Recommended Salon', area: bridalSalon?.area || '', service: 'Party Makeup + Hair Styling', cost: 5000 });
    }

    const totalCost = items.reduce((a, item) => a + item.cost, 0);

    return { items, totalCost };
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!plan ? (
        <div className="space-y-8">
          {/* Step 1: Role */}
          <div className={`card-glass p-6 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <h3 className="text-lg font-bold font-display text-gray-800 mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-rose-gold" />
              Your Role
            </h3>
            <p className="text-sm text-gray-500 mb-4">Who are you in the wedding?</p>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => { setFormData({ ...formData, role }); setStep(Math.max(step, 2)); }}
                  id={`role-${role.toLowerCase().replace(/\s/g, '-')}`}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    formData.role === role
                      ? 'bg-rose-gold text-white shadow-glow'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-gold/50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Date & Budget */}
          <div className={`card-glass p-6 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-lg font-bold font-display text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-gold" />
              Wedding Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Wedding Date</label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => { setFormData({ ...formData, weddingDate: e.target.value }); setStep(Math.max(step, 3)); }}
                  id="wedding-date"
                  className="input-styled"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Budget: <span className="text-rose-gold font-bold">₹{formData.budget.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="1000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                  id="budget-slider"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-gold"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>₹5,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Preferred Areas */}
          <div className={`card-glass p-6 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-lg font-bold font-display text-gray-800 mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-gold" />
              Preferred Areas
            </h3>
            <p className="text-sm text-gray-500 mb-4">Select areas where you'd like your salons (or skip for all Hyderabad)</p>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    formData.areas.includes(area)
                      ? 'bg-plum text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-plum/30'
                  }`}
                >
                  {formData.areas.includes(area) && <Check className="w-3 h-3 inline mr-1" />}
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className={`card-glass p-6 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label className="text-sm font-medium text-gray-700 block mb-2">Additional Notes (Optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="E.g., I prefer organic products, need home service for mehndi, want a South Indian bridal look..."
              rows={3}
              id="planner-notes"
              className="input-styled resize-none"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePlan}
            disabled={!formData.role || !formData.weddingDate || loading}
            id="generate-plan-btn"
            className={`w-full py-4 rounded-2xl text-lg font-bold transition-all duration-500 flex items-center justify-center gap-3 ${
              formData.role && formData.weddingDate && !loading
                ? 'btn-primary'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                AI is creating your beauty plan...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate My Wedding Beauty Plan
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-gold/10 text-rose-gold text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Generated Beauty Plan
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-800">
              Your {formData.role} Beauty Timeline
            </h2>
            <p className="text-gray-500 mt-2">
              Wedding: {new Date(formData.weddingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Timeline or Raw Plan */}
          {plan.items && Array.isArray(plan.items) && typeof plan.items[0] === 'object' ? (
            <>
              {/* Structured Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-gold via-gold to-plum" />

                <div className="space-y-6">
                  {plan.items.map((item, i) => (
                    <div key={i} className="relative flex gap-3 sm:gap-6 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                      {/* Timeline Dot */}
                      <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center shrink-0 shadow-glow">
                        <span className="text-xs font-bold text-white">{item.date?.split(' ')[0]}</span>
                      </div>

                      {/* Card */}
                      <div className="flex-1 card p-4 sm:p-5 mb-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] sm:text-xs font-medium text-rose-gold bg-rose-gold/10 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
                            {item.daysLeft}
                          </span>
                          <span className="text-sm font-bold text-gold">₹{item.cost?.toLocaleString()}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 text-base sm:text-lg font-display mb-1">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed">{item.desc}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-[10px] text-gray-400">Recommended Salon</p>
                            <p className="text-xs sm:text-sm font-semibold text-gray-800">{item.salon}</p>
                            {item.area && <p className="text-[10px] text-gray-400">{item.area}</p>}
                          </div>
                          <Link
                            href="/salons"
                            className="text-xs text-rose-gold font-medium flex items-center gap-1 hover:underline self-end sm:self-auto"
                          >
                            Book Now <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Summary */}
              {plan.totalCost && (
                <div className="card-glass p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Total</p>
                      <p className="text-3xl font-bold gradient-text font-display">₹{plan.totalCost.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Your Budget</p>
                      <p className="text-xl font-bold text-gray-800">₹{formData.budget.toLocaleString()}</p>
                      <p className={`text-sm font-medium ${plan.totalCost <= formData.budget ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {plan.totalCost <= formData.budget ? '✓ Within budget' : '⚠ Slightly over budget'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : plan.raw ? (
            <div className="card-glass p-6">
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{plan.raw}</p>
              </div>
            </div>
          ) : null}

          {/* Reset Button */}
          <button
            onClick={() => { setPlan(null); setStep(1); }}
            className="btn-secondary w-full flex items-center justify-center gap-2"
            id="new-plan-btn"
          >
            Create Another Plan
          </button>
        </div>
      )}
    </div>
  );
}
