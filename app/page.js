'use client';

import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import SalonCarousel from '@/components/SalonCarousel';
import salons from '@/data/salons.json';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const howItWorks = [
  { step: '01', title: 'Describe Your Look', desc: 'Tell our AI what you need -- occasion, style, budget, preferred area' },
  { step: '02', title: 'Preview on Your Face', desc: 'Upload a selfie and see AI-recommended styles visualized on you' },
  { step: '03', title: 'Get Matched', desc: 'AI finds the perfect Hyderabad salon for your specific requirements' },
  { step: '04', title: 'Book Instantly', desc: 'Confirm your appointment with available time slots in one step' },
];

const aiFeatures = [
  { title: 'AI Style Advisor', desc: 'Conversational AI that understands your occasion, style, and budget to recommend the perfect look and salon.', href: '/advisor' },
  { title: 'Face Style Preview', desc: 'Vision AI analyzes your face shape, skin tone, and features to recommend hairstyles, makeup, and colors.', href: '/preview' },
  { title: 'Wedding Planner', desc: 'AI generates a complete day-by-day beauty schedule for your wedding with salon recommendations.', href: '/planner' },
  { title: 'Smart Booking', desc: 'Type in natural language and AI handles the rest -- finding salons, checking availability, confirming slots.', href: '/advisor' },
  { title: 'Review Intelligence', desc: 'AI reads all reviews and gives you a concise verdict -- what customers love and what to know.', href: '/salons' },
];

const neighborhoods = [
  'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur', 'Gachibowli',
  'Kukatpally', 'Secunderabad', 'Begumpet', 'Ameerpet', 'Kondapur',
];

export default function Home() {
  const topSalons = [...salons].sort((a, b) => b.rating - a.rating).slice(0, 8);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    const els = document.querySelectorAll('.scroll-reveal');
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* How It Works */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto" id="how-it-works">
        <div className="text-center mb-16 scroll-reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-gold/50 font-light mb-4">Process</p>
          <h2 className="section-heading">Your Beauty Journey</h2>
          <div className="gold-line mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {howItWorks.map((item, i) => (
            <div
              key={i}
              className="text-center scroll-reveal"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <span className="text-5xl font-display font-light text-gold/20 block mb-4">
                {item.step}
              </span>
              <h3 className="text-lg font-display font-light text-ivory mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-ivory/30 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-24 scroll-reveal" id="featured-salons">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold/50 font-light mb-3">Curated</p>
              <h2 className="section-heading text-left">Featured Salons</h2>
            </div>
            <Link href="/salons" className="hidden sm:flex items-center gap-2 text-sm text-ivory/30 hover:text-gold tracking-[0.1em] uppercase font-light transition-colors duration-300">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <SalonCarousel salons={topSalons} />

        <div className="mt-8 text-center sm:hidden px-6">
          <Link href="/salons" className="btn-secondary inline-flex items-center gap-2">
            View All Salons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-24 relative" id="ai-features">
        <div className="absolute inset-0 border-y border-gold/[0.04]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 scroll-reveal">
            <p className="text-xs tracking-[0.3em] uppercase text-mauve/60 font-light mb-4">
              Powered by NVIDIA NIM
            </p>
            <h2 className="section-heading">
              Five AI Features. One Platform.
            </h2>
            <p className="section-subheading mt-4">
              Every feature is powered by Llama 3.3 70B and Llama 3.2 90B Vision.
            </p>
            <div className="gold-line mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/[0.04]">
            {aiFeatures.map((f, i) => (
              <Link
                key={i}
                href={f.href}
                className="group bg-[#080608] p-8 hover:bg-noir-50 transition-colors duration-500 scroll-reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="text-3xl font-display font-light text-gold/15 block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-display font-light text-ivory mb-3 group-hover:text-gold transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="text-sm text-ivory/30 font-light leading-relaxed mb-4">
                  {f.desc}
                </p>
                <span className="text-xs text-gold/40 tracking-[0.1em] uppercase font-light group-hover:text-gold transition-colors duration-300 flex items-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto" id="neighborhoods">
        <div className="text-center mb-12 scroll-reveal">
          <p className="text-xs tracking-[0.3em] uppercase text-gold/50 font-light mb-3">Explore</p>
          <h2 className="section-heading">Across Hyderabad</h2>
          <div className="gold-line mx-auto mt-6" />
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 scroll-reveal">
          {neighborhoods.map((n, i) => (
            <Link
              key={i}
              href={`/salons?area=${encodeURIComponent(n)}`}
              className="text-sm text-ivory/30 hover:text-gold transition-colors duration-300 font-light tracking-wide"
            >
              {n}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats — Inline Text */}
      <section className="py-16 border-y border-gold/[0.04]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
            {[
              { value: '25+', label: 'Verified Salons' },
              { value: '10', label: 'Neighborhoods' },
              { value: '5', label: 'AI Features' },
              { value: '200+', label: 'Services' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl sm:text-4xl font-display font-light text-gold">
                  {s.value}
                </p>
                <p className="text-xs text-ivory/25 mt-1 tracking-[0.15em] uppercase font-light">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto scroll-reveal">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-light text-ivory mb-4">
            Ready to Find Your Perfect Look?
          </h2>
          <p className="text-base text-ivory/30 font-light mb-10 leading-relaxed">
            See your look before you go. Let AI plan your entire beauty journey across Hyderabad.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/advisor" className="btn-primary">
              Start with AI Advisor
            </Link>
            <Link href="/salons" className="btn-secondary">
              Browse Salons
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
