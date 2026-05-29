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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 animate-pulse-once bg-white">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/60 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Book Sacred Ceremony</h3>
            <p className="text-xs text-slate-500">with {pandit.user ? pandit.user.name : 'Pandit Ji'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto bg-white">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Ritual Selection & Pricing */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Ritual Ceremony</label>
            <div className="flex gap-4">
              <select
                value={ritualId}
                onChange={handleRitualChange}
                className="flex-1 rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-saffron-500 cursor-pointer"
              >
                {pandit.rituals.map(r => (
                  <option key={r.ritual._id} value={r.ritual._id} className="bg-white text-slate-800">
                    {r.ritual.name}
                  </option>
                ))}
              </select>
              <div className="w-28 bg-saffron-50 border border-saffron-200 rounded-lg p-2 text-center flex flex-col justify-center">
                <span className="text-[9px] uppercase font-bold text-saffron-700 block leading-none">Cost Rate</span>
                <span className="text-sm font-extrabold text-saffron-700">₹{selectedPrice}</span>
              </div>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-saffron-600" />
                Select Date
              </label>
              <input
                type="date"
                value={date}
                min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // from tomorrow onwards
                onChange={handleDateChange}
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-saffron-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold-600" />
                Time Slot
              </label>
              {dayOfWeek ? (
                availableSlots.length > 0 ? (
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-saffron-500 cursor-pointer"
                    required
                  >
                    {availableSlots.map((s, idx) => (
                      <option key={idx} value={s} className="bg-white text-slate-800">
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-rose-600 py-2 border border-rose-200 bg-rose-50 rounded-lg px-3">
                    No open slots on {dayOfWeek}. Please choose another date.
                  </div>
                )
              ) : (
                <div className="text-xs text-slate-500 py-2 border border-slate-200 bg-slate-50 rounded-lg px-3">
                  Please select date first
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2.5 border-t border-slate-200/60 pt-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              Ceremony Location Address
            </span>
            <div className="space-y-2">
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Street Address, Apartment/House No."
                className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                  required
                />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="PIN Code"
                  className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 border-t border-slate-200/60 pt-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <NotepadText className="w-3.5 h-3.5 text-slate-500" />
              Special Requests / Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring special puja materials, specify language preferences, outdoor/indoor arrangements..."
              className="w-full rounded-lg bg-white border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-saffron-500 h-20 resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="border-t border-slate-200/60 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (date && availableSlots.length === 0)}
              className="px-5 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-500 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-400 text-white text-sm font-bold transition-colors gold-glow flex items-center gap-1.5 cursor-pointer"
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
