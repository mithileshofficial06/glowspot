'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, MapPin, Star, Home, X, SlidersHorizontal, Loader2, IndianRupee, ArrowUpDown } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import salons from '@/data/salons.json';

const allAreas = [...new Set(salons.map((s) => s.area))].sort();

function SalonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialArea = searchParams.get('area') || '';

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [maxPrice, setMaxPrice] = useState(30000); // 30k as absolute upper bound
  const [minRating, setMinRating] = useState(0);
  const [homeOnly, setHomeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync with search params area
  useEffect(() => {
    if (initialArea) {
      setSelectedArea(initialArea);
    }
  }, [initialArea]);

  // Handle filtering
  const filtered = useMemo(() => {
    let result = salons.filter((s) => {
      // 1. Search filter
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.area.toLowerCase().includes(search.toLowerCase()) ||
        s.specializations.some((sp) => sp.toLowerCase().includes(search.toLowerCase()));

      // 2. Area filter
      const matchArea = !selectedArea || s.area === selectedArea;

      // 3. Price filter (if salon minPrice is within the user's limit)
      const matchPrice = s.minPrice <= maxPrice;

      // 4. Rating filter
      const matchRating = s.rating >= minRating;

      // 5. Home Service filter
      const matchHome = !homeOnly || s.homeService;

      return matchSearch && matchArea && matchPrice && matchRating && matchHome;
    });

    // Handle Sorting
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.maxPrice - a.maxPrice);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [search, selectedArea, maxPrice, minRating, homeOnly, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedArea('');
    setMaxPrice(30000);
    setMinRating(0);
    setHomeOnly(false);
    // Remove search param
    router.replace('/salons');
  };

  const isFiltered = search || selectedArea || maxPrice < 30000 || minRating > 0 || homeOnly;

  // Filter form component (used on both desktop sidebar and mobile drawer)
  const FilterForm = () => (
    <div className="space-y-6">
      {/* Search Input in Sidebar */}
      <div>
        <label className="text-xs font-semibold text-white/40 block mb-2 tracking-wider uppercase">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Salon, service, area..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-neon-gold/30"
          />
        </div>
      </div>

      {/* Area Selector */}
      <div>
        <label className="text-xs font-semibold text-white/40 block mb-2 tracking-wider uppercase">
          <MapPin className="w-3.5 h-3.5 inline mr-1 text-neon-gold" />
          Neighborhood
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-noir-100 border border-white/[0.06] text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-neon-gold/30"
        >
          <option value="">All Hyderabad Areas</option>
          {allAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Price Limit Filter */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold text-white/40 tracking-wider uppercase">
            <IndianRupee className="w-3.5 h-3.5 inline mr-1 text-neon-gold" />
            Max Starting Price
          </label>
          <span className="text-xs font-bold text-neon-gold">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="100"
          max="30000"
          step="200"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-gold"
        />
        <div className="flex justify-between text-[10px] text-white/20 mt-1">
          <span>₹100</span>
          <span>₹15,000</span>
          <span>₹30,000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-xs font-semibold text-white/40 block mb-2 tracking-wider uppercase">
          <Star className="w-3.5 h-3.5 inline mr-1 text-neon-gold" />
          Minimum Rating
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[0, 4.0, 4.3, 4.5, 4.7].map((val) => (
            <button
              key={val}
              onClick={() => setMinRating(val)}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                minRating === val
                  ? 'bg-neon-gold text-black border-neon-gold shadow-glow font-bold'
                  : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:border-white/15'
              }`}
            >
              {val === 0 ? 'Any' : `${val}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Home Service Toggle */}
      <div>
        <label className="text-xs font-semibold text-white/40 block mb-2 tracking-wider uppercase">
          <Home className="w-3.5 h-3.5 inline mr-1 text-neon-gold" />
          Service Type
        </label>
        <button
          onClick={() => setHomeOnly(!homeOnly)}
          className={`w-full py-3 rounded-xl text-xs font-bold transition-all border ${
            homeOnly
              ? 'bg-emerald-glow text-black border-emerald-glow shadow-md'
              : 'bg-white/[0.02] border-white/[0.05] text-white/60 hover:bg-white/[0.04]'
          }`}
        >
          {homeOnly ? '✓ Home Service Only' : 'Show All Services'}
        </button>
      </div>

      {/* Clear Filters Button */}
      {isFiltered && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 rounded-xl border border-neon-gold/20 hover:border-neon-gold/40 text-neon-gold text-xs font-semibold transition-all hover:bg-neon-gold/[0.02] flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Heading */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-2">
          Discover <span className="gradient-text">Hyderabad Salons</span>
        </h1>
        <p className="text-sm text-white/40 max-w-2xl">
          Browse through {salons.length} curated, top-rated professional styling, makeup, and wellness partners across the city.
        </p>
      </div>

      {/* Action / Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] mb-8">
        <div className="text-sm text-white/60">
          We found <span className="font-bold text-neon-gold">{filtered.length}</span> matching salon{filtered.length !== 1 ? 's' : ''}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white/80 hover:text-white"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neon-gold" />
            Filters
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-neon-gold animate-pulse" />
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-white/30 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-noir-100 border border-white/[0.06] text-xs text-white/80 focus:outline-none focus:ring-1 focus:ring-neon-gold/30"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="reviews">Sort: Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.04] backdrop-blur-sm sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>
            {isFiltered && (
              <button onClick={clearFilters} className="text-xs text-white/40 hover:text-neon-gold transition-colors font-medium">
                Reset
              </button>
            )}
          </div>
          <FilterForm />
        </div>

        {/* Mobile Filter Drawer / Slider Panel */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
              onClick={() => setShowMobileFilters(false)}
            />
            {/* Drawer container */}
            <div className="relative w-80 max-w-full h-full bg-noir-50 border-l border-white/[0.05] p-6 overflow-y-auto flex flex-col justify-between shadow-2xl animate-slide-left">
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-lg hover:bg-white/[0.04] text-white/40 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterForm />
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary w-full py-3 mt-8 font-bold text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Salons Card Grid */}
        <div className="lg:col-span-3">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
              {filtered.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 rounded-2xl bg-white/[0.01] border border-white/[0.04] p-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mx-auto mb-6">
                <Search className="w-6 h-6 text-white/20" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-2">No salons matched your filters</h3>
              <p className="text-sm text-white/40 mb-6 max-w-sm mx-auto">
                Try widening your price range, choosing another area, or clearing some options.
              </p>
              <button onClick={clearFilters} className="btn-secondary px-6 py-2.5 text-xs font-semibold">
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Salons() {
  return (
    <div className="min-h-screen pt-24 bg-noir text-white/90 relative z-10">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32 min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-neon-gold" />
          </div>
        }
      >
        <SalonsContent />
      </Suspense>
    </div>
  );
}
