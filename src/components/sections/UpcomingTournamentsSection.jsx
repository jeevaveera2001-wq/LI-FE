import React from 'react';
import { Calendar, Swords, Trophy, Clock, ChevronLeft, ChevronRight, Sparkles, MapPin, Users, Award } from 'lucide-react';
import { soundFx } from '../../utils/audio';

const UPCOMING_TOURNAMENTS_DATA = [
  {
    id: 'up-1',
    title: 'UPCOMING TOURNAMENT 1 (SOLO CLASH)',
    category: 'SOLO BATTLE',
    format: 'Solo TPP Sanhok',
    prizePool: '₹2,50,000 INR',
    prize: '₹2,50,000 INR',
    entryFee: 0,
    entryFeeText: 'FREE ENTRY (₹0)',
    isFree: true,
    regEndsDate: 'Registration Ends: July 04, 2026 • 11:59 PM',
    date: 'Starts July 05, 2026',
    time: '6:00 PM IST',
    map: 'Sanhok',
    slots: '100 Solo Slots Limit',
    totalSlots: 100,
    filledSlots: 14,
    status: 'UPCOMING',
    tag: 'SOLO BATTLE',
    banner: '/assets/banners/sanhok.jpg'
  },
  {
    id: 'up-2',
    title: 'UPCOMING TOURNAMENT 2 (DUO SHOWDOWN)',
    category: 'DUO CLASH',
    format: 'Duo TPP Miramar',
    prizePool: '₹2,50,000 INR',
    prize: '₹2,50,000 INR',
    entryFee: 500,
    entryFeeText: '₹500 / Duo',
    isFree: false,
    regEndsDate: 'Registration Ends: July 11, 2026 • 11:59 PM',
    date: 'Starts July 12, 2026',
    time: '7:00 PM IST',
    map: 'Miramar',
    slots: '50 Duos Limit',
    totalSlots: 50,
    filledSlots: 12,
    status: 'UPCOMING',
    tag: 'DUO CLASH',
    banner: '/assets/banners/miramar.jpg'
  },
  {
    id: 'up-3',
    title: 'UPCOMING TOURNAMENT 3 (SQUAD CHAMPIONSHIP)',
    category: 'SQUAD CHAMPIONSHIP',
    format: 'Squad TPP Erangel',
    prizePool: '₹2,50,000 INR',
    prize: '₹2,50,000 INR',
    entryFee: 2500,
    entryFeeText: '₹2,500 / Squad',
    isFree: false,
    regEndsDate: 'Registration Ends: July 18, 2026 • 11:59 PM',
    date: 'Starts July 19, 2026',
    time: '7:30 PM IST',
    map: 'Erangel',
    slots: '25 Squads Limit',
    totalSlots: 25,
    filledSlots: 9,
    status: 'UPCOMING',
    tag: 'SQUAD CHAMPIONSHIP',
    banner: '/assets/banners/erangel.jpg'
  },
  {
    id: 'up-4',
    title: 'UPCOMING TOURNAMENT 4 (CHAMPIONSHIP)',
    category: 'CHAMPIONSHIP',
    format: 'Squad TPP Vikendi',
    prizePool: '₹5,00,000 INR',
    prize: '₹5,00,000 INR',
    entryFee: 7500,
    entryFeeText: '₹7,500 / Squad',
    isFree: false,
    regEndsDate: 'Registration Ends: July 25, 2026 • 11:59 PM',
    date: 'Starts July 26, 2026',
    time: '8:00 PM IST',
    map: 'Vikendi',
    slots: '25 Squads Limit',
    totalSlots: 25,
    filledSlots: 8,
    status: 'UPCOMING',
    tag: 'CHAMPIONSHIP',
    banner: '/assets/banners/vikendi.jpg'
  }
];

