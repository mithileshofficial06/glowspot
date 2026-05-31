'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X, Scissors, Eye, Calendar, MessageCircle, MapPin } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home', icon: Sparkles },
  { href: '/advisor', label: 'AI Advisor', icon: MessageCircle },
  { href: '/preview', label: 'Style Preview', icon: Eye },
  { href: '/planner', label: 'Wedding Planner', icon: Calendar },
  { href: '/salons', label: 'Salons', icon: MapPin },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" id="nav-logo">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold font-display gradient-text">GlowSpot</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-1 font-body">Hyderabad</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-rose-gold/10 text-rose-gold'
                      : 'text-gray-600 hover:text-rose-gold hover:bg-rose-gold/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* CTA Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              href="/advisor"
              id="nav-cta-book"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Book with AI
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-rose-gold hover:bg-rose-gold/5 transition-all duration-300"
            id="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-40 transition-all duration-500 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-plum-deep/50 backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-cream shadow-2xl transition-transform duration-500 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-rose-gold transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mb-8 mt-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display gradient-text">GlowSpot</span>
            </div>

            {/* Links */}
            <div className="space-y-2">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-rose-gold/10 text-rose-gold'
                        : 'text-gray-600 hover:text-rose-gold hover:bg-rose-gold/5'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-6">
              <Link
                href="/advisor"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full text-center text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Book with AI
              </Link>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-8 left-6 right-6">
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Serving Hyderabad
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
