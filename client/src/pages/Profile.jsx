import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import { Star, MapPin, Award, Globe, ShieldCheck, Calendar, ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API_URL } = useAuth();

  const [pandit, setPandit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPanditDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/pandits/${id}`);
        const data = await res.json();
        if (data.success) {
          setPandit(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPanditDetails();
  }, [id, API_URL]);

  const handleBookTrigger = () => {
    if (!user) {
      // Prompt sign in
      navigate('/auth');
      return;
    }
    if (user.role !== 'customer') {
      setErrorMsg("Only customer accounts can book puja services.");
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }
    setIsBookingOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg('Spiritual ceremony request sent successfully! Track state on your dashboard.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSuccessMsg(''), 6000);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-saffron-500 border-t-transparent animate-spin mx-auto" />
        <span className="text-xs text-slate-400">Loading profile details...</span>
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-slate-800">Profile Not Found</h3>
        <p className="text-xs text-slate-500">The requested priest profile is missing or inactive.</p>
        <Link to="/search" className="text-saffron-600 underline text-sm">Return to search directory</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 bg-spiritual-dark">
      {/* Success Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold p-4 rounded-xl flex items-start gap-2.5 shadow-md shadow-emerald-100/30">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-650 text-sm font-semibold p-4 rounded-xl">
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Back button */}
      <Link to="/search" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-saffron-600 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to listings
      </Link>

      {/* Main Profile Header Card */}
      <div className="glass-panel rounded-3xl border border-slate-200/60 overflow-hidden flex flex-col md:flex-row items-center md:items-start p-8 gap-8 bg-white">
            {!imageError && pandit.profilePic ? (
              <img
                src={pandit.profilePic}
                alt={pandit.user ? pandit.user.name : 'Pandit'}
                className="w-32 h-32 rounded-full object-cover border-2 border-saffron-200 shrink-0 shadow-lg"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-saffron-50 border-2 border-saffron-200 flex items-center justify-center font-serif text-5xl font-bold text-saffron-600 shrink-0 shadow-lg">
                {pandit.user ? pandit.user.name.split(' ').slice(-1)[0][0] : 'P'}
              </div>
            )}

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="font-serif text-3xl font-bold text-slate-800 tracking-wide">
                  {pandit.user ? pandit.user.name : 'Pandit Ji'}
                </h2>
                {pandit.isVerified === 'verified' && (
                  <ShieldCheck className="w-6 h-6 text-emerald-600 fill-emerald-50" title="Verified Priest" />
                )}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-slate-500 mt-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{pandit.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl font-bold text-amber-700 text-sm">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{pandit.rating.toFixed(1)} out of 5</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-slate-600 border-t border-slate-200/60 pt-4">
            <div className="flex items-center gap-1.5">
              <Award className="w-5 h-5 text-gold-600" />
              <span>{pandit.experience} Years of Active Experience</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-5 h-5 text-saffron-600" />
              <span>Speaks {pandit.languages.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Columns (Bio & Working Hours) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 space-y-3 bg-white">
            <h3 className="font-serif text-lg font-semibold text-slate-800 border-b border-slate-200/60 pb-2">Spiritual Profile</h3>
            <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-line">
              {pandit.bio}
            </p>
          </div>

          {/* Working Schedule */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 space-y-4 bg-white">
            <h3 className="font-serif text-lg font-semibold text-slate-800 border-b border-slate-200/60 pb-2">Availability Calendar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pandit.availabilitySlots.map((s, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">{s.day}</span>
                    <span className="text-[10px] uppercase font-bold text-saffron-600 mt-1 block">Active slots</span>
                  </div>
                  <div className="text-right space-y-1">
                    {s.slots.length > 0 ? (
                      s.slots.map((sl, i) => (
                        <span key={i} className="text-xs text-slate-500 block font-mono">{sl}</span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 block">Not Available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Quick Booking Call-to-action */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="glass-panel p-6 rounded-2xl border border-saffron-200/60 space-y-6 bg-gradient-to-b from-saffron-50 via-white to-white text-center shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-saffron-600 block">Schedule devotions</span>
              <h3 className="font-serif text-xl font-bold text-slate-800 mt-1">Book Ceremony Now</h3>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Book this certified Pandit Ji for customized rituals. Send a booking request with your location details.
            </p>

            <button
              onClick={handleBookTrigger}
              className="w-full py-3 rounded-xl bg-saffron-600 hover:bg-saffron-500 text-white font-bold text-sm tracking-wide transition-all gold-glow flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-saffron-100"
            >
              <Calendar className="w-4 h-4 animate-pulse-slow" />
              <span>Book Appointment</span>
            </button>

            <span className="text-[9px] text-slate-400 block uppercase font-bold">Safe booking guaranteed</span>
          </div>

          {/* Detailed Pricing Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200/60 space-y-4 bg-white">
            <h3 className="font-serif text-base font-semibold text-slate-800 border-b border-slate-200/60 pb-2">Ceremony Rate Chart</h3>
            <div className="space-y-3">
              {pandit.rituals && pandit.rituals.length > 0 ? (
                pandit.rituals.map((r) => (
                  <div key={r.ritual._id} className="flex items-center justify-between gap-4 text-sm border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                    <div>
                      <span className="font-medium text-slate-700 block">{r.ritual.name}</span>
                      <span className="text-[10px] text-slate-400 block leading-none">Est: {r.ritual.duration}</span>
                    </div>
                    <span className="font-extrabold text-saffron-600 shrink-0">₹{r.price}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center py-4">No ritual rates set yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          pandit={pandit}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default Profile;
