import ChatInterface from '@/components/ChatInterface';
import { MessageCircle, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Style Advisor — GlowSpot Hyderabad',
  description: 'Chat with our AI to get personalized beauty and salon recommendations for Hyderabad. Describe your occasion, budget, and preferences.',
};

export default function Advisor() {
  return (
    <div className="min-h-screen pt-20 bg-cream flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-plum-deep via-plum to-rose-gold/30 py-6 md:py-10 px-4 shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs md:text-sm font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-gold-light" />
            Powered by Llama 3.3 70B
          </div>
          <h1 className="text-2xl md:text-4xl font-bold font-display text-white mb-2">
            AI Style Advisor
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto">
            Tell me about your occasion, style, and budget. I&apos;ll recommend the perfect look and find the best Hyderabad salon for you.
          </p>
        </div>
      </div>

      {/* Chat Interface Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col overflow-hidden relative" style={{ height: 'calc(100dvh - 280px)', minHeight: '400px' }}>
        <ChatInterface />
      </div>
    </div>
  );
}
