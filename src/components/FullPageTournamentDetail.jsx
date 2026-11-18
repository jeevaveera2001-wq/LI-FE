import React, { useState } from 'react';
import { ArrowLeft, Swords, Trophy, MapPin, Calendar, Clock, Shield, Users, User, CheckCircle2, AlertCircle, Share2, Copy, Check, Sparkles, Award, Flame, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { getTournamentBanner } from '../utils/portalData';

export const FullPageTournamentDetail = ({
  tournament,
  onBack,
  onRegister,
  currentUser
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('SCHEDULE'); // 'SCHEDULE' | 'PRIZES' | 'POINTS' | 'RULES' | 'SLOTS'

  if (!tournament) return null;

  const t = tournament;
  const isScrim = Boolean(
    t.isScrim ||
    (t.id && String(t.id).toLowerCase().includes('scrim')) ||
    (t.title && String(t.title).toUpperCase().includes('SCRIM'))
  );

  const bannerImg = getTournamentBanner(t);
  const totalSlots = t.totalSlots || 25;
  const filledSlots = t.filledSlots || Math.min(totalSlots - 2, 18);
  const remainingSlots = Math.max(0, totalSlots - filledSlots);
  const format = t.format || (isScrim ? 'Squad TPP Erangel' : 'Squad Championship');
  const map = t.map || 'Erangel';
  const prizePool = t.prizePool || t.prize || '₹2,50,000 INR';
  const entryFee = t.entryFee !== undefined ? t.entryFee : (t.isFree ? 0 : 0);
  const entryFeeText = t.entryFeeText || (entryFee === 0 ? 'FREE ENTRY (₹0)' : `₹${entryFee.toLocaleString('en-IN')}`);
  const regEndsDate = t.regEndsDate || t.registrationEnds || 'Closes 2 Hours Before Match';
  const matchSchedule = t.date || t.time || 'Official Match Operations Schedule';

  const handleCopyLink = () => {
    soundFx.playSuccess();
    const url = window.location.href;
    navigator.clipboard.writeText(`Live tournaments.in • ${t.title}\nPrize: ${prizePool}\nEntry: ${entryFeeText}\nFormat: ${format}\nLink: ${url}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-slate-200 flex flex-col">
      
      {/* Top Sticky Header */}
      <header className="w-full bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playClick();
              onBack?.();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] transition-all text-xs font-bold cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#475569]" />
            <span>Back to Hub</span>
          </button>

          <div className="hidden sm:block border-l border-[#E2E8F0] pl-3">
            <h2 className="font-montserrat font-extrabold text-sm text-[#0F172A] truncate max-w-md uppercase">
              {t.title}
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">
              Official Tournament Dossier • Live tournaments.in
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] text-xs font-semibold cursor-pointer transition-all shadow-xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Details' : 'Share'}</span>
          </button>

          <button
            onClick={() => {
              soundFx.playModalOpen();
              onRegister?.(t);
            }}
            className="px-5 py-2 rounded-xl bg-[#E5C05B] hover:bg-[#F3CF7A] text-slate-950 font-montserrat font-extrabold text-xs uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>Register Now</span>
          </button>
        </div>
      </header>

      {/* Main Full Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Hero Showcase Card */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          
          {/* High-Resolution Tournament Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black/80">
            <img
              src={bannerImg}
              alt={t.title}
              className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
              onError={(e) => { e.target.src = '/assets/banners/championship.jpg'; }}
            />
            
            {/* Cinematic Gradient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/40 text-amber-400 text-xs font-montserrat font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isScrim ? 'OFFICIAL SCRIM' : (t.status || 'ACTIVE')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-slate-700 text-amber-400 text-xs font-mono font-bold uppercase">
                  {t.tag || t.category || (isScrim ? 'SQUAD SCRIMS' : 'PRO ESPORTS')}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono uppercase ${
                  entryFee === 0 
                    ? 'bg-emerald-500/90 text-white shadow-xs' 
                    : 'bg-amber-500/90 text-black shadow-xs'
                }`}>
                  {entryFee === 0 ? 'FREE ENTRY' : 'PAID ENTRY'}
                </span>
              </div>
            </div>

            {/* Bottom Hero Text Over Banner */}
            <div className="absolute bottom-5 left-5 right-5 z-10">
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-extrabold mb-1 drop-shadow">
                OFFICIAL MATCH OPERATIONS • ESPORTS ARENA
              </div>
              <h1 className="font-montserrat font-black text-2xl sm:text-4xl text-white uppercase tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                {t.title}
              </h1>
              <p className="font-rajdhani text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl drop-shadow">
                {t.description || 'Verified competitive room matches, dedicated room dispatch, live leaderboards, and transparent cash prize pool distribution.'}
              </p>
            </div>
          </div>

          {/* 7 Core Highlights Grid: Directly Below Card Banner */}
          <div className="p-4 sm:p-6 bg-white border-t border-[#E2E8F0]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
              
              {/* 1. Prize Amount */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Prize Amount</span>
                </div>
                <div className="font-montserrat font-extrabold text-sm sm:text-base text-amber-600 truncate">
                  {prizePool}
                </div>
              </div>

              {/* 2. Entry Fee */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Entry Fee</span>
                </div>
                <div className={`font-montserrat font-extrabold text-sm sm:text-base truncate ${
                  entryFee === 0 ? 'text-emerald-700' : 'text-[#0F172A]'
                }`}>
                  {entryFeeText}
                </div>
              </div>

              {/* 3. Match Format */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1">
                  <Swords className="w-3.5 h-3.5 text-teal-600" />
                  <span>Format</span>
                </div>
                <div className="font-montserrat font-extrabold text-sm sm:text-base text-teal-700 truncate">
                  {format.split(' ')[0]}
                </div>
              </div>

              {/* 4. Map */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Map</span>
                </div>
                <div className="font-montserrat font-extrabold text-sm sm:text-base text-[#0F172A] truncate">
                  {map}
                </div>
              </div>

              {/* 5. Slot Limit */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Slot Limit</span>
                </div>
                <div className="font-montserrat font-extrabold text-sm sm:text-base text-indigo-700 truncate">
                  {totalSlots} Limit
                </div>
              </div>

              {/* 6. Registration Ends Date */}
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reg Ends Date</span>
                </div>
                <div className="font-montserrat font-bold text-xs sm:text-xs text-[#0F172A] truncate mt-1">
                  {regEndsDate.replace('Registration Ends:', '').trim()}
                </div>
              </div>

            </div>

            {/* Capacity Progress Bar */}
            <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#64748B] font-bold">VERIFIED CAPACITY:</span>
                <span className="text-[#0F172A] font-extrabold">{filledSlots} / {totalSlots} Filled</span>
                <span className="text-emerald-700 font-bold">({remainingSlots} Slots Left)</span>
              </div>
              <div className="w-full sm:w-72 h-2 rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-amber-600 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((filledSlots / totalSlots) * 100))}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Tabs Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#CBD5E1]">
          {[
            { id: 'SCHEDULE', label: 'Match Schedule & Timing', icon: Calendar },
            { id: 'PRIZES', label: 'Prize Pool Distribution', icon: Trophy },
            { id: 'POINTS', label: 'Points System & WWCD', icon: Award },
            { id: 'RULES', label: 'Official Rules & Anti-Cheat', icon: Shield },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-[#64748B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-5 sm:p-7 shadow-xs">
          
          {/* TAB 1: SCHEDULE & TIMELINE */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-wide">
                  Match Schedule & Room ID Dispatch
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Full timetable, check-in instructions, and room ID/passcode release procedure.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-mono text-amber-700 font-bold uppercase">Phase 1</span>
                  <div className="font-montserrat font-extrabold text-sm text-[#0F172A]">Registration Deadline</div>
                  <p className="text-xs text-[#64748B]">{regEndsDate}</p>
                  <span className="inline-block text-[10px] bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded font-bold mt-1">
                    First Come, First Served
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-mono text-teal-700 font-bold uppercase">Phase 2</span>
                  <div className="font-montserrat font-extrabold text-sm text-[#0F172A]">Room ID & Passcode Release</div>
                  <p className="text-xs text-[#64748B]">Released 15 minutes before match start via Player Portal & SMS/Email</p>
                  <span className="inline-block text-[10px] bg-teal-100 text-teal-800 font-mono px-2 py-0.5 rounded font-bold mt-1">
                    Direct Room Dispatch
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Phase 3</span>
                  <div className="font-montserrat font-extrabold text-sm text-[#0F172A]">Match Start & Flight Path</div>
                  <p className="text-xs text-[#64748B]">{matchSchedule}</p>
                  <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-bold mt-1">
                    Strict Reporting Time
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-[#0F172A] space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Important Match Ops Reporting Rule:</span>
                </div>
                <p className="text-[#475569] leading-relaxed">
                  All players must enter their assigned slot number in the custom room. Any unauthorized players or teams entering incorrect slot positions will be kicked immediately by match observers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIZE POOL DISTRIBUTION */}
          {activeTab === 'PRIZES' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-wide">
                  Prize Money Distribution Breakdown
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Total Prize Pool: <strong className="text-amber-600">{prizePool}</strong> • Transparent bank / UPI transfers within 24 hours of match completion.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-50 to-white border-2 border-amber-400 shadow-sm text-center space-y-2">
                  <span className="text-2xl">👑</span>
                  <div className="font-montserrat font-black text-sm text-[#0F172A] uppercase">1st Place (Champion)</div>
                  <div className="text-xl font-black text-amber-600">50% Share</div>
                  <p className="text-[11px] text-[#64748B]">Official Winner Trophy Crest + Automatic Tier-1 Finals Whitelist</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-slate-300 shadow-xs text-center space-y-2">
                  <span className="text-2xl">🥈</span>
                  <div className="font-montserrat font-black text-sm text-[#0F172A] uppercase">2nd Place (Runner-Up)</div>
                  <div className="text-xl font-black text-slate-700">25% Share</div>
                  <p className="text-[11px] text-[#64748B]">Runner-Up Medal & Hall of Fame Placement</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border-2 border-amber-700/30 shadow-xs text-center space-y-2">
                  <span className="text-2xl">🥉</span>
                  <div className="font-montserrat font-black text-sm text-[#0F172A] uppercase">3rd Place (2nd Runner-Up)</div>
                  <div className="text-xl font-black text-amber-800">15% Share</div>
                  <p className="text-[11px] text-[#64748B]">Podium Finish Certificate & Points</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] shadow-xs text-center space-y-2">
                  <span className="text-2xl">🎯</span>
                  <div className="font-montserrat font-black text-sm text-[#0F172A] uppercase">MVP / Top Fragger</div>
                  <div className="text-xl font-black text-teal-700">10% Share</div>
                  <p className="text-[11px] text-[#64748B]">Highest individual kill scorer across the match</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: POINTS SYSTEM */}
          {activeTab === 'POINTS' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-wide">
                  Official Esports Points Matrix (WWCD + Kills)
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Standard BGIS / PMGC 10-Point scoring system approved by tournament management.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[10px] text-[#475569] uppercase font-bold">
                      <th className="py-2.5 px-3">Finish Placement</th>
                      <th className="py-2.5 px-3 text-center">Placement Points</th>
                      <th className="py-2.5 px-3 text-center">Kill Point Multiplier</th>
                      <th className="py-2.5 px-3 text-center">Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    <tr className="bg-amber-50/70 font-bold text-[#0F172A]">
                      <td className="py-2.5 px-3">👑 #1 (Winner Winner Chicken Dinner)</td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-amber-700">10 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-800">Match Victory</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#0F172A]">
                      <td className="py-2.5 px-3">🥈 #2 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">6 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#64748B]">Runner Up</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#0F172A]">
                      <td className="py-2.5 px-3">🥉 #3 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">5 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#64748B]">Podium</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#0F172A]">
                      <td className="py-2.5 px-3">#4 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">4 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#64748B]">Top 4</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#0F172A]">
                      <td className="py-2.5 px-3">#5 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">3 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#64748B]">Top 5</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#0F172A]">
                      <td className="py-2.5 px-3">#6 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">2 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#64748B]">Top 6</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#0F172A]">
                      <td className="py-2.5 px-3">#7 – #8 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">1 Point</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#64748B]">Top 8</td>
                    </tr>
                    <tr className="hover:bg-slate-50 text-[#64748B]">
                      <td className="py-2.5 px-3">#9 – #16 Place</td>
                      <td className="py-2.5 px-3 text-center font-bold">0 Points</td>
                      <td className="py-2.5 px-3 text-center">1 Point / Kill</td>
                      <td className="py-2.5 px-3 text-center text-[#94A3B8]">Kills Only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RULES & FAIR PLAY */}
          {activeTab === 'RULES' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-montserrat font-extrabold text-base sm:text-lg text-[#0F172A] uppercase tracking-wide">
                  Official Tournament Rules & Fair Play Policy
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Strict enforcement by Match Operations Admin desk. Violations result in permanent blacklist.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="font-montserrat font-bold text-[#0F172A] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Eligible Devices (Mobile Only)</span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    Only hand-held mobile devices (iOS and Android smartphones) are permitted. Emulators, iPads, tablets, triggers, mouse/keyboard setups, and third-party overlays are strictly forbidden.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="font-montserrat font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <span>Anti-Cheat & POV Recording</span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    Live observers record all matches. Players must be ready to provide hand-cam or screen-recording POV upon request by Match Operations within 15 minutes of match conclusion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="font-montserrat font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    <span>Roster & Character ID Lock</span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    Only verified registered in-game IDs (IGIDs) entered during tournament registration may join the room. Ringers or unlisted substitute accounts will lead to squad disqualification.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                  <div className="font-montserrat font-bold text-[#0F172A] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Teaming & Toxic Behavior Ban</span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">
                    Zero tolerance for teaming, stream-sniping, match-fixing, or abusive language in chat. Violating teams forfeit any prize eligibility and receive permanent platform bans.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Bottom CTA Bar */}
        <div className="rounded-3xl p-6 sm:p-7 bg-[#0F172A] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
              REGISTRATION ACTIVE • {remainingSlots} SLOTS AVAILABLE
            </span>
            <h3 className="font-montserrat font-extrabold text-lg sm:text-xl uppercase mt-0.5">
              Ready to Compete in {t.title}?
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Entry: <strong className="text-white">{entryFeeText}</strong> • Prize: <strong className="text-amber-400">{prizePool}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                soundFx.playClick();
                onBack?.();
              }}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Hub
            </button>
            <button
              onClick={() => {
                soundFx.playModalOpen();
                onRegister?.(t);
              }}
              className="px-7 py-3 rounded-xl bg-[#E5C05B] hover:bg-[#F3CF7A] text-slate-950 font-montserrat font-black text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Register Now</span>
            </button>
          </div>
        </div>

      </main>

    </div>
  );
};

export default FullPageTournamentDetail;
