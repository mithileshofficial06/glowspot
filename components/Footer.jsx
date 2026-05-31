import Link from 'next/link';
import { Scissors, MapPin, Heart, Instagram, Facebook, Twitter } from 'lucide-react';

const neighborhoods = [
  'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur', 'Gachibowli',
  'Kukatpally', 'Secunderabad', 'Begumpet', 'Ameerpet', 'Kondapur',
];

const quickLinks = [
  { href: '/advisor', label: 'AI Style Advisor' },
  { href: '/preview', label: 'Face Preview' },
  { href: '/planner', label: 'Wedding Planner' },
  { href: '/salons', label: 'Browse Salons' },
];

export default function Footer() {
  return (
    <footer className="bg-plum-deep text-white/80">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">GlowSpot</span>
            </div>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              AI-powered beauty salon marketplace built exclusively for Hyderabad. 
              Describe your look, preview it, and book the perfect salon.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-rose-gold/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-white/60" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">AI Features</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-rose-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Neighborhoods */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              <MapPin className="w-4 h-4 inline mr-1" />
              Neighborhoods
            </h3>
            <ul className="space-y-2">
              {neighborhoods.map((area) => (
                <li key={area}>
                  <Link
                    href={`/salons?area=${encodeURIComponent(area)}`}
                    className="text-sm text-white/60 hover:text-rose-gold transition-colors duration-300"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Powered By */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Powered By</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/40 mb-1">AI Engine</p>
                <p className="text-sm font-semibold text-white">NVIDIA NIM</p>
                <p className="text-xs text-white/50 mt-1">Llama 3.3 70B Instruct</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/40 mb-1">Vision AI</p>
                <p className="text-sm font-semibold text-white">Llama 3.2 90B Vision</p>
                <p className="text-xs text-white/50 mt-1">Face Analysis & Recommendations</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/40 mb-1">Framework</p>
                <p className="text-sm font-semibold text-white">Next.js 14</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              © 2026 GlowSpot Hyderabad. Built for SuperXgen AI Startup Buildathon.
            </p>
            <p className="text-xs text-white/40 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-gold fill-rose-gold" /> in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
