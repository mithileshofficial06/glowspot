'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/advisor', label: 'Advisor' },
  { href: '/preview', label: 'Preview' },
  { href: '/planner', label: 'Planner' },
  { href: '/salons', label: 'Salons' },
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
          ? 'bg-[#080608]/90 border-b border-gold/[0.06] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo — Text Only */}
          <Link href="/" className="group" id="nav-logo">
            <span className="text-2xl font-display font-light tracking-wide text-ivory">
              Glow<span className="text-gold">Spot</span>
            </span>
          </Link>

          {/* Desktop Navigation — Minimal Text Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.label.toLowerCase()}`}
                  className={`relative text-sm tracking-[0.12em] uppercase font-body font-light transition-colors duration-300 ${
                    isActive
                      ? 'text-gold'
                      : 'text-ivory/40 hover:text-gold'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-gold/40" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-ivory/40 hover:text-gold transition-colors duration-300"
            id="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
          className={`absolute inset-0 bg-black/70 transition-opacity duration-500 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-72 bg-[#0e0c0e] border-l border-gold/[0.06] shadow-2xl transition-transform duration-500 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-8">
            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 text-ivory/30 hover:text-gold transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div className="mb-10 mt-2">
              <span className="text-2xl font-display font-light text-ivory">
                Glow<span className="text-gold">Spot</span>
              </span>
            </div>

            {/* Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-3 text-sm tracking-[0.12em] uppercase font-body font-light transition-all duration-300 border-l-2 ${
                      isActive
                        ? 'text-gold border-gold/40'
                        : 'text-ivory/40 hover:text-gold border-transparent hover:border-gold/20'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Bottom */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="gold-line-wide mb-4" />
              <p className="text-xs text-ivory/20 font-light tracking-wider">
                Hyderabad
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
