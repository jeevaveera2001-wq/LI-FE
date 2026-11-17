import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Swords, Trophy, MapPin, Users, Calendar, ShieldCheck, Flame } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredTournaments } from '../../utils/portalData';

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
    <section id="tournaments" className="w-full mb-8">
      <div className="rounded-2xl p-5 sm:p-7 bg-[#0C0F15] border border-[#1E2433] relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#E5C05B]" />
              <span>LIVE TOURNAMENTS</span>
            </h3>
            <p className="font-rajdhani text-xs sm:text-sm text-[#788294] font-medium mt-0.5">
              Competitive Battles & Limited Squad Slots
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => soundFx.playClick()}
              aria-label="Previous Tournaments"
              className="w-8 h-8 rounded-lg bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] hover:border-[#E5C05B]/40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => soundFx.playClick()}
              aria-label="Next Tournaments"
              className="w-8 h-8 rounded-lg bg-[#131722] border border-[#222A3A] flex items-center justify-center text-[#788294] hover:text-[#E5C05B] hover:border-[#E5C05B]/40 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-6 border-b border-[#1A202C] mb-5">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('ACTIVE');
            }}
            className={`pb-2.5 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'text-[#E5C05B] border-b-2 border-[#E5C05B]'
                : 'text-[#64748B] hover:text-[#CBD5E1]'
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
                ? 'text-[#E5C05B] border-b-2 border-[#E5C05B]'
                : 'text-[#64748B] hover:text-[#CBD5E1]'
            }`}
          >
            HISTORIC ({historicTournaments.length})
          </button>
        </div>

        {/* Urgency Highlight Announcement Strip */}
        <div className="mb-6 p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#11151E] via-[#161C2A] to-[#11151E] border border-[#E5C05B]/30 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E5C05B] animate-ping" />
            <span className="text-[10px] sm:text-[11px] font-montserrat font-bold text-[#E5C05B] uppercase tracking-wider">
              • LIMITED REGISTRATION
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="font-montserrat font-extrabold text-xs sm:text-sm text-white uppercase">
              ONLY <strong className="text-[#E5C05B]">25 SLOTS</strong> FOR SQUAD LIMITED
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono text-[#788294]">
            <span className="text-emerald-400 font-bold">● SLOTS 01 – 25</span>
            <span>•</span>
            <span className="uppercase text-gray-300">FIRST COME FIRST SERVED</span>
          </div>
        </div>

        {/* 4 Tournament Cards in a Single Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayedTournaments.map((t, idx) => (
            <div
              key={t.id || idx}
              className="group rounded-xl bg-[#11151E] border border-[#1E2536] hover:border-[#E5C05B]/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_0_20px_rgba(229,192,91,0.15)]"
            >
              {/* Card Banner: Hero Section Page Background Image */}
              <div className="relative h-36 w-full overflow-hidden bg-black/60">
                <img
                  src="/assets/conqueror_badge.jpg"
                  alt={t.title || 'Tournament Card'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85] contrast-[1.05]"
                />
                
                {/* Vignette gradients for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#11151E] via-[#11151E]/40 to-black/50 pointer-events-none" />

                {/* Floating Top Header Badges */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-[#E5C05B]/40 text-[#E5C05B] text-[9px] font-montserrat font-bold tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ACTIVE</span>
                  </div>
                  <span className="text-[9px] font-montserrat font-bold text-[#E5C05B] px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-[#2B3448] uppercase tracking-wider">
                    {t.tag || t.category || 'BOTSQUADWAR'}
                  </span>
                </div>

                {/* Title & Prize Pool overlay on Banner */}
                <div className="absolute bottom-2.5 left-3 right-3 z-10">
                  <h4 className="font-montserrat font-black text-xs sm:text-sm text-white tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] truncate">
                    {t.title || `TOURNAMENT ${idx + 1}`}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-rajdhani mt-0.5">
                    <span className="text-gray-300 font-medium drop-shadow truncate">
                      {t.date || 'Active 16 — June 19, 2026'}
                    </span>
                    <span className="text-[#E5C05B] font-extrabold font-mono text-xs tracking-wider drop-shadow shrink-0 ml-1">
                      {t.prizePool || t.prize || '₹2,50,000 INR'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body: Match Specs & Action */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                
                {/* 3-Column Match Specs Pill */}
                <div className="grid grid-cols-3 gap-1 text-center text-[11px] font-mono bg-black/40 p-2 rounded-lg border border-[#1A202C]">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#64748B] uppercase font-sans">Map</span>
                    <strong className="text-white font-bold truncate mt-0.5">{t.map || 'Erangel'}</strong>
                  </div>
                  <div className="flex flex-col border-x border-[#1E2536]">
                    <span className="text-[9px] text-[#64748B] uppercase font-sans">Format</span>
                    <strong className="text-teal-400 font-bold truncate mt-0.5">{(t.format || 'Squad War').split(' ')[0]}</strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#64748B] uppercase font-sans">Slots</span>
                    <strong className="text-[#E5C05B] font-bold truncate mt-0.5">{t.totalSlots || 25} Limit</strong>
                  </div>
                </div>

                {/* Slots Filled Capacity Indicator */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#64748B] uppercase font-sans">Verified Capacity</span>
                    <span className="text-[#E5C05B] font-bold">
                      {t.filledSlots || 18} / {t.totalSlots || 25} Teams
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#1A202C] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 via-[#E5C05B] to-[#FFDE00] rounded-full transition-all duration-500"
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
                  className="w-full py-2.5 rounded-lg bg-[#E5C05B] hover:bg-[#F3CF7A] text-[#0A0D12] font-montserrat font-extrabold text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(229,192,91,0.2)] hover:shadow-[0_0_18px_rgba(229,192,91,0.35)] flex items-center justify-center gap-1.5 group-hover:scale-[1.01]"
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
