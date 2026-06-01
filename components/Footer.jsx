import Link from 'next/link';

const quickLinks = [
  { href: '/advisor', label: 'AI Advisor' },
  { href: '/preview', label: 'Style Preview' },
  { href: '/planner', label: 'Wedding Planner' },
  { href: '/salons', label: 'Browse Salons' },
];

const neighborhoods = [
  'Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur', 'Gachibowli',
  'Kukatpally', 'Secunderabad', 'Begumpet', 'Ameerpet', 'Kondapur',
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gold/[0.06] bg-[#080608]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span className="text-2xl font-display font-light text-ivory mb-4 block">
              Glow<span className="text-gold">Spot</span>
            </span>
            <p className="text-sm text-ivory/30 mb-6 leading-relaxed font-light">
              AI-powered beauty salon marketplace built exclusively for Hyderabad.
              Describe your look, preview it, and book the perfect salon.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-ivory/40 mb-5">
              Features
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ivory/30 hover:text-gold transition-colors duration-300 font-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Neighborhoods */}
          <div>
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-ivory/40 mb-5">
              Neighborhoods
            </h3>
            <ul className="space-y-2">
              {neighborhoods.map((area) => (
                <li key={area}>
                  <Link
                    href={`/salons?area=${encodeURIComponent(area)}`}
                    className="text-sm text-ivory/30 hover:text-gold transition-colors duration-300 font-light"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Powered By */}
          <div>
            <h3 className="text-xs font-body uppercase tracking-[0.2em] text-ivory/40 mb-5">
              Technology
            </h3>
            <div className="space-y-4">
              <div className="border border-gold/[0.06] p-4">
                <p className="text-xs text-ivory/25 mb-1 font-light">AI Engine</p>
                <p className="text-sm text-gold font-display">NVIDIA NIM</p>
                <p className="text-xs text-ivory/25 mt-1 font-light">Llama 3.3 70B Instruct</p>
              </div>
              <div className="border border-gold/[0.06] p-4">
                <p className="text-xs text-ivory/25 mb-1 font-light">Vision AI</p>
                <p className="text-sm text-mauve font-display">Llama 3.2 90B Vision</p>
                <p className="text-xs text-ivory/25 mt-1 font-light">Face Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/[0.04]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-ivory/20 font-light tracking-wider">
              2026 GlowSpot Hyderabad. Built for SuperXgen AI Startup Buildathon.
            </p>
            <p className="text-xs text-ivory/20 font-light tracking-wider">
              Crafted in Hyderabad
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