export const UpcomingTournamentsSection = ({ onOpenTournamentModal, onOpenTournamentDetail }) => {
  return (
    <section id="upcoming" className="w-full">
      {/* Anchor for backward compatibility with #poll */}
      <span id="poll" className="sr-only" />

      <div className="rounded-2xl p-5 sm:p-7 bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-montserrat font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>UPCOMING ESPORTS ARENA</span>
            </div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>UPCOMING TOURNAMENTS</span>
            </h3>
            <p className="font-rajdhani text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
              Scheduled Battles, Qualifiers & Next Season Registrations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              EARLY REGISTRATION OPEN
            </span>
          </div>
        </div>

        {/* 4 Tournament Cards in a Single Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_TOURNAMENTS_DATA.map((t, idx) => {
            const entryFeeText = t.entryFeeText || (t.isFree ? 'FREE ENTRY (₹0)' : `₹${t.entryFee || 500}`);
            const regEndsDate = t.regEndsDate || 'Registration Ends: Closes 24h Before Match';
            const prizeAmount = t.prizePool || t.prize || '₹2,50,000 INR';
            const totalSlots = t.totalSlots || 25;
            const filledSlots = t.filledSlots || 10;

            return (
              <div
                key={t.id || idx}
                className="group rounded-2xl bg-white border border-[#CBD5E1] hover:border-amber-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
              >
                {/* Card Banner: High-Impact Tournament Banner */}
                <div 
                  onClick={() => onOpenTournamentDetail?.(t)}
                  className="relative h-36 w-full overflow-hidden bg-black/60 cursor-pointer"
                >
                  <img
                    src={t.banner}
                    alt={t.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85] contrast-[1.05]"
                  />
                  
                  {/* Vignette Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                  {/* Floating Top Header Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/40 text-amber-400 text-[9px] font-montserrat font-bold tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>UPCOMING</span>
                    </div>
                    <span className="text-[9px] font-montserrat font-bold text-amber-400 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-slate-700 uppercase tracking-wider">
                      {t.tag}
                    </span>
                  </div>

                  {/* Title & Prize Pool overlay on Banner */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10">
                    <h4 className="font-montserrat font-black text-xs sm:text-sm text-white tracking-wide uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] truncate">
                      {t.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] font-rajdhani mt-0.5">
                      <span className="text-slate-200 font-medium drop-shadow truncate">{t.date}</span>
                      <span className="text-amber-400 font-extrabold font-mono text-xs tracking-wider drop-shadow shrink-0 ml-1">
                        {prizeAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body: Below Section with ALL 7 FIELDS Clearly Visible */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  
                  {/* 1. Tournament Name */}
                  <div 
                    onClick={() => onOpenTournamentDetail?.(t)}
                    className="cursor-pointer"
                  >
                    <h4 className="font-montserrat font-extrabold text-sm text-[#0F172A] leading-snug line-clamp-1 hover:text-amber-600 transition-colors uppercase">
                      {t.title}
                    </h4>
                    <span className="text-[10px] text-[#64748B] font-mono">
                      Click card for full details
                    </span>
                  </div>

                  {/* 2 to 7. Visible Format Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    {/* Map */}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-[#64748B] font-sans block uppercase">Map</span>
                        <strong className="text-[#0F172A] truncate block text-[11px]">{t.map}</strong>
                      </div>
                    </div>

                    {/* Format */}
                    <div className="flex items-center gap-1.5">
                      <Swords className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-[#64748B] font-sans block uppercase">Format</span>
                        <strong className="text-teal-700 truncate block text-[11px]">{t.format.split(' ')[0]}</strong>
                      </div>
                    </div>

                    {/* Slot Limit */}
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-[#64748B] font-sans block uppercase">Slot Limit</span>
                        <strong className="text-[#0F172A] truncate block text-[11px]">{totalSlots} Limit</strong>
                      </div>
                    </div>

                    {/* Entry Fee */}
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="text-[9px] text-[#64748B] font-sans block uppercase">Entry Fee</span>
                        <strong className={`truncate block text-[11px] ${t.isFree || t.entryFee === 0 ? 'text-emerald-700' : 'text-amber-800'}`}>
                          {entryFeeText}
                        </strong>
                      </div>
                    </div>

                    {/* Registration Ends Date */}
                    <div className="col-span-2 flex items-center gap-1.5 pt-1.5 border-t border-[#E2E8F0]">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <div className="truncate flex-1">
                        <span className="text-[9px] text-[#64748B] font-sans block uppercase">Registration Ends Date</span>
                        <strong className="text-[#0F172A] truncate block text-[11px]">{regEndsDate}</strong>
                      </div>
                    </div>

                    {/* Prize Amount */}
                    <div className="col-span-2 flex items-center justify-between pt-1.5 border-t border-[#E2E8F0]">
                      <span className="text-[9px] text-[#64748B] font-sans uppercase font-bold flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-500" />
                        Prize Amount
                      </span>
                      <strong className="text-amber-600 font-extrabold text-xs tracking-wide">
                        {prizeAmount}
                      </strong>
                    </div>
                  </div>

                  {/* Slots Filled Capacity Indicator */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#64748B] uppercase font-sans">Whitelist Capacity</span>
                      <span className="text-emerald-700 font-bold">
                        {filledSlots} / {totalSlots} Reserved
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-amber-600 rounded-full"
                        style={{ width: `${Math.min(100, Math.round(((filledSlots) / (totalSlots)) * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons: View Details (Full Page) & Register */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onOpenTournamentDetail?.(t);
                      }}
                      className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => {
                        soundFx.playModalOpen();
                        onOpenTournamentModal?.(t);
                      }}
                      className="py-2.5 px-2 rounded-xl bg-[#E5C05B] hover:bg-[#F3CF7A] text-slate-950 font-montserrat font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs hover:shadow-md flex items-center justify-center gap-1"
                    >
                      <Swords className="w-3 h-3" />
                      <span>Register</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default UpcomingTournamentsSection;
