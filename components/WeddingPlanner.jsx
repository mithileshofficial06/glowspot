'use client';
import { useState, useRef } from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Sparkles, 
  Loader2, 
  Clock, 
  ChevronRight, 
  Check, 
  Palette, 
  Home, 
  UserCheck, 
  Heart, 
  ShoppingCart, 
  Info, 
  Upload, 
  Trash2, 
  CheckCircle, 
  RefreshCw, 
  Camera, 
  Briefcase,
  Truck,
  X
} from 'lucide-react';
import Link from 'next/link';
import salons from '@/data/salons.json';

const roles = ['Bride', 'Bridesmaid', 'Mother of the Bride', 'Guest', 'Groom'];
const areas = ['Banjara Hills', 'Jubilee Hills', 'Hitech City', 'Madhapur', 'Gachibowli', 'Kukatpally', 'Secunderabad', 'Begumpet', 'Ameerpet', 'Kondapur'];

const stylePresets = [
  { 
    id: 'telugu', 
    label: 'Classic Telugu Bride', 
    desc: 'Temple gold accents, elegant Kanjeevaram draping, warm bronze makeup, jasmine braids.',
    colors: ['bg-amber-600', 'bg-amber-100', 'bg-red-800'] 
  },
  { 
    id: 'royal_deccani', 
    label: 'Royal Deccani Bride', 
    desc: 'Vintage Khada Dupatta, rich passas/pearl styling, emerald accents, dramatic smokey eyes.',
    colors: ['bg-emerald-800', 'bg-yellow-200', 'bg-neutral-800'] 
  },
  { 
    id: 'north_indian', 
    label: 'North Indian Heritage', 
    desc: 'Deep crimson lehengas, heavy Kundan layering, velvet styling, premium cut-crease glam.',
    colors: ['bg-rose-700', 'bg-amber-500', 'bg-red-900'] 
  },
  { 
    id: 'minimalist', 
    label: 'Contemporary Minimalist', 
    desc: 'Dewy peach glass skin finish, sleek low buns or beach waves, soft natural glow.',
    colors: ['bg-orange-200', 'bg-amber-200', 'bg-white'] 
  },
  { 
    id: 'groom_fusion', 
    label: 'Indie Groom Fusion', 
    desc: 'Premium beard profiling, active charcoal face treatment, matte sleek hair styling.',
    colors: ['bg-neutral-900', 'bg-amber-400', 'bg-zinc-300'] 
  }
];

