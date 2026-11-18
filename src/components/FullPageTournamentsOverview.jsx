import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Calendar, Shield, Users, User, ArrowLeft, LogOut, Search, Clock, MapPin, CheckCircle2, ChevronRight, AlertCircle, Sparkles, Filter, Check, Copy, Flame, Radio, Award, X, DollarSign } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { getStoredTournaments, getStoredHallOfFame, submitTournamentRegistration, getStoredRegistrations, getTournamentBanner } from '../utils/portalData';
import { FullPageTournamentDetail } from './FullPageTournamentDetail';
import confetti from 'canvas-confetti';

export const FullPageTournamentsOverview = ({
  currentUser,
  onLogout,
  onBackToPortal,
  onOpenAdmin,
  onOpenSuperAdmin,
  onOpenRegisterTournament
}) => {
  // Navigation & Category Filters
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'LIVE' | 'UPCOMING' | 'SCRIMS' | 'LEADERBOARD'
  const [searchQuery, setSearchQuery] = useState('');
  const [teamTypeFilter, setTeamTypeFilter] = useState('ALL'); // 'ALL' | 'SQUAD' | 'DUO' | 'SOLO'
  const [tournamentFeeFilter, setTournamentFeeFilter] = useState('ALL'); 
  // 'ALL' | 'FREE' | 'PAID_1_1000' | 'PAID_1000_5000' | 'PAID_5000_10000' | 'PAID_10000_100000' | 'PAID_100000_500000' | 'PAID_500000_ABOVE'
  const [scrimsTypeFilter, setScrimsTypeFilter] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID' (no price range as requested)

  // Full-Page Detail View State (opened when card is clicked)
  const [detailedTournament, setDetailedTournament] = useState(null);

  // Tournaments & Scrims Data
  const [tournaments, setTournaments] = useState(getStoredTournaments());
  const [hofData, setHofData] = useState(() => getStoredHallOfFame());
  const [registrations, setRegistrations] = useState(getStoredRegistrations());

  // Quick In-Page Registration Modal State (fallback)
  const [registeringItem, setRegisteringItem] = useState(null);
  const [regTeamName, setRegTeamName] = useState('');
  const [regIglName, setRegIglName] = useState(currentUser?.name || '');
  const [regIglPhone, setRegIglPhone] = useState(currentUser?.phone || '');
  const [regPlayer1Id, setRegPlayer1Id] = useState('');
  const [regPlayer2Id, setRegPlayer2Id] = useState('');
  const [regPlayer3Id, setRegPlayer3Id] = useState('');
  const [regPlayer4Id, setRegPlayer4Id] = useState('');
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync data updates
  useEffect(() => {
    const handleUpdate = () => {
      setTournaments(getStoredTournaments());
      setHofData(getStoredHallOfFame());
      setRegistrations(getStoredRegistrations());
    };
    window.addEventListener('portal_tournaments_updated', handleUpdate);
    window.addEventListener('portal_hof_updated', handleUpdate);
    window.addEventListener('portal_registrations_updated', handleUpdate);

    return () => {
      window.removeEventListener('portal_tournaments_updated', handleUpdate);
      window.removeEventListener('portal_hof_updated', handleUpdate);
      window.removeEventListener('portal_registrations_updated', handleUpdate);
    };
  }, []);

  // Upcoming Tournaments List with Full Visible Attributes
  const upcomingTournaments = [
    {
      id: 'up-1',
      title: 'UPCOMING TOURNAMENT 1 (SOLO CLASH)',
      category: 'SOLO',
      format: 'Solo TPP Sanhok',
      prize: '₹2,50,000 INR',
      prizePool: '₹2,50,000 INR',
      entryFee: 0,
      entryFeeText: 'FREE ENTRY (₹0)',
      isFree: true,
      isToday: false,
      regEndsDate: 'Registration Ends: July 04, 2026 • 11:59 PM',
      date: 'Starts July 05, 2026',
      time: '6:00 PM IST',
      map: 'Sanhok',
      totalSlots: 100,
      filledSlots: 14,
      status: 'UPCOMING',
      tag: 'SOLO BATTLE',
      banner: '/assets/banners/sanhok.jpg'
    },
    {
      id: 'up-2',
      title: 'UPCOMING TOURNAMENT 2 (DUO SHOWDOWN)',
      category: 'DUO',
      format: 'Duo TPP Miramar',
      prize: '₹2,50,000 INR',
      prizePool: '₹2,50,000 INR',
      entryFee: 500,
      entryFeeText: '₹500 / Duo',
      isFree: false,
      isToday: false,
      regEndsDate: 'Registration Ends: July 11, 2026 • 11:59 PM',
      date: 'Starts July 12, 2026',
      time: '7:00 PM IST',
      map: 'Miramar',
      totalSlots: 50,
      filledSlots: 12,
      status: 'UPCOMING',
      tag: 'DUO CLASH',
      banner: '/assets/banners/miramar.jpg'
    },
    {
      id: 'up-3',
      title: 'UPCOMING TOURNAMENT 3 (SQUAD CHAMPIONSHIP)',
      category: 'SQUAD',
      format: 'Squad TPP Erangel',
      prize: '₹2,50,000 INR',
      prizePool: '₹2,50,000 INR',
      entryFee: 2500,
      entryFeeText: '₹2,500 / Squad',
      isFree: false,
      isToday: false,
      regEndsDate: 'Registration Ends: July 18, 2026 • 11:59 PM',
      date: 'Starts July 19, 2026',
      time: '7:30 PM IST',
      map: 'Erangel',
      totalSlots: 25,
      filledSlots: 9,
      status: 'UPCOMING',
      tag: 'SQUAD CHAMPIONSHIP',
      banner: '/assets/banners/erangel.jpg'
    },
    {
      id: 'up-4',
      title: 'UPCOMING TOURNAMENT 4 (MEGA FINALE)',
      category: 'SQUAD',
      format: 'Squad TPP All Maps',
      prize: '₹5,00,000 INR',
      prizePool: '₹5,00,000 INR',
      entryFee: 7500,
      entryFeeText: '₹7,500 / Squad',
      isFree: false,
      isToday: false,
      regEndsDate: 'Registration Ends: July 25, 2026 • 11:59 PM',
      date: 'Starts July 26, 2026',
      time: '8:00 PM IST',
      map: 'Erangel / Miramar / Sanhok',
      totalSlots: 25,
      filledSlots: 18,
      status: 'UPCOMING',
      tag: 'MEGA GRAND FINALE',
      banner: '/assets/banners/championship.jpg'
    }
  ];

  // Daily Scrims Schedule Data (STRICTLY SQUAD MATCH ONLY - NO DUO OR SOLO IN SCRIMS)
  const dailyScrims = [
    {
      id: 'scrim-1',
      title: 'DAILY TIER-1 SQUAD SCRIM (MATCH 1)',
      category: 'SQUAD',
      format: 'Squad TPP Erangel',
      prize: 'Official WWCD Trophy & Points',
      prizePool: 'WWCD Trophy & Points',
      entryFee: 0,
      entryFeeText: 'FREE ENTRY (₹0)',
      isFree: true,
      isPaid: false,
      isToday: true,
      isLive: true,
      regEndsDate: 'Registration Ends: Today • 4:30 PM',
      time: '5:00 PM IST',
      checkinTime: '4:45 PM IST',
      map: 'Erangel',
      totalSlots: 25,
      filledSlots: 21,
      status: 'OPEN',
      isScrim: true,
      banner: '/assets/banners/erangel.jpg',
      mode: 'Custom Competitive Room (25 Squads Limit)'
    },
    {
      id: 'scrim-2',
      title: 'DAILY TIER-1 SQUAD SCRIM (MATCH 2)',
      category: 'SQUAD',
      format: 'Squad TPP Miramar',
      prize: 'Leaderboard Points & Standings',
      prizePool: 'Leaderboard Points',
      entryFee: 0,
      entryFeeText: 'FREE ENTRY (₹0)',
      isFree: true,
      isPaid: false,
      isToday: true,
      isLive: true,
      regEndsDate: 'Registration Ends: Today • 6:30 PM',
      time: '7:00 PM IST',
      checkinTime: '6:45 PM IST',
      map: 'Miramar',
      totalSlots: 25,
      filledSlots: 18,
      status: 'OPEN',
      isScrim: true,
      banner: '/assets/banners/miramar.jpg',
      mode: 'Custom Competitive Room (25 Squads Limit)'
    },
    {
      id: 'scrim-3',
      title: 'HIGH-KILL SPRINT SQUAD SCRIM (MATCH 3)',
      category: 'SQUAD',
      format: 'Squad TPP Sanhok',
      prize: '₹15,000 Cash Pool',
      prizePool: '₹15,000 INR',
      entryFee: 200,
      entryFeeText: 'PAID SCRIM (₹200 / Squad)',
      isFree: false,
      isPaid: true,
      isToday: true,
      isLive: false,
      regEndsDate: 'Registration Ends: Today • 8:30 PM',
      time: '9:00 PM IST',
      checkinTime: '8:45 PM IST',
      map: 'Sanhok',
      totalSlots: 25,
      filledSlots: 15,
      status: 'OPEN',
      isScrim: true,
      banner: '/assets/banners/sanhok.jpg',
      mode: 'High-Kill Cash Prize Room'
    },
    {
      id: 'scrim-4',
      title: 'NIGHT ELITE SQUAD SCRIM (MATCH 4)',
      category: 'SQUAD',
      format: 'Squad TPP Vikendi',
      prize: '₹35,000 Cash Pool',
      prizePool: '₹35,000 INR',
      entryFee: 500,
      entryFeeText: 'PAID SCRIM (₹500 / Squad)',
      isFree: false,
      isPaid: true,
      isToday: true,
      isLive: false,
      regEndsDate: 'Registration Ends: Today • 10:30 PM',
      time: '11:00 PM IST',
      checkinTime: '10:45 PM IST',
      map: 'Vikendi',
      totalSlots: 25,
      filledSlots: 19,
      status: 'OPEN',
      isScrim: true,
      banner: '/assets/banners/vikendi.jpg',
      mode: 'Night Elite Cash Prize Room'
    }
  ];

  // Helper filter function for search and dropdowns
  const matchesSearch = (item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const haystack = `${item.title || ''} ${item.map || ''} ${item.format || ''} ${item.category || ''} ${item.tag || ''}`.toLowerCase();
    return haystack.includes(q);
  };

  const matchesTeamType = (item) => {
    if (teamTypeFilter === 'ALL') return true;
    const text = `${item.title || ''} ${item.format || ''} ${item.category || ''}`.toUpperCase();
    if (teamTypeFilter === 'SOLO') return text.includes('SOLO');
    if (teamTypeFilter === 'DUO') return text.includes('DUO');
    if (teamTypeFilter === 'SQUAD') return !text.includes('SOLO') && !text.includes('DUO');
    return true;
  };

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

  const matchesScrimsType = (item) => {
    if (scrimsTypeFilter === 'ALL') return true;
    if (scrimsTypeFilter === 'FREE') return item.isFree || item.entryFee === 0;
    if (scrimsTypeFilter === 'PAID') return item.isPaid || (item.entryFee && item.entryFee > 0);
    return true;
  };

  // Filtered tournament & scrim lists
  const filteredLive = tournaments.filter(t => matchesSearch(t) && matchesTeamType(t) && matchesTournamentFee(t));
  const filteredUpcoming = upcomingTournaments.filter(t => matchesSearch(t) && matchesTeamType(t) && matchesTournamentFee(t));
  const filteredScrims = dailyScrims.filter(s => matchesSearch(s) && matchesScrimsType(s));

  // Compute Live Dashboard Counts (Requested by user)
  const liveTournamentsCount = tournaments.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'ACTIVE' || t.isLive).length;
  const todayTournamentsCount = tournaments.filter(t => t.isToday || (t.date && t.date.toLowerCase().includes('today'))).length || 6;
  const todayScrimsCount = dailyScrims.filter(s => s.isToday).length || 4;
  const liveScrimsCount = dailyScrims.filter(s => s.isLive).length || 2;

  const hasActiveFilters = searchQuery !== '' || teamTypeFilter !== 'ALL' || tournamentFeeFilter !== 'ALL' || scrimsTypeFilter !== 'ALL';

  const handleResetFilters = () => {
    soundFx.playClick();
    setSearchQuery('');
    setTeamTypeFilter('ALL');
    setTournamentFeeFilter('ALL');
    setScrimsTypeFilter('ALL');
  };

  // Standings Leaderboard for current category
  const activeLeaderboardCategory = teamTypeFilter === 'ALL' ? 'SQUAD' : teamTypeFilter;
  const currentLeaderboard = hofData[activeLeaderboardCategory] || getStoredHallOfFame(activeLeaderboardCategory) || [];

  // Handle Quick Registration Submit
  const handleQuickRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundFx.playClick();

    const newReg = submitTournamentRegistration({
      teamName: regTeamName,
      iglName: regIglName,
      captainName: regIglName,
      iglPhone: regIglPhone,
      captainPhone: regIglPhone,
      matchType: teamTypeFilter === 'ALL' ? 'SQUAD' : teamTypeFilter,
      player1Name: regIglName,
      player1Id: regPlayer1Id,
      player2Name: 'Player 2',
      player2Id: regPlayer2Id,
      player3Name: 'Player 3',
      player3Id: regPlayer3Id,
      player4Name: 'Player 4',
      player4Id: regPlayer4Id,
      tournamentTitle: registeringItem?.title || 'Championship Match'
    });

    setIsSubmitting(false);
    soundFx.playVictory();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0F172A', '#10B981', '#3B82F6', '#F59E0B']
    });

    setRegistrationSuccessData(newReg);
  };

  // If user clicked any card to view full-page details:
  if (detailedTournament) {
    return (
      <FullPageTournamentDetail
        tournament={detailedTournament}
        currentUser={currentUser}
        onBack={() => setDetailedTournament(null)}
        onRegister={(t) => {
          setDetailedTournament(null);
          onOpenRegisterTournament?.(t);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-slate-200 flex flex-col">
      
      {/* Top Header Bar */}
      <header className="w-full bg-white border-b border-[#E2E8F0] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#CBD5E1] p-0.5 bg-[#F1F5F9] shadow-xs flex items-center justify-center">
            <img
              src="/assets/conqueror_badge.jpg"
              alt="Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="font-montserrat font-black text-sm sm:text-base text-[#0F172A] tracking-wide uppercase leading-tight">
              LIVE TOURNAMENTS<span className="text-amber-500">.IN</span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
              Tournaments & Scrims Hub
            </div>
          </div>
        </div>

        {/* User Session & Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F1F5F9] border border-[#CBD5E1] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-[#0F172A]">{currentUser.name || currentUser.username}</span>
              <span className="text-[10px] bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded text-[#64748B] font-semibold">
                {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : currentUser.role === 'ADMIN' ? 'Match Ops' : 'Competitor'}
              </span>
            </div>
          )}

          {currentUser?.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => {
                soundFx.playVictory();
                onOpenSuperAdmin?.();
              }}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Admin Console
            </button>
          )}

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => {
                soundFx.playVictory();
                onOpenAdmin?.();
              }}
              className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Match Ops
            </button>
          )}

          <button
            onClick={() => {
              soundFx.playClick();
              onBackToPortal?.();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F1F5F9] transition-all text-xs font-bold cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#475569]" />
            <span>Back to Arena</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              onLogout?.();
            }}
            title="Sign Out"
            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ======================================================== */}
        {/* 1. LIVE DASHBOARD: 4 COUNT CARDS (USER SPECIFIED)       */}
        {/* ======================================================== */}
        <section aria-label="Live Match Operations Dashboard">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            {/* Card 1: LIVE TOURNAMENTS COUNT */}
            <div 
              onClick={() => {
                soundFx.playClick();
                setActiveTab('LIVE');
              }}
              className="bg-white border border-[#E2E8F0] hover:border-emerald-500 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <Trophy className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div>
                <div className="font-montserrat font-black text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
                  {liveTournamentsCount}
                </div>
                <div className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                  Live Tournaments Count
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  Active Championship Lobbies
                </span>
              </div>
            </div>

            {/* Card 2: TODAY'S TOURNAMENTS COUNT */}
            <div 
              onClick={() => {
                soundFx.playClick();
                setActiveTab('LIVE');
              }}
              className="bg-white border border-[#E2E8F0] hover:border-amber-400 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                  TODAY
                </span>
              </div>
              <div>
                <div className="font-montserrat font-black text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
                  {todayTournamentsCount}
                </div>
                <div className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                  Today Tournaments Count
                </div>
                <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                  Scheduled for Today's Play
                </span>
              </div>
            </div>

            {/* Card 3: TODAY'S SCRIMS COUNT */}
            <div 
              onClick={() => {
                soundFx.playClick();
                setActiveTab('SCRIMS');
              }}
              className="bg-white border border-[#E2E8F0] hover:border-orange-400 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-mono font-bold uppercase tracking-wider">
                  SQUAD ONLY
                </span>
              </div>
              <div>
                <div className="font-montserrat font-black text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
                  {todayScrimsCount}
                </div>
                <div className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                  Today Scrims Count
                </div>
                <span className="text-[11px] text-orange-700 font-semibold mt-1 block">
                  Daily Practice Squad Rooms
                </span>
              </div>
            </div>

            {/* Card 4: LIVE SCRIMS COUNT */}
            <div 
              onClick={() => {
                soundFx.playClick();
                setActiveTab('SCRIMS');
              }}
              className="bg-white border border-[#E2E8F0] hover:border-rose-400 rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  BROADCASTING
                </span>
              </div>
              <div>
                <div className="font-montserrat font-black text-3xl sm:text-4xl text-[#0F172A] tracking-tight">
                  {liveScrimsCount}
                </div>
                <div className="font-montserrat font-extrabold text-xs uppercase tracking-wider text-[#64748B] mt-0.5">
                  Live Scrims Count
                </div>
                <span className="text-[11px] text-rose-700 font-semibold mt-1 block">
                  Custom Rooms Active Now
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 2. ADVANCED SEARCH BAR & FILTER DROPDOWNS                */}
        {/* ======================================================== */}
        <section className="bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
          
          {/* Row 1: Search Bar & Reset Control */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tournaments by name, map (Erangel, Sanhok, Miramar), format or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-2xs"
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
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Row 2: 3 Filter Dropdowns (Team Type, Tournament Price Range, Scrims Free/Paid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#F1F5F9]">
            
            {/* Dropdown 1: Team Type (Squad, Duo, Solo) */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-teal-600" />
                <span>Team Type Format</span>
              </label>
              <select
                value={teamTypeFilter}
                onChange={(e) => setTeamTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer shadow-2xs"
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
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Tournaments (Free & Paid)</option>
                <option value="FREE">Free Tournaments (₹0 Entry)</option>
                <option value="PAID_1_1000">Paid: ₹1 to ₹1,000</option>
                <option value="PAID_1000_5000">Paid: ₹1,000 to ₹5,000</option>
                <option value="PAID_5000_10000">Paid: ₹5,000 to ₹10,000</option>
                <option value="PAID_10000_100000">Paid: ₹10,000 to ₹1,00,000</option>
                <option value="PAID_100000_500000">Paid: ₹1,00,000 to ₹5,00,000</option>
                <option value="PAID_500000_ABOVE">Paid: Above ₹5 Lakhs (₹5,00,000+)</option>
              </select>
            </div>

            {/* Dropdown 3: Scrims Free & Paid (No Price Range as requested) */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Shield className="w-3 h-3 text-orange-500" />
                <span>Scrims: Free & Paid</span>
              </label>
              <select
                value={scrimsTypeFilter}
                onChange={(e) => setScrimsTypeFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white cursor-pointer shadow-2xs"
              >
                <option value="ALL">All Scrims (Free & Paid)</option>
                <option value="FREE">Free Scrims (Daily Practice Rooms)</option>
                <option value="PAID">Paid Scrims (High Stakes / Cash Prize)</option>
              </select>
            </div>

          </div>

          {/* Navigation Section Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9]">
            {[
              { id: 'ALL', label: 'All Overview' },
              { id: 'LIVE', label: `Live Tournaments (${filteredLive.length})` },
              { id: 'UPCOMING', label: `Upcoming Tournaments (${filteredUpcoming.length})` },
              { id: 'SCRIMS', label: `Daily Scrims (${filteredScrims.length})` },
              { id: 'LEADERBOARD', label: 'Official Standings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </section>

        {/* ======================================================== */}
        {/* SECTION 1: LIVE TOURNAMENTS HUB (CARD SECTIONS)         */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'LIVE') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="font-montserrat font-extrabold text-lg text-[#0F172A] uppercase tracking-wide">
                  Live Tournaments Hub
                </h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Registration Open
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredLive.length > 0 ? (
                filteredLive.map((t, idx) => {
                  const entryFeeText = t.entryFeeText || (t.entryFee === 0 || t.isFree ? 'FREE ENTRY (₹0)' : `₹${t.entryFee || 500}`);
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
                          setDetailedTournament(t);
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
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/40 text-amber-400 text-[9px] font-montserrat font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>ACTIVE</span>
                          </div>
                          <span className="text-[9px] font-montserrat font-bold text-amber-400 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-slate-700 uppercase tracking-wider">
                            {t.tag || t.category || 'PRO ESPORTS'}
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

                      {/* Card Body: Lower Section with ALL 7 REQUIRED FIELDS Clearly Visible */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                        
                        {/* 1. Tournament Name */}
                        <div 
                          onClick={() => {
                            soundFx.playClick();
                            setDetailedTournament(t);
                          }}
                          className="cursor-pointer"
                        >
                          <h4 className="font-montserrat font-extrabold text-sm text-[#0F172A] leading-snug line-clamp-1 hover:text-amber-600 transition-colors uppercase">
                            {t.title || `TOURNAMENT ${idx + 1}`}
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
                              setDetailedTournament(t);
                            }}
                            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              soundFx.playModalOpen();
                              if (onOpenRegisterTournament) {
                                onOpenRegisterTournament(t);
                              } else {
                                setRegisteringItem(t);
                                setRegistrationSuccessData(null);
                              }
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
                })
              ) : (
                <div className="col-span-full bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center text-sm text-[#64748B]">
                  No live tournaments match your selected filters. Try adjusting search or price range.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: UPCOMING TOURNAMENTS (CARD SECTIONS)         */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'UPCOMING') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                <h2 className="font-montserrat font-extrabold text-lg text-[#0F172A] uppercase tracking-wide">
                  Upcoming Tournaments
                </h2>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                Pre-Registrations Open
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredUpcoming.length > 0 ? (
                filteredUpcoming.map((t, idx) => {
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
                      {/* Card Banner */}
                      <div 
                        onClick={() => {
                          soundFx.playClick();
                          setDetailedTournament(t);
                        }}
                        className="relative h-36 w-full overflow-hidden bg-black/60 cursor-pointer"
                      >
                        <img
                          src={t.banner}
                          alt={t.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.85] contrast-[1.05]"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                        {/* Top Badges */}
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
                          onClick={() => {
                            soundFx.playClick();
                            setDetailedTournament(t);
                          }}
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
                              setDetailedTournament(t);
                            }}
                            className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => {
                              soundFx.playModalOpen();
                              if (onOpenRegisterTournament) {
                                onOpenRegisterTournament(t);
                              } else {
                                setRegisteringItem(t);
                                setRegistrationSuccessData(null);
                              }
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
                })
              ) : (
                <div className="col-span-full bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center text-sm text-[#64748B]">
                  No upcoming tournaments match your selected filters.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 3: DAILY SCRIMS (SQUAD ONLY • 25 SQUADS LIMIT)  */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'SCRIMS') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="font-montserrat font-extrabold text-lg text-[#0F172A] uppercase tracking-wide">
                  Daily Scrims Schedule (Squad Match Only)
                </h2>
              </div>
              <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3 text-orange-500" />
                Squad Only • 25 Slots
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredScrims.map((scrim) => (
                <div
                  key={scrim.id}
                  className="group rounded-2xl bg-white border border-[#CBD5E1] hover:border-orange-400 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xs"
                >
                  {/* Scrims Banner Header */}
                  <div 
                    onClick={() => {
                      soundFx.playClick();
                      setDetailedTournament(scrim);
                    }}
                    className="relative h-36 rounded-t-2xl overflow-hidden bg-black/80 p-3 flex flex-col justify-between text-white border-b border-slate-700 shadow-xs cursor-pointer"
                  >
                    <img
                      src={getTournamentBanner(scrim)}
                      alt={scrim.title || 'Daily Scrim Banner'}
                      className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.75] contrast-[1.1] group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/assets/banners/erangel.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30 pointer-events-none" />

                    <div className="flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/25 backdrop-blur-md border border-orange-400/50 text-orange-300 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                        <Flame className="w-3 h-3 text-orange-400" />
                        SQUAD SCRIM
                      </span>
                      <span className="text-emerald-400 font-mono font-bold text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-emerald-400/30">
                        {scrim.filledSlots}/{scrim.totalSlots} Slots
                      </span>
                    </div>
                    <div className="flex items-end justify-between z-10">
                      <div className="text-[11px] font-semibold text-slate-200 drop-shadow">
                        Map: <strong className="text-white font-bold">{scrim.map}</strong>
                      </div>
                      <span className="text-amber-400 font-extrabold font-mono text-xs tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {scrim.time}
                      </span>
                    </div>
                  </div>

                  {/* Scrim Body: Below Section with ALL 7 FIELDS Clearly Visible */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                    {/* 1. Tournament / Scrim Name */}
                    <div 
                      onClick={() => {
                        soundFx.playClick();
                        setDetailedTournament(scrim);
                      }}
                      className="cursor-pointer"
                    >
                      <h4 className="font-montserrat font-extrabold text-sm text-[#0F172A] leading-snug line-clamp-1 hover:text-orange-600 transition-colors uppercase">
                        {scrim.title}
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
                          <strong className="text-[#0F172A] truncate block text-[11px]">{scrim.map}</strong>
                        </div>
                      </div>

                      {/* Format */}
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <div className="truncate">
                          <span className="text-[9px] text-[#64748B] font-sans block uppercase">Format</span>
                          <strong className="text-orange-700 truncate block text-[11px]">Squad (4P + 1 Sub)</strong>
                        </div>
                      </div>

                      {/* Slot Limit */}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <div className="truncate">
                          <span className="text-[9px] text-[#64748B] font-sans block uppercase">Slot Limit</span>
                          <strong className="text-[#0F172A] truncate block text-[11px]">{scrim.totalSlots || 25} Limit</strong>
                        </div>
                      </div>

                      {/* Entry Fee (Free or Paid) */}
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <div className="truncate">
                          <span className="text-[9px] text-[#64748B] font-sans block uppercase">Entry Fee</span>
                          <strong className={`truncate block text-[11px] ${scrim.isFree || scrim.entryFee === 0 ? 'text-emerald-700' : 'text-orange-800'}`}>
                            {scrim.entryFeeText || 'FREE ENTRY'}
                          </strong>
                        </div>
                      </div>

                      {/* Registration Ends Date */}
                      <div className="col-span-2 flex items-center gap-1.5 pt-1.5 border-t border-[#E2E8F0]">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <div className="truncate flex-1">
                          <span className="text-[9px] text-[#64748B] font-sans block uppercase">Registration Ends Date</span>
                          <strong className="text-[#0F172A] truncate block text-[11px]">
                            {scrim.regEndsDate || `Registration Ends: Today • ${scrim.checkinTime}`}
                          </strong>
                        </div>
                      </div>

                      {/* Prize Amount */}
                      <div className="col-span-2 flex items-center justify-between pt-1.5 border-t border-[#E2E8F0]">
                        <span className="text-[9px] text-[#64748B] font-sans uppercase font-bold flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          Prize Amount
                        </span>
                        <strong className="text-amber-600 font-extrabold text-xs tracking-wide">
                          {scrim.prize || 'WWCD Trophy & Points'}
                        </strong>
                      </div>
                    </div>

                    {/* Capacity Indicator Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#64748B] uppercase font-sans">Slot Reservations</span>
                        <span className="text-orange-700 font-bold">
                          {scrim.filledSlots} / {scrim.totalSlots} Squads
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                          style={{ width: `${Math.min(100, Math.round(((scrim.filledSlots) / (scrim.totalSlots)) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* 2 Action Buttons: View Details (Full Page) & Register */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setDetailedTournament(scrim);
                        }}
                        className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playModalOpen();
                          if (onOpenRegisterTournament) {
                            onOpenRegisterTournament({
                              ...scrim,
                              category: 'SQUAD',
                              matchCategory: 'SQUAD',
                              format: scrim.format || 'Squad TPP',
                              isScrim: true
                            });
                          } else {
                            setRegisteringItem({
                              ...scrim,
                              category: 'SQUAD',
                              matchCategory: 'SQUAD',
                              format: scrim.format || 'Squad TPP',
                              isScrim: true
                            });
                            setRegistrationSuccessData(null);
                          }
                        }}
                        className="py-2.5 px-2 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                      >
                        <Swords className="w-3 h-3 text-amber-400" />
                        <span>Book Scrim</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 4: SCRIMS OFFICIAL TOP 10 STANDINGS             */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'LEADERBOARD') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h2 className="font-montserrat font-bold text-lg text-[#0F172A] uppercase tracking-wide">
                  Scrims & Official Top 10 Standings ({activeLeaderboardCategory})
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                Synced with Match Ops
              </span>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Team / Player Name</th>
                      <th className="py-3 px-4 text-center">WWCD (Wins)</th>
                      <th className="py-3 px-4 text-center">Finishes (Kills)</th>
                      <th className="py-3 px-4 text-center">Placement Pts</th>
                      <th className="py-3 px-4 text-center">Total Points</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                    {currentLeaderboard.slice(0, 10).map((team, idx) => (
                      <tr key={team.id || idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-black">
                          {idx === 0 && <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">#1</span>}
                          {idx === 1 && <span className="inline-block px-2 py-0.5 rounded bg-slate-200 text-slate-900 border border-slate-300 font-extrabold">#2</span>}
                          {idx === 2 && <span className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-900 border border-orange-300 font-extrabold">#3</span>}
                          {idx > 2 && <span className="text-[#64748B]">#{idx + 1}</span>}
                        </td>
                        <td className="py-3 px-4 font-bold text-sm">
                          {team.teamName || team.name || `Team ${idx + 1}`}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-[#475569]">
                          {team.wwcd || 0}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-[#475569]">
                          {team.kills || 0}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-[#475569]">
                          {team.placementPts || 0}
                        </td>
                        <td className="py-3 px-4 text-center font-extrabold text-[#0F172A]">
                          {team.totalPts || team.total || 0}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ======================================================== */}
      {/* QUICK IN-SCREEN REGISTRATION MODAL (WHITE BG + BLACK TEXT) */}
      {/* ======================================================== */}
      {registeringItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs font-sans">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl text-[#0F172A] max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600 tracking-wider">
                  Registration Entry
                </span>
                <h3 className="font-montserrat font-extrabold text-lg text-[#0F172A] leading-tight">
                  {registeringItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setRegisteringItem(null);
                  setRegistrationSuccessData(null);
                }}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-slate-200 text-[#475569] flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* If Already Registered: Success Confirmation */}
            {registrationSuccessData ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-montserrat font-extrabold text-xl text-[#0F172A]">
                    Registration Confirmed!
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1">
                    Your slot has been reserved for {registeringItem.title}.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-2xl text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Ticket ID:</span>
                    <strong className="font-mono text-[#0F172A]">{registrationSuccessData.ticketId}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Slot Assigned:</span>
                    <strong className="font-mono text-emerald-700 font-bold">{registrationSuccessData.slotCode}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Tournament:</span>
                    <span className="font-semibold text-[#0F172A]">{registeringItem.title}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setRegisteringItem(null);
                    setRegistrationSuccessData(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#0F172A] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Quick Form */
              <form onSubmit={handleQuickRegister} className="py-4 space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soul Esports"
                    value={regTeamName}
                    onChange={(e) => setRegTeamName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-amber-500 focus:bg-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Captain / IGL Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mortal"
                      value={regIglName}
                      onChange={(e) => setRegIglName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-amber-500 focus:bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] uppercase mb-1">
                      Contact WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={regIglPhone}
                      onChange={(e) => setRegIglPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-amber-500 focus:bg-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-[#475569] uppercase mb-2">
                    In-Game Character IDs (IGIDs)
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <input
                      type="text"
                      required
                      placeholder="Player 1 IGID *"
                      value={regPlayer1Id}
                      onChange={(e) => setRegPlayer1Id(e.target.value.replace(/\D/g, ''))}
                      className="px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] text-xs"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Player 2 IGID *"
                      value={regPlayer2Id}
                      onChange={(e) => setRegPlayer2Id(e.target.value.replace(/\D/g, ''))}
                      className="px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Player 3 IGID"
                      value={regPlayer3Id}
                      onChange={(e) => setRegPlayer3Id(e.target.value.replace(/\D/g, ''))}
                      className="px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Player 4 IGID"
                      value={regPlayer4Id}
                      onChange={(e) => setRegPlayer4Id(e.target.value.replace(/\D/g, ''))}
                      className="px-3 py-2 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#0F172A] text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#E5C05B] hover:bg-[#F3CF7A] text-slate-950 font-montserrat font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-xs transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <Swords className="w-4 h-4" />
                  <span>{isSubmitting ? 'Confirming Slot...' : 'Confirm Registration'}</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default FullPageTournamentsOverview;
