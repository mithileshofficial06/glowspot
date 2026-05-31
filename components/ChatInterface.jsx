'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, MessageSquare, Flame, Lightbulb, HelpCircle } from 'lucide-react';
import SalonCard from './SalonCard';
import salons from '@/data/salons.json';

const suggestions = [
  { text: "Bridal Makeup for a Telugu wedding", category: "Wedding", icon: Flame },
  { text: "Premium Hair Spa near Hitech City", category: "Trending", icon: Lightbulb },
  { text: "Home service for facial and grooming", category: "Convenient", icon: Sparkles },
  { text: "Trendy haircut at premium Madhapur salon", category: "Style Guide", icon: HelpCircle },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am your GlowSpot beauty advisor. Tell me your occasion, budget, or the look you want — I will find the perfect Hyderabad salon for you. What are you looking for today?"
    }
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
        content: "Hi! I am your GlowSpot beauty advisor. Tell me your occasion, budget, or the look you want — I will find the perfect Hyderabad salon for you. What are you looking for today?"
      }
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
          content: `You are GlowSpot AI, a premium beauty salon advisor and personal stylist for Hyderabad. You help users find the perfect salon, recommend styles, and book appointments.

Here are the salons in our Hyderabad database:
${salonContext}

Guidelines:
- CRITICAL: If the user mentions an upcoming event, wedding, marriage, function, or service request, DO NOT directly suggest specific salons or make final service recommendations on the first turn.
- Instead, congratulate them warmly and ask 2-3 warm, targeted questions to understand their needs (e.g. preferred look like traditional vs modern, skin type, hair texture, budget range, or favorite neighborhood in Hyderabad).
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
    <div className="flex flex-col h-full bg-noir select-none">
      {/* Top Action Bar */}
      <div className="px-6 py-4 border-b border-white/[0.04] flex items-center justify-between bg-noir shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neon-gold fill-neon-gold/25" />
          <span className="font-bold font-display text-white text-sm md:text-base">GlowSpot AI</span>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-white/50 hover:text-white transition-colors font-semibold"
            >
              Clear Chat
            </button>
          )}
          <a
            href="/salons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-xl bg-neon-gold/10 border border-neon-gold/20 hover:bg-neon-gold text-neon-gold hover:text-black transition-all font-semibold flex items-center gap-1 shadow-sm"
          >
            Salons ↗
          </a>
        </div>
      </div>

      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto w-full space-y-6">
          {/* Message Log */}
          {messages.map((msg, i) => (
            <div key={i} className="space-y-4">
              <div
                className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-gold to-neon-amber flex items-center justify-center shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-black" />
                  </div>
                )}
                <div
                  className={msg.role === 'user' ? 'chat-bubble-user shadow-md' : 'chat-bubble-ai'}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Suggestions Cards inline right below the greeting message */}
              {i === 0 && msg.role === 'assistant' && messages.length === 1 && (
                <div className="pl-11 pr-4 animate-fade-in-up">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-3">Quick Suggestions:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                    {suggestions.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleSend(item.text)}
                          className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:border-neon-gold/20 hover:bg-white/[0.03] transition-all duration-300 text-left flex items-start justify-between group shadow-sm"
                        >
                          <div>
                            <span className="text-[9px] font-bold text-neon-gold uppercase tracking-wider bg-neon-gold/10 border border-neon-gold/20 px-2 py-0.5 rounded-md mb-2 inline-block">
                              {item.category}
                            </span>
                            <span className="text-xs text-white font-semibold leading-snug block">
                              {item.text}
                            </span>
                          </div>
                          <Icon className="w-4 h-4 text-white/20 group-hover:text-neon-gold transition-colors shrink-0 ml-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommended Salon Cards Inline inside the specific message */}
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
            <div className="flex items-center gap-2 pl-11 animate-fade-in text-xs text-neon-gold font-semibold">
              <Sparkles className="w-4 h-4 text-neon-gold animate-spin" />
              <span>GlowSpot AI is thinking</span>
              <div className="typing-indicator !p-0 !py-1 flex gap-1">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Centered Floating Input Bar (ChatGPT/Gemini Style) */}
      <div className="p-4 bg-noir shrink-0">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex gap-3 items-end relative border border-white/[0.06] rounded-3xl bg-white/[0.02] backdrop-blur-md p-2 shadow-lg focus-within:border-neon-gold/40 focus-within:ring-2 focus-within:ring-neon-gold/10 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message GlowSpot AI..."
              rows={1}
              id="chat-input"
              className="w-full pl-4 pr-12 py-3 bg-transparent resize-none outline-none text-sm text-white placeholder-white/30"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              id="chat-send-btn"
              className={`absolute right-3 bottom-3 p-2.5 rounded-full transition-all duration-300 ${
                input.trim() && !loading
                  ? 'bg-neon-gold text-black shadow-md hover:brightness-110'
                  : 'bg-white/[0.03] text-white/20 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-2 font-body">
            GlowSpot AI can make mistakes. Consider checking important salon info.
          </p>
        </div>
      </div>
    </div>
  );
}
