import React, { useState, useEffect } from 'react';
import { Shield, ExternalLink, Sparkles, Award, Star, HeartHandshake, ArrowRight } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredSponsors } from '../../utils/portalData';

export const SponsorsSection = ({ onOpenSponsorModal }) => {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const loadSponsors = () => {
      const all = getStoredSponsors();
      setSponsors(all.filter(s => s.status === 'ACTIVE'));
    };

    loadSponsors();

    const handleUpdate = () => loadSponsors();
    window.addEventListener('portal_sponsors_updated', handleUpdate);
    return () => window.removeEventListener('portal_sponsors_updated', handleUpdate);
  }, []);

  return (
    <section id="sponsors" className="w-full">
      <div className="rounded-2xl p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#E2E8F0] pb-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-montserrat font-bold uppercase tracking-wider mb-2">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>OFFICIAL PARTNERS</span>
            </div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-[#0F172A] uppercase tracking-wider">
              SPONSORS & SUPPORTERS
            </h3>
            <p className="font-rajdhani text-xs text-[#64748B] font-medium mt-0.5">
              Empowering High-Stakes Esports & The Live tournaments.in Community
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 font-bold">
              {sponsors.length} Verified Partners
            </span>
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenSponsorModal?.();
              }}
              className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-montserrat font-extrabold uppercase transition-all cursor-pointer shadow-xs"
            >
              + Partner With Us
            </button>
          </div>
        </div>

        {/* Sponsors Grid */}
        {sponsors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {sponsors.map((sponsor) => (
              <a
                key={sponsor.id}
                href={sponsor.link || '#'}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                onMouseEnter={() => soundFx.playHover()}
                className="group p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer hover:shadow-md transform hover:-translate-y-1"
              >
                <div>
                  {/* Logo & Tier Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-montserrat font-bold uppercase tracking-wider ${
                      sponsor.tier === 'TITLE'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : sponsor.tier === 'PLATINUM'
                        ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {sponsor.tier || 'OFFICIAL'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#64748B] group-hover:text-amber-600 transition-colors" />
                  </div>

                  {/* Sponsor Image / Logo */}
                  <div className="w-full h-24 rounded-lg bg-white border border-[#E2E8F0] group-hover:border-amber-300 flex items-center justify-center p-3 mb-3 overflow-hidden shadow-2xs">
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain filter transition-all group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 font-montserrat font-bold text-xs">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>{sponsor.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <h4 className="font-montserrat font-bold text-sm text-[#0F172A] group-hover:text-amber-700 transition-colors">
                    {sponsor.name}
                  </h4>
                  <p className="font-rajdhani text-xs text-[#64748B] mt-1 line-clamp-2">
                    {sponsor.description || 'Proud official partner backing championship matches and competitive prize pools.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-700 font-bold">● Active Partner</span>
                  <span className="text-[#64748B] group-hover:text-amber-700 flex items-center gap-1">
                    Visit <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center text-xs font-rajdhani text-[#64748B]">
            Partnerships open for registration. Click "Partner With Us" to feature your brand on Live tournaments.in.
          </div>
        )}

      </div>
    </section>
  );
};

export default SponsorsSection;