export default function WeddingPlanner() {
  const [formData, setFormData] = useState({
    role: '',
    weddingDate: '',
    budget: 35000,
    areas: [],
    notes: '',
    stylePreset: 'telugu',
    homeService: false,
    entourage: {
      bridesmaids: 0,
      mother: false,
      groom: false,
    }
  });

  const [plan, setPlan] = useState(null);
  const [timelineItems, setTimelineItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Selfie Upload & Vision Analysis States
  const [selfieImage, setSelfieImage] = useState(null);
  const [faceAnalysis, setFaceAnalysis] = useState(null);
  const [analyzingFace, setAnalyzingFace] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Bulk Booking Cart Modal States
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMoodBoard, setShowMoodBoard] = useState(false);
  const [bookingProgress, setBookingProgress] = useState(0); // 0: Idle, 1: Reserving, 2: Success

  const [selectedItems, setSelectedItems] = useState({});

  const toggleArea = (area) => {
    setFormData((prev) => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area],
    }));
  };

  const updateEntourage = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      entourage: {
        ...prev.entourage,
        [field]: value
      }
    }));
  };

  // Drag and drop for Selfie Box
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelfieImage(e.target.result);
        setFaceAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runFaceAnalysis = async () => {
    if (!selfieImage) return;
    setAnalyzingFace(true);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: selfieImage }),
      });
      const data = await res.json();
      if (data.analysis) {
        setFaceAnalysis(data.analysis);
      } else {
        // Fallback Face Analysis
        setFaceAnalysis({
          faceShape: 'Oval',
          skinTone: 'Medium warm undertone',
          features: 'Well proportioned forehead and defined jawline',
          makeupRecommendations: [
            { look: 'Natural Glow', colors: ['Warm peach', 'Gloss lip'] }
          ]
        });
      }
    } catch (e) {
      setFaceAnalysis({
        faceShape: 'Oval',
        skinTone: 'Medium warm undertone',
        features: 'Well proportioned face lines',
        makeupRecommendations: [
          { look: 'Natural Glow', colors: ['Warm peach', 'Gloss lip'] }
        ]
      });
    } finally {
      setAnalyzingFace(false);
    }
  };

  // Re-balancer Salon Lookups
  const rebalanceSalon = (index, newCost) => {
    const updatedItems = [...timelineItems];
    const item = updatedItems[index];
    item.cost = parseInt(newCost) || 0;

    // Define price ranges
    let targetPriceRange = '₹';
    if (newCost > 10000) targetPriceRange = '₹₹₹₹';
    else if (newCost > 5000) targetPriceRange = '₹₹₹';
    else if (newCost > 2000) targetPriceRange = '₹₹';

    const category = item.category || 'makeup';
    const areaPref = formData.areas;

    // Search salons.json
    let eligibleSalons = salons.filter((s) => {
      const matchArea = areaPref.length === 0 || areaPref.includes(s.area);
      const matchSpec = s.specializations.some((sp) => 
        sp.toLowerCase().includes(category.toLowerCase()) || 
        category.toLowerCase().includes(sp.toLowerCase())
      );
      return matchArea && matchSpec;
    });

    if (eligibleSalons.length === 0) {
      eligibleSalons = salons.filter((s) => areaPref.length === 0 || areaPref.includes(s.area));
    }
    if (eligibleSalons.length === 0) {
      eligibleSalons = salons;
    }

    // Try to find matching price tier
    let chosenSalon = eligibleSalons.find((s) => s.priceRange === targetPriceRange) || eligibleSalons[0];

    if (chosenSalon) {
      item.salon = chosenSalon.name;
      item.area = chosenSalon.area;
      item.desc = `Custom budgeted ${item.service} coordinated at ${chosenSalon.name} (${chosenSalon.area}) tailored for your ${stylePresets.find(p => p.id === formData.stylePreset)?.label || 'Wedding'} look.`;
    }

    setTimelineItems(updatedItems);
    const newTotal = updatedItems.reduce((sum, it) => sum + it.cost + (it.entourageCost || 0), 0);
    setTotalCost(newTotal);
  };

  const generatePlan = async () => {
    setLoading(true);

    try {
      const salonContext = salons
        .filter((s) => formData.areas.length === 0 || formData.areas.includes(s.area))
        .map((s) => `${s.name} (${s.area}) - ${s.specializations.join(', ')} - ${s.priceRange}`)
        .join('\n');

      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          weddingDate: formData.weddingDate,
          budget: formData.budget,
          areas: formData.areas,
          notes: formData.notes,
          salonContext,
          stylePreset: formData.stylePreset,
          homeService: formData.homeService,
          entourage: formData.entourage,
          faceAnalysis
        }),
      });

      const data = await res.json();

      if (data.plan) {
        setTimelineItems(data.plan.items || []);
        setTotalCost(data.plan.totalCost || (data.plan.items || []).reduce((s, it) => s + it.cost + (it.entourageCost || 0), 0));
        setPlan(data.plan);
        // Enable checkboxes for all items initially
        const initialChecks = {};
        (data.plan.items || []).forEach((_, idx) => {
          initialChecks[idx] = true;
        });
        setSelectedItems(initialChecks);
      } else {
        const fallback = generateFallbackPlan();
        setTimelineItems(fallback.items);
        setTotalCost(fallback.totalCost);
        setPlan(fallback);
        const initialChecks = {};
        fallback.items.forEach((_, idx) => {
          initialChecks[idx] = true;
        });
        setSelectedItems(initialChecks);
      }
    } catch (error) {
      const fallback = generateFallbackPlan();
      setTimelineItems(fallback.items);
      setTotalCost(fallback.totalCost);
      setPlan(fallback);
      const initialChecks = {};
      fallback.items.forEach((_, idx) => {
        initialChecks[idx] = true;
      });
      setSelectedItems(initialChecks);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackPlan = () => {
    const wDate = new Date(formData.weddingDate);
    const relevantSalons = salons.filter(
      (s) => formData.areas.length === 0 || formData.areas.includes(s.area)
    );
    const bridalSalon = relevantSalons.find((s) => s.tags.includes('bridal')) || relevantSalons[0];
    const skinSalon = relevantSalons.find((s) => s.specializations.some((sp) => sp.toLowerCase().includes('skin'))) || relevantSalons[1] || bridalSalon;
    const hairSalon = relevantSalons.find((s) => s.specializations.some((sp) => sp.toLowerCase().includes('hair'))) || relevantSalons[2] || bridalSalon;

    const items = [];
    const isBride = formData.role === 'Bride';

    // Calculate multiplier for Home Service Travel fee
    const serviceMultiplier = formData.homeService ? 1.2 : 1.0;
    const isHome = formData.homeService;

    // Check Entourage details
    const ent = formData.entourage;
    let entourageCostPerEvent = 0;
    let entourageServiceDesc = '';
    
    if (ent.bridesmaids > 0 || ent.mother || ent.groom) {
      const parts = [];
      let cost = 0;
      if (ent.bridesmaids > 0) {
        parts.push(`${ent.bridesmaids} Bridesmaid(s)`);
        cost += ent.bridesmaids * 2000;
      }
      if (ent.mother) {
        parts.push(`Mother Stylings`);
        cost += 2500;
      }
      if (ent.groom) {
        parts.push(`Groom Grooming`);
        cost += 1500;
      }
      entourageCostPerEvent = Math.round(cost * serviceMultiplier);
      entourageServiceDesc = parts.join(' + ');
    }

    if (isBride) {
      const d6 = new Date(wDate); d6.setDate(d6.getDate() - 42);
      items.push({ 
        date: d6.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: '6 weeks before', 
        title: 'Start Pre-Bridal Skincare', 
        desc: `Begin deep skin rejuvenation customized for the ${stylePresets.find(p => p.id === formData.stylePreset)?.label || 'Telugu'} look.`, 
        salon: skinSalon?.name || 'Recommended Salon', 
        area: skinSalon?.area || '', 
        service: 'Pre-Bridal Facial', 
        cost: Math.round(2000 * serviceMultiplier),
        category: 'skin',
        forWho: 'Bride',
        homeService: isHome,
        styleTip: 'Apply sunscreen and hydrating cream twice daily.'
      });

      const d5 = new Date(wDate); d5.setDate(d5.getDate() - 28);
      items.push({ 
        date: d5.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: '4 weeks before', 
        title: 'Premium Hair Spa & Therapy', 
        desc: 'Nourishing conditioning session to prepare hair structure for wedding hairstyles.', 
        salon: hairSalon?.name || 'Recommended Salon', 
        area: hairSalon?.area || '', 
        service: 'Hair Spa + Treatment', 
        cost: Math.round(2500 * serviceMultiplier),
        category: 'hair',
        forWho: 'Bride',
        homeService: isHome,
        styleTip: 'Avoid hot dryers or coloring for the next 21 days.'
      });

      const d3 = new Date(wDate); d3.setDate(d3.getDate() - 14);
      items.push({ 
        date: d3.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: '2 weeks before', 
        title: 'Aesthetic Makeup Trial', 
        desc: `Preview your customized look, fine-tuned for a perfect photogenic glow.`, 
        salon: bridalSalon?.name || 'Recommended Salon', 
        area: bridalSalon?.area || '', 
        service: 'Trial Makeup Session', 
        cost: Math.round(3000 * serviceMultiplier),
        category: 'makeup',
        forWho: 'Bride',
        homeService: isHome,
        styleTip: 'Wear a neutral color top to test the color accuracy of the foundation.'
      });

      const d2 = new Date(wDate); d2.setDate(d2.getDate() - 3);
      items.push({ 
        date: d2.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: '3 days before', 
        title: 'Sangeet Mehndi Application', 
        desc: 'Elaborate bridal mehndi designs. Entourage stylings happen concurrently.', 
        salon: bridalSalon?.name || 'Recommended Salon', 
        area: bridalSalon?.area || '', 
        service: 'Bridal Mehndi', 
        cost: Math.round(4000 * serviceMultiplier),
        category: 'mehndi',
        forWho: entourageServiceDesc ? 'Both' : 'Bride',
        entourageService: entourageServiceDesc ? `${entourageServiceDesc} Mehndi` : '',
        entourageCost: entourageCostPerEvent ? Math.round(entourageCostPerEvent * 0.7) : 0,
        homeService: isHome,
        styleTip: 'Use natural oils to set the color deep before the ceremony.'
      });

      items.push({ 
        date: wDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: 'Wedding Day', 
        title: 'Bridal Makeover & Traditional Styling', 
        desc: `Stunning wedding transformation, hair bun flower decoration, and custom draping.`, 
        salon: bridalSalon?.name || 'Recommended Salon', 
        area: bridalSalon?.area || '', 
        service: 'Complete Bridal Package', 
        cost: Math.round(12000 * serviceMultiplier),
        category: 'makeup',
        forWho: entourageServiceDesc ? 'Both' : 'Bride',
        entourageService: entourageServiceDesc ? `${entourageServiceDesc} Makeup + Styling` : '',
        entourageCost: entourageCostPerEvent,
        homeService: isHome,
        styleTip: 'Carry translucent powder and lip oil for minor event touch-ups.'
      });
    } else {
      const d2 = new Date(wDate); d2.setDate(d2.getDate() - 7);
      items.push({ 
        date: d2.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: '1 week before', 
        title: 'Event Prep Glow', 
        desc: 'Skin facial and organic clean prep.', 
        salon: hairSalon?.name || 'Recommended Salon', 
        area: hairSalon?.area || '', 
        service: 'Facial + Glow Prep', 
        cost: Math.round(2500 * serviceMultiplier),
        category: 'hair',
        forWho: 'Bride',
        homeService: isHome
      });

      items.push({ 
        date: wDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), 
        daysLeft: 'Event Day', 
        title: 'Sleek Makeup & Hair Styling', 
        desc: 'Modern chic hair curls and matching styling.', 
        salon: bridalSalon?.name || 'Recommended Salon', 
        area: bridalSalon?.area || '', 
        service: 'Party Makeup', 
        cost: Math.round(5000 * serviceMultiplier),
        category: 'makeup',
        forWho: 'Bride',
        homeService: isHome
      });
    }

    const total = items.reduce((a, item) => a + item.cost + (item.entourageCost || 0), 0);

    return { items, totalCost: total };
  };

  const handleBulkBooking = () => {
    setShowBookingModal(true);
    setBookingProgress(1);
    
    // Simulate premium reservation progress step-by-step
    setTimeout(() => {
      setBookingProgress(2);
      // Generate some confetti sparkles in state/ui
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-1 sm:px-4">
      {!plan ? (
        <div className="space-y-8 animate-fade-in">
          {/* Step 1: Role & Style Preset */}
          <div className="card-glass p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-display text-ivory mb-1 flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                Step 1: Your Role in the Wedding
              </h3>
              <p className="text-xs text-ivory/60 mb-3">Choose your role to customize milestones</p>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => { setFormData({ ...formData, role }); setStep(Math.max(step, 2)); }}
                    id={`role-${role.toLowerCase().replace(/\s/g, '-')}`}
                    className={`px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                      formData.role === role
                        ? 'bg-gold text-noir shadow-glow'
                        : 'bg-noir-100 border border-ivory/10 text-ivory/70 hover:border-gold/30 shadow-sm'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
             <hr className="border-ivory/10" />

            <div>
              <h3 className="text-lg font-bold font-display text-ivory mb-1 flex items-center gap-2">
                <Palette className="w-5 h-5 text-gold" />
                Select Bridal/Styling Aesthetic
              </h3>
              <p className="text-xs text-ivory/60 mb-4">Choose a preset look to guide makeup and product recommendations</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stylePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setFormData({ ...formData, stylePreset: preset.id })}
                    className={`p-4 text-left border transition-all duration-300 flex flex-col justify-between ${
                      formData.stylePreset === preset.id
                        ? 'border-gold bg-gold/10 shadow-glow ring-1 ring-gold/20'
                        : 'border-ivory/10 bg-noir-100 text-ivory/80 hover:border-gold/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-ivory font-display">{preset.label}</span>
                        {formData.stylePreset === preset.id && <Check className="w-4 h-4 text-gold" />}
                      </div>
                      <p className="text-[11px] text-ivory/60 leading-relaxed mb-3">{preset.desc}</p>
                    </div>
                    <div className="flex gap-1.5 mt-auto">
                      {preset.colors.map((c, i) => (
                        <div key={i} className={`w-4 h-4 ${c} border border-ivory/20 shadow-sm`} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            </div>
          </div>

          {/* Step 2: Shared Family & Entourage Panel */}
          <div className={`card-glass p-6 space-y-6 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-lg font-bold font-display text-ivory mb-1 flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              Step 2: Shared Family & Entourage Planner (Co-bookings)
            </h3>
            <p className="text-xs text-ivory/60">Coordinate and bundle styling packages for bridesmaids, mothers, and groom alongside the main booking.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gold/5 p-4 border border-gold/10">
              <div className="bg-noir-100 p-3 shadow-sm border border-ivory/10">
                <label className="text-xs font-semibold text-ivory block mb-1">Bridesmaids Styling ({formData.entourage.bridesmaids} Pax)</label>
                <input 
                  type="range"
                  min="0"
                  max="6"
                  value={formData.entourage.bridesmaids}
                  onChange={(e) => updateEntourage('bridesmaids', parseInt(e.target.value))}
                  className="w-full accent-gold h-1.5 bg-noir-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ivory/45 mt-1">
                  <span>0</span>
                  <span>6 Max</span>
                </div>
              </div>

              <div className="bg-noir-100 p-3 shadow-sm border border-ivory/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-ivory block">Mother of the Bride</span>
                  <span className="text-[10px] text-ivory/50">Pre-bridal facial & sari draping</span>
                </div>
                <input 
                  type="checkbox"
                  checked={formData.entourage.mother}
                  onChange={(e) => updateEntourage('mother', e.target.checked)}
                  className="w-4 h-4 rounded text-gold accent-gold cursor-pointer"
                />
              </div>

              <div className="bg-noir-100 p-3 shadow-sm border border-ivory/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-ivory block">Groom Grooming Package</span>
                  <span className="text-[10px] text-ivory/50">Beard trimming & face charcoal treatment</span>
                </div>
                <input 
                  type="checkbox"
                  checked={formData.entourage.groom}
                  onChange={(e) => updateEntourage('groom', e.target.checked)}
                  className="w-4 h-4 rounded text-gold accent-gold cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Optional Selfie upload and face vision analysis */}
          <div className={`card-glass p-6 space-y-6 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-lg font-bold font-display text-ivory mb-1 flex items-center gap-2">
              <Camera className="w-5 h-5 text-gold" />
              <Sparkles className="w-4 h-4 text-gold" />
              Optional: Integrate AI Selfie Analysis
            </h3>
            <p className="text-xs text-ivory/60">Upload your picture to let the AI analyze skin-tones and face structures, fine-tuning your beauty calendar.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!selfieImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-ivory/10 hover:border-gold/50 bg-noir-100 hover:bg-noir-200 p-6 text-center cursor-pointer transition-all"
                >
                  <Upload className="w-8 h-8 text-gold mx-auto mb-2" />
                  <span className="text-xs font-bold text-ivory block">Drag & Drop or Click to Upload</span>
                  <span className="text-[10px] text-ivory/50">PNG or JPG Selfie</span>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative overflow-hidden shadow-sm bg-noir border border-ivory/10 flex items-center justify-center p-2">
                  <img src={selfieImage} className="w-full h-32 object-cover " alt="selfie" />
                  <button 
                    onClick={() => { setSelfieImage(null); setFaceAnalysis(null); }}
                    className="absolute top-4 right-4 bg-noir-200 p-1.5 shadow-md text-ivory/70 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="bg-noir-100 p-4 border border-ivory/10 flex flex-col justify-center">
                {selfieImage && !faceAnalysis && (
                  <button
                    onClick={runFaceAnalysis}
                    disabled={analyzingFace}
                    className="btn-primary py-2.5 px-4 w-full flex items-center justify-center gap-2 text-xs font-bold"
                  >
                    {analyzingFace ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing face geometry...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Run AI Face Analysis
                      </>
                    )}
                  </button>
                )}

                {faceAnalysis ? (
                  <div className="space-y-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-xs bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 p-2 font-semibold">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      Face Analysis Integrated
                    </div>
                    <div className="text-[11px] text-ivory/80 space-y-1">
                      <p><strong>Face Shape:</strong> {faceAnalysis.faceShape}</p>
                      <p><strong>Skin Tone:</strong> {faceAnalysis.skinTone}</p>
                      <p className="truncate"><strong>Traits:</strong> {faceAnalysis.features}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-ivory/50">
                    <Info className="w-4 h-4 mx-auto mb-1 text-ivory/30" />
                    Upload selfie to trigger personalized visual makeup swatches inside plan.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Date, Budget & Home Service */}
          <div className={`card-glass p-6 space-y-6 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-lg font-bold font-display text-ivory mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              Step 3: Logistics & Wedding Date
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-ivory block mb-1">Target Wedding Date</label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => { setFormData({ ...formData, weddingDate: e.target.value }); setStep(Math.max(step, 3)); }}
                  id="wedding-date"
                  className="input-styled py-2.5 text-xs"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-ivory block mb-1">
                  Target Budget limit: <span className="text-gold font-bold">₹{formData.budget.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="5000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                  id="budget-slider"
                  className="w-full accent-gold h-1.5 bg-noir-300 appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ivory/45 mt-1">
                  <span>₹10,000</span>
                  <span>₹1,50,000</span>
                </div>
              </div>
            </div>

            <hr className="border-ivory/10" />

            <div className="flex items-center justify-between bg-gold/5 p-4 border border-gold/10">
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-gold mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-ivory block">Elite Home-Service / On-Venue Stylists</span>
                  <span className="text-[10px] text-ivory/60">Salons dispatch artists directly to your residence. Elite surcharge calculated.</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.homeService} 
                  onChange={(e) => setFormData({ ...formData, homeService: e.target.checked })} 
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-ivory after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-4 after:w-4 after:transition-all peer-checked:bg-gold"></div>
              </label>
            </div>
          </div>

          {/* Step 4: Preferred Areas */}
          <div className={`card-glass p-6 space-y-4 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h3 className="text-lg font-bold font-display text-ivory mb-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              Step 4: Hyderabad Areas Filter
            </h3>
            <p className="text-xs text-ivory/60">Highlight your preferred neighborhoods for localized salon matching</p>
            <div className="flex flex-wrap gap-1.5">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => toggleArea(area)}
                  className={`px-3 py-1.5 text-[11px] font-semibold transition-all duration-300 ${
                    formData.areas.includes(area)
                      ? 'bg-mauve text-ivory shadow-sm'
                      : 'bg-noir-100 border border-ivory/10 text-ivory/70 hover:border-mauve/30'
                  }`}
                >
                  {formData.areas.includes(area) && <Check className="w-3 h-3 inline mr-1" />}
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Notes area */}
          <div className={`card-glass p-6 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <label className="text-xs font-semibold text-ivory block mb-1">Additional Notes / Custom Styling Details</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Skin sensitvities, specific sari draping requirements, organic/vegan skincare preferences..."
              rows={3}
              className="input-styled text-xs resize-none"
            />
          </div>

          {/* Primary Submit Button */}
          <button
            onClick={generatePlan}
            disabled={!formData.role || !formData.weddingDate || loading}
            className={`w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
              formData.role && formData.weddingDate && !loading
                ? 'btn-primary'
                : 'bg-noir-300 text-ivory/30 cursor-not-allowed border border-ivory/10'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI is designing your bridal portfolio...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Premium Wedding Beauty Plan
              </>
            )}
          </button>
        </div>
      ) : (
         <div className="space-y-6 animate-fade-in pb-12">
          {/* Plan Header */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 text-gold text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Premium Wedding Portfolio
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-ivory">
              Your Complete Beauty Timeline
            </h2>
            <p className="text-xs text-ivory/60 mt-1">
              Occasion: {new Date(formData.weddingDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {formData.homeService && (
              <div className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-gold bg-gold/10 px-2.5 py-0.5 border border-gold/20">
                <Home className="w-3 h-3" />
                Premium Home Services Enabled
              </div>
            )}
          </div>

          {/* Visual AI Lookbook card at top if face analysis exists */}
          {faceAnalysis && (
            <div className="card-glass p-5 border border-gold/20 bg-gradient-to-r from-gold/5 to-mauve/5 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-gold/5 filter blur-xl" />
              <div className="flex gap-4">
                {selfieImage && (
                  <img src={selfieImage} className="w-16 h-16 object-cover border border-gold/20" alt="Selfie" />
                )}
                <div>
                  <h4 className="font-bold text-xs text-ivory font-display flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-gold" />
                    AI Face-Matching Lookbook Profile
                  </h4>
                  <p className="text-[10px] text-ivory/60 mt-0.5">Custom styling mapped to your {faceAnalysis.faceShape?.toLowerCase()} structure and warm skin tone.</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-0.5 rounded-md bg-noir-100 border border-ivory/10 text-[9px] font-bold text-ivory/80">Shape: {faceAnalysis.faceShape}</span>
                    <span className="px-2 py-0.5 rounded-md bg-noir-100 border border-ivory/10 text-[9px] font-bold text-ivory/80">Tone: {faceAnalysis.skinTone}</span>
                    <span className="px-2 py-0.5 rounded-md bg-noir-100 border border-gold/20 text-[9px] font-bold text-gold">Look: {formData.stylePreset ? stylePresets.find(p => p.id === formData.stylePreset)?.label : 'Telugu Glam'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Milestones */}
          <div className="relative">
            {/* Vertical timeline connector */}
            <div className="absolute left-6 md:left-8 top-4 bottom-4 w-[2px] bg-gradient-to-b from-gold via-gold/50 to-mauve" />

            <div className="space-y-8">
              {timelineItems.map((item, idx) => {
                // Parse date string robustly to avoid squishing
                let dayVal = '01';
                let monthVal = 'JUN';
                if (item.date) {
                  if (item.date.includes('-')) {
                    const parts = item.date.split('-');
                    const d = new Date(item.date);
                    if (!isNaN(d.getTime())) {
                      dayVal = d.toLocaleDateString('en-IN', { day: '2-digit' });
                      monthVal = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
                    } else if (parts.length === 3) {
                      dayVal = parts[2];
                      monthVal = parts[1];
                    }
                  } else if (item.date.includes(' ')) {
                    const parts = item.date.split(' ');
                    dayVal = parts[0];
                    monthVal = parts[1]?.toUpperCase();
                  } else {
                    dayVal = item.date.substring(0, 2);
                    monthVal = 'WED';
                  }
                }

                return (
                  <div key={idx} className="relative flex gap-4 md:gap-6 animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                    {/* Timeline Date Circle Indicator */}
                    <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-gold to-gold-dark flex flex-col items-center justify-center shrink-0 shadow-md border-2 border-noir-100">
                      <span className="text-[9px] md:text-[10px] font-bold text-noir uppercase tracking-wider leading-none mb-0.5">{monthVal}</span>
                      <span className="text-sm md:text-lg font-extrabold text-noir leading-none">{dayVal}</span>
                    </div>

                    {/* Timeline Card - Sleek grid-based multi-column layout */}
                    <div className="flex-1 card p-0 overflow-hidden relative border border-ivory/10 hover:border-gold/20 transition-all duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-5">
                        
                        {/* LEFT COLUMN: Milestone Details (60% width on desktop) */}
                        <div className="lg:col-span-3 p-6 flex flex-col justify-between space-y-4">
                          <div>
                            {/* Badges and Cart Selector */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex flex-wrap gap-1">
                                <span className="text-[9px] font-bold text-gold bg-gold/10 px-2.5 py-0.5 uppercase tracking-wider">
                                  {item.daysLeft}
                                </span>
                                {item.homeService && (
                                  <span className="text-[9px] font-bold text-gold bg-gold/10 px-2 py-0.5 flex items-center gap-0.5 border border-gold/20">
                                    <Home className="w-2.5 h-2.5" />
                                    Home Service
                                  </span>
                                )}
                                <span className="text-[9px] font-bold text-ivory/70 bg-noir-200 border border-ivory/10 px-2.5 py-0.5">
                                  {item.forWho || 'Bride'}
                                </span>
                              </div>

                              <label className="flex items-center gap-1.5 cursor-pointer scale-90">
                                <span className="text-[10px] text-ivory/50 font-bold select-none uppercase tracking-wider">Add to Cart</span>
                                <input
                                  type="checkbox"
                                  checked={!!selectedItems[idx]}
                                  onChange={(e) => setSelectedItems({ ...selectedItems, [idx]: e.target.checked })}
                                  className="w-4 h-4 rounded text-gold accent-gold border-ivory/10 bg-noir-200"
                                />
                              </label>
                            </div>

                            <h4 className="font-extrabold text-ivory text-base md:text-lg font-display mb-2">{item.title}</h4>
                            <p className="text-[11px] sm:text-xs text-ivory/60 leading-relaxed font-light">{item.desc}</p>
                          </div>

                          {/* Elegant, clean visual tip at the bottom of text */}
                          {item.styleTip && (
                            <div className="text-[10px] text-ivory/70 bg-gold/5 border-l-2 border-gold p-2.5 flex gap-1.5 items-start mt-2">
                              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                              <p className="leading-relaxed"><strong className="text-gold">Aesthetic Tip:</strong> {item.styleTip}</p>
                            </div>
                          )}
                        </div>

                        {/* RIGHT COLUMN: Control Panel & Pricing Dashboard (40% width on desktop) */}
                        <div className="lg:col-span-2 bg-noir-200/50 p-6 border-t lg:border-t-0 lg:border-l border-ivory/10 flex flex-col justify-between space-y-4">
                          
                          {/* Cost Adjuster Slider */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] text-ivory/50 font-extrabold uppercase tracking-wider flex items-center gap-0.5">
                                <DollarSign className="w-3 h-3 text-gold" />
                                Custom Cost Allocator
                              </span>
                              <span className="text-sm font-extrabold text-gold bg-noir-100 border border-gold/20 px-2 py-0.5 shadow-sm">
                                ₹{item.cost?.toLocaleString()}
                              </span>
                            </div>
                            <input 
                              type="range"
                              min="1000"
                              max="25000"
                              step="500"
                              value={item.cost || 1000}
                              onChange={(e) => rebalanceSalon(idx, parseInt(e.target.value))}
                              className="w-full accent-gold h-1.5 cursor-ew-resize bg-noir-300 appearance-none"
                            />
                            <div className="flex justify-between text-[8px] font-bold text-ivory/30">
                              <span>₹1,000</span>
                              <span>₹25,000</span>
                            </div>
                          </div>

                          {/* Entourage Slot Panel if active */}
                          {item.entourageService && (
                            <div className="p-3 bg-mauve/10 border border-mauve/20 flex items-center justify-between text-[11px] animate-fade-in shadow-inner">
                              <div className="min-w-0 pr-2">
                                <span className="font-extrabold text-mauve block text-[9px] uppercase tracking-wider">Entourage Slots</span>
                                <span className="text-ivory/70 text-[10px] font-medium block truncate">{item.entourageService}</span>
                              </div>
                              <span className="font-bold text-mauve bg-noir-100 border border-mauve/25 px-2 py-0.5 shrink-0">
                                +₹{item.entourageCost?.toLocaleString()}
                              </span>
                            </div>
                          )}

                          {/* Recommended Salon Details */}
                          <div className="pt-4 border-t border-ivory/10 flex items-center justify-between">
                            <div className="min-w-0">
                              <span className="text-[8px] text-ivory/40 uppercase tracking-wider font-extrabold block">Fulfillment Location</span>
                              <span className="text-xs font-extrabold text-ivory truncate block">{item.salon || 'Elite Salon partners'}</span>
                              {item.area && <span className="text-[9px] text-ivory/40 font-bold block">{item.area}</span>}
                            </div>
                            <Link
                              href="/salons"
                              className="text-[10px] text-gold font-extrabold flex items-center gap-0.5 hover:underline shrink-0 ml-2"
                            >
                              Explore <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unified dynamic Bridal booking tracker */}
          <div className="card-glass p-6 border border-gold/30 bg-gradient-to-br from-gold/5 via-noir-100 to-mauve/5 shadow-glow space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-xs text-ivory/50 font-semibold block">Consolidated Estimated Total</span>
                <p className="text-3xl font-extrabold font-display gradient-text">₹{totalCost.toLocaleString()}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-ivory/50 font-semibold block">Your Limit Budget</span>
                <p className="text-base font-bold text-ivory/80">₹{formData.budget.toLocaleString()}</p>
                <span className={`text-xs font-bold ${totalCost <= formData.budget ? 'text-emerald-400' : 'text-gold'}`}>
                  {totalCost <= formData.budget ? '✓ Total within target budget limits' : '⚠ Plan has exceeded target by ₹' + (totalCost - formData.budget).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleBulkBooking}
                className="btn-primary flex-1 py-3 px-6 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all min-w-[200px]"
              >
                <ShoppingCart className="w-4 h-4" />
                Elite Bulk Reservation (One-Click Booking)
              </button>

              <button
                onClick={() => setShowMoodBoard(true)}
                className="px-5 py-3 border border-gold/30 bg-gold/5 hover:bg-gold/10 text-gold text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                View Mood Board
              </button>
              
              <button
                onClick={() => { setPlan(null); setStep(1); }}
                className="px-5 py-3 border border-ivory/10 text-ivory/70 hover:bg-noir-200 text-xs font-bold transition-all"
              >
                Reset Planner
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Bulk Booking Cart Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card max-w-md w-full bg-noir-100 p-6 relative overflow-hidden shadow-glow-lg animate-scale-up border border-gold/20 rounded-3xl">
            
            {bookingProgress === 1 && (
              <div className="text-center py-8 space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-gold/20" />
                  <div className="absolute inset-0 border-4 border-gold border-t-transparent animate-spin" />
                  <Heart className="w-8 h-8 text-gold absolute inset-0 m-auto animate-pulse" />
                </div>
                <h3 className="text-lg font-bold font-display text-ivory">Dispatching Elite Booking Orders</h3>
                <p className="text-xs text-ivory/60 max-w-xs mx-auto">Securing individual time slots, assigning artists, and coordinating home travel calendars with Oasis Salon, Bubbles, and top partner boutiques.</p>
                <div className="w-full bg-noir-300 h-1.5 max-w-xs mx-auto overflow-hidden">
                  <div className="bg-gold h-1.5 animate-progress" />
                </div>
              </div>
            )}

            {bookingProgress === 2 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-ivory">Congratulations</h3>
                  <p className="text-xs text-ivory/60 mt-1">Your entire wedding beauty itinerary is successfully locked and coordinated.</p>
                </div>

                <div className="bg-noir-200 p-4 text-left border border-ivory/10 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory/60 font-medium">Services Booked</span>
                    <span className="font-bold text-ivory">{Object.values(selectedItems).filter(Boolean).length} Appointments</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory/60 font-medium">Bulk Package Cost</span>
                    <span className="font-bold text-gold">₹{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-ivory/60 font-medium">Fulfillment Type</span>
                    <span className="font-bold text-ivory flex items-center gap-1">{formData.homeService ? <><Truck className="w-3 h-3 text-gold" /> Home / On-Venue</> : <><Briefcase className="w-3 h-3 text-gold" /> In-Salon</>}</span>
                  </div>
                  <div className="pt-2 border-t border-ivory/10 flex items-center justify-between text-[10px] text-ivory/40">
                    <span>Confirmation ID: GS-WED-2026</span>
                    <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 font-bold px-2 py-0.5">PAID</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="btn-primary w-full py-2.5 text-xs font-bold"
                  >
                    Return to Timeline
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2.5 border border-ivory/10 text-ivory/70 hover:bg-noir-200 text-xs font-bold transition-all"
                  >
                    Print
                  </button>
                </div>
              </div>
            )}

            <button 
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-ivory/40 hover:text-ivory/70"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Bridal Mood Board Modal */}
      {showMoodBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in print:bg-white print:p-0 print:relative">
          <div className="card max-w-2xl w-full bg-noir-100 p-6 relative overflow-y-auto max-h-[90vh] shadow-glow border border-gold/20 rounded-3xl animate-scale-up print:bg-white print:text-black print:shadow-none print:border-none print:w-full print:max-h-full print:p-0">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-ivory/10 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold" />
                <h3 className="text-lg font-bold font-display text-ivory">Your AI Bridal Lookbook & Mood Board</h3>
              </div>
              <button 
                onClick={() => setShowMoodBoard(false)}
                className="text-ivory/40 hover:text-ivory/70 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mood Board Canvas Layout */}
            <div id="mood-board-print-area" className="space-y-6 print:space-y-4 print:text-[#080608]">
              {/* Top Banner */}
              <div className="bg-gradient-to-r from-mauve to-gold p-6 text-ivory flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-xl font-bold font-display">GlowSpot Bridal Portfolio</h4>
                  <p className="text-xs opacity-80 mt-1">Aesthetic direction curated for Hyderabad beauty styles</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono tracking-widest uppercase opacity-70">Itinerary Code</span>
                  <p className="text-sm font-bold font-mono">GS-WED-2026</p>
                </div>
              </div>

              {/* Grid 2 Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
                
                {/* Left Side: Profile & Aesthetic Details */}
                <div className="space-y-4">
                  <div className="bg-noir-200 print:bg-gray-50 p-4 border border-ivory/10 print:border-gray-200/50">
                    <span className="text-[10px] uppercase font-bold text-ivory/40 print:text-gray-400 tracking-wider">Aesthetic Theme</span>
                    <h5 className="font-extrabold text-ivory print:text-gray-800 text-sm mt-1">
                      {formData.stylePreset ? stylePresets.find(p => p.id === formData.stylePreset)?.label : 'Custom Look'}
                    </h5>
                    <p className="text-[11px] text-ivory/60 print:text-gray-500 mt-1 leading-relaxed">
                      {formData.stylePreset ? stylePresets.find(p => p.id === formData.stylePreset)?.desc : 'Custom curated schedule'}
                    </p>
                    <div className="flex gap-1.5 mt-3">
                      {formData.stylePreset && stylePresets.find(p => p.id === formData.stylePreset)?.colors.map((c, i) => (
                        <div key={i} className={`w-5 h-5 ${c} border border-ivory/25 shadow-sm`} />
                      ))}
                    </div>
                  </div>

                  {faceAnalysis && (
                    <div className="bg-noir-200 print:bg-gray-50 p-4 border border-ivory/10 print:border-gray-200/50 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-ivory/40 print:text-gray-400 tracking-wider">Face Shape & Skin Profile</span>
                      <p className="text-xs text-ivory/80 print:text-gray-700"><strong>Face Shape:</strong> {faceAnalysis.faceShape}</p>
                      <p className="text-xs text-ivory/80 print:text-gray-700"><strong>Complexion undertones:</strong> {faceAnalysis.skinTone}</p>
                      <p className="text-[11px] text-ivory/60 print:text-gray-500 leading-relaxed italic">{faceAnalysis.features}</p>
                    </div>
                  )}
                </div>

                {/* Right Side: Key Milestones Summary */}
                <div className="bg-noir-200 print:bg-gray-50 p-4 border border-ivory/10 print:border-gray-200/50 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-ivory/40 print:text-gray-400 tracking-wider">Timeline Highlights</span>
                    <ul className="space-y-2.5 mt-3">
                      {timelineItems.slice(-3).map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-ivory/80 print:text-gray-700">
                          <span className="font-bold text-gold print:text-rose-gold shrink-0">{item.daysLeft}:</span>
                          <span className="truncate">{item.service} at <strong>{item.salon}</strong></span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-ivory/10 print:border-gray-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-ivory/60 print:text-gray-500 font-semibold">Total Cost Estimate:</span>
                      <strong className="text-gold print:text-rose-gold">₹{totalCost.toLocaleString()}</strong>
                    </div>
                    {formData.homeService && (
                      <span className="text-[9px] text-gold bg-gold/10 px-2 py-0.5 mt-1.5 inline-block font-bold font-body border border-gold/20 print:bg-amber-50 print:text-amber-700 print:border-amber-100">
                        ✓ Travel/Venue Delivery Service Configured
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Handcrafted Styling Instructions */}
              <div className="bg-gold/5 border border-gold/10 text-xs text-ivory/70 print:bg-rose-blush/5 print:border-rose-gold/10 print:text-gray-600 leading-relaxed">
                <strong>Bridal Preparation Checklist:</strong> Apply cold pressed oils, drink 3L of water daily leading to the wedding day, and share this lookbook sheet with your boutique coordinator so they can sync Kanjeevaram sari pleating or Khada dupatta setups directly.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-ivory/10 print:hidden">
              <button
                onClick={() => window.print()}
                className="btn-primary flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Print / Download PDF Lookbook
              </button>
              
              <button
                onClick={() => {
                  const presetName = stylePresets.find(p => p.id === formData.stylePreset)?.label || 'Wedding';
                  const text = `Hi! Check out my GlowSpot Bridal beauty schedule: *${presetName}* aesthetic, scheduled on ${formData.weddingDate} with top Hyderabad salons. Total estimated package: ₹${totalCost.toLocaleString()}. Generate yours at http://localhost:3000/planner`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="px-4 py-2.5 border border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/20 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                Share Lookbook on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
