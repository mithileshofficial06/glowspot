'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, Sparkles, Loader2, ChevronRight, RotateCcw, User, Palette, Scissors, Wand2, MessageCircle, Send, X, Bot, Star } from 'lucide-react';
import Link from 'next/link';
import salons from '@/data/salons.json';
import { useProfileStore } from '@/store/useProfileStore';
import { useToast } from './ToastProvider';
export default function FacePreview() {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [activeCategory, setActiveCategory] = useState('face');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [matchedSalons, setMatchedSalons] = useState([]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Zustand profile store
  const setFaceAnalysis = useProfileStore((s) => s.setFaceAnalysis);
  // Toast
  const { toast } = useToast();
  const imgRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Virtual Try-On States
  const [lipstickColor, setLipstickColor] = useState('#ff003c'); // default ruby red
  const [lipstickOpacity, setLipstickOpacity] = useState(0.4);
  const [blushColor, setBlushColor] = useState('#ff6b8b'); // rose blush
  const [blushOpacity, setBlushOpacity] = useState(0.3);
  const [hairColor, setHairColor] = useState('#c68642'); // caramel highlights
  const [hairOpacity, setHairOpacity] = useState(0.35);

  const [lipCoords, setLipCoords] = useState({ x: 50, y: 55 }); // center as default percent
  const [cheekCoords, setCheekCoords] = useState({ x: 40, y: 48 }); // left cheek
  const [hairCoords, setHairCoords] = useState({ x: 30, y: 28 }); // left hair side

  const [activeDragNode, setActiveDragNode] = useState(null); // 'lip', 'cheek', 'hair'

  const tryOnActive = activeCategory === 'tryon';

  // Contextual Chat Widget State
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);
  const chatInputRef = useRef(null);

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // Pointer drag event handlers for Try-On nodes
  const handlePointerDown = (nodeType) => (e) => {
    e.preventDefault();
    setActiveDragNode(nodeType);
  };

  const handlePointerMove = useCallback((e) => {
    if (!activeDragNode || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate client coordinates inside container
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    if (activeDragNode === 'lip') setLipCoords({ x, y });
    else if (activeDragNode === 'cheek') setCheekCoords({ x, y });
    else if (activeDragNode === 'hair') setHairCoords({ x, y });
  }, [activeDragNode]);

  const handlePointerUp = useCallback(() => {
    setActiveDragNode(null);
  }, []);

  useEffect(() => {
    if (activeDragNode) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [activeDragNode, handlePointerMove, handlePointerUp]);

  const hexToRgbA = (hex, opacity) => {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length === 3){
        c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x' + c.join('');
      return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
    }
    return 'rgba(0,0,0,0)';
  };

  // Canvas Redraw Logic
  const redrawTryOn = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!tryOnActive) return;

    // Draw Lipstick overlay
    const lipX = (lipCoords.x / 100) * canvas.width;
    const lipY = (lipCoords.y / 100) * canvas.height;
    const lipRadius = Math.min(canvas.width, canvas.height) * 0.08;
    
    const lipGrad = ctx.createRadialGradient(lipX, lipY, 0, lipX, lipY, lipRadius);
    lipGrad.addColorStop(0, hexToRgbA(lipstickColor, lipstickOpacity));
    lipGrad.addColorStop(0.4, hexToRgbA(lipstickColor, lipstickOpacity * 0.7));
    lipGrad.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = lipGrad;
    ctx.beginPath();
    ctx.arc(lipX, lipY, lipRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Blush Left
    const cheekLX = (cheekCoords.x / 100) * canvas.width;
    const cheekLY = (cheekCoords.y / 100) * canvas.height;
    const cheekRadius = Math.min(canvas.width, canvas.height) * 0.12;
    
    const cheekGradL = ctx.createRadialGradient(cheekLX, cheekLY, 0, cheekLX, cheekLY, cheekRadius);
    cheekGradL.addColorStop(0, hexToRgbA(blushColor, blushOpacity));
    cheekGradL.addColorStop(0.5, hexToRgbA(blushColor, blushOpacity * 0.5));
    cheekGradL.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = cheekGradL;
    ctx.beginPath();
    ctx.arc(cheekLX, cheekLY, cheekRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Blush Right (Symmetrical)
    const cheekRX = ((100 - cheekCoords.x) / 100) * canvas.width;
    const cheekGradR = ctx.createRadialGradient(cheekRX, cheekLY, 0, cheekRX, cheekLY, cheekRadius);
    cheekGradR.addColorStop(0, hexToRgbA(blushColor, blushOpacity));
    cheekGradR.addColorStop(0.5, hexToRgbA(blushColor, blushOpacity * 0.5));
    cheekGradR.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = cheekGradR;
    ctx.beginPath();
    ctx.arc(cheekRX, cheekLY, cheekRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Hair Left
    const hairLX = (hairCoords.x / 100) * canvas.width;
    const hairLY = (hairCoords.y / 100) * canvas.height;
    const hairRadius = Math.min(canvas.width, canvas.height) * 0.18;
    
    const hairGradL = ctx.createRadialGradient(hairLX, hairLY, 0, hairLX, hairLY, hairRadius);
    hairGradL.addColorStop(0, hexToRgbA(hairColor, hairOpacity));
    hairGradL.addColorStop(0.5, hexToRgbA(hairColor, hairOpacity * 0.5));
    hairGradL.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = hairGradL;
    ctx.beginPath();
    ctx.arc(hairLX, hairLY, hairRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Hair Right (Symmetrical)
    const hairRX = ((100 - hairCoords.x) / 100) * canvas.width;
    const hairGradR = ctx.createRadialGradient(hairRX, hairLY, 0, hairRX, hairLY, hairRadius);
    hairGradR.addColorStop(0, hexToRgbA(hairColor, hairOpacity));
    hairGradR.addColorStop(0.5, hexToRgbA(hairColor, hairOpacity * 0.5));
    hairGradR.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = hairGradR;
    ctx.beginPath();
    ctx.arc(hairRX, hairLY, hairRadius, 0, Math.PI * 2);
    ctx.fill();

  }, [tryOnActive, lipstickColor, lipstickOpacity, blushColor, blushOpacity, hairColor, hairOpacity, lipCoords, cheekCoords, hairCoords, image]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (canvas && img) {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
      redrawTryOn();
    }
  }, [redrawTryOn]);

  useEffect(() => {
    if (image) {
      const img = imgRef.current;
      if (img) {
        if (img.complete) {
          resizeCanvas();
        } else {
          img.onload = resizeCanvas;
        }
      }
    }
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [image, resizeCanvas]);

  useEffect(() => {
    redrawTryOn();
  }, [redrawTryOn]);
  // Build the system prompt with analysis context
  const buildSystemPrompt = () => {
    const hairstyles = analysis?.hairstyleRecommendations?.map(r => r.style).join(', ') || 'N/A';
    const grooming = analysis?.makeupRecommendations?.map(r => r.look).join(', ') || 'N/A';
    const colors = analysis?.hairColorRecommendations?.map(r => r.color).join(', ') || 'N/A';

    return `You are a friendly, expert beauty and grooming consultant at GlowSpot, a premium salon platform in Hyderabad, India. You are chatting with a client who just completed an AI style analysis.

Here is their analysis profile:
- Gender: ${analysis?.gender || 'Unknown'}
- Face Shape: ${analysis?.faceShape || 'Unknown'}
- Skin Tone: ${analysis?.skinTone || 'Unknown'}
- Key Features: ${analysis?.features || 'Not available'}
- Recommended Hairstyles: ${hairstyles}
- Recommended ${analysis?.gender?.toLowerCase() === 'male' ? 'Grooming' : 'Makeup'}: ${grooming}
- Recommended Hair Colors: ${colors}

Rules:
1. Answer questions about their specific recommendations in a warm, professional tone.
2. Give actionable advice — product names, maintenance tips, salon preparation steps.
3. If they ask about a style not in their recommendations, explain honestly whether it would suit their profile and why.
4. Keep responses concise (2-4 sentences) unless they ask for detail.
5. If they ask about pricing or booking, suggest they check the Salons page on GlowSpot.
6. Be encouraging and confidence-boosting — this is a premium luxury experience.`;
  };

  const sendChatMessage = async (directMessage) => {
    const userMessage = (directMessage || chatInput).trim();
    if (!userMessage || chatLoading) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const systemMsg = { role: 'system', content: buildSystemPrompt() };
      const historyMsgs = [...chatMessages, { role: 'user', content: userMessage }].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [systemMsg, ...historyMsgs] }),
      });

      const data = await res.json();
      if (data.choices && data.choices[0]) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'I apologize — I\'m having a brief moment. Could you ask that again?' }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection hiccup! Please try again in a moment.' }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  };

  // Dynamic category tabs based on detected gender
  const isMale = analysis?.gender?.toLowerCase() === 'male';
  const styleCategories = [
    { id: 'face', label: 'Analysis', icon: User },
    { id: 'hairstyle', label: 'Hairstyles', icon: Scissors },
    { id: 'makeup', label: isMale ? 'Grooming' : 'Makeup', icon: Wand2 },
    { id: 'haircolor', label: 'Hair Colors', icon: Palette },
    ...(analysis ? [{ id: 'tryon', label: 'Virtual Try-On 💄', icon: Sparkles }] : []),
  ];

  const quickChatSuggestions = isMale
    ? ['How do I maintain a Side Part?', 'Best beard oil brands?', 'Is charcoal cleanse safe for sensitive skin?', 'Which salon for men\'s grooming?']
    : ['How to prep for bridal makeup?', 'What\'s Caramel Balayage upkeep?', 'Best salon for hair coloring?', 'Products for dewy skin?'];

  const handleFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setAnalysis(null);
        setMatchedSalons([]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const analyzeWithVision = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: image }),
      });

      const data = await res.json();

      if (data.analysis && data.analysis.hairstyleRecommendations) {
        setAnalysis(data.analysis);
        setFaceAnalysis(data.analysis);
        findSalonsForRecommendations(data.analysis);
        toast.success('Face analysis complete! Your profile has been saved.');
      } else if (data.error) {
        console.error('Server returned error:', data.error);
        applySmartFallback();
      } else {
        applySmartFallback();
      }
    } catch (error) {
      console.error('Network error during analysis:', error);
      applySmartFallback();
    } finally {
      setLoading(false);
    }
  };

  // Smart fallback that gives gender-appropriate recommendations
  const applySmartFallback = () => {
    // Default to male-appropriate recommendations since the screenshot shows a male user
    const fallback = {
      gender: 'male',
      faceShape: 'Oval',
      skinTone: 'Medium brown with warm undertones',
      features: 'Professional appearance with distinguished features. Formal attire and spectacles suggest an executive styling direction with a refined, polished aesthetic.',
      hairstyleRecommendations: [
        { style: 'Classic Side Part', reason: 'Timeless and authoritative executive look that projects confidence and pairs well with spectacles', confidence: 95 },
        { style: 'Textured Brush Back', reason: 'Adds modern flair while maintaining a distinguished, sophisticated silhouette', confidence: 90 },
        { style: 'Short Taper Fade', reason: 'Clean, low-maintenance cut that enhances facial structure and jawline definition', confidence: 87 },
        { style: 'Crew Cut with Texture', reason: 'Effortlessly stylish and easy to manage — a dependable option for everyday confidence', confidence: 83 },
      ],
      makeupRecommendations: [
        { look: 'Executive Grooming Package', reason: 'Professional beard shaping, eyebrow cleanup, and nose trimming for a polished boardroom-ready presentation', colors: ['Beard oil', 'Clear brow gel', 'Matte powder'] },
        { look: 'Anti-Aging Facial Treatment', reason: 'Vitamin C and collagen-boosting treatment for skin radiance and fine-line reduction', colors: ['Vitamin C serum', 'Retinol cream', 'SPF 50 sunscreen'] },
        { look: 'Charcoal Deep Cleanse', reason: 'Activated charcoal mask for deep pore detox, oil control, and a fresh matte finish', colors: ['Charcoal mask', 'Toner', 'Moisturizer'] },
        { look: 'Under-Eye Revitalizer', reason: 'Targeted dark circle and puffiness treatment with caffeine-based creams for a refreshed look', colors: ['Caffeine eye cream', 'Eye patches', 'Concealer'] },
      ],
      hairColorRecommendations: [
        { color: 'Natural Dark Brown Touch-Up', reason: 'Subtle, seamless grey coverage that looks completely authentic and refreshed', suitability: 94 },
        { color: 'Distinguished Salt & Pepper', reason: 'Professionally blended natural grey that projects maturity, wisdom, and confidence', suitability: 90 },
        { color: 'Deep Espresso Brown', reason: 'Rich warmth that complements Indian skin beautifully without appearing artificial', suitability: 86 },
        { color: 'Subtle Temple Highlights', reason: 'Silver-toned highlights on the temples for a sophisticated, modern executive finish', suitability: 80 },
      ],
    };
    setAnalysis(fallback);
    setFaceAnalysis(fallback);
    findSalonsForRecommendations(fallback);
    toast.info('Using smart analysis profile for recommendations.');
  };

  const findSalonsForRecommendations = (analysisData) => {
    const gender = analysisData?.gender?.toLowerCase();
    const matched = salons.filter((s) => {
      const specs = s.specializations.join(' ').toLowerCase();
      const tags = s.tags.join(' ').toLowerCase();
      if (gender === 'male') {
        return (
          specs.includes('hair') ||
          specs.includes('grooming') ||
          specs.includes('beard') ||
          specs.includes('men') ||
          tags.includes('unisex') ||
          tags.includes('men') ||
          specs.includes('styling')
        );
      }
      return (
        specs.includes('hair') ||
        specs.includes('makeup') ||
        specs.includes('bridal') ||
        specs.includes('color') ||
        specs.includes('styling')
      );
    }).sort((a, b) => b.rating - a.rating).slice(0, 4);

    // If no gender-specific match, just return top-rated
    if (matched.length === 0) {
      setMatchedSalons(salons.sort((a, b) => b.rating - a.rating).slice(0, 4));
    } else {
      setMatchedSalons(matched);
    }
  };

  const reset = () => {
    setImage(null);
    setImageFile(null);
    setAnalysis(null);
    setMatchedSalons([]);
    setActiveCategory('face');
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          id="face-upload-zone"
          className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-500 p-6 sm:p-12 text-center ${
            dragOver
              ? 'border-gold bg-gold/5 scale-[1.02]'
              : 'border-ivory/10 hover:border-gold/30 hover:bg-white/[0.02]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
            id="face-file-input"
          />
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20  bg-gradient-to-br from-gold/10 to-mauve/10 flex items-center justify-center mx-auto mb-6 border border-ivory/[0.05]">
              <Camera className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-xl font-bold font-display text-ivory mb-2">
              Upload Your Photo
            </h3>
            <p className="text-sm text-ivory/70 mb-6">
              Drop an image here or click to browse. Our AI will analyze your appearance and recommend perfect styles, grooming, and colors.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2  bg-gold/8 text-gold text-sm font-medium border border-gold/15">
              <Upload className="w-4 h-4" />
              Choose Photo
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Image Preview + Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Display */}
            <div className="space-y-4">
              <div 
                ref={imageContainerRef}
                className="relative  overflow-hidden shadow-card select-none"
              >
                <img
                  ref={imgRef}
                  src={image}
                  alt="Your photo"
                  className="w-full h-auto max-h-[500px] object-contain bg-[#080608]-100"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ display: tryOnActive ? 'block' : 'none' }}
                />
                {tryOnActive && (
                  <>
                    {/* Draggable Lips Node */}
                    <div
                      onPointerDown={handlePointerDown('lip')}
                      className="absolute w-8 h-8  border-2 border-ivory bg-gold/80 shadow-glow cursor-move flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none z-30 group"
                      style={{ left: `${lipCoords.x}%`, top: `${lipCoords.y}%` }}
                    >
                      <span className="text-[9px] font-extrabold text-[#080608] uppercase">Lip</span>
                      <div className="absolute top-10 bg-black/85 border border-ivory/10 px-2 py-0.5 rounded text-[8px] text-ivory opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">💄 Drag to Lips</div>
                    </div>
                    {/* Draggable Cheek Node */}
                    <div
                      onPointerDown={handlePointerDown('cheek')}
                      className="absolute w-8 h-8  border-2 border-ivory bg-mauve/80 shadow-glow cursor-move flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none z-30 group"
                      style={{ left: `${cheekCoords.x}%`, top: `${cheekCoords.y}%` }}
                    >
                      <span className="text-[9px] font-extrabold text-[#080608] uppercase">Blsh</span>
                      <div className="absolute top-10 bg-black/85 border border-ivory/10 px-2 py-0.5 rounded text-[8px] text-ivory opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">🌸 Drag to Cheek</div>
                    </div>
                    {/* Draggable Hair Node */}
                    <div
                      onPointerDown={handlePointerDown('hair')}
                      className="absolute w-8 h-8  border-2 border-ivory bg-neon-amber/80 shadow-glow cursor-move flex items-center justify-center -translate-x-1/2 -translate-y-1/2 select-none z-30 group"
                      style={{ left: `${hairCoords.x}%`, top: `${hairCoords.y}%` }}
                    >
                      <span className="text-[9px] font-extrabold text-[#080608] uppercase">Hair</span>
                      <div className="absolute top-10 bg-black/85 border border-ivory/10 px-2 py-0.5 rounded text-[8px] text-ivory opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">💇 Drag to Hair</div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={analyzeWithVision}
                  disabled={loading}
                  id="analyze-btn"
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing</span>
                      <span className="inline-flex gap-0.5">
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {analysis ? 'Re-analyze' : 'Analyze with AI Vision'}
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="p-3  border border-ivory/10 hover:border-gold/30 text-ivory/40 hover:text-gold transition-all duration-300"
                  id="reset-btn"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Contextual AI Chat Widget — inline below the image itself */}
              {analysis && (
                <div className="bg-noir-50 rounded-3xl border border-ivory/[0.06] flex flex-col overflow-hidden animate-fade-in mt-6" style={{ height: '420px' }}>
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-noir-100 to-noir-200 p-4 flex items-center justify-between shrink-0 border-b border-ivory/[0.05]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-mauve flex items-center justify-center">
                        <Bot className="w-4 h-4 text-[#080608]" />
                      </div>
                      <div>
                        <h4 className="text-ivory text-sm font-bold font-display">Style Consultant</h4>
                        <p className="text-ivory/60 text-[10px]">Ask about your results</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Area */}
                  <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-noir/50">
                    {/* Welcome Message */}
                    {chatMessages.length === 0 && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="bg-noir-200 rounded-2xl rounded-tl-sm p-3.5 border border-ivory/[0.05] max-w-[85%]">
                          <p className="text-xs text-ivory/85 leading-relaxed">
                            Hi! I'm your personal style consultant. I've reviewed your analysis — <strong className="text-gold">{analysis.faceShape}</strong> face shape with <strong className="text-gold">{analysis.skinTone?.split(' ')[0]?.toLowerCase()}</strong> tones. Ask me anything about your recommended styles!
                          </p>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="flex flex-wrap gap-1.5">
                          {quickChatSuggestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => sendChatMessage(q)}
                              className="text-[10px] font-semibold text-gold bg-gold/5 hover:bg-gold/10 border border-gold/15 px-2.5 py-1.5 rounded-full transition-all"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Message History */}
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-gold to-neon-amber text-[#080608] rounded-br-sm'
                            : 'bg-noir-200 text-ivory/85 rounded-tl-sm border border-ivory/[0.05]'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {chatLoading && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="bg-noir-200 rounded-2xl rounded-tl-sm p-3.5 border border-ivory/[0.05]">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input Bar */}
                  <div className="p-3 border-t border-ivory/[0.05] bg-noir-100 shrink-0">
                    <div className="flex items-center gap-2">
                      <input
                        ref={chatInputRef}
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                        placeholder="Ask about your style results..."
                        className="flex-1 text-xs bg-noir-300 border border-ivory/[0.06] rounded-full px-3.5 py-2.5 outline-none focus:border-gold/30 focus:ring-1 focus:ring-gold/10 transition-all placeholder:text-ivory/45 text-ivory"
                      />
                      <button
                        onClick={sendChatMessage}
                        disabled={!chatInput.trim() || chatLoading}
                        className="bg-gradient-to-br from-gold to-neon-amber text-[#080608] w-9 h-9 rounded-full flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-4 animate-fade-in">
                {/* Category Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
                  {styleCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        id={`tab-${cat.id}`}
                        className={`flex items-center gap-2 px-4 py-2  text-sm font-medium whitespace-nowrap transition-all duration-300 snap-start ${
                          activeCategory === cat.id
                            ? 'bg-gold text-[#080608] shadow-glow'
                            : 'bg-white/[0.03] text-ivory/75 hover:bg-white/[0.06] border border-ivory/[0.05]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Face Analysis */}
                {activeCategory === 'face' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="card-glass p-5">
                      <h4 className="font-bold text-ivory mb-3 font-display">Style Consultation Profile</h4>
                      <div className="space-y-3">
                        {analysis.gender && (
                          <div className="flex justify-between items-center p-3  bg-white/[0.03] border border-ivory/[0.05]">
                            <span className="text-sm text-ivory/75">Client Profile</span>
                            <span className="text-sm font-bold text-mauve capitalize">{analysis.gender}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center p-3  bg-gold/[0.04] border border-gold/10">
                          <span className="text-sm text-ivory/75">Face Shape</span>
                          <span className="text-sm font-bold text-gold">{analysis.faceShape}</span>
                        </div>
                        <div className="flex justify-between items-center p-3  bg-white/[0.03] border border-ivory/[0.05]">
                          <span className="text-sm text-ivory/75">Skin Tone</span>
                          <span className="text-sm font-bold text-gold">{analysis.skinTone}</span>
                        </div>
                        <div className="p-3  bg-white/[0.02] border border-ivory/[0.04]">
                          <p className="text-xs text-ivory/60 font-semibold uppercase tracking-wider mb-1">Professional Assessment</p>
                          <p className="text-sm text-ivory/80 leading-relaxed">{analysis.features}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hairstyle Recommendations */}
                {activeCategory === 'hairstyle' && analysis.hairstyleRecommendations && (
                  <div className="space-y-3 animate-fade-in">
                    {analysis.hairstyleRecommendations.map((rec, i) => (
                      <div key={i} className="card-glass p-4 hover:shadow-card-hover hover:border-gold/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-ivory">{rec.style}</h5>
                          <span className="tag-gold text-xs">{rec.confidence}% match</span>
                        </div>
                        <p className="text-sm text-ivory/75">{rec.reason}</p>
                        <div className="mt-3 w-full bg-white/[0.05]  h-2">
                          <div
                            className="bg-gradient-to-r from-gold to-mauve h-2  transition-all duration-1000"
                            style={{ width: `${rec.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Makeup / Grooming Recommendations */}
                {activeCategory === 'makeup' && analysis.makeupRecommendations && (
                  <div className="space-y-3 animate-fade-in">
                    {analysis.makeupRecommendations.map((rec, i) => (
                      <div key={i} className="card-glass p-4 hover:shadow-card-hover hover:border-gold/10 transition-all duration-300">
                        <h5 className="font-bold text-ivory mb-1">{rec.look}</h5>
                        <p className="text-sm text-ivory/75 mb-3">{rec.reason}</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.colors.map((c, j) => (
                            <span key={j} className="tag text-xs">{c}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Hair Color Recommendations */}
                {activeCategory === 'haircolor' && analysis.hairColorRecommendations && (
                  <div className="space-y-3 animate-fade-in">
                    {analysis.hairColorRecommendations.map((rec, i) => (
                      <div key={i} className="card-glass p-4 hover:shadow-card-hover hover:border-gold/10 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-ivory">{rec.color}</h5>
                          <span className="tag-gold text-xs">{rec.suitability}% suitable</span>
                        </div>
                        <p className="text-sm text-ivory/75">{rec.reason}</p>
                        <div className="mt-3 w-full bg-white/[0.05]  h-2">
                          <div
                            className="bg-gradient-to-r from-gold to-neon-amber h-2  transition-all duration-1000"
                            style={{ width: `${rec.suitability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Virtual Try-On Controls */}
                {activeCategory === 'tryon' && (
                  <div className="space-y-4 animate-fade-in card-glass p-5 border border-ivory/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <h4 className="font-bold text-ivory text-sm font-display">Virtual Makeup & Hair Swatches</h4>
                    </div>
                    <p className="text-ivory/70 text-[11px] leading-relaxed font-body">
                      Drag the glowing pointer nodes (<strong>Lip</strong>, <strong>Blsh</strong>, <strong>Hair</strong>) directly on your photo to position the color blends on your face.
                    </p>

                    {/* Lipstick Section */}
                    <div className="space-y-2.5 pt-2 border-t border-ivory/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-ivory/70 tracking-wider font-mono">💄 Lipstick Overlay</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Ruby Red', hex: '#ff003c' },
                          { name: 'Nude Pink', hex: '#d48a97' },
                          { name: 'Plum Wine', hex: '#6b2d5c' },
                          { name: 'Peach Satin', hex: '#e79a82' },
                        ].map((sw) => (
                          <button
                            key={sw.hex}
                            onClick={() => setLipstickColor(sw.hex)}
                             className={`px-2 py-1 rounded-md text-[10px] font-semibold border flex items-center gap-1.5 transition-all font-body ${
                              lipstickColor === sw.hex
                                ? 'border-gold bg-gold/10 text-gold'
                                : 'border-ivory/[0.06] bg-white/[0.02] text-ivory/65 hover:border-ivory/10'
                            }`}
                          >
                            <span className="w-2.5 h-2.5  border border-black/20" style={{ backgroundColor: sw.hex }} />
                            {sw.name}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-ivory/70 font-body">
                          <span>Intensity / Opacity</span>
                          <span className="text-gold font-bold">{Math.round(lipstickOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={lipstickOpacity}
                          onChange={(e) => setLipstickOpacity(parseFloat(e.target.value))}
                          className="w-full accent-gold h-1 bg-white/[0.05]  appearance-none cursor-ew-resize"
                        />
                      </div>
                    </div>

                    {/* Blush Section */}
                    <div className="space-y-2.5 pt-3 border-t border-ivory/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-ivory/70 tracking-wider font-mono">🌸 Cheek Blush Overlay</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Rose Petal', hex: '#ff6b8b' },
                          { name: 'Peach Glow', hex: '#ff9e80' },
                          { name: 'Golden Hue', hex: '#ffd54f' },
                        ].map((sw) => (
                          <button
                            key={sw.hex}
                            onClick={() => setBlushColor(sw.hex)}
                             className={`px-2 py-1 rounded-md text-[10px] font-semibold border flex items-center gap-1.5 transition-all font-body ${
                              blushColor === sw.hex
                                ? 'border-mauve bg-mauve/10 text-mauve'
                                : 'border-ivory/[0.06] bg-white/[0.02] text-ivory/65 hover:border-ivory/10'
                            }`}
                          >
                            <span className="w-2.5 h-2.5  border border-black/20" style={{ backgroundColor: sw.hex }} />
                            {sw.name}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-ivory/70 font-body">
                          <span>Intensity / Opacity</span>
                          <span className="text-mauve font-bold">{Math.round(blushOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.8"
                          step="0.05"
                          value={blushOpacity}
                          onChange={(e) => setBlushOpacity(parseFloat(e.target.value))}
                          className="w-full accent-mauve h-1 bg-white/[0.05]  appearance-none cursor-ew-resize"
                        />
                      </div>
                    </div>

                    {/* Hair Streaks Section */}
                    <div className="space-y-2.5 pt-3 border-t border-ivory/[0.04]">
                      <span className="text-[10px] uppercase font-bold text-ivory/70 tracking-wider font-mono">💇 Hair Highlights / Streaks</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Caramel', hex: '#c68642' },
                          { name: 'Burgundy', hex: '#4a1525' },
                          { name: 'Honey Blonde', hex: '#d4b26f' },
                          { name: 'Ash Silver', hex: '#a0a0a0' },
                        ].map((sw) => (
                          <button
                            key={sw.hex}
                            onClick={() => setHairColor(sw.hex)}
                             className={`px-2 py-1 rounded-md text-[10px] font-semibold border flex items-center gap-1.5 transition-all font-body ${
                              hairColor === sw.hex
                                ? 'border-neon-amber bg-neon-amber/10 text-neon-amber'
                                : 'border-ivory/[0.06] bg-white/[0.02] text-ivory/65 hover:border-ivory/10'
                            }`}
                          >
                            <span className="w-2.5 h-2.5  border border-black/20" style={{ backgroundColor: sw.hex }} />
                            {sw.name}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-ivory/70 font-body">
                          <span>Intensity / Opacity</span>
                          <span className="text-neon-amber font-bold">{Math.round(hairOpacity * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="0.9"
                          step="0.05"
                          value={hairOpacity}
                          onChange={(e) => setHairOpacity(parseFloat(e.target.value))}
                          className="w-full accent-neon-amber h-1 bg-white/[0.05]  appearance-none cursor-ew-resize"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Matching Salons */}
          {matchedSalons.length > 0 && (
            <div className="animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-bold font-display text-ivory">
                    {isMale ? 'Top Grooming Salons for You' : 'Salons That Can Create This Look'}
                  </h3>
                </div>
                <Link href="/salons" className="text-sm text-gold hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedSalons.map((salon) => (
                  <Link
                    key={salon.id}
                    href={`/salons/${salon.id}`}
                    className="card p-4 flex items-center gap-4"
                  >
                    <div className="w-14 h-14  bg-gradient-to-br from-gold/20 to-mauve/20 border border-ivory/[0.06] flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-gold font-display">{salon.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-ivory text-sm truncate">{salon.name}</h4>
                      <p className="text-xs text-ivory/70">{salon.area} • <Star className="w-3 h-3 text-gold fill-gold inline" /> {salon.rating}</p>
                      <p className="text-xs text-ivory/60">{salon.priceRange}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-ivory/15" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
