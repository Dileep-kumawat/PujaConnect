import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, NotepadText } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, pandit, onSubmit }) => {
  const [ritualId, setRitualId] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [date, setDate] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState(pandit ? pandit.location : '');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (pandit && pandit.rituals && pandit.rituals.length > 0) {
      // Pre-select first ritual
      setRitualId(pandit.rituals[0].ritual._id);
      setSelectedPrice(pandit.rituals[0].price);
    }
  }, [pandit]);

  // Handle ritual change to update pricing
  const handleRitualChange = (e) => {
    const selectedId = e.target.value;
    setRitualId(selectedId);
    
    const selected = pandit.rituals.find(r => r.ritual._id === selectedId);
    if (selected) {
      setSelectedPrice(selected.price);
    }
  };

  // Handle date change to filter availability slots by day of week
  const handleDateChange = (e) => {
    const selectedDateStr = e.target.value;
    setDate(selectedDateStr);
    
    if (!selectedDateStr) {
      setDayOfWeek('');
      setAvailableSlots([]);
      setTimeSlot('');
      return;
    }

    const selectedDate = new Date(selectedDateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDayName = days[selectedDate.getDay()];
    setDayOfWeek(selectedDayName);

    // Find Pandit slots for this day
    const dayConfig = pandit.availabilitySlots.find(s => s.day === selectedDayName);
    if (dayConfig && dayConfig.slots && dayConfig.slots.length > 0) {
      setAvailableSlots(dayConfig.slots);
      setTimeSlot(dayConfig.slots[0]); // pre-select first slot
    } else {
      setAvailableSlots([]);
      setTimeSlot('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!ritualId || !date || !timeSlot || !street || !city || !postalCode) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    const bookingData = {
      panditId: pandit._id,
      ritualId,
      date,
      timeSlot,
      address: { street, city, postalCode },
      notes
    };

    const res = await onSubmit(bookingData);
    setSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message || 'Booking failed');
    }
  };

  if (!isOpen || !pandit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-pulse-once">
        {/* Header */}
        <div className="px-6 py-4 bg-spiritual-slate border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Book Sacred Ceremony</h3>
            <p className="text-xs text-slate-400">with {pandit.user ? pandit.user.name : 'Pandit Ji'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Ritual Selection & Pricing */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Ritual Ceremony</label>
            <div className="flex gap-4">
              <select
                value={ritualId}
                onChange={handleRitualChange}
                className="flex-1 rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
              >
                {pandit.rituals.map(r => (
                  <option key={r.ritual._id} value={r.ritual._id} className="bg-spiritual-slate text-white">
                    {r.ritual.name}
                  </option>
                ))}
              </select>
              <div className="w-28 bg-saffron-950/20 border border-saffron-500/20 rounded-lg p-2 text-center flex flex-col justify-center">
                <span className="text-[9px] uppercase font-bold text-saffron-400 block leading-none">Cost Rate</span>
                <span className="text-sm font-extrabold text-white">₹{selectedPrice}</span>
              </div>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-saffron-500" />
                Select Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // from tomorrow onwards
                onChange={handleDateChange}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-500" />
                Time Slot
              </label>
              {dayOfWeek ? (
                availableSlots.length > 0 ? (
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron-500"
                    required
                  >
                    {availableSlots.map((s, idx) => (
                      <option key={idx} value={s} className="bg-spiritual-slate text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-rose-400 py-2 border border-rose-500/10 bg-rose-500/5 rounded-lg px-3">
                    No open slots on {dayOfWeek}. Please choose another date.
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-500 py-2 border border-white/5 bg-white/5 rounded-lg px-3">
                  Please select date first
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2.5 border-t border-white/5 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Ceremony Location Address
            </span>
            <div className="space-y-2">
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street Address, Apartment/House No."
                className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                  required
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="PIN Code"
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 border-t border-white/5 pt-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <NotepadText className="w-3.5 h-3.5 text-slate-400" />
              Special Requests / Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring special puja materials, specify language preferences, outdoor/indoor arrangements..."
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-saffron-500 h-20 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="border-t border-white/5 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (date && availableSlots.length === 0)}
              className="px-5 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-500 disabled:bg-slate-800 disabled:border-white/5 disabled:text-slate-500 text-white text-sm font-bold transition-colors gold-glow flex items-center gap-1.5"
            >
              {submitting ? 'Sending Request...' : 'Send Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
