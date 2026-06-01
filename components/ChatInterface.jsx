'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Sparkles, Bot, User, Loader2, MessageSquare, Flame, Lightbulb, HelpCircle, Volume2, VolumeX, Mic, MicOff, Star, Calendar, Check, CheckCircle } from 'lucide-react';
import SalonCard from './SalonCard';

// Zero-dependency canvas confetti explosion for successful bookings
function ConfettiCanvas() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Scale canvas to parent bounds
    canvas.width = canvas.parentElement.clientWidth || 400;
    canvas.height = canvas.parentElement.clientHeight || 300;
    
    let particles = [];
    const colors = ['#FFD700', '#FFBF00', '#FF4500', '#FF8C00', '#FF1493', '#00FF7F', '#00BFFF'];
    
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 5 + 3,
        d: Math.random() * canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.08 + 0.02,
        tiltAngle: 0
      });
    }
    
    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      
      particles = particles.filter(p => p.y < canvas.height);
      if (particles.length > 0) {
        animationId = requestAnimationFrame(draw);
      }
    };
    
    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />;
}
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
    if (aqi <= 50) return { label: 'Good', color: 'text-emerald-glow' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-neon-gold' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400' };
    return { label: 'Unhealthy', color: 'text-red-500' };
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

${weatherContext ? `\n\n${weatherContext} Use this weather context to suggest relevant treatments or care. E.g. if AQI is high, suggest charcoal facial; if humidity is high, suggest styling for curls/frizz.` : ''}`
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
        if (speakActive) speakText(aiContent);
        
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

        {weatherData && (
          <div className="hidden sm:flex items-center gap-3.5 bg-white/[0.02] border border-white/[0.05] px-3.5 py-1.5 rounded-full text-[10px] text-white/50 animate-fade-in font-medium select-none">
            <span className="flex items-center gap-1.5 font-body">
              ☀️ <strong className="text-white">{weatherData.temp}°C</strong> ({getWeatherDesc(weatherData.weatherCode)})
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5 font-body">
              🌫️ AQI: <strong className={getAQIDesc(weatherData.aqi).color}>{weatherData.aqi}</strong> ({getAQIDesc(weatherData.aqi).label})
            </span>
          </div>
        )}
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
                  <div className="card-glass border border-white/[0.08] bg-white/[0.02] p-5 rounded-2xl relative overflow-hidden shadow-xl text-white">
                    {msg.bookingState.confirmed ? (
                      <div className="text-center py-6 space-y-4 relative z-20">
                        <ConfettiCanvas />
                        <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-md">
                          <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold font-display text-white">Appointment Confirmed!</h4>
                          <p className="text-xs text-white/50 mt-1">Your reservation at {msg.bookingSalon.name} is successfully scheduled.</p>
                        </div>

                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 text-left space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Salon</span>
                            <span className="font-bold text-white">{msg.bookingSalon.name}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-white/40">Service</span>
                            <span className="font-bold text-neon-gold">{msg.bookingState.selectedService?.name}</span>
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
                            <span className="font-bold text-neon-gold">₹{msg.bookingState.selectedService?.price?.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <p className="text-[10px] text-white/30 italic">Confirmation code: GS-{msg.bookingSalon.id.substring(0,4).toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/[0.05] pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-neon-gold" />
                            <span className="text-sm font-bold font-display">Book at {msg.bookingSalon.name}</span>
                          </div>
                          <span className="text-[10px] text-neon-gold bg-neon-gold/10 border border-neon-gold/25 px-2 py-0.5 rounded-md font-bold animate-pulse">
                            Instant Slot Booking
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
                                className={`p-2.5 rounded-xl text-left border text-xs transition-all duration-300 ${
                                  msg.bookingState.selectedService?.name === service.name
                                    ? 'border-neon-gold bg-neon-gold/10 text-white'
                                    : 'border-white/[0.06] bg-white/[0.01] hover:border-white/20 text-white/70'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="font-semibold">{service.name}</p>
                                    <p className="text-[10px] text-white/40">{service.duration}</p>
                                  </div>
                                  <span className="font-bold text-neon-gold">₹{service.price}</span>
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
                                    className={`px-3 py-2 rounded-xl text-center border text-xs min-w-[70px] shrink-0 transition-all ${
                                      msg.bookingState.selectedDate === date
                                        ? 'border-neon-gold bg-neon-gold text-black font-bold'
                                        : 'border-white/[0.06] bg-white/[0.01] text-white/70 hover:border-white/20'
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
                                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                                    msg.bookingState.selectedTime === time
                                      ? 'border-neon-gold bg-neon-gold text-black font-bold'
                                      : 'border-white/[0.06] bg-white/[0.01] text-white/70 hover:border-white/20'
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
                                className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-neon-gold animate-fade-in"
                              />
                              <input
                                type="tel"
                                placeholder="Phone Number"
                                value={msg.bookingState.customerPhone}
                                onChange={(e) => updateBookingState(i, { customerPhone: e.target.value })}
                                className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-neon-gold animate-fade-in"
                              />
                            </div>

                            <button
                              disabled={!msg.bookingState.customerName || !msg.bookingState.customerPhone}
                              onClick={() => updateBookingState(i, { confirmed: true })}
                              className={`w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                msg.bookingState.customerName && msg.bookingState.customerPhone
                                  ? 'bg-neon-gold text-black hover:brightness-110 shadow-glow'
                                  : 'bg-white/[0.03] text-white/20 cursor-not-allowed border border-white/[0.05]'
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
              placeholder={voiceActive ? "Listening to your voice..." : "Message GlowSpot AI..."}
              rows={1}
              id="chat-input"
              className="w-full pl-4 pr-32 py-3 bg-transparent resize-none outline-none text-sm text-white placeholder-white/30"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <div className="absolute right-3 bottom-2.5 flex items-center gap-2">
              {/* Speaker Toggle Button */}
              <button
                onClick={toggleSpeak}
                title={speakActive ? "Mute Voice Responses" : "Unmute Voice Responses"}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  speakActive
                    ? 'bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {speakActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Mic Button */}
              <button
                onClick={toggleVoice}
                title={voiceActive ? "Stop Listening" : "Start Voice Consult"}
                className={`p-2 rounded-xl transition-all duration-300 relative ${
                  voiceActive
                    ? 'bg-neon-gold text-black shadow-glow animate-pulse'
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {voiceActive ? (
                  <>
                    <Mic className="w-4 h-4" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </>
                ) : (
                  <MicOff className="w-4 h-4" />
                )}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                id="chat-send-btn"
                className={`p-2 rounded-xl transition-all duration-300 ${
                  input.trim() && !loading
                    ? 'bg-neon-gold text-black shadow-md hover:brightness-110'
                    : 'bg-white/[0.03] text-white/20 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-2 font-body">
            GlowSpot AI can make mistakes. Consider checking important salon info.
          </p>
        </div>
      </div>
    </div>
  );
}
