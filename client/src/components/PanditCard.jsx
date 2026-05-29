import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Globe, MapPin, Star, ShieldCheck } from 'lucide-react';

const PanditCard = ({ pandit }) => {
  const { user, bio, languages, location, experience, rituals, rating, isVerified, _id } = pandit;

  // Find lowest price
  const basePrice = rituals && rituals.length > 0
    ? Math.min(...rituals.map(r => r.price))
    : null;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden gold-glow-hover flex flex-col justify-between transition-all duration-300">
      <div className="p-6">
        {/* Header Profile Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-saffron-900/30 border border-saffron-500/30 flex items-center justify-center font-serif text-2xl font-bold text-saffron-500">
              {user && user.name ? user.name.split(' ').slice(-1)[0][0] : 'P'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-lg font-semibold text-white tracking-wide">
                  {user ? user.name : 'Pandit Ji'}
                </h3>
                {isVerified === 'verified' && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 fill-emerald-500/10" title="Verified Pandit" />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg text-xs font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Experience & Languages */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-300 border-y border-white/5 py-3 mb-4">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-gold-500" />
            <span>{experience} Years Exp.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-saffron-500" />
            <span>{languages.join(', ')}</span>
          </div>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {bio}
        </p>

        {/* Puja Rates Preview */}
        {rituals && rituals.length > 0 && (
          <div className="space-y-2 mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Ceremony Pricing Preview</span>
            <div className="grid grid-cols-2 gap-2">
              {rituals.slice(0, 2).map((r, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-lg p-2 flex flex-col">
                  <span className="text-[10px] text-slate-400 truncate">{r.ritual ? r.ritual.name : 'Puja'}</span>
                  <span className="text-xs font-bold text-gold-500">₹{r.price}</span>
                </div>
              ))}
              {rituals.length > 2 && (
                <div className="bg-white/5 border border-white/5 rounded-lg p-2 flex items-center justify-center text-[10px] text-slate-500">
                  +{rituals.length - 2} more services
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer / CTA */}
      <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between mt-auto">
        <div>
          {basePrice && (
            <>
              <span className="text-[10px] text-slate-500 block leading-none">Starting from</span>
              <span className="text-lg font-extrabold text-white">₹{basePrice}</span>
            </>
          )}
        </div>
        <Link
          to={`/profile/${_id}`}
          className="px-4 py-2 rounded-lg bg-saffron-600/20 border border-saffron-500/30 hover:bg-saffron-600 hover:border-saffron-500 text-saffron-400 hover:text-white font-medium text-xs transition-all duration-300"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default PanditCard;
