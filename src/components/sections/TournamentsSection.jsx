import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Swords, Trophy, MapPin, Users, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredTournaments, getTournamentBanner } from '../../utils/portalData';

export const TournamentsSection = ({ onOpenTournamentModal }) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [tournaments, setTournaments] = useState(getStoredTournaments());

  useEffect(() => {
    const handleUpdate = () => {
      setTournaments(getStoredTournaments());
    };
    window.addEventListener('portal_tournaments_updated', handleUpdate);
    return () => window.removeEventListener('portal_tournaments_updated', handleUpdate);
  }, []);

  const activeTournaments = tournaments.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
  const historicTournaments = tournaments.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'HISTORIC' || t.status === 'COMPLETED');

  // Ensure exactly 4 tournament cards are shown for sample / live display
  const displayedTournaments = activeTab === 'ACTIVE' 
    ? (activeTournaments.length > 0 ? activeTournaments.slice(0, 4) : tournaments.slice(0, 4))
    : (historicTournaments.length > 0 ? historicTournaments.slice(0, 4) : tournaments.slice(0, 4));

  return (
    <section id="tournaments" className="w-full">
      <div className="rounded-2xl p-5 sm:p-7 bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>TOURNAMENTS HUB</span>
            </h3>
            <p className="font-rajdhani text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
              Competitive Esports Cards & Limited Squad Slots Hub
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => soundFx.playClick()}
              aria-label="Previous Tournaments"
              className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-amber-400 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => soundFx.playClick()}
              aria-label="Next Tournaments"
              className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-amber-400 transition-all cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-6 border-b border-[#E2E8F0] mb-5">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('ACTIVE');
            }}
            className={`pb-2.5 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            ACTIVE ({activeTournaments.length})
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('HISTORIC');
            }}
            className={`pb-2.5 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'HISTORIC'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            HISTORIC ({historicTournaments.length})
          </button>
        </div>

        {/* Urgency Highlight Announcement Strip */}
        <div className="mb-6 p-3 sm:p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-montserrat font-bold text-amber-700 uppercase tracking-wider">
              • LIMITED REGISTRATION
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="font-montserrat font-extrabold text-xs sm:text-sm text-[#0F172A] uppercase">
              ONLY <strong className="text-amber-600 font-black">25 SLOTS</strong> FOR SQUAD LIMITED
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#64748B]">
            <span className="text-emerald-700 font-bold">● SLOTS 01 – 25</span>
            <span>•</span>
            <span className="uppercase text-slate-700 font-medium">FIRST COME FIRST SERVED</span>
          </div>
        </div>

        {/* 4 Tournament Cards in a Single Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedTournaments.map((t, idx) => (
            <div
              key={t.id || idx}
              className="group rounded-xl bg-white border border-[#E2E8F0] hover:border-amber-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
            >
              {/* Card Banner: High-Impact Tournament Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-black/80">
                <img
                  src={getTournamentBanner(t)}
                  alt={t.title || 'Tournament Card'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85] contrast-[1.05]"
                  onError={(e) => {
                    e.target.src = '/assets/banners/championship.jpg';
                  }}
                />
                
                {/* Vignette gradients for text readability on top of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                {/* Floating Top Header Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/40 text-amber-400 text-[9px] font-montserrat font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ACTIVE</span>
                  </div>
                  <span className="text-[9px] font-montserrat font-bold text-amber-400 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-slate-700 uppercase tracking-wider">
                    {t.tag || t.category || 'PRO SQUAD'}
                  </span>
                </div>

                {/* Title & Prize Pool overlay on Banner */}
                <div className="absolute bottom-2.5 left-3 right-3 z-10">
                  <h4 className="font-montserrat font-black text-xs sm:text-sm text-white tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
                    {t.title || `TOURNAMENT ${idx + 1}`}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-rajdhani mt-0.5">
                    <span className="text-slate-200 font-medium drop-shadow truncate">
                      {t.date || 'Active 16 — June 19, 2026'}
                    </span>
                    <span className="text-amber-400 font-extrabold font-mono text-xs tracking-wider drop-shadow shrink-0 ml-1">
                      {t.prizePool || t.prize || '₹2,50,000 INR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body: Match Specs & Action (White Background) */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                
                {/* 3-Column Match Specs Pill */}
                <div className="grid grid-cols-3 gap-1 text-center text-[11px] font-mono bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#64748B] uppercase font-sans">Map</span>
                    <strong className="text-[#0F172A] font-bold truncate mt-0.5">{t.map || 'Erangel'}</strong>
                  </div>
                  <div className="flex flex-col border-x border-[#E2E8F0]">
                    <span className="text-[9px] text-[#64748B] uppercase font-sans">Format</span>
                    <strong className="text-teal-700 font-bold truncate mt-0.5">{(t.format || 'Squad Championship').split(' ')[0]}</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#64748B] uppercase font-sans">Slots</span>
                    <strong className="text-amber-700 font-bold truncate mt-0.5">{t.totalSlots || 25} Limit</strong>
                  </div>
                </div>

                {/* Slots Filled Capacity Indicator */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#64748B] uppercase font-sans">Verified Capacity</span>
                    <span className="text-amber-700 font-bold">
                      {t.filledSlots || 18} / {t.totalSlots || 25} Teams
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round(((t.filledSlots || 18) / (t.totalSlots || 25)) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Action Button: REGISTER FOR UPCOMING TOURNAMENTS */}
                <button
                  onClick={() => {
                    soundFx.playModalOpen();
                    onOpenTournamentModal?.(t);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  className="w-full py-2.5 rounded-lg bg-[#E5C05B] hover:bg-[#F3CF7A] text-slate-950 font-montserrat font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-1.5 group-hover:scale-[1.01]"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>REGISTER FOR UPCOMING TOURNAMENTS</span>
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TournamentsSection;
