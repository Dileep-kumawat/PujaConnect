import React from 'react';
import { Calendar, Clock, MapPin, User, Check, X, Ban, Award, FileText } from 'lucide-react';

const BookingCard = ({ booking, role, onStatusUpdate }) => {
  const { _id, customer, pandit, ritual, date, timeSlot, address, price, status, notes } = booking;

  // Format Date
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getStatusStyle = (statusVal) => {
    switch (statusVal) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      case 'cancelled':
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    }
  };

  const getStepClass = (stepName, currentStatus) => {
    const states = ['pending', 'accepted', 'completed'];
    const currentIndex = states.indexOf(currentStatus);
    const stepIndex = states.indexOf(stepName);

    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
      return 'bg-slate-900 border-white/5 text-slate-500';
    }

    if (stepIndex < currentIndex) {
      return 'bg-emerald-500/20 border-emerald-400 text-emerald-400';
    } else if (stepIndex === currentIndex) {
      return 'bg-saffron-500/20 border-saffron-400 text-saffron-400 gold-glow';
    } else {
      return 'bg-slate-900 border-white/5 text-slate-600';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
      {/* Upper Panel: Ritual Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-saffron-500 tracking-wider">Religious Ceremony</span>
          <h3 className="font-serif text-xl font-semibold text-white mt-0.5">
            {ritual ? ritual.name : 'Unknown Ritual'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gold-500">₹{price}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Middle Panel: Details (DateTime, Address, Connected Party) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-saffron-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-gold-500" />
            <span>{timeSlot}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
            <div>
              <span>{address.street}, {address.city}</span>
              <span className="text-xs text-slate-500 block">PIN: {address.postalCode}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs text-slate-500 block">{role === 'customer' ? 'Assigned Pandit' : 'Client Customer'}</span>
              <span className="font-semibold text-white">
                {role === 'customer' 
                  ? (pandit && pandit.user ? pandit.user.name : 'Pandit Ji')
                  : (customer ? customer.name : 'Client')}
              </span>
              <span className="text-xs text-slate-400 block">
                Phone: {role === 'customer' 
                  ? (pandit && pandit.user ? pandit.user.phone : 'N/A')
                  : (customer ? customer.phone : 'N/A')}
              </span>
            </div>
          </div>

          {notes && (
            <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-slate-400">
              <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <p className="line-clamp-2"><strong>Notes: </strong>{notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Tracker Timeline */}
      {status !== 'rejected' && status !== 'cancelled' && (
        <div className="border-t border-white/5 pt-6">
          <div className="relative flex justify-between items-center w-full max-w-md mx-auto">
            {/* Background Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-white/5 -z-10 top-1/2 -translate-y-1/2" />
            
            {/* Step 1: Requested */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStepClass('pending', status)}`}>
                1
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Requested</span>
            </div>

            {/* Step 2: Confirmed */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStepClass('accepted', status)}`}>
                2
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Confirmed</span>
            </div>

            {/* Step 3: Completed */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStepClass('completed', status)}`}>
                3
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Performed</span>
            </div>
          </div>
        </div>
      )}

      {/* Action panel */}
      {onStatusUpdate && (
        <div className="border-t border-white/5 pt-4 flex items-center justify-end gap-3">
          {/* Customer Cancelling Action */}
          {role === 'customer' && (status === 'pending' || status === 'accepted') && (
            <button
              onClick={() => onStatusUpdate(_id, 'cancelled')}
              className="px-3.5 py-1.5 rounded-lg border border-red-500/20 bg-red-950/10 hover:bg-red-950/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Ban className="w-3.5 h-3.5" />
              Cancel Ceremony
            </button>
          )}

          {/* Pandit Actions */}
          {role === 'pandit' && status === 'pending' && (
            <>
              <button
                onClick={() => onStatusUpdate(_id, 'rejected')}
                className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-semibold flex items-center gap-1 transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={() => onStatusUpdate(_id, 'accepted')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/50"
              >
                <Check className="w-3.5 h-3.5" />
                Accept Booking
              </button>
            </>
          )}

          {role === 'pandit' && status === 'accepted' && (
            <button
              onClick={() => onStatusUpdate(_id, 'completed')}
              className="px-3.5 py-1.5 rounded-lg bg-gold-600/90 hover:bg-gold-600 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-gold-950/50"
            >
              <Check className="w-3.5 h-3.5" />
              Mark Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingCard;
