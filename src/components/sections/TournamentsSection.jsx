import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Swords, 
  Trophy, 
  MapPin, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Flame, 
  Clock, 
  Award, 
  Info, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Search, 
  X, 
  Radio 
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { getStoredTournaments, getTournamentBanner } from '../../utils/portalData';

export const TournamentsSection = ({ 
  onOpenTournamentModal, 
  onOpenTournamentDetail, 
  onOpenOverview 
}) => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [tournaments, setTournaments] = useState(getStoredTournaments());

  // Search & Filter Dropdown State
  const [searchQuery, setSearchQuery] = useState('');
  const [teamTypeFilter, setTeamTypeFilter] = useState('ALL'); // 'ALL' | 'SQUAD' | 'DUO' | 'SOLO'
  const [tournamentFeeFilter, setTournamentFeeFilter] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID_1_1000' ...
  const [scrimsTypeFilter, setScrimsTypeFilter] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID'

  useEffect(() => {
    const handleUpdate = () => {
      setTournaments(getStoredTournaments());
    };
    window.addEventListener('portal_tournaments_updated', handleUpdate);
    return () => window.removeEventListener('portal_tournaments_updated', handleUpdate);
  }, []);

  const activeTournaments = tournaments.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'ACTIVE');
  const historicTournaments = tournaments.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'HISTORIC' || t.status === 'COMPLETED');

  // Compute Live Dashboard Counts (Requested by user)
  const liveTournamentsCount = tournaments.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'ACTIVE' || t.isLive).length;
  const todayTournamentsCount = tournaments.filter(t => t.isToday || (t.date && t.date.toLowerCase().includes('today'))).length || 6;
  const todayScrimsCount = 4; // Daily competitive squad custom rooms
  const liveScrimsCount = 2;  // Live broadcasting scrim custom rooms

  // Helper search filter
  const matchesSearch = (item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const haystack = `${item.title || ''} ${item.map || ''} ${item.format || ''} ${item.category || ''} ${item.tag || ''}`.toLowerCase();
    return haystack.includes(q);
  };

  // Helper team type filter (Squad, Duo, Solo)
  const matchesTeamType = (item) => {
    if (teamTypeFilter === 'ALL') return true;
    const text = `${item.title || ''} ${item.format || ''} ${item.category || ''}`.toUpperCase();
    if (teamTypeFilter === 'SOLO') return text.includes('SOLO');
    if (teamTypeFilter === 'DUO') return text.includes('DUO');
    if (teamTypeFilter === 'SQUAD') return !text.includes('SOLO') && !text.includes('DUO');
    return true;
  };

  // Helper tournament fee filter with exact price tiers
  const matchesTournamentFee = (item) => {
    if (tournamentFeeFilter === 'ALL') return true;
    const fee = item.entryFee !== undefined ? Number(item.entryFee) : 0;
    const isFree = item.isFree || fee === 0;

    if (tournamentFeeFilter === 'FREE') return isFree;
    if (tournamentFeeFilter === 'PAID_1_1000') return !isFree && fee >= 1 && fee <= 1000;
    if (tournamentFeeFilter === 'PAID_1000_5000') return !isFree && fee >= 1000 && fee <= 5000;
    if (tournamentFeeFilter === 'PAID_5000_10000') return !isFree && fee >= 5000 && fee <= 10000;
    if (tournamentFeeFilter === 'PAID_10000_100000') return !isFree && fee >= 10000 && fee <= 100000;
    if (tournamentFeeFilter === 'PAID_100000_500000') return !isFree && fee >= 100000 && fee <= 500000;
    if (tournamentFeeFilter === 'PAID_500000_ABOVE') return !isFree && fee >= 500000;
    return true;
  };

  // Helper scrims free/paid filter (strictly no price range)
  const matchesScrimsType = (item) => {
    if (scrimsTypeFilter === 'ALL') return true;
    if (scrimsTypeFilter === 'FREE') return item.isFree || item.entryFee === 0;
    if (scrimsTypeFilter === 'PAID') return !item.isFree && item.entryFee > 0;
    return true;
  };

  const hasActiveFilters = searchQuery !== '' || teamTypeFilter !== 'ALL' || tournamentFeeFilter !== 'ALL' || scrimsTypeFilter !== 'ALL';

  const handleResetFilters = () => {
    soundFx.playClick();
    setSearchQuery('');
    setTeamTypeFilter('ALL');
    setTournamentFeeFilter('ALL');
    setScrimsTypeFilter('ALL');
  };

  // Base list depending on activeTab
  const baseList = activeTab === 'ACTIVE'
    ? (activeTournaments.length > 0 ? activeTournaments : tournaments)
    : (historicTournaments.length > 0 ? historicTournaments : tournaments);

  // Filtered list
  const filteredList = baseList.filter(t => 
    matchesSearch(t) && matchesTeamType(t) && matchesTournamentFee(t) && matchesScrimsType(t)
  );

  const displayedTournaments = filteredList;

  return (
    <section id="tournaments" className="w-full">
      <div className="rounded-2xl p-5 sm:p-7 bg-white border border-[#E2E8F0] shadow-sm relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-[#E2E8F0] pb-4">
          <div>
            <h3 className="font-montserrat font-extrabold text-base sm:text-xl text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>TOURNAMENTS HUB</span>
            </h3>
            <p className="font-rajdhani text-xs sm:text-sm text-[#64748B] font-medium mt-0.5">
              Live Esports Matches, Custom Rooms & Verified Prize Competitions
            </p>
          </div>

          {/* Action Buttons: Explore Hub & Tab / Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenOverview?.();
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 border border-amber-300 text-amber-700 text-xs font-montserrat font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500 group-hover:text-slate-950" />
              <span>Explore Tournaments Hub Page</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
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

        {/* ======================================================== */}
        {/* 1. LIVE DASHBOARD: 4 COUNT CARDS (USER SPECIFIED)       */}
        {/* ======================================================== */}
        <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: LIVE TOURNAMENTS COUNT */}
          <div 
            onClick={() => {
              soundFx.playClick();
              onOpenOverview?.();
            }}
            className="bg-[#F8FAFC] hover:bg-emerald-50/50 border border-[#E2E8F0] hover:border-emerald-500 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <div>
              <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
                {liveTournamentsCount}
              </div>
              <div className="font-montserrat font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                Live Tournaments Count
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                Active Championship Lobbies
              </span>
            </div>
          </div>

          {/* Card 2: TODAY TOURNAMENTS COUNT */}
          <div 
            onClick={() => {
              soundFx.playClick();
              onOpenOverview?.();
            }}
            className="bg-[#F8FAFC] hover:bg-amber-50/50 border border-[#E2E8F0] hover:border-amber-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                TODAY
              </span>
            </div>
            <div>
              <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
                {todayTournamentsCount}
              </div>
              <div className="font-montserrat font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                Today Tournaments Count
              </div>
              <span className="text-[10px] sm:text-[11px] text-amber-700 font-semibold mt-0.5 block">
                Scheduled for Today's Play
              </span>
            </div>
          </div>

          {/* Card 3: TODAY SCRIMS COUNT */}
          <div 
            onClick={() => {
              soundFx.playClick();
              onOpenOverview?.();
            }}
            className="bg-[#F8FAFC] hover:bg-orange-50/50 border border-[#E2E8F0] hover:border-orange-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100/70 border border-orange-200 flex items-center justify-center text-orange-700 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                SQUAD ONLY
              </span>
            </div>
            <div>
              <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
                {todayScrimsCount}
              </div>
              <div className="font-montserrat font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                Today Scrims Count
              </div>
              <span className="text-[10px] sm:text-[11px] text-orange-700 font-semibold mt-0.5 block">
                Daily Practice Squad Rooms
              </span>
            </div>
          </div>

          {/* Card 4: LIVE SCRIMS COUNT */}
          <div 
            onClick={() => {
              soundFx.playClick();
              onOpenOverview?.();
            }}
            className="bg-[#F8FAFC] hover:bg-rose-50/50 border border-[#E2E8F0] hover:border-rose-400 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-rose-100/70 border border-rose-200 flex items-center justify-center text-rose-700 group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                ACTIVE
              </span>
            </div>
            <div>
              <div className="font-montserrat font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
                {liveScrimsCount}
              </div>
              <div className="font-montserrat font-extrabold text-[11px] sm:text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                Live Scrims Count
              </div>
              <span className="text-[10px] sm:text-[11px] text-rose-700 font-semibold mt-0.5 block">
                Custom Rooms Active Now
              </span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 2. ADVANCED SEARCH BAR & 3 FILTER DROPDOWNS              */}
        {/* ======================================================== */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] shadow-2xs space-y-3.5">
          {/* Row 1: Search Bar & Reset Control */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tournaments by name, map (Erangel, Sanhok, Miramar), format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:border-amber-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#94A3B8] hover:text-[#0F172A] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Row 2: 3 Filter Dropdowns (Team Type, Tournament Price Tiers, Scrims Free/Paid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E2E8F0]">
            
            {/* Dropdown 1: Team Type (Squad, Duo, Solo) */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-teal-600" />
                <span>Team Type Format</span>
              </label>
              <select
                value={teamTypeFilter}
                onChange={(e) => setTeamTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Team Types (Squad, Duo, Solo)</option>
                <option value="SQUAD">Squad (4 Players + 1 Sub)</option>
                <option value="DUO">Duo (2 Players)</option>
                <option value="SOLO">Solo (1 Player)</option>
              </select>
            </div>

            {/* Dropdown 2: Free & Paid Tournaments with Exact Price Tiers */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>Tournaments: Free & Paid Price</span>
              </label>
              <select
                value={tournamentFeeFilter}
                onChange={(e) => setTournamentFeeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Tournaments (Free & Paid)</option>
                <option value="FREE">Free Tournaments (₹0 Entry)</option>
                <option value="PAID_1_1000">Paid: ₹1 to ₹1,000</option>
                <option value="PAID_1000_5000">Paid: ₹1,000 to ₹5,000</option>
                <option value="PAID_5000_10000">Paid: ₹5,000 to ₹10,000</option>
                <option value="PAID_10000_100000">Paid: ₹10,000 to ₹1,00,000</option>
                <option value="PAID_100000_500000">Paid: ₹1,00,000 to ₹5,00,000</option>
                <option value="PAID_500000_ABOVE">Paid: 5 Lakhs Above</option>
              </select>
            </div>

            {/* Dropdown 3: Scrims (Free & Paid - Strictly No Price Range) */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-orange-600" />
                <span>Daily Scrims (Squad Only)</span>
              </label>
              <select
                value={scrimsTypeFilter}
                onChange={(e) => setScrimsTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Scrims (Free & Paid)</option>
                <option value="FREE">Free Scrims</option>
                <option value="PAID">Paid Scrims</option>
              </select>
            </div>

          </div>
        </div>

        {/* Tab Selection: ACTIVE / HISTORIC */}
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
            ACTIVE MATCHES ({activeTournaments.length})
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

        {/* ======================================================== */}
        {/* 3. TOURNAMENT CARDS (ALL 7 FIELDS VISIBLE IN LOWER SECTION) */}
        {/* ======================================================== */}
        {displayedTournaments.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] space-y-3">
            <Trophy className="w-10 h-10 text-[#94A3B8] mx-auto" />
            <h4 className="font-montserrat font-bold text-sm text-[#0F172A] uppercase">
              No tournaments match your current filters
            </h4>
            <p className="text-xs text-[#64748B]">
              Try clearing your search query or selecting a different team format or price tier.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedTournaments.map((t, idx) => {
              const entryFeeText = t.entryFeeText || (t.entryFee === 0 || t.isFree ? 'FREE ENTRY (₹0)' : `₹${(t.entryFee || 500).toLocaleString('en-IN')}`);
              const regEndsDate = t.regEndsDate || 'Registration Ends: Today • 5:00 PM IST';
              const prizeAmount = t.prizePool || t.prize || '₹2,50,000 INR';
              const formatText = t.format || 'Squad Championship';
              const mapText = t.map || 'Erangel';
              const totalSlots = t.totalSlots || 25;
              const filledSlots = t.filledSlots || 18;

              return (
                <div
                  key={t.id || idx}
                  className="group rounded-2xl bg-white border border-[#CBD5E1] hover:border-amber-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  {/* Card Banner: High-Impact Tournament Banner */}
                  <div 
                    onClick={() => {
                      soundFx.playClick();
                      onOpenTournamentDetail?.(t);
                    }}
                    className="relative h-36 w-full overflow-hidden bg-black/80 cursor-pointer"
                  >
                    <img
                      src={getTournamentBanner(t)}
                      alt={t.title || 'Tournament Card'}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85] contrast-[1.05]"
                      onError={(e) => {
                        e.target.src = '/assets/banners/championship.jpg';
                      }}
                    />
                    
                    {/* Vignette gradients for text readability on top of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

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
                          {prizeAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Below Section with ALL 7 FIELDS Clearly Visible */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    
                    {/* 1. Tournament Name */}
                    <div 
                      onClick={() => {
                        soundFx.playClick();
                        onOpenTournamentDetail?.(t);
                      }}
                      className="cursor-pointer"
                    >
                      <h4 className="font-montserrat font-extrabold text-sm text-[#0F172A] leading-snug line-clamp-1 hover:text-amber-600 transition-colors uppercase">
                        {t.title || `TOURNAMENT ${idx + 1}`}
                      </h4>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        Click card to view full details
                      </span>
                    </div>

                    {/* 2 to 7. Visible Format Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                      {/* Map */}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <div className="truncate">
                          <span className="text-[9px] text-[#64748B] font-sans block uppercase">Map</span>
                          <strong className="text-[#0F172A] truncate block text-[11px]">{mapText}</strong>
                        </div>
                      </div>

                      {/* Format */}
                      <div className="flex items-center gap-1.5">
                        <Swords className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <div className="truncate">
                          <span className="text-[9px] text-[#64748B] font-sans block uppercase">Format</span>
                          <strong className="text-teal-700 truncate block text-[11px]">{formatText.split(' ')[0]}</strong>
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

                    {/* Slots Capacity Indicator Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#64748B] uppercase font-sans">Verified Capacity</span>
                        <span className="text-amber-700 font-bold">
                          {filledSlots} / {totalSlots} Teams
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 via-amber-500 to-amber-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.round((filledSlots / totalSlots) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* 2 Action Buttons: View Details (Full Page) & Register */}
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
        )}

        {/* Bottom Hub Explorer Footer Link */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
          <span className="font-rajdhani font-semibold">
            Showing competitive matches • Explore all formats, prize tiers & daily scrims in the hub
          </span>
          <button
            onClick={() => {
              soundFx.playClick();
              onOpenOverview?.();
            }}
            className="font-montserrat font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors text-xs"
          >
            <span>Open Full Tournaments Hub Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default TournamentsSection;
