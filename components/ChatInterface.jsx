'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';
import SalonCard from './SalonCard';
import salons from '@/data/salons.json';

const suggestions = [
  "Bridal makeup for a Telugu wedding in Banjara Hills",
  "Hair spa and coloring near Hitech City under ₹3000",
  "Home service for facial and waxing in Kukatpally",
  "Trendy haircut for men near Ameerpet",
  "Pre-bridal skincare package in Jubilee Hills",
  "Party makeup for Saturday evening in Madhapur",
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
  const [recommendedSalons, setRecommendedSalons] = useState([]);
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
  }, [messages]);

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

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setRecommendedSalons([]);

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
- CRITICAL: If the user mentions an upcoming event, occasion (e.g. "I'm having a marriage tomorrow", "I have a wedding", "I have a party"), or service requests, DO NOT directly suggest specific salons or make final service recommendations on the first turn.
- Instead, congratulate them warmly and ask 2-3 warm, targeted questions to understand their needs (e.g. preferred look like traditional vs modern, skin type, hair texture, budget range, or favorite neighborhood in Hyderabad).
- Act as a true consultative beauty advisor: gather insights first and only suggest specific salons once you have their answers, or if they explicitly request: "just list the options now".
- Recommend specific salons ONLY when the user asks for suggestions, lists, or to find options.
- If they ask general questions (e.g. "who are you?", "how many shops are there?"), answer the question directly and warmly, and do NOT list salons unless they ask.
- Include salon name, area, relevant services, and price range when recommending.
- Be warm, professional, and knowledgeable about Hyderabad neighborhoods.
- Keep responses concise but helpful (max 3 paragraphs).
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
        setMessages((prev) => [...prev, { role: 'assistant', content: aiContent }]);

        // Only recommend cards if the user has requested recommendations/finding
        if (hasRecommendationIntent(text)) {
          const matched = findMatchingSalons(aiContent + ' ' + text);
          setRecommendedSalons(matched);
        } else {
          setRecommendedSalons([]);
        }
      } else {
        // Fallback if API fails
        if (hasRecommendationIntent(text)) {
          const matched = findMatchingSalons(text);
          setRecommendedSalons(matched);
          const fallback = matched.length > 0
            ? `Based on your request, I'd recommend checking out **${matched.map(s => s.name).join(', ')}**. ${matched[0] ? `${matched[0].name} in ${matched[0].area} specializes in ${matched[0].specializations.join(', ')}.` : ''}\n\nI've shown the salon cards below — tap any to see details and book!`
            : "I'd love to help! Could you tell me more about what you're looking for?";
          setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
        } else {
          setRecommendedSalons([]);
          const fallback = "I'd love to help! How can I assist you with your beauty styling journey today?";
          setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
        }
      }
    } catch (error) {
      if (hasRecommendationIntent(text)) {
        const matched = findMatchingSalons(text);
        setRecommendedSalons(matched);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: matched.length > 0
              ? `I found some great options for you! Check out **${matched.map(s => s.name).join(', ')}** below.`
              : "I'd love to help you find the perfect salon! Could you tell me the area you prefer in Hyderabad and what service you're looking for?",
          },
        ]);
      } else {
        setRecommendedSalons([]);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: "I'd love to assist you! Feel free to ask me questions, seek style advice, or ask me to recommend the best local salons.",
          },
        ]);
      }
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
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-plum to-plum-light flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="chat-bubble-ai">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Salon Cards */}
        {recommendedSalons.length > 0 && (
          <div className="mt-4 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3 px-1">
              <Sparkles className="w-4 h-4 text-rose-gold" />
              <span className="text-sm font-semibold text-gray-700">Recommended Salons</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-x-visible md:pb-0">
              {recommendedSalons.map((salon) => (
                <div key={salon.id} className="w-[285px] md:w-auto shrink-0 md:shrink snap-start">
                  <SalonCard salon={salon} />
                </div>
              ))}
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
      <div className="border-t border-gray-100 p-4 bg-white/50 backdrop-blur-sm">
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
