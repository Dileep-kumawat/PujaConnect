import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Search, MapPin, Sparkles, BookOpen, HeartHandshake, ShieldCheck } from 'lucide-react';

const Home = () => {
  const [rituals, setRituals] = useState([]);
  const [selectedRitual, setSelectedRitual] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRituals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rituals');
        const data = await res.json();
        if (data.success) {
          setRituals(data.data);
        }
      } catch (err) {
        console.error('Error fetching rituals:', err);
      }
    };
    fetchRituals();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let queryParams = [];
    if (selectedRitual) queryParams.push(`ritual=${selectedRitual}`);
    if (location) queryParams.push(`location=${location}`);
    
    navigate(`/search?${queryParams.join('&')}`);
  };

  const handleRitualClick = (ritualId) => {
    navigate(`/search?ritual=${ritualId}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[550px] flex items-center justify-center text-center px-6 pt-12 overflow-hidden border-b border-white/5 bg-gradient-to-b from-burgundy-900/10 via-spiritual-dark to-spiritual-dark">
        {/* Saffron & Burgundy Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-saffron-600/10 blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-burgundy-900/10 blur-[100px] pointer-events-none -z-10 animate-pulse-slow" />

        <div className="max-w-4xl mx-auto space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-400 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digitalizing Vedic Traditions</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Connect with Verified Pandits <br />
            for <span className="gradient-text-saffron">Sacred Ceremonies</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover and book experienced priests for Satyanarayan Katha, Griha Pravesh, Havan, and other customized Hindu rituals. Enjoy transparent pricing and standardized ritual requirements.
          </p>

          {/* Search Box Panel */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="glass-panel p-4 md:p-3 rounded-2xl md:rounded-full border border-white/10 max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 items-center shadow-2xl gold-glow"
          >
            {/* Input 1: Ritual Selector */}
            <div className="flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-white/5">
              <BookOpen className="w-5 h-5 text-saffron-500 shrink-0" />
              <select
                value={selectedRitual}
                onChange={(e) => setSelectedRitual(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder-slate-500"
              >
                <option value="" className="bg-spiritual-slate text-slate-300">Select Ritual Ceremony</option>
                {rituals.map(r => (
                  <option key={r._id} value={r._id} className="bg-spiritual-slate text-white">{r.name}</option>
                ))}
              </select>
            </div>

            {/* Input 2: Location */}
            <div className="flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-white/5">
              <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter City (e.g. Delhi, Varanasi)"
                className="w-full bg-transparent border-none focus:outline-none text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl md:rounded-full bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-saffron-950/40"
            >
              <Search className="w-4 h-4" />
              <span>Search Pandits</span>
            </button>
          </form>
        </div>
      </section>

      {/* 2. Standardized Rituals Catalog */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-3xl font-semibold text-white tracking-wide">
            Browse Sacred Rituals
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose standard religious ceremonies. Each profile sets details, timeslots, and materials templates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rituals.map((r) => (
            <div
              key={r._id}
              onClick={() => handleRitualClick(r._id)}
              className="glass-panel rounded-2xl overflow-hidden cursor-pointer group hover:border-saffron-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="h-44 overflow-hidden relative border-b border-white/5 bg-slate-950">
                {r.image ? (
                  <img 
                    src={r.image} 
                    alt={r.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-85" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-burgundy-900/40 to-saffron-900/30 flex items-center justify-center text-slate-600">
                    <Flame className="w-10 h-10 text-saffron-500/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-spiritual-slate via-transparent to-transparent" />
              </div>

              <div className="p-6 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-saffron-500">{r.duration} duration</span>
                <h3 className="font-serif text-lg font-semibold text-white group-hover:text-gold-500 transition-colors">
                  {r.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                <span>Location: {r.locationType}</span>
                <span className="font-bold text-slate-300">Browse pricing →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works */}
      <section className="bg-spiritual-slate/50 border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-semibold text-white">How PujaConnect Works</h2>
            <p className="text-sm text-slate-400">Streamlining booking in three elegant steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-saffron-950/30 border border-saffron-500/30 flex items-center justify-center text-xl font-bold text-saffron-400 shadow-md">
                1
              </div>
              <h3 className="font-serif text-lg font-semibold text-white">Search and Filter</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Filter list of qualified priests by specific city, language profiles, years of experience, or ritual custom specialties.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-gold-950/30 border border-gold-500/30 flex items-center justify-center text-xl font-bold text-gold-400 shadow-md">
                2
              </div>
              <h3 className="font-serif text-lg font-semibold text-white">Personalize Booking</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Select your preferred ritual, choose a matching date/time slot from the Pandit's calendar, customize instructions, and send the request.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-burgundy-950/30 border border-burgundy-900/30 flex items-center justify-center text-xl font-bold text-red-400 shadow-md">
                3
              </div>
              <h3 className="font-serif text-lg font-semibold text-white">Perform Ceremony</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Your Pandit Ji arrives punctually, completes the Vedic rituals, shares standard requirements checklist, and guides you through.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Platform Trust Metrics */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-saffron-500/10 rounded-xl border border-saffron-500/20 text-saffron-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Verified Credentials</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Every Pandit Ji undergoes profile verification, ensuring certified qualifications and liturgical training.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-gold-500/10 rounded-xl border border-gold-500/20 text-gold-500">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Standard Requirements</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Transparent, complete requirements lists for every ceremony, preventing confusion or sudden arrangements.
            </p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-400">
            <Flame className="w-6 h-6 animate-pulse-slow" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">Transparent Pricing</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No hidden fees or unexpected demands. The Pandit's listed rate for that ritual is final and locked during booking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
