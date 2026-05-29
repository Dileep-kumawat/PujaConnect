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
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
      case 'accepted':
        return 'bg-blue-50 text-blue-700 border border-blue-200/60';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border border-rose-200/60';
      case 'cancelled':
        return 'bg-slate-100 text-slate-600 border border-slate-200/60';
      default:
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    }
  };

  const getStepClass = (stepName, currentStatus) => {
    const states = ['pending', 'accepted', 'completed'];
    const currentIndex = states.indexOf(currentStatus);
    const stepIndex = states.indexOf(stepName);

    if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
      return 'bg-slate-100 border-slate-200 text-slate-400';
    }

    if (stepIndex < currentIndex) {
      return 'bg-emerald-50 border-emerald-500 text-emerald-600';
    } else if (stepIndex === currentIndex) {
      return 'bg-saffron-50 border-saffron-500 text-saffron-600 gold-glow';
    } else {
      return 'bg-slate-50 border-slate-200 text-slate-400';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-200/60 bg-white space-y-6">
      {/* Upper Panel: Ritual Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-saffron-600 tracking-wider">Religious Ceremony</span>
          <h3 className="font-serif text-xl font-semibold text-slate-800 mt-0.5">
            {ritual ? ritual.name : 'Unknown Ritual'}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-saffron-600">₹{price}</span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Middle Panel: Details (DateTime, Address, Connected Party) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-saffron-600" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-gold-600" />
            <span>{timeSlot}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
            <div>
              <span>{address.street}, {address.city}</span>
              <span className="text-xs text-slate-400 block">PIN: {address.postalCode}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t md:border-t-0 md:border-l border-slate-200/60 pt-3 md:pt-0 md:pl-4">
          <div className="flex items-center gap-2.5">
            <User className="w-4 h-4 text-amber-500" />
            <div>
              <span className="text-xs text-slate-400 block">{role === 'customer' ? 'Assigned Pandit' : 'Client Customer'}</span>
              <span className="font-semibold text-slate-800">
                {role === 'customer' 
                  ? (pandit && pandit.user ? pandit.user.name : 'Pandit Ji')
                  : (customer ? customer.name : 'Client')}
              </span>
              <span className="text-xs text-slate-500 block">
                Phone: {role === 'customer' 
                  ? (pandit && pandit.user ? pandit.user.phone : 'N/A')
                  : (customer ? customer.phone : 'N/A')}
              </span>
            </div>
          </div>

          {notes && (
            <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 text-xs text-slate-600 rounded-lg p-2">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <p className="line-clamp-2"><strong>Notes: </strong>{notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Tracker Timeline */}
      {status !== 'rejected' && status !== 'cancelled' && (
        <div className="border-t border-slate-200/60 pt-6">
          <div className="relative flex justify-between items-center w-full max-w-md mx-auto">
            {/* Background Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-slate-250 bg-slate-200 -z-10 top-1/2 -translate-y-1/2" />
            
            {/* Step 1: Requested */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStepClass('pending', status)}`}>
                1
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Requested</span>
            </div>

            {/* Step 2: Confirmed */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStepClass('accepted', status)}`}>
                2
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Confirmed</span>
            </div>

            {/* Step 3: Completed */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${getStepClass('completed', status)}`}>
                3
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Performed</span>
            </div>
          </div>
        </div>
      )}

      {/* Action panel */}
      {onStatusUpdate && (
        <div className="border-t border-slate-200/60 pt-4 flex items-center justify-end gap-3">
          {/* Customer Cancelling Action */}
          {role === 'customer' && (status === 'pending' || status === 'accepted') && (
            <button
              onClick={() => onStatusUpdate(_id, 'cancelled')}
              className="px-3.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
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
                className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100/80 text-red-600 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={() => onStatusUpdate(_id, 'accepted')}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow shadow-emerald-250 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Accept Booking
              </button>
            </>
          )}

          {role === 'pandit' && status === 'accepted' && (
            <button
              onClick={() => onStatusUpdate(_id, 'completed')}
              className="px-3.5 py-1.5 rounded-lg bg-gold-600 hover:bg-gold-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow shadow-gold-150 cursor-pointer"
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
