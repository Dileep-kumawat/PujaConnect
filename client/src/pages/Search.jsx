import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PanditCard from '../components/PanditCard';
import { Search as SearchIcon, MapPin, BookOpen, Globe, Award, SlidersHorizontal, RotateCcw } from 'lucide-react';

const Search = () => {
  const [pandits, setPandits] = useState([]);
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchVal, setSearchVal] = useState('');
  const [locationVal, setLocationVal] = useState('');
  const [ritualVal, setRitualVal] = useState('');
  const [languageVal, setLanguageVal] = useState('');
  const [minExpVal, setMinExpVal] = useState('');

  const routerLocation = useLocation();

  // Load URL parameters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(routerLocation.search);
    const ritualParam = searchParams.get('ritual') || '';
    const locationParam = searchParams.get('location') || '';

    setRitualVal(ritualParam);
    setLocationVal(locationParam);
  }, [routerLocation.search]);

  // Load rituals catalog for filter dropdown
  useEffect(() => {
    const fetchRituals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rituals');
        const data = await res.json();
        if (data.success) {
          setRituals(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRituals();
  }, []);

  // Fetch Pandits whenever filters change
  useEffect(() => {
    const fetchPandits = async () => {
      setLoading(true);
      try {
        let queryParams = [];
        if (locationVal) queryParams.push(`location=${locationVal}`);
        if (ritualVal) queryParams.push(`ritual=${ritualVal}`);
        if (languageVal) queryParams.push(`language=${languageVal}`);
        if (minExpVal) queryParams.push(`minExperience=${minExpVal}`);
        if (searchVal) queryParams.push(`search=${searchVal}`);

        const url = `http://localhost:5000/api/pandits?${queryParams.join('&')}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          setPandits(data.data);
        }
      } catch (err) {
        console.error('Error searching Pandits:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchPandits();
    }, 300); // Debounce to prevent rapid refetches

    return () => clearTimeout(delayDebounce);
  }, [locationVal, ritualVal, languageVal, minExpVal, searchVal]);

  const handleResetFilters = () => {
    setSearchVal('');
    setLocationVal('');
    setRitualVal('');
    setLanguageVal('');
    setMinExpVal('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Search and Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-semibold text-slate-800 tracking-wide">Discovery Portal</h2>
          <p className="text-xs text-slate-500 mt-1">Discover, compare, and book verified religious priests</p>
        </div>

        {/* Global Keyword Search */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search by name or bio keyword..."
            className="w-full rounded-xl bg-white border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Interactive Sidebar Filters */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 space-y-6 lg:sticky lg:top-24 bg-white">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-saffron-600" />
              Search Filters
            </span>
            <button
              onClick={handleResetFilters}
              className="text-[10px] text-slate-500 hover:text-saffron-600 font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer bg-transparent border-none"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Operational City
              </label>
              <input
                type="text"
                value={locationVal}
                onChange={(e) => setLocationVal(e.target.value)}
                placeholder="e.g. Delhi, Varanasi"
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
              />
            </div>

            {/* Ritual */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Puja Ceremony
              </label>
              <select
                value={ritualVal}
                onChange={(e) => setRitualVal(e.target.value)}
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-saffron-500 cursor-pointer"
              >
                <option value="" className="bg-white text-slate-700">All Ceremonies</option>
                {rituals.map(r => (
                  <option key={r._id} value={r._id} className="bg-white text-slate-800">{r.name}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Spoken Language
              </label>
              <input
                type="text"
                value={languageVal}
                onChange={(e) => setLanguageVal(e.target.value)}
                placeholder="e.g. Sanskrit, Hindi"
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
              />
            </div>

            {/* Experience */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                Minimum Experience (Years)
              </label>
              <select
                value={minExpVal}
                onChange={(e) => setMinExpVal(e.target.value)}
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-saffron-500 cursor-pointer"
              >
                <option value="" className="bg-white text-slate-700">Any Experience</option>
                <option value="5" className="bg-white text-slate-800">5+ Years</option>
                <option value="10" className="bg-white text-slate-800">10+ Years</option>
                <option value="15" className="bg-white text-slate-800">15+ Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-100 border border-slate-200/65 rounded-xl px-4 py-2">
            <span>Showing verified priest profiles</span>
            <span className="font-bold text-slate-800">{pandits.length} Pandits available</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(idx => (
                <div key={idx} className="glass-panel h-64 rounded-2xl animate-pulse flex flex-col justify-between p-6 bg-white border border-slate-200/60">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200/60" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-slate-200/60 rounded" />
                      <div className="h-3 w-20 bg-slate-200/60 rounded" />
                    </div>
                  </div>
                  <div className="h-10 bg-slate-200/60 rounded w-full" />
                </div>
              ))}
            </div>
          ) : pandits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pandits.map(p => (
                <PanditCard key={p._id} pandit={p} />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center border border-slate-200 bg-white space-y-4">
              <div className="w-12 h-12 rounded-full bg-saffron-50 border border-saffron-200 flex items-center justify-center mx-auto text-saffron-600 shadow-sm">
                <SearchIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-800">No Pandits Found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                We couldn't find any verified Pandits matching your active filters. Try expanding your search queries or resetting your inputs.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg bg-saffron-50 border border-saffron-200 hover:bg-saffron-600 text-saffron-600 hover:text-white font-medium text-xs transition-colors cursor-pointer"
              >
                Clear Search Queries
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
