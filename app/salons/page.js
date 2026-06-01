'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowUpDown } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import salons from '@/data/salons.json';

const allAreas = [...new Set(salons.map((s) => s.area))].sort();

function SalonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialArea = searchParams.get('area') || '';

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [maxPrice, setMaxPrice] = useState(30000);
  const [minRating, setMinRating] = useState(0);
  const [homeOnly, setHomeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (initialArea) setSelectedArea(initialArea);
  }, [initialArea]);

  const filtered = useMemo(() => {
    let result = salons.filter((s) => {
      const matchSearch = !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.area.toLowerCase().includes(search.toLowerCase()) ||
        s.specializations.some((sp) => sp.toLowerCase().includes(search.toLowerCase()));
      const matchArea = !selectedArea || s.area === selectedArea;
      const matchPrice = s.minPrice <= maxPrice;
      const matchRating = s.rating >= minRating;
      const matchHome = !homeOnly || s.homeService;
      return matchSearch && matchArea && matchPrice && matchRating && matchHome;
    });

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price-low') result.sort((a, b) => a.minPrice - b.minPrice);
    else if (sortBy === 'price-high') result.sort((a, b) => b.maxPrice - a.maxPrice);
    else if (sortBy === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);
    return result;
  }, [search, selectedArea, maxPrice, minRating, homeOnly, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedArea('');
    setMaxPrice(30000);
    setMinRating(0);
    setHomeOnly(false);
    router.replace('/salons');
  };

  const isFiltered = search || selectedArea || maxPrice < 30000 || minRating > 0 || homeOnly;

  const FilterForm = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="text-xs text-ivory/40 block mb-2 tracking-[0.15em] uppercase font-light">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-ivory/25" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Salon, service, area..."
            className="w-full pl-9 pr-4 py-2.5 bg-noir-50 border border-gold/[0.06] text-sm text-ivory placeholder-ivory/25 focus:outline-none focus:border-gold/30 font-light"
          />
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="text-xs text-ivory/40 block mb-2 tracking-[0.15em] uppercase font-light">Neighborhood</label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="w-full px-3 py-2.5 bg-noir-100 border border-gold/[0.06] text-sm text-ivory/70 focus:outline-none focus:border-gold/30 font-light"
        >
          <option value="">All Areas</option>
          {allAreas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs text-ivory/40 tracking-[0.15em] uppercase font-light">Max Price</label>
          <span className="text-xs text-gold font-display">{maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="100"
          max="30000"
          step="200"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
          className="w-full h-[1px] bg-gold/20 appearance-none cursor-pointer accent-[#D4A96A]"
        />
        <div className="flex justify-between text-[10px] text-ivory/20 mt-1 font-light">
          <span>100</span>
          <span>15,000</span>
          <span>30,000+</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="text-xs text-ivory/40 block mb-2 tracking-[0.15em] uppercase font-light">Min Rating</label>
        <div className="grid grid-cols-5 gap-1">
          {[0, 4.0, 4.3, 4.5, 4.7].map((val) => (
            <button
              key={val}
              onClick={() => setMinRating(val)}
              className={`py-2 text-xs font-light border transition-all ${
                minRating === val
                  ? 'bg-gold text-[#080608] border-gold'
                  : 'border-gold/[0.06] text-ivory/50 hover:border-gold/20'
              }`}
            >
              {val === 0 ? 'Any' : val}
            </button>
          ))}
        </div>
      </div>

      {/* Home Service */}
      <div>
        <label className="text-xs text-ivory/40 block mb-2 tracking-[0.15em] uppercase font-light">Service Type</label>
        <button
          onClick={() => setHomeOnly(!homeOnly)}
          className={`w-full py-3 text-xs font-light transition-all border ${
            homeOnly
              ? 'bg-gold text-[#080608] border-gold'
              : 'border-gold/[0.06] text-ivory/50 hover:border-gold/20'
          }`}
        >
          {homeOnly ? 'Home Service Only' : 'All Services'}
        </button>
      </div>

      {/* Clear */}
      {isFiltered && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 border border-gold/15 hover:border-gold/30 text-gold text-xs font-light transition-all flex items-center justify-center gap-1.5 tracking-[0.1em] uppercase"
        >
          <X className="w-3.5 h-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
      {/* Heading */}
      <div className="mb-10 animate-fade-in">
        <p className="text-xs tracking-[0.3em] uppercase text-gold/50 font-light mb-3">Directory</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-light text-ivory mb-2">
          Hyderabad Salons
        </h1>
        <p className="text-sm text-ivory/30 max-w-2xl font-light">
          Browse {salons.length} curated salons across the city.
        </p>
      </div>

      {/* Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gold/[0.06] mb-8">
        <div className="text-sm text-ivory/40 font-light">
          <span className="text-gold font-display">{filtered.length}</span> salons found
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gold/[0.08] text-xs text-ivory/50 hover:text-gold hover:border-gold/20 transition-all font-light tracking-wider"
          >
            Filters
            {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-gold" />}
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-ivory/25 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-noir-100 border border-gold/[0.06] text-xs text-ivory/60 focus:outline-none focus:border-gold/30 font-light"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="lg:grid lg:grid-cols-4 lg:gap-10 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1 p-6 border border-gold/[0.04] sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-gold/[0.06]">
            <h3 className="text-xs text-ivory/50 uppercase tracking-[0.2em] font-light">Filters</h3>
            {isFiltered && (
              <button onClick={clearFilters} className="text-xs text-ivory/30 hover:text-gold transition-colors font-light">
                Reset
              </button>
            )}
          </div>
          <FilterForm />
        </div>

        {/* Mobile Filter Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end animate-fade-in">
            <div
              className="absolute inset-0 bg-black/70 transition-opacity duration-300"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="relative w-80 max-w-full h-full bg-[#0e0c0e] border-l border-gold/[0.06] p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gold/[0.06]">
                  <h3 className="text-xs text-ivory/50 uppercase tracking-[0.2em] font-light">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 text-ivory/30 hover:text-gold"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterForm />
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="btn-primary w-full py-3 mt-8 text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Cards Grid */}
        <div className="lg:col-span-3">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
              {filtered.map((salon) => (
                <SalonCard key={salon.id} salon={salon} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-gold/[0.04] p-8 animate-fade-in">
              <div className="w-16 h-16 border border-gold/10 flex items-center justify-center mx-auto mb-6">
                <Search className="w-6 h-6 text-ivory/20" />
              </div>
              <h3 className="text-lg font-display font-light text-ivory mb-2">No salons matched</h3>
              <p className="text-sm text-ivory/30 mb-6 max-w-sm mx-auto font-light">
                Try widening your filters or choosing another area.
              </p>
              <button onClick={clearFilters} className="btn-secondary px-6 py-2.5 text-xs">
                Reset Filters
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
    <div className="min-h-screen pt-24 bg-[#080608] text-ivory relative z-10">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32 min-h-[50vh]">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
          </div>
        }
      >
        <SalonsContent />
      </Suspense>
    </div>
  );
}
