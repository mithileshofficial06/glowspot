'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Bot, User, Loader2, MessageSquare, Flame, Lightbulb, HelpCircle, Volume2, VolumeX, Mic, MicOff, Star, Calendar, Check, CheckCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import SalonCard from './SalonCard';
import { useProfileStore } from '@/store/useProfileStore';
import { useToast } from './ToastProvider';

// Dynamic import: BookingConfirmation with ssr: false
const BookingConfirmation = dynamic(() => import('./BookingConfirmation'), {
  ssr: false,
  loading: () => (
    <div className="py-6 flex flex-col items-center gap-3">
      <div className="w-16 h-16 skeleton-shimmer rounded-full" />
      <div className="h-4 w-40 skeleton-shimmer" />
    </div>
  ),
});

import salons from '@/data/salons.json';

const suggestions = [
  { text: "Bridal Makeup for a Telugu wedding" },
  { text: "Premium Hair Spa near Hitech City" },
  { text: "Home service for facial and grooming" },
  { text: "Trendy haircut at premium Madhapur salon" },
];

// Skeleton loader component for AI thinking state
function SkeletonThinking() {
  return (
    <div className="flex gap-3 justify-start animate-fade-in">
      <div className="w-7 h-7 border border-gold/20 flex items-center justify-center shrink-0">
        <Bot className="w-3.5 h-3.5 text-gold" />
      </div>
      <div className="chat-bubble-ai space-y-2 min-w-[180px]">
        <div className="h-3 w-[85%] skeleton-shimmer" />
        <div className="h-3 w-[65%] skeleton-shimmer" />
        <div className="h-3 w-[45%] skeleton-shimmer" />
      </div>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I am your GlowSpot beauty advisor. Tell me your occasion, budget, or the look you want — I will find the perfect Hyderabad salon for you. What are you looking for today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Zustand profile store
  const profile = useProfileStore();
  // Toast
  const { toast } = useToast();

  // Weather & AQI States
  const [weatherData, setWeatherData] = useState(null);

  // Speech Recognition & Synthesis States
  const [voiceActive, setVoiceActive] = useState(false);
  const [speakActive, setSpeakActive] = useState(false);
  const recognitionRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Fetch Hyderabad Weather & AQI from Open-Meteo
  useEffect(() => {
    const fetchWeatherAndAQI = async () => {
      try {
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=17.3850&longitude=78.4867&current=temperature_2m,relative_humidity_2m,weather_code');
        const aqiRes = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=17.3850&longitude=78.4867&current=pm2_5,pm10,us_aqi');
        
        if (weatherRes.ok && aqiRes.ok) {
          const weather = await weatherRes.json();
          const aqi = await aqiRes.json();
          
          setWeatherData({
            temp: weather.current.temperature_2m,
            humidity: weather.current.relative_humidity_2m,
            aqi: aqi.current.us_aqi,
            pm2_5: aqi.current.pm2_5,
            weatherCode: weather.current.weather_code
          });
        }
      } catch (err) {
        console.error('Error fetching weather/AQI:', err);
      }
    };
    fetchWeatherAndAQI();
  }, []);

  const getWeatherDesc = (code) => {
    if (code === 0) return 'Sunny / Clear';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy / Drizzle';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95 && code <= 99) return 'Thunderstorm';
    return 'Clear';
  };

  const getAQIDesc = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-gold' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-gold-muted' };
    if (aqi <= 150) return { label: 'Sensitive', color: 'text-mauve' };
    return { label: 'Unhealthy', color: 'text-mauve-dark' };
  };

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-IN';
        
        rec.onstart = () => {
          setVoiceActive(true);
        };
        
        rec.onend = () => {
          setVoiceActive(false);
        };
        
        rec.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSend(transcript);
        };
        
        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.");
      return;
    }
    if (voiceActive) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Speak the first sentence or first 160 characters
      const cleanText = text.replace(/[*#]/g, ''); // strip markdown chars
      const shortText = cleanText.split('\n')[0].substring(0, 160);
      
      const utterance = new SpeechSynthesisUtterance(shortText);
      utterance.lang = 'en-IN';
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSpeak = () => {
    if (speakActive) {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    }
    setSpeakActive(!speakActive);
  };

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

  const triggerInlineBooking = (salon) => {
    const bookingMessage = {
      role: 'assistant',
      content: `Let's book your appointment at **${salon.name}** (${salon.area}). Please select a service:`,
      bookingSalon: salon,
      bookingState: {
        step: 1,
        selectedService: null,
        selectedDate: '',
        selectedTime: '',
        customerName: '',
        customerPhone: '',
        confirmed: false
      }
    };
    setMessages(prev => [...prev, bookingMessage]);
  };

  const updateBookingState = (msgIdx, newState) => {
    setMessages(prev => {
      const updated = [...prev];
      updated[msgIdx] = {
        ...updated[msgIdx],
        bookingState: {
          ...updated[msgIdx].bookingState,
          ...newState
        }
      };
      // Fire toast on confirmation
      if (newState.confirmed) {
        setTimeout(() => {
          toast.success(`Appointment confirmed at ${updated[msgIdx].bookingSalon?.name}!`);
        }, 800);
      }
      return updated;
    });
  };

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage = { role: 'user', content: text };
    
    // Intercept booking intent
    const lowerText = text.toLowerCase();
    if (lowerText.includes('book') || lowerText.includes('appointment') || lowerText.includes('reserve') || lowerText.includes('booking')) {
      const matchedSalon = salons.find(s => 
        lowerText.includes(s.name.toLowerCase()) || 
        s.name.toLowerCase().split(' ').some(word => word.length > 3 && lowerText.includes(word))
      );
      
      if (matchedSalon) {
        setMessages(prev => [
          ...prev,
          userMessage,
          {
            role: 'assistant',
            content: `I've started an interactive booking for you at **${matchedSalon.name}** (${matchedSalon.area}). Let's select your service:`,
            bookingSalon: matchedSalon,
            bookingState: {
              step: 1,
              selectedService: null,
              selectedDate: '',
              selectedTime: '',
              customerName: '',
              customerPhone: '',
              confirmed: false
            }
          }
        ]);
        setInput('');
        return;
      }
    }

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const salonContext = salons.map(s =>
        `${s.name} (${s.area}) - ${s.specializations.join(', ')} - ${s.priceRange} - Rating: ${s.rating} - ${s.homeService ? 'Home service available' : 'In-salon only'}`
      ).join('\n');

      const weatherContext = weatherData
        ? `[Live Hyderabad Weather Info: Temp ${weatherData.temp}°C, Humidity ${weatherData.humidity}%, AQI ${weatherData.aqi} (${getAQIDesc(weatherData.aqi).label}), Condition: ${getWeatherDesc(weatherData.weatherCode)}]`
        : '';

      // Build profile context from Zustand store
      let profileContext = '';
      if (profile.faceShape || profile.skinTone) {
        profileContext = `\n\n[User Profile from Face Preview]
- Face Shape: ${profile.faceShape || 'Unknown'}
- Skin Tone: ${profile.skinTone || 'Unknown'}
- Gender: ${profile.gender || 'Unknown'}
${profile.features ? `- Features: ${profile.features}` : ''}
${profile.hairstyleRecommendations ? `- Recommended Hairstyles: ${profile.hairstyleRecommendations.map(r => r.style).join(', ')}` : ''}
${profile.weddingDate ? `- Wedding Date: ${profile.weddingDate}` : ''}
${profile.preferredArea ? `- Preferred Area: ${profile.preferredArea}` : ''}
Use this profile to personalize recommendations.`;
      }

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
- Use emojis sparingly for warmth.

${weatherContext ? `\n\n${weatherContext} Use this weather context to suggest relevant treatments or care. E.g. if AQI is high, suggest charcoal facial; if humidity is high, suggest styling for curls/frizz.` : ''}${profileContext}`
        },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      // SSE Streaming
      if (res.headers.get('Content-Type')?.includes('text/event-stream')) {
        setLoading(false);
        setStreaming(true);

        // Add an empty assistant message to accumulate tokens into
        setMessages(prev => [...prev, { role: 'assistant', content: '', salons: [] }]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.token) {
                fullContent += parsed.token;
                // Update the last message with accumulated content
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: fullContent,
                  };
                  return updated;
                });
              }
            } catch (e) {
              // skip
            }
          }
        }

        // After stream completes, attach salon matches
        const matched = hasRecommendationIntent(text) ? findMatchingSalons(fullContent + ' ' + text) : [];
        if (matched.length > 0) {
          toast.success(`Found ${matched.length} matching salon${matched.length > 1 ? 's' : ''} for you!`);
        }
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            salons: matched,
          };
          return updated;
        });

        if (speakActive && fullContent) speakText(fullContent);
        setStreaming(false);
      } else {
        // Fallback for non-streaming response
        const data = await res.json();

        if (data.choices && data.choices[0]) {
          const aiContent = data.choices[0].message.content;
          if (speakActive) speakText(aiContent);
          
          const matched = hasRecommendationIntent(text) ? findMatchingSalons(aiContent + ' ' + text) : [];
          if (matched.length > 0) {
            toast.success(`Found ${matched.length} matching salon${matched.length > 1 ? 's' : ''} for you!`);
          }
          setMessages((prev) => [...prev, { role: 'assistant', content: aiContent, salons: matched }]);
        } else {
          const matched = hasRecommendationIntent(text) ? findMatchingSalons(text) : [];
          const fallback = matched.length > 0
            ? `Perfect! Here are 3 top-rated salons in Hyderabad that fit your style: `
            : "I'd love to help! Tell me a little more: What kind of function? Are you the bride, guest, or bridesmaid? Any specific services in mind — makeup, hair, mehndi, or a full package?";
          
          setMessages((prev) => [...prev, { role: 'assistant', content: fallback, salons: matched }]);
        }
        setLoading(false);
      }
    } catch (error) {
      // Fallback on catch
      const matched = hasRecommendationIntent(text) ? findMatchingSalons(text) : [];
      const fallback = "I'm having a little trouble right now. Here are our top-rated salons in Hyderabad while I get back on track:";
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback, salons: matched }]);
      setLoading(false);
      setStreaming(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080608] select-none">
      {/* Top Action Bar */}
      <div className="px-6 py-4 border-b border-gold/[0.06] flex items-center justify-between bg-[#080608] shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-light text-ivory text-sm md:text-base">GlowSpot <span className="text-gold">AI</span></span>
        </div>

        {weatherData && (
          <div className="hidden sm:flex items-center gap-3 border border-gold/[0.06] px-3.5 py-1.5 text-[10px] text-ivory/40 animate-fade-in font-light select-none tracking-wider">
            <span className="font-body">
              {weatherData.temp}°C, {getWeatherDesc(weatherData.weatherCode)}
            </span>
            <span className="w-px h-3 bg-gold/10" />
            <span className="font-body">
              AQI: <span className={getAQIDesc(weatherData.aqi).color}>{weatherData.aqi}</span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-xs px-3 py-1.5 border border-gold/[0.08] hover:border-gold/20 text-ivory/40 hover:text-gold transition-colors font-light tracking-wider"
            >
              Clear
            </button>
          )}
          <a
            href="/salons"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 border border-gold/20 text-gold hover:bg-gold hover:text-[#080608] transition-all font-light tracking-wider"
          >
            Salons
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
                  <div className="w-7 h-7 border border-gold/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-gold" />
                  </div>
                )}
                <div
                  className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed font-light">
                    {msg.content}
                    {/* Streaming cursor */}
                    {streaming && i === messages.length - 1 && msg.role === 'assistant' && (
                      <span className="inline-block w-[2px] h-4 bg-gold ml-0.5 animate-pulse align-text-bottom" />
                    )}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 border border-ivory/15 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-ivory/50" />
                  </div>
                )}
              </div>

              {/* Suggestions Cards inline right below the greeting message */}
              {i === 0 && msg.role === 'assistant' && messages.length === 1 && (
                <div className="pl-11 pr-4 animate-fade-in-up">
                  <p className="text-[10px] text-ivory/30 uppercase tracking-[0.2em] font-light mb-3">Try asking</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl">
                    {suggestions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSend(item.text)}
                        className="p-3 border border-gold/[0.06] hover:border-gold/20 transition-all duration-300 text-left group"
                      >
                        <span className="text-xs text-ivory/50 font-light leading-snug block group-hover:text-gold transition-colors">
                          {item.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Salon Cards Inline inside the specific message */}
              {msg.salons && msg.salons.length > 0 && (
                <div className="pl-11 animate-fade-in-up w-full">
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-x-visible md:pb-0">
                    {msg.salons.map((salon) => (
                      <div key={salon.id} className="w-[285px] md:w-auto shrink-0 md:shrink snap-start">
                        <SalonCard 
                          salon={salon} 
                          onBook={(s) => triggerInlineBooking(s)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversational Slot Booking Card */}
              {msg.bookingSalon && msg.bookingState && (
                <div className="pl-11 mt-4 animate-fade-in-up max-w-2xl w-full">
                  <div className="border border-gold/[0.08] bg-[#0e0c0e] p-5 relative overflow-hidden text-ivory">
                    {msg.bookingState.confirmed ? (
                      <div className="relative z-20">
                        <BookingConfirmation salonName={msg.bookingSalon.name} />

                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-left space-y-2 mt-4">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Salon</span>
                            <span className="font-bold text-white">{msg.bookingSalon.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Service</span>
                            <span className="font-bold text-gold">{msg.bookingState.selectedService?.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Date</span>
                            <span className="font-bold text-white">
                              {new Date(msg.bookingState.selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Time</span>
                            <span className="font-bold text-white">{msg.bookingState.selectedTime}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/[0.06] text-xs">
                            <span className="text-white/40 font-semibold">Total Price</span>
                            <span className="font-bold text-gold">₹{msg.bookingState.selectedService?.price?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-white/30 italic text-center mt-3">Confirmation code: GS-{msg.bookingSalon.id.substring(0,4).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gold" />
                            <span className="text-sm font-display font-light">Book at {msg.bookingSalon.name}</span>
                          </div>
                          <span className="text-[10px] text-gold/60 tracking-[0.1em] uppercase font-light">
                            Instant Booking
                          </span>
                        </div>

                        {/* Step 1: Select Service */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-white/40 block mb-2">1. Select Service</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.bookingSalon.services?.slice(0, 4).map((service, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => updateBookingState(i, { selectedService: service, step: 2 })}
                                className={`p-2.5 text-left border text-xs transition-all duration-300 ${
                                  msg.bookingState.selectedService?.name === service.name
                                    ? 'border-gold bg-gold/5 text-ivory'
                                    : 'border-gold/[0.06] hover:border-gold/20 text-ivory/60'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">{service.name}</p>
                                    <p className="text-[10px] text-white/40">{service.duration}</p>
                                  </div>
                                  <span className="font-bold text-gold">₹{service.price}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Step 2: Select Date */}
                        {msg.bookingState.step >= 2 && (
                          <div className="animate-fade-in">
                            <span className="text-[10px] uppercase font-bold text-white/40 block mb-2">2. Choose Date</span>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                              {Object.keys(msg.bookingSalon.availability || {}).map((date) => {
                                const d = new Date(date);
                                return (
                                  <button
                                    key={date}
                                    onClick={() => updateBookingState(i, { selectedDate: date, selectedTime: '', step: 3 })}
                                    className={`px-3 py-2 text-center border text-xs min-w-[70px] shrink-0 transition-all ${
                                      msg.bookingState.selectedDate === date
                                        ? 'border-gold bg-gold text-[#080608] font-medium'
                                        : 'border-gold/[0.06] text-ivory/60 hover:border-gold/20'
                                    }`}
                                  >
                                    <p className="text-[9px] opacity-75">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</p>
                                    <p className="text-sm font-bold my-0.5">{d.getDate()}</p>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Step 3: Select Time */}
                        {msg.bookingState.step >= 3 && msg.bookingState.selectedDate && (
                          <div className="animate-fade-in">
                            <span className="text-[10px] uppercase font-bold text-white/40 block mb-2">3. Select Time Slot</span>
                            <div className="flex flex-wrap gap-1.5">
                              {(msg.bookingSalon.availability[msg.bookingState.selectedDate] || []).map((time) => (
                                <button
                                  key={time}
                                  onClick={() => updateBookingState(i, { selectedTime: time, step: 4 })}
                                  className={`px-3 py-1.5 border text-xs transition-all ${
                                    msg.bookingState.selectedTime === time
                                      ? 'border-gold bg-gold text-[#080608] font-medium'
                                      : 'border-gold/[0.06] text-ivory/60 hover:border-gold/20'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Step 4: Contact details */}
                        {msg.bookingState.step >= 4 && msg.bookingState.selectedTime && (
                          <div className="animate-fade-in space-y-3 pt-2 border-t border-white/[0.05]">
                            <span className="text-[10px] uppercase font-bold text-white/40 block">4. Your Details</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Your Name"
                                value={msg.bookingState.customerName}
                                onChange={(e) => updateBookingState(i, { customerName: e.target.value })}
                                className="bg-[#0e0c0e] border border-gold/[0.06] px-3 py-2 text-xs text-ivory placeholder-ivory/30 outline-none focus:border-gold animate-fade-in font-light"
                              />
                              <input
                                type="tel"
                                placeholder="Phone Number"
                                value={msg.bookingState.customerPhone}
                                onChange={(e) => updateBookingState(i, { customerPhone: e.target.value })}
                                className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-gold animate-fade-in"
                              />
                            </div>

                            <button
                              disabled={!msg.bookingState.customerName || !msg.bookingState.customerPhone}
                              onClick={() => updateBookingState(i, { confirmed: true })}
                              className={`w-full mt-3 py-2.5 text-xs tracking-[0.1em] uppercase font-light transition-all flex items-center justify-center gap-1.5 ${
                                msg.bookingState.customerName && msg.bookingState.customerPhone
                                  ? 'bg-gold text-[#080608] hover:brightness-110'
                                  : 'border border-gold/[0.06] text-ivory/20 cursor-not-allowed'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              Confirm Appointment (₹{msg.bookingState.selectedService?.price})
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Skeleton Thinking Indicator */}
          {loading && <SkeletonThinking />}
        </div>
      </div>

      {/* Centered Floating Input Bar (ChatGPT/Gemini Style) */}
      <div className="p-4 bg-[#080608] shrink-0">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex gap-3 items-end relative border border-gold/[0.08] bg-[#0e0c0e] p-2 focus-within:border-gold/30 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={voiceActive ? "Listening..." : "Message GlowSpot AI..."}
              rows={1}
              id="chat-input"
              className="w-full pl-4 pr-32 py-3 bg-transparent resize-none outline-none text-sm text-ivory placeholder-ivory/25 font-light"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-2.5 flex items-center gap-1.5">
              <button
                onClick={toggleSpeak}
                title={speakActive ? "Mute" : "Unmute"}
                className={`p-2 transition-all duration-300 ${
                  speakActive
                    ? 'text-gold border border-gold/20'
                    : 'text-ivory/25 hover:text-gold'
                }`}
              >
                {speakActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleVoice}
                title={voiceActive ? "Stop" : "Voice"}
                className={`p-2 transition-all duration-300 relative ${
                  voiceActive
                    ? 'bg-gold text-[#080608]'
                    : 'text-ivory/25 hover:text-gold'
                }`}
              >
                {voiceActive ? (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-mauve rounded-full animate-ping" />
                  </>
                ) : (
                  <MicOff className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading || streaming}
                id="chat-send-btn"
                className={`p-2 transition-all duration-300 ${
                  input.trim() && !loading && !streaming
                    ? 'bg-gold text-[#080608]'
                    : 'text-ivory/15 cursor-not-allowed'
                }`}
              >
                {(loading || streaming) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-ivory/20 text-center mt-2 font-light tracking-wider">
            GlowSpot AI can make mistakes. Verify salon details.
          </p>
        </div>
      </div>
    </div>
  );
}
