import ChatInterface from '@/components/ChatInterface';
import { MessageCircle, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Style Advisor — GlowSpot Hyderabad',
  description: 'Chat with our AI to get personalized beauty and salon recommendations for Hyderabad. Describe your occasion, budget, and preferences.',
};

export default function Advisor() {
  return (
    <div className="min-h-screen pt-20 bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-plum-deep via-plum to-rose-gold/30 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 text-gold-light" />
            Powered by Llama 3.3 70B
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
            AI Style Advisor
          </h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Tell me about your occasion, style, and budget. I&apos;ll recommend the perfect look and find the best Hyderabad salon for you.
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto" style={{ height: 'calc(100vh - 280px)' }}>
        <ChatInterface />
      </div>
    </div>
  );
}
