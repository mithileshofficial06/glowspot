'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, Star, Home, X, SlidersHorizontal, Loader2 } from 'lucide-react';
import SalonCard from '@/components/SalonCard';
import salons from '@/data/salons.json';

const allAreas = [...new Set(salons.map((s) => s.area))].sort();
const allSpecializations = [...new Set(salons.flatMap((s) => s.specializations))].sort();

function SalonsContent() {
  const searchParams = useSearchParams();
  const initialArea = searchParams.get('area') || '';

  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [minRating, setMinRating] = useState(0);
  const [homeOnly, setHomeOnly] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState([]);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const toggleSpec = (spec) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const filtered = useMemo(() => {
    let result = salons.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.area.toLowerCase().includes(search.toLowerCase()) ||
        s.specializations.some((sp) => sp.toLowerCase().includes(search.toLowerCase()));
      const matchArea = !selectedArea || s.area === selectedArea;
      const matchRating = s.rating >= minRating;
      const matchHome = !homeOnly || s.homeService;
      const matchSpecs =
        selectedSpecs.length === 0 ||
        selectedSpecs.some((sp) => s.specializations.includes(sp));

      return matchSearch && matchArea && matchRating && matchHome && matchSpecs;
    });

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price-low') result.sort((a, b) => a.minPrice - b.minPrice);
    else if (sortBy === 'price-high') result.sort((a, b) => b.maxPrice - a.maxPrice);
    else if (sortBy === 'reviews') result.sort((a, b) => b.reviewCount - a.reviewCount);

    return result;
  }, [search, selectedArea, minRating, homeOnly, selectedSpecs, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedArea('');
    setMinRating(0);
    setHomeOnly(false);
    setSelectedSpecs([]);
  };

  const activeFilterCount = [selectedArea, minRating > 0, homeOnly, selectedSpecs.length > 0].filter(Boolean).length;

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-plum-deep/90 to-rose-gold/20 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
            Hyderabad Salons
          </h1>
          <p className="text-white/60 mb-6">
            {filtered.length} salon{filtered.length !== 1 ? 's' : ''} found
            {selectedArea && ` in ${selectedArea}`}
          </p>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search salons, areas, or services..."
                id="salon-search"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-gold/30"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              id="toggle-filters"
              className={`px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all ${
                showFilters || activeFilterCount > 0
                  ? 'bg-rose-gold text-white'
                  : 'bg-white/90 text-gray-600 hover:bg-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showFilters && (
          <div className="card-glass p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-xs text-rose-gold hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Area
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  id="filter-area"
                  className="input-styled text-sm"
                >
                  <option value="">All Areas</option>
                  {allAreas.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">
                  <Star className="w-3 h-3 inline mr-1" />
                  Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-gold"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  id="filter-sort"
                  className="input-styled text-sm"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">
                  <Home className="w-3 h-3 inline mr-1" />
                  Home Service
                </label>
                <button
                  onClick={() => setHomeOnly(!homeOnly)}
                  id="filter-home"
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium w-full transition-all ${
                    homeOnly
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-600'
                  }`}
                >
                  {homeOnly ? '✓ Home Service Only' : 'Show All'}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-gray-500 block mb-2">Specializations</label>
              <div className="flex flex-wrap gap-2">
                {allSpecializations.slice(0, 12).map((spec) => (
                  <button
                    key={spec}
                    onClick={() => toggleSpec(spec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedSpecs.includes(spec)
                        ? 'bg-plum text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-plum/30'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-rose-gold/10 flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-rose-gold/50" />
            </div>
            <h3 className="text-xl font-bold font-display text-gray-800 mb-2">No salons found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search term.</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function Salons() {
  return (
    <div className="min-h-screen pt-20 bg-cream">
      <Suspense fallback={
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-rose-gold" />
        </div>
      }>
        <SalonsContent />
      </Suspense>
    </div>
  );
}
