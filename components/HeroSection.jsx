'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import HeroBackgroundAnimation from './HeroBackgroundAnimation';

const headlineWords = ['Discover', 'the', 'Art', 'of', 'Beauty', 'in', 'Hyderabad'];

export default function HeroSection() {
  const [visibleWords, setVisibleWords] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Sequential word reveal
    const wordTimer = setInterval(() => {
      setVisibleWords((prev) => {
        if (prev >= headlineWords.length) {
          clearInterval(wordTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 140);

    // Show sub-content after headline completes
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, headlineWords.length * 140 + 400);

    return () => {
      clearInterval(wordTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Dynamic Animated Canvas Background */}
      <HeroBackgroundAnimation />

      {/* Two-Column Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column — Text */}
          <div>
            {/* Overline */}
            <div
              className={`mb-8 transition-all duration-700 ${
                showContent ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-xs tracking-[0.3em] uppercase text-gold/60 font-body font-light">
                AI-Powered Beauty Platform
              </span>
            </div>

            {/* Headline with word-by-word reveal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-light leading-[1.1] mb-8">
              {headlineWords.map((word, i) => (
                <span
                  key={i}
                  className={`inline-block mr-[0.3em] transition-all duration-500 ${
                    i < visibleWords
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                  } ${
                    word === 'Art' || word === 'Beauty'
                      ? 'text-gold italic'
                      : 'text-ivory'
                  }`}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Gold divider */}
            <div
              className={`gold-line mb-8 transition-all duration-700 delay-100 ${
                showContent ? 'opacity-100 w-12' : 'opacity-0 w-0'
              }`}
            />

            {/* Subheadline */}
            <p
              className={`text-lg text-ivory/40 font-light leading-relaxed max-w-md mb-10 transition-all duration-700 delay-200 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              Describe your look, preview it on your face, and book the perfect salon.
              Powered by AI that understands Indian beauty.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${
                showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <Link href="/salons" id="hero-cta-salons" className="btn-primary">
                Explore Salons
              </Link>
              <Link
                href="/advisor"
                id="hero-cta-advisor"
                className="group flex items-center gap-2 px-4 py-3 text-sm tracking-[0.1em] uppercase text-ivory/40 hover:text-gold transition-colors duration-300 font-light"
              >
                Consult AI Advisor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>

          {/* Right Column — Editorial Image */}
          <div
            className={`hidden lg:block transition-all duration-1000 delay-500 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img
                src="/hero-editorial.png"
                alt="Premium salon interior"
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080608] via-transparent to-[#080608]/30" />
              {/* Border frame */}
              <div className="absolute inset-3 border border-gold/10 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom subtle line */}
        <div
          className={`mt-20 transition-all duration-700 delay-700 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="gold-line-wide" />
          <div className="flex items-center justify-between mt-4 text-xs text-ivory/20 font-light tracking-wider">
            <span>25+ Verified Salons</span>
            <span>10 Neighborhoods</span>
            <span className="hidden sm:inline">5 AI Features</span>
          </div>
        </div>
      </div>
    </section>
  );
}
