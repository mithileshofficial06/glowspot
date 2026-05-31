'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import SalonCard from './SalonCard';
import salons from '@/data/salons.json';

const suggestions = [
  "Bridal Makeup", 
  "Hair Spa", 
  "Near Hitech City", 
  "Under ₹1000", 
  "Home Service", 
  "Men's Grooming",
  "Party Makeup", 
  "Keratin Treatment", 
  "Mehndi"
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "✨ Welcome to GlowSpot AI! I'm your personal beauty advisor for Hyderabad.\n\nTell me about your occasion, style preference, budget, and preferred area — I'll recommend the perfect salon and look for you.\n\nTry something like: \"I need bridal makeup for my wedding next week in Banjara Hills under ₹15,000\"",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const findMatchingSalons = (text) => {
    const lower = text.toLowerCase();
    return salons.filter((s) => {
      const matchArea = s.area.toLowerCase().split(' ').some((w) => lower.includes(w.toLowerCase()));
      const matchSpec = s.specializations.some((sp) => lower.includes(sp.toLowerCase()));
      const matchTag = s.tags.some((t) => lower.includes(t));
      const matchName = lower.includes(s.name.toLowerCase());
      return matchArea || matchSpec || matchTag || matchName;
    }).slice(0, 3);
  };
  
  const hasRecommendationIntent = (userText) => {
    const lower = userText.toLowerCase();
    return (
      lower.includes('recommend') ||
      lower.includes('suggest') ||
      lower.includes('list') ||
      lower.includes('seek') ||
      lower.includes('find') ||
      lower.includes('show') ||
      lower.includes('where') ||
      lower.includes('book')
    );
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "✨ Welcome to GlowSpot AI! I'm your personal beauty advisor for Hyderabad.\n\nTell me about your occasion, style preference, budget, and preferred area — I'll recommend the perfect salon and look for you.",
      },
    ]);
  };

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const salonContext = salons.map(s =>
        `${s.name} (${s.area}) - ${s.specializations.join(', ')} - ${s.priceRange} - Rating: ${s.rating} - ${s.homeService ? 'Home service available' : 'In-salon only'}`
      ).join('\n');

      const apiMessages = [
        {
          role: 'system',
          content: `You are GlowSpot AI, a beauty salon advisor for Hyderabad. You help users find the perfect salon, recommend styles, and book appointments.

Here are the salons in our Hyderabad database:
${salonContext}

Guidelines:
- CRITICAL: If the user mentions an upcoming event, wedding, marriage, function, or service request, DO NOT directly suggest specific salons or make final service recommendations on the first turn.
- Instead, congratulate them warmly and ask 2-3 warm, targeted questions to understand their needs (e.g. style feel like traditional vs modern, skin type, hair texture, budget range, or favorite neighborhood in Hyderabad).
- Act as a true consultative beauty advisor: gather insights first and only suggest specific salons once you have their answers, or if they explicitly request: "recommend a salon" or "list the options".
- Recommend specific salons ONLY when the user asks for suggestions, lists, or to find/book options.
- If they ask general questions (e.g. "who are you?", "how many shops are there?"), answer the question directly and warmly, and do NOT list salons unless they ask.
- Include salon name, area, relevant services, and price range when recommending.
- Be warm, professional, and knowledgeable about Hyderabad neighborhoods.
- Keep responses concise but helpful (max 3 paragraphs).
- Always end your response with one engaging follow-up question (e.g., "Would you like to see home service options too?", "Want me to check Sunday availability for these?", "Should I include men's grooming salons as well?").
- Use emojis sparingly for warmth.`
        },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.choices && data.choices[0]) {
        const aiContent = data.choices[0].message.content;
        
        // Find matching salons inline only if user asked for recommendations
        const matched = hasRecommendationIntent(text) ? findMatchingSalons(aiContent + ' ' + text) : [];
        setMessages((prev) => [...prev, { role: 'assistant', content: aiContent, salons: matched }]);
      } else {
        // Fallback if API fails
        const matched = hasRecommendationIntent(text) ? findMatchingSalons(text) : [];
        const fallback = matched.length > 0
          ? `Perfect! Here are 3 top-rated salons in Hyderabad that fit your style: `
          : "I'd love to help! Tell me a little more: What kind of function? Are you the bride, guest, or bridesmaid? Any specific services in mind — makeup, hair, mehndi, or a full package?";
        
        setMessages((prev) => [...prev, { role: 'assistant', content: fallback, salons: matched }]);
      }
    } catch (error) {
      // Fallback on catch
      const matched = hasRecommendationIntent(text) ? findMatchingSalons(text) : [];
      const fallback = "I'm having a little trouble right now. Here are our top-rated salons in Hyderabad while I get back on track:";
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback, salons: matched }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Top Action Bar */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-gold fill-rose-gold/25" />
          <span className="font-bold font-display text-gray-800 text-sm md:text-base">GlowSpot AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="text-xs px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-rose-gold/10 text-gray-500 hover:text-rose-gold transition-colors font-medium border border-gray-100"
          >
            Clear Chat
          </button>
          <a
            href="/salons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-xl bg-rose-gold/5 hover:bg-rose-gold text-rose-gold hover:text-white transition-all font-medium border border-rose-gold/10 flex items-center gap-1"
          >
            Salons ↗
          </a>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-4">
            <div
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={msg.role === 'user' ? 'chat-bubble-user shadow-md' : 'chat-bubble-ai'}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-plum to-plum-light flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Inline Salon Cards bound to this specific message */}
            {msg.salons && msg.salons.length > 0 && (
              <div className="pl-11 animate-fade-in-up w-full">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-x-visible md:pb-0">
                  {msg.salons.map((salon) => (
                    <div key={salon.id} className="w-[285px] md:w-auto shrink-0 md:shrink snap-start">
                      <SalonCard salon={salon} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex items-center gap-2 pl-11 animate-fade-in text-xs text-rose-gold font-medium">
            <Sparkles className="w-4 h-4 text-gold animate-spin" />
            <span>GlowSpot AI is thinking</span>
            <div className="typing-indicator !p-0 !py-1 flex gap-1">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 mb-2">Try asking:</p>
          <div className="flex gap-2 overflow-x-auto pb-2 md:flex-wrap md:overflow-x-visible md:pb-0 no-scrollbar">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="text-xs px-3 py-2 rounded-xl bg-rose-gold/5 text-rose-gold hover:bg-rose-gold/10 border border-rose-gold/10 transition-all duration-300 hover:scale-105 shrink-0 md:shrink"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="border-t border-gray-100 p-4 bg-white/50 backdrop-blur-sm shrink-0">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you're looking for..."
              rows={1}
              id="chat-input"
              className="input-styled resize-none pr-4 text-sm"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            id="chat-send-btn"
            className={`p-3 rounded-xl transition-all duration-300 ${
              input.trim() && !loading
                ? 'btn-primary'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
