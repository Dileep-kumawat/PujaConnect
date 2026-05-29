import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';
import { LayoutDashboard, Calendar, FileText, CheckCircle2, ShieldAlert, Award, Clock, DollarSign, PlusCircle, Trash2, MapPin, Globe } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, token, updateProfile, API_URL } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [ritualsCatalog, setRitualsCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pandit Settings Edit States
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState(1);
  const [languages, setLanguages] = useState('');
  const [selectedRitualsMap, setSelectedRitualsMap] = useState({}); // { ritualId: price }
  const [slotsConfig, setSlotsConfig] = useState([]); // Array of { day, slots: [] }

  // Admin Dashboard States
  const [adminStats, setAdminStats] = useState(null);
  const [newRitualName, setNewRitualName] = useState('');
  const [newRitualDesc, setNewRitualDesc] = useState('');
  const [newRitualDuration, setNewRitualDuration] = useState('');
  const [newRitualMaterials, setNewRitualMaterials] = useState('');
  const [newRitualMinPrice, setNewRitualMinPrice] = useState('');
  const [newRitualMaxPrice, setNewRitualMaxPrice] = useState('');
  const [newRitualLocation, setNewRitualLocation] = useState('Both');

  // Load context user profile details into edit states
  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setExperience(profile.experience || 1);
      setLanguages(profile.languages ? profile.languages.join(', ') : '');
      
      // Load current rituals config map
      const rMap = {};
      if (profile.rituals) {
        profile.rituals.forEach(item => {
          if (item.ritual) {
            rMap[item.ritual._id || item.ritual] = item.price;
          }
        });
      }
      setSelectedRitualsMap(rMap);
      
      // Load slots config
      setSlotsConfig(profile.availabilitySlots || []);
    }
  }, [profile]);

  // Load Bookings for active role
  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  // Load Rituals Catalog
  const fetchRitualsCatalog = async () => {
    try {
      const res = await fetch(`${API_URL}/rituals`);
      const data = await res.json();
      if (data.success) {
        setRitualsCatalog(data.data);
      }
    } catch (err) {
      console.error('Error fetching rituals catalog:', err);
    }
  };

  // Load Admin Stats
  const fetchAdminStats = async () => {
    if (user && user.role === 'admin') {
      try {
        const res = await fetch(`${API_URL}/admin/stats`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setAdminStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      }
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      if (token) {
        await fetchBookings();
        await fetchRitualsCatalog();
        await fetchAdminStats();
      }
      setLoading(false);
    };
    loadDashboardData();
  }, [token, user]);

  const handleBookingStatusUpdate = async (bookingId, nextStatus) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Booking status updated successfully to '${nextStatus}'.`);
        setTimeout(() => setSuccessMsg(''), 4000);
        await fetchBookings();
        await fetchAdminStats(); // update in case admin changes status
      } else {
        setErrorMsg(data.message || 'Status update failed.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // PANDIT HANDLERS
  const handleSaveProfileSettings = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const parsedLanguages = languages.split(',').map(l => l.trim()).filter(Boolean);

    const payload = {
      bio,
      location,
      experience: Number(experience),
      languages: parsedLanguages
    };

    const res = await updateProfile(payload);
    if (res.success) {
      setSuccessMsg('Spiritual bio and operational settings saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleToggleRitualCheckbox = (ritualId) => {
    setSelectedRitualsMap(prev => {
      const next = { ...prev };
      if (next[ritualId] !== undefined) {
        delete next[ritualId];
      } else {
        next[ritualId] = 3100; // default initial price
      }
      return next;
    });
  };

  const handleRitualPriceChange = (ritualId, price) => {
    setSelectedRitualsMap(prev => ({
      ...prev,
      [ritualId]: Number(price)
    }));
  };

  const handleSaveRateCard = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // Map selectedRitualsMap into Pandit schemas rituals array
    const ritualsPayload = Object.keys(selectedRitualsMap).map(rId => ({
      ritual: rId,
      price: selectedRitualsMap[rId]
    }));

    const res = await updateProfile({ rituals: ritualsPayload });
    if (res.success) {
      setSuccessMsg('Ritual custom pricing rates updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.message || 'Failed to update pricing rates.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleAddSlot = (dayName, slotTime) => {
    setSlotsConfig(prev => {
      return prev.map(item => {
        if (item.day === dayName) {
          return {
            ...item,
            slots: [...new Set([...item.slots, slotTime])] // unique slots
          };
        }
        return item;
      });
    });
  };

  const handleRemoveSlot = (dayName, slotIndex) => {
    setSlotsConfig(prev => {
      return prev.map(item => {
        if (item.day === dayName) {
          const nextSlots = [...item.slots];
          nextSlots.splice(slotIndex, 1);
          return { ...item, slots: nextSlots };
        }
        return item;
      });
    });
  };

  const handleSaveSlotsConfig = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const res = await updateProfile({ availabilitySlots: slotsConfig });
    if (res.success) {
      setSuccessMsg('Availability calendar slots configured successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } else {
      setErrorMsg(res.message || 'Failed to configure slots.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // ADMIN HANDLERS
  const handleVerifyPandit = async (panditId, targetStatus) => {
    try {
      const res = await fetch(`${API_URL}/admin/pandits/${panditId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: targetStatus })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => setSuccessMsg(''), 4000);
        await fetchAdminStats();
      } else {
        setErrorMsg(data.message || 'Verification update failed.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRitual = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newRitualName || !newRitualDesc || !newRitualDuration || !newRitualMinPrice || !newRitualMaxPrice) {
      setErrorMsg('Please fill in all ritual fields.');
      return;
    }

    const materialsArray = newRitualMaterials
      ? newRitualMaterials.split(',').map(m => m.trim()).filter(Boolean)
      : [];

    const payload = {
      name: newRitualName,
      description: newRitualDesc,
      duration: newRitualDuration,
      requiredMaterials: materialsArray,
      basePriceRange: {
        min: Number(newRitualMinPrice),
        max: Number(newRitualMaxPrice)
      },
      locationType: newRitualLocation
    };

    try {
      const res = await fetch(`${API_URL}/admin/rituals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('New Ritual Ceremony Category added to system successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
        
        // Reset states
        setNewRitualName('');
        setNewRitualDesc('');
        setNewRitualDuration('');
        setNewRitualMaterials('');
        setNewRitualMinPrice('');
        setNewRitualMaxPrice('');
        setNewRitualLocation('Both');

        await fetchRitualsCatalog();
        await fetchAdminStats();
      } else {
        setErrorMsg(data.message || 'Failed to add ritual category.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-saffron-600 border-t-transparent animate-spin mx-auto" />
        <span className="text-xs text-slate-500">Syncing dashboard information...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Alert Notices */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold p-4 rounded-xl flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-650 text-sm font-semibold p-4 rounded-xl">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header Profile Dashboard Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-800 tracking-wide">
            {user.role === 'admin' 
              ? 'Administrator Panel' 
              : user.role === 'pandit' 
              ? 'Pandit Portal' 
              : 'Customer Dashboard'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Namaste, {user.name}! Manage your bookings, pricing tables, and account details.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-saffron-50 border border-saffron-200 text-saffron-600 uppercase tracking-widest leading-none">
          Active: {user.role}
        </span>
      </div>

      {/* ============================================================== */}
      {/* 1. CUSTOMER PORTAL */}
      {/* ============================================================== */}
      {user.role === 'customer' && (
        <div className="space-y-6">
          <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-saffron-500" />
            Your Scheduled Ceremonies
          </h3>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookings.map(b => (
                <BookingCard 
                  key={b._id} 
                  booking={b} 
                  role="customer" 
                  onStatusUpdate={handleBookingStatusUpdate} 
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center border border-slate-200 bg-white space-y-4 shadow-sm">
              <span className="text-slate-650 text-sm block font-medium">No ceremonies booked yet.</span>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Connect with verified Pandit Ji specialists to customized home and temple religious ceremonies.
              </p>
              <a 
                href="/search" 
                className="inline-block px-5 py-2.5 rounded-lg bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs tracking-wider transition-colors gold-glow cursor-pointer"
              >
                Search Verified Pandits
              </a>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PANDIT DASHBOARD */}
      {/* ============================================================== */}
      {user.role === 'pandit' && profile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start bg-spiritual-dark">
          {/* Left Columns (Booking Queue & Profile Editor) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Booking queue */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200/60 pb-2">
                Booking Requests & Assignments ({bookings.length})
              </h3>
              
              {bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map(b => (
                    <BookingCard
                      key={b._id}
                      booking={b}
                      role="pandit"
                      onStatusUpdate={handleBookingStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-xl text-xs text-slate-500 font-medium">
                  No upcoming booking requests in your assignments queue.
                </div>
              )}
            </div>

            {/* Profile Bio Editor */}
            <form onSubmit={handleSaveProfileSettings} className="glass-panel p-6 rounded-2xl border border-slate-200/60 space-y-4 bg-white">
              <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200/60 pb-2">
                Edit Spiritual Bio & Qualifications
              </h3>

              {profile.isVerified === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold p-3 rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Profile Verification Pending Admin Moderation. Fill out details.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Operational City</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Delhi, Mumbai"
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Experience (Years)</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    min={1}
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-saffron-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Spoken Languages</label>
                  <input
                    type="text"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Hindi, Sanskrit, English"
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detailed Bio / Lineage Info</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share details on your Sanskrit qualifications, specific temples trained at, and approach to conducting Vedic rituals..."
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500 h-28 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs tracking-wider transition-colors gold-glow cursor-pointer shadow-sm"
              >
                Save Bio & Credentials
              </button>
            </form>
          </div>

          {/* Right Columns: Ritual Pricing rates editor & Slot scheduler */}
          <div className="space-y-6">
            {/* Rates Card Editor */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200/60 pb-2 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gold-600" />
                  Your Ceremony Rates
                </h3>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                  Check which rituals you perform and set your custom rupee pricing rates.
                </p>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {ritualsCatalog.map((r) => {
                  const isSelected = selectedRitualsMap[r._id] !== undefined;
                  return (
                    <div key={r._id} className="flex items-center justify-between gap-3 text-xs p-2 bg-slate-50 border border-slate-200/60 rounded-lg">
                      <label className="flex items-center gap-2 font-medium text-slate-800 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRitualCheckbox(r._id)}
                          className="accent-saffron-500 w-3.5 h-3.5 rounded"
                        />
                        <span>{r.name}</span>
                      </label>
                      {isSelected && (
                        <div className="flex items-center border border-slate-250 rounded bg-white overflow-hidden w-24">
                          <span className="px-1 text-slate-400 border-r border-slate-200">₹</span>
                          <input
                            type="number"
                            value={selectedRitualsMap[r._id] || 0}
                            onChange={(e) => handleRitualPriceChange(r._id, e.target.value)}
                            min={1}
                            className="w-full text-right px-1.5 py-0.5 bg-transparent border-none focus:outline-none text-xs font-bold text-saffron-600"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSaveRateCard}
                className="w-full py-2.5 rounded-lg bg-gold-600 hover:bg-gold-500 text-white font-bold text-xs tracking-wider transition-colors gold-glow cursor-pointer"
              >
                Save Ritual Rate Card
              </button>
            </div>

            {/* Slots Scheduler config */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200/60 pb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-saffron-600" />
                  Availability Slots
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  Add hourly timeslots for each day of the week to enable client bookings.
                </p>
              </div>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const dayConfig = slotsConfig.find(s => s.day === day) || { slots: [] };
                  return (
                    <div key={day} className="space-y-2 border-b border-slate-200/60 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">{day}</span>
                        
                        {/* Quick Add Custom Slot button input helper */}
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddSlot(day, e.target.value);
                              e.target.value = ''; // reset
                            }
                          }}
                          className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[9px] text-slate-650 cursor-pointer focus:outline-none focus:border-saffron-500"
                        >
                          <option value="" className="bg-white text-slate-700">+ Add Slot</option>
                          <option value="08:00 AM - 10:00 AM" className="bg-white text-slate-800">08:00 AM - 10:00 AM</option>
                          <option value="09:00 AM - 12:00 PM" className="bg-white text-slate-800">09:00 AM - 12:00 PM</option>
                          <option value="10:00 AM - 01:00 PM" className="bg-white text-slate-800">10:00 AM - 01:00 PM</option>
                          <option value="02:00 PM - 04:00 PM" className="bg-white text-slate-800">02:00 PM - 04:00 PM</option>
                          <option value="03:00 PM - 06:00 PM" className="bg-white text-slate-800">03:00 PM - 06:00 PM</option>
                          <option value="04:00 PM - 07:00 PM" className="bg-white text-slate-800">04:00 PM - 07:00 PM</option>
                          <option value="06:00 PM - 08:00 PM" className="bg-white text-slate-800">06:00 PM - 08:00 PM</option>
                        </select>
                      </div>

                      {/* Slots render */}
                      <div className="flex flex-wrap gap-1.5">
                        {dayConfig.slots && dayConfig.slots.length > 0 ? (
                          dayConfig.slots.map((s, idx) => (
                            <span 
                              key={idx} 
                              className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-[9px] font-mono px-2 py-0.5 rounded text-slate-600 group"
                            >
                              <span>{s}</span>
                              <button
                                onClick={() => handleRemoveSlot(day, idx)}
                                className="text-slate-400 hover:text-red-650 focus:outline-none bg-transparent border-none cursor-pointer text-xs"
                              >
                                &times;
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-400">No slots defined</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleSaveSlotsConfig}
                className="w-full py-2.5 rounded-lg bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs tracking-wider transition-colors gold-glow cursor-pointer"
              >
                Save Availability Slots
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. ADMINISTRATOR PANEL */}
      {/* ============================================================== */}
      {user.role === 'admin' && adminStats && (
        <div className="space-y-8">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">Registered Customers</span>
              <span className="text-3xl font-extrabold text-slate-800 mt-2">{adminStats.counts.users}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">Registered Pandits</span>
              <span className="text-3xl font-extrabold text-saffron-600 mt-2">
                {adminStats.counts.pandits} 
                <span className="text-xs text-slate-500 font-normal ml-2">({adminStats.panditsBreakdown.verified} verified)</span>
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">Total Bookings</span>
              <span className="text-3xl font-extrabold text-saffron-700 mt-2">{adminStats.counts.bookings}</span>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 block leading-none">Booking Completion Rate</span>
              <span className="text-3xl font-extrabold text-emerald-600 mt-2">{adminStats.completionRate}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left side: Pandit Verification Table */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200/60 pb-2">
                Pending Pandit Verifications ({adminStats.pendingPanditsList.length})
              </h3>

              {adminStats.pendingPanditsList.length > 0 ? (
                <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-4">Name</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Experience</th>
                        <th className="p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {adminStats.pendingPanditsList.map(p => (
                        <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-slate-850 block">{p.user ? p.user.name : 'Unknown'}</span>
                            <span className="text-[10px] text-slate-500">{p.user ? p.user.email : ''}</span>
                          </td>
                          <td className="p-4 text-slate-650">{p.location}</td>
                          <td className="p-4 text-slate-650">{p.experience} Years</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleVerifyPandit(p._id, 'rejected')}
                                className="px-2.5 py-1.5 rounded bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 font-bold cursor-pointer transition-all"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleVerifyPandit(p._id, 'verified')}
                                className="px-2.5 py-1.5 rounded bg-emerald-650 hover:bg-emerald-600 bg-emerald-600 text-white font-bold shadow cursor-pointer transition-all"
                              >
                                Verify & Approve
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 p-8 text-center rounded-xl text-xs text-slate-500 font-medium">
                  No Pandit profiles currently awaiting verification approval.
                </div>
              )}
            </div>

            {/* Right side: Create Ritual Ceremony Form */}
            <form onSubmit={handleCreateRitual} className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-slate-800 border-b border-slate-200/60 pb-2 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-saffron-600" />
                Add Standard Ritual
              </h3>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ceremony Name</label>
                <input
                  type="text"
                  value={newRitualName}
                  onChange={(e) => setNewRitualName(e.target.value)}
                  placeholder="e.g. Durga Puja, Mundan"
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Brief Description</label>
                <textarea
                  value={newRitualDesc}
                  onChange={(e) => setNewRitualDesc(e.target.value)}
                  placeholder="Summarize the spiritual background of the katha/ritual..."
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500 h-16 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Duration (e.g. 2 hours)</label>
                  <input
                    type="text"
                    value={newRitualDuration}
                    onChange={(e) => setNewRitualDuration(e.target.value)}
                    placeholder="2.5 hours"
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Location Allowed</label>
                  <select
                    value={newRitualLocation}
                    onChange={(e) => setNewRitualLocation(e.target.value)}
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-saffron-500 cursor-pointer"
                  >
                    <option value="Both" className="bg-white text-slate-800">Both Home & Temple</option>
                    <option value="Home" className="bg-white text-slate-800">Home Only</option>
                    <option value="Temple" className="bg-white text-slate-800">Temple Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Min Base Price (₹)</label>
                  <input
                    type="number"
                    value={newRitualMinPrice}
                    onChange={(e) => setNewRitualMinPrice(e.target.value)}
                    placeholder="1500"
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Max Base Price (₹)</label>
                  <input
                    type="number"
                    value={newRitualMaxPrice}
                    onChange={(e) => setNewRitualMaxPrice(e.target.value)}
                    placeholder="4000"
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Required Materials (comma separated)</label>
                <input
                  type="text"
                  value={newRitualMaterials}
                  onChange={(e) => setNewRitualMaterials(e.target.value)}
                  placeholder="Ganga Jal, Coconut, Flowers, Ghee"
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-xs tracking-wider transition-colors gold-glow cursor-pointer shadow shadow-saffron-100"
              >
                Create Ritual Category
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
