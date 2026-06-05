import WeddingPlanner from '@/components/WeddingPlanner';
import { Calendar, Sparkles, Heart } from 'lucide-react';

export const metadata = {
  title: 'Wedding Beauty Planner — GlowSpot Hyderabad',
  description: 'Let AI create your complete wedding beauty schedule. From pre-bridal skincare to the big day — day-by-day plan with Hyderabad salon recommendations.',
};

export default function Planner() {
  return (
    <div className="min-h-screen pt-20 bg-noir text-white/90">
      {/* Header */}
      <div className="bg-gradient-to-r from-noir-50 via-noir-100 to-noir-200 border-b border-white/[0.04] py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-gold/5 animate-float"
              style={{
                width: `${16 + Math.random() * 20}px`,
                height: `${16 + Math.random() * 20}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            AI-Powered Wedding Beauty Planning
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
            Wedding Beauty Planner
          </h1>
          <p className="text-white/40 max-w-xl mx-auto">
            Tell us about your wedding and AI will create a complete day-by-day beauty schedule with Hyderabad salon recommendations — from skincare prep to the big day.
          </p>
        </div>
      </div>

      {/* Planner Component */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <WeddingPlanner />
      </div>
    </div>
  );
}
