import ChatInterface from '@/components/ChatInterface';
import { MessageCircle, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'AI Style Advisor — GlowSpot Hyderabad',
  description: 'Chat with our AI to get personalized beauty and salon recommendations for Hyderabad. Describe your occasion, budget, and preferences.',
};

export default function Advisor() {
  return (
    <div className="fixed inset-0 z-40 pt-20 bg-noir flex flex-col overflow-hidden">
      {/* Full Viewport Chat Workspace Container */}
      <div className="flex-1 w-full flex flex-col overflow-hidden relative">
        <ChatInterface />
      </div>
    </div>
  );
}
