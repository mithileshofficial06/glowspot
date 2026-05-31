import HeroSection from '@/components/HeroSection';
import SalonCarousel from '@/components/SalonCarousel';
import salons from '@/data/salons.json';
import Link from 'next/link';
import { Sparkles, MessageCircle, Eye, Calendar, Star, MapPin, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const howItWorks = [
  { step: '01', title: 'Describe Your Look', desc: 'Tell our AI what you need — occasion, style, budget, area', icon: MessageCircle, color: 'from-neon-gold to-neon-amber' },
  { step: '02', title: 'Preview on Your Face', desc: 'Upload a selfie and see AI-recommended styles visualized', icon: Eye, color: 'from-violet-500 to-purple-600' },
  { step: '03', title: 'Get Matched', desc: 'AI finds the perfect Hyderabad salon for your specific look', icon: Sparkles, color: 'from-emerald-glow to-green-500' },
  { step: '04', title: 'Book Instantly', desc: 'Confirm your appointment in one tap with available time slots', icon: Calendar, color: 'from-emerald-500 to-teal-500' },
];

const neighborhoods = [
  { name: 'Banjara Hills', tagline: 'Luxury & Bridal', count: 3 },
  { name: 'Jubilee Hills', tagline: 'Celebrity Style', count: 3 },
  { name: 'Hitech City', tagline: 'Quick & Professional', count: 3 },
  { name: 'Madhapur', tagline: 'Affordable Quality', count: 3 },
  { name: 'Gachibowli', tagline: 'Modern & Trendy', count: 2 },
  { name: 'Kukatpally', tagline: 'Budget & Home Service', count: 3 },
  { name: 'Secunderabad', tagline: 'Heritage Mix', count: 2 },
  { name: 'Begumpet', tagline: 'Bridal Specialists', count: 2 },
  { name: 'Ameerpet', tagline: 'Student Friendly', count: 2 },
  { name: 'Kondapur', tagline: 'Family & Home Spa', count: 2 },
];

export default function Home() {
  const topSalons = [...salons].sort((a, b) => b.rating - a.rating).slice(0, 25);

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="how-it-works">
        <div className="text-center mb-14">
          <span className="tag-gold mb-4 inline-block">How It Works</span>
          <h2 className="section-heading gradient-text">Your Beauty Journey in 4 Steps</h2>
          <p className="section-subheading">From first thought to booked appointment — AI handles everything.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative card p-6 text-center group">
                {i < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-white/10" />
                  </div>
                )}
                <div className="text-xs font-bold text-neon-gold/40 mb-4">{item.step}</div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/35">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-20" id="featured-salons">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="tag mb-3 inline-block">Top Rated</span>
              <h2 className="section-heading gradient-text text-left">Featured Salons</h2>
              <p className="text-white/35 mt-2">Highest-rated beauty destinations in Hyderabad</p>
            </div>
            <Link href="/salons" className="btn-secondary hidden sm:flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <SalonCarousel salons={topSalons} />

        <div className="mt-8 text-center sm:hidden px-4">
          <Link href="/salons" className="btn-secondary inline-flex items-center gap-2">
            View All Salons <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-20 relative overflow-hidden" id="ai-features">
        <div className="absolute inset-0 bg-gradient-to-br from-noir-50 via-noir-100 to-noir-200 border-y border-white/[0.04]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 text-neon-gold" />
              Powered by NVIDIA NIM
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-white mb-4">
              5 AI Features. One Platform.
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Every feature is powered by Llama 3.3 70B and Llama 3.2 90B Vision — making your beauty journey smarter than ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'AI Style Advisor', desc: 'Conversational AI that understands your occasion, style, and budget to recommend the perfect look and salon.', Icon: MessageCircle, href: '/advisor', gradient: 'from-neon-gold to-neon-amber' },
              { title: 'Face Style Preview', desc: 'Vision AI analyzes your face shape, skin tone, and features to recommend hairstyles, makeup, and colors.', Icon: Eye, href: '/preview', gradient: 'from-violet-500 to-purple-600' },
              { title: 'Wedding Planner', desc: 'AI generates a complete day-by-day beauty schedule for your wedding with salon recommendations.', Icon: Calendar, href: '/planner', gradient: 'from-emerald-glow to-green-500' },
              { title: 'Smart Booking', desc: 'Type in natural language — "Book hair spa Sunday morning in Madhapur" — and AI handles the rest.', Icon: Zap, href: '/advisor', gradient: 'from-cyan-400 to-blue-500' },
              { title: 'Review Summarizer', desc: 'AI reads all reviews and gives you a 2-line verdict — what customers love and what to know before booking.', Icon: Sparkles, href: '/salons', gradient: 'from-neon-gold to-emerald-glow' },
            ].map((f, i) => (
              <Link
                key={i}
                href={f.href}
                className="group p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] hover:border-neon-gold/20 hover:bg-white/[0.04] transition-all duration-500"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <f.Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-display">{f.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm text-neon-gold font-medium group-hover:gap-2 transition-all">
                  Try it <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhood Explorer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="neighborhoods">
        <div className="text-center mb-14">
          <span className="tag mb-3 inline-block">
            <MapPin className="w-3 h-3 inline mr-1" />
            Explore
          </span>
          <h2 className="section-heading gradient-text">Salons Across Hyderabad</h2>
          <p className="section-subheading">10 neighborhoods. 25 verified salons. One city we love.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {neighborhoods.map((n, i) => (
            <Link
              key={i}
              href={`/salons?area=${encodeURIComponent(n.name)}`}
              className="card p-4 text-center group hover:bg-gradient-to-br hover:from-neon-gold/[0.03] hover:to-emerald-glow/[0.03]"
            >
              <div className="w-10 h-10 rounded-xl bg-neon-gold/5 border border-white/[0.05] flex items-center justify-center mx-auto mb-3 group-hover:bg-neon-gold/10 transition-colors">
                <MapPin className="w-5 h-5 text-neon-gold" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{n.name}</h4>
              <p className="text-xs text-white/30">{n.tagline}</p>
              <p className="text-xs text-neon-gold mt-1 font-medium">{n.count} salons</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-noir-100 to-noir-200 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '25+', label: 'Verified Salons' },
              { value: '10', label: 'Neighborhoods' },
              { value: '5', label: 'AI Features' },
              { value: '200+', label: 'Services Listed' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold gradient-text font-display">{s.value}</p>
                <p className="text-sm text-white/35 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center bg-gradient-to-br from-noir-100 via-noir-200 to-noir-300 border border-white/[0.05]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-64 h-64 rounded-full bg-neon-gold/5 blur-3xl -top-10 -right-10 animate-float" />
            <div className="absolute w-48 h-48 rounded-full bg-emerald-glow/5 blur-3xl bottom-10 -left-10 animate-float" style={{ animationDelay: '3s' }} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
              Ready to Find Your Perfect Look?
            </h2>
            <p className="text-lg text-white/60 max-w-xl mx-auto mb-8">
              Don&apos;t just book a salon — see your look before you go, and let AI plan your entire beauty journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/advisor" className="btn-gold px-8 py-4 text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start with AI Advisor
              </Link>
              <Link href="/salons" className="px-8 py-4 rounded-xl text-lg font-semibold text-white border-2 border-white/20 hover:border-white/40 transition-all">
                Browse Salons
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
