import React, { useState, useEffect, useMemo } from 'react';
import { SkeletonLoader, InfiniteScrollLoader, ButtonLoader } from './loaders';

const ALL_TOURNAMENTS_CATALOG = [
  {
    id: 'bgmi-showdown-reg',
    title: 'BGMI SHOWDOWN TOURNAMENT',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    badge: '🔥 REGISTRATION OPEN',
    badgeColor: 'bg-amber-500 text-black font-extrabold',
    schedule: 'Starts Today • 7:00 PM IST',
    prizePool: '₹ 1,50,000 INR',
    squadType: 'Squad',
    format: 'Squad (Erangel + Miramar)',
    map: 'Erangel / Miramar',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_bgmi_showdown_4k.jpg'
  },
  {
    id: 'pubg-mobile-global-reg',
    title: 'PUBG MOBILE GLOBAL CHAMPIONSHIP',
    game: 'PUBG MOBILE',
    category: 'PUBG',
    badge: '⭐ PREMIER REGISTRATION',
    badgeColor: 'bg-[#DFBD78] text-black font-extrabold shadow-sm',
    schedule: 'Starts in 2 Days • 8:00 PM IST',
    prizePool: '₹ 5,00,000 INR',
    squadType: 'Squad',
    format: 'Squad Global Series',
    map: 'Erangel / Sanhok',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_pubg_mobile_4k.jpg'
  },
  {
    id: 'bgmi-lan-warriors-reg',
    title: 'BGMI LAN WARRIORS CHALLENGE',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    badge: '⚡ SQUAD MATCH OPEN',
    badgeColor: 'bg-emerald-600 text-white font-extrabold',
    schedule: 'Starts Tomorrow • 5:00 PM IST',
    prizePool: '₹ 75,000 INR',
    squadType: 'Duo',
    format: 'Duo Tactical Showdown',
    map: 'Miramar',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_bgmi_lan_warriors_4k.jpg'
  },
  {
    id: 'pubg-ultimate-squad-reg',
    title: 'PUBG ULTIMATE SQUAD SERIES',
    game: 'PUBG MOBILE',
    category: 'PUBG',
    badge: '🎯 SQUAD ENTRY LIVE',
    badgeColor: 'bg-blue-600 text-white font-extrabold',
    schedule: 'Starts Tomorrow • 6:00 PM IST',
    prizePool: '₹ 30,000 INR',
    squadType: 'Solo',
    format: 'Solo Survival Battle',
    map: 'Erangel',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_pubg_ultimate_squad_4k.jpg'
  },
  {
    id: 'freefire-clutch-cup-reg',
    title: 'FREE FIRE MAX CLUTCH MASTERS',
    game: 'FREE FIRE MAX',
    category: 'FREEFIRE',
    badge: '🎯 OPEN REGISTRATION',
    badgeColor: 'bg-indigo-600 text-white font-extrabold',
    schedule: 'Starts Saturday • 4:00 PM IST',
    prizePool: '₹ 50,000 INR',
    squadType: 'Squad',
    format: 'Squad Clash Royale',
    map: 'Bermuda',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_bgmi_showdown_4k.jpg'
  },
  {
    id: 'valorant-spike-masters-reg',
    title: 'VALORANT MUMBAI SPIKE LEAGUE',
    game: 'VALORANT',
    category: 'OTHER',
    badge: '🏆 5v5 SQUAD OPEN',
    badgeColor: 'bg-purple-600 text-white font-extrabold',
    schedule: 'Starts Sunday • 6:00 PM IST',
    prizePool: '₹ 1,00,000 INR',
    squadType: '5v5 Squad',
    format: '5v5 Competitive Tactical',
    map: 'Ascent / Bind',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_bgmi_lan_warriors_4k.jpg'
  },
  {
    id: 'codm-battle-royale-reg',
    title: 'COD MOBILE BATTLE ROYALE CUP',
    game: 'CALL OF DUTY: MOBILE',
    category: 'OTHER',
    badge: '🔥 REGISTRATION OPEN',
    badgeColor: 'bg-amber-600 text-white font-extrabold',
    schedule: 'Starts Sunday • 8:00 PM IST',
    prizePool: '₹ 40,000 INR',
    squadType: 'Solo',
    format: 'Isolated Map BR',
    map: 'Isolated',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_pubg_mobile_4k.jpg'
  },
  {
    id: 'bgmi-underdog-pro-reg',
    title: 'BGMI UNDERDOG PRO RUMBLE',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    category: 'BGMI',
    badge: '⭐ VERIFIED SQUAD CUP',
    badgeColor: 'bg-[#DFBD78] text-black font-extrabold',
    schedule: 'Starts Monday • 7:30 PM IST',
    prizePool: '₹ 60,000 INR',
    squadType: 'Squad',
    format: 'Underdog Squad Qualifier',
    map: 'Erangel / Vikendi',
    entryFee: 'FREE ENTRY',
    slots: 'Open Registration',
    image: '/assets/tournament_pubg_ultimate_squad_4k.jpg'
  }
];

export default function TournamentsPage({ onNavigate, currentUser }) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeSquadType, setActiveSquadType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  // Modal State
  const [selectedTourney, setSelectedTourney] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [squadName, setSquadName] = useState('');
  const [leaderIgn, setLeaderIgn] = useState('');
  const [characterId, setCharacterId] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [teammates, setTeammates] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccessData, setRegSuccessData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Active user helper
  const getActiveUser = () => {
    if (currentUser) return currentUser;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lt_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const activeUser = getActiveUser();

  // Joined Tournaments Sync
  const [joinedTourneyIds, setJoinedTourneyIds] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lt_user_joined_tourneys');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return new Set(parsed.map(t => t.id || t.tourneyId || t.title));
          }
        }
      } catch (e) {}
    }
    return new Set();
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleCategoryChange = (cat) => {
    setIsFiltering(true);
    setActiveCategory(cat);
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleSquadChange = (sq) => {
    setIsFiltering(true);
    setActiveSquadType(sq);
    setTimeout(() => setIsFiltering(false), 220);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 200);
  };

  // Close modals safely without navigation
  const handleCloseAuthModal = (e) => {
    if (e) e.stopPropagation();
    setShowAuthModal(false);
    setSelectedTourney(null);
  };

  const handleCloseRegistrationModal = (e) => {
    if (e) e.stopPropagation();
    setSelectedTourney(null);
    setRegSuccessData(null);
  };

  // Open Registration Modal with strict sign-in verification
  const handleOpenRegister = (tourney) => {
    const activeUser = getActiveUser();

    if (!activeUser) {
      setSelectedTourney(tourney);
      setShowAuthModal(true);
      return;
    }

    if (joinedTourneyIds.has(tourney.id) || joinedTourneyIds.has(tourney.title)) {
      showToast(`✓ You are already registered for ${tourney.title}. Opening Dashboard...`);
      if (onNavigate) {
        setTimeout(() => onNavigate('user-dashboard'), 600);
      }
      return;
    }

    setSelectedTourney(tourney);
    setRegSuccessData(null);
    setSquadName(activeUser.clan || '');
    setLeaderIgn(activeUser.username || activeUser.name || '');
    setCharacterId('');
    setWhatsappNumber(activeUser.mobile || '');
    setTeammates('');
  };

  // Submit Match Registration
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    const activeUser = getActiveUser();
    if (!activeUser || !selectedTourney) return;

    if (!squadName.trim() || !leaderIgn.trim() || !characterId.trim()) {
      showToast('⚠️ Please fill Squad Name, In-Game Name, and Character ID.');
      return;
    }

    setIsRegistering(true);

    try {
      const roomPass = 'LT-' + Math.floor(100000 + Math.random() * 900000);
      const slotNum = Math.floor(1 + Math.random() * 25);
      const regId = 'REG-' + Date.now().toString().slice(-6);

      const newRegistration = {
        id: regId,
        tourneyId: selectedTourney.id,
        title: selectedTourney.title,
        game: selectedTourney.game,
        schedule: selectedTourney.schedule,
        prizePool: selectedTourney.prizePool,
        squadName: squadName.trim(),
        leaderIgn: leaderIgn.trim(),
        characterId: characterId.trim(),
        whatsappNumber: whatsappNumber.trim() || activeUser.mobile || '',
        teammates: teammates.trim(),
        registeredAt: new Date().toISOString(),
        registeredTimeIST: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
        status: 'CONFIRMED',
        roomCredentials: {
          slotNumber: slotNum,
          roomCode: 'LT-ROOM-' + Math.floor(1000 + Math.random() * 9000),
          password: roomPass,
          distributionTime: '15 Minutes Before Match Start via SMS & Dashboard'
        }
      };

      // Save to localStorage joined tournaments
      const existing = JSON.parse(localStorage.getItem('lt_user_joined_tourneys') || '[]');
      existing.unshift(newRegistration);
      localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(existing));

      setJoinedTourneyIds(prev => new Set([...prev, selectedTourney.id, selectedTourney.title]));
      setRegSuccessData(newRegistration);
      setIsRegistering(false);
      showToast(`🎉 Registration Confirmed for ${selectedTourney.title}!`);
    } catch (err) {
      console.error('Registration error:', err);
      setIsRegistering(false);
      showToast('⚠️ Registration error. Please try again.');
    }
  };

  // Filtered Tournaments
  const filteredTournaments = useMemo(() => {
    return ALL_TOURNAMENTS_CATALOG.filter((tourney) => {
      // Category filter
      if (activeCategory !== 'ALL') {
        if (tourney.category !== activeCategory) return false;
      }

      // Squad filter
      if (activeSquadType !== 'ALL') {
        const sq = tourney.squadType?.toLowerCase() || '';
        if (activeSquadType === 'SOLO' && !sq.includes('solo')) return false;
        if (activeSquadType === 'DUO' && !sq.includes('duo')) return false;
        if (activeSquadType === 'SQUAD' && !sq.includes('squad')) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = tourney.title.toLowerCase().includes(q);
        const matchGame = tourney.game.toLowerCase().includes(q);
        const matchMap = (tourney.map || '').toLowerCase().includes(q);
        if (!matchTitle && !matchGame && !matchMap) return false;
      }

      return true;
    });
  }, [activeCategory, activeSquadType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-neutral-900 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-black text-white shadow-2xl border border-gold-primary text-xs font-semibold animate-fade-in">
          <span className="material-symbols-outlined text-gold-primary text-base">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-black transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">home</span>
              <span>Home</span>
            </button>
            <span>/</span>
            <span className="text-black font-bold">Tournaments &amp; Scrims Arena</span>
          </div>

          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gold-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>&larr; Back to Main Arena</span>
          </button>
        </div>
      </div>

      {/* Arena Hero Header */}
      <section className="bg-neutral-950 text-white border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-gold-primary/10 via-transparent to-transparent pointer-events-none opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-primary/15 text-gold-primary border border-gold-primary/30 text-[11px] font-mono font-bold uppercase tracking-widest">
                <span className="size-2 rounded-full bg-gold-primary animate-pulse"></span>
                Official Esports Hub
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white">
                Tournament &amp; Match Registrations
              </h1>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Discover active tournament matches, enter competitive brackets across BGMI, PUBG Mobile, and Free Fire MAX, and receive instant custom room credentials directly on your dashboard.
              </p>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Prize Pool</span>
                <span className="text-lg font-black text-gold-primary font-mono block mt-0.5">₹ 9,50,000+</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Match Anti-Cheat</span>
                <span className="text-lg font-black text-emerald-400 font-mono block mt-0.5">100% Verified</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Entry Policy</span>
                <span className="text-lg font-black text-white font-mono block mt-0.5">Free Registration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Tournament Arena */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Controls Bar: Search & Category Filter Pills */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/90 shadow-sm space-y-4 mb-8">
          {/* Top row: Search and Squad Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
              <input
                type="text"
                placeholder="Search by tournament name, title, game, or map (e.g. BGMI, Erangel)..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 bg-white focus:border-gold-primary focus:ring-2 focus:ring-gold-primary/20 focus:outline-hidden transition-all text-gray-900 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Squad Type Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">Format:</span>
              {['ALL', 'SQUAD', 'DUO', 'SOLO'].map((sq) => (
                <button
                  key={sq}
                  onClick={() => handleSquadChange(sq)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    activeSquadType === sq
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {sq === 'ALL' ? 'All Formats' : sq}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom row: Game Category Pills */}
          <div className="pt-3 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'ALL'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>All Matches</span>
              <span className="text-[10px] opacity-75 font-mono">({ALL_TOURNAMENTS_CATALOG.length})</span>
            </button>

            <button
              onClick={() => handleCategoryChange('BGMI')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'BGMI'
                  ? 'bg-gold-primary text-black shadow-sm font-extrabold'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🎯 BGMI Showdowns</span>
            </button>

            <button
              onClick={() => handleCategoryChange('PUBG')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'PUBG'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🏆 PUBG Mobile</span>
            </button>

            <button
              onClick={() => handleCategoryChange('FREEFIRE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'FREEFIRE'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>⚡ Free Fire MAX</span>
            </button>

            <button
              onClick={() => handleCategoryChange('OTHER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === 'OTHER'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <span>🎮 Tactical &amp; PC</span>
            </button>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Showing <span className="text-black font-extrabold font-mono">{filteredTournaments.length}</span> Available Tournaments
          </p>

          {activeUser && (
            <button
              onClick={() => onNavigate && onNavigate('user-dashboard')}
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View My Active Matches</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Tournament Cards Grid */}
        {isFiltering ? (
          <SkeletonLoader variant="tournament-card" count={4} />
        ) : filteredTournaments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/80 shadow-xs space-y-3">
            <span className="material-symbols-outlined text-gray-400 text-5xl">sports_esports</span>
            <h3 className="text-lg font-bold text-gray-800">No Tournaments Match Your Filter</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Try adjusting your game category, squad format, or search keywords to find open competitive lobbies.
            </p>
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setActiveSquadType('ALL');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-primary hover:text-black transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredTournaments.map((tourney) => {
              const isRegistered = joinedTourneyIds.has(tourney.id) || joinedTourneyIds.has(tourney.title);

              return (
                <div
                  key={tourney.id}
                  onClick={() => handleOpenRegister(tourney)}
                  className={`group relative flex flex-col rounded-2xl bg-white shadow-md hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 ease-out border overflow-hidden cursor-pointer transform-gpu will-change-transform hover:scale-[1.07] hover:-translate-y-3 hover:z-30 hover:border-gold-primary hover:ring-2 hover:ring-gold-primary/40 ${
                    isRegistered ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-black/10'
                  }`}
                >
                  {/* Image Banner with Hover Prize Overlay */}
                  <div className="relative aspect-[1.74/1] w-full overflow-hidden bg-neutral-900">
                    <img
                      alt={tourney.title}
                      loading="lazy"
                      width="462"
                      height="266"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      src={tourney.image}
                    />

                    {/* Smooth Hover Prize Banner Pop */}
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center pointer-events-none">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gold-primary font-bold">
                        Prize Pool
                      </span>
                      <span className="text-lg font-black text-white font-mono drop-shadow-md">
                        {tourney.prizePool}
                      </span>
                      <span className="mt-2 px-3 py-1 rounded-full bg-gold-primary text-black font-bold text-[10px] uppercase tracking-wider shadow">
                        {isRegistered ? 'Slot Active ✓' : 'Register Now →'}
                      </span>
                    </div>
                  </div>

                  {/* Clean Content: Title, Timing, Free/Paid Status & Prize Pool */}
                  <div className="flex flex-col justify-between flex-1 p-4 lg:p-5 gap-3.5">
                    <div>
                      <h3 className="primary-bold-s16-lh120 text-dark-default uppercase group-hover:text-gold-primary transition-colors duration-200 line-clamp-1">
                        {tourney.title}
                      </h3>
                      {/* Match Timing & Free/Paid Status (Below Title) */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500 font-mono mt-1.5">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <span className="material-symbols-outlined text-[13px] text-gold-primary">schedule</span>
                          <span>{tourney.schedule}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          {tourney.entryFee || 'FREE ENTRY'}
                        </span>
                      </div>
                    </div>

                    {/* Prize Pool & Registration Action Button */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Prize Pool</span>
                        <span className="text-sm font-extrabold text-black group-hover:text-gold-primary transition-colors font-mono">{tourney.prizePool}</span>
                      </div>

                      {isRegistered ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onNavigate) onNavigate('user-dashboard');
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Slot Active ✓</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRegister(tourney);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-black text-white group-hover:bg-gold-primary group-hover:text-black text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs cursor-pointer flex items-center gap-1 group-hover:shadow-md"
                        >
                          <span>Register Match</span>
                          <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL 1: AUTH REQUIRED NOTICE (Only Sign-In Players)
          ======================================================== */}
      {showAuthModal && (
        <div 
          onClick={handleCloseAuthModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 overflow-hidden text-center p-6 space-y-4"
          >
            {/* Top-right close button that closes cleanly without redirection */}
            <button
              type="button"
              onClick={handleCloseAuthModal}
              className="absolute top-4 right-4 size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            <div className="size-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-xs">
              <span className="material-symbols-outlined text-[32px]">lock</span>
            </div>

            <div className="space-y-1.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gold-primary/20 text-black border border-gold-primary/40">
                Official Match Policy
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Sign In Required to Register
              </h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Only signed-in players can register for official competitive matches and receive custom room credentials.
              </p>
            </div>

            {selectedTourney && (
              <div className="bg-neutral-50 p-3 rounded-xl border border-gray-200 text-left flex items-center gap-3">
                <img
                  src={selectedTourney.image}
                  alt={selectedTourney.title}
                  className="size-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-900 truncate">{selectedTourney.title}</h4>
                  <p className="text-[10px] text-gold-primary font-bold uppercase">{selectedTourney.game}</p>
                  <p className="text-[10px] text-gray-500">{selectedTourney.schedule}</p>
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedTourney(null);
                  if (onNavigate) onNavigate('login');
                }}
                className="w-full py-3 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Sign In to Register</span>
                <span className="material-symbols-outlined text-[16px]">login</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedTourney(null);
                  if (onNavigate) onNavigate('register');
                }}
                className="w-full py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Create New Player Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: MATCH REGISTRATION FOR SIGNED-IN PLAYERS
          ======================================================== */}
      {selectedTourney && !showAuthModal && (
        <div 
          onClick={handleCloseRegistrationModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 bg-neutral-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-gold-primary text-black">
                  Match Entry Arena
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {regSuccessData ? 'Registration Confirmed!' : 'Register for Tournament'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseRegistrationModal}
                className="size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {regSuccessData ? (
                <div className="space-y-4 text-center py-2">
                  <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Your Squad is Registered!</h4>
                  <p className="text-gray-600 text-xs">
                    Your spot for <strong>{regSuccessData.title}</strong> has been secured. Custom room credentials will be delivered before match start.
                  </p>

                  <div className="p-4 rounded-xl bg-neutral-50 border border-gray-200 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Registration ID:</span>
                      <span className="font-mono font-bold text-black">{regSuccessData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Squad Name:</span>
                      <span className="font-bold text-black">{regSuccessData.squadName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Leader IGN:</span>
                      <span className="font-bold text-black">{regSuccessData.leaderIgn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assigned Slot:</span>
                      <span className="font-bold text-emerald-600 font-mono">Slot #{regSuccessData.roomCredentials.slotNumber}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => {
                        handleCloseRegistrationModal();
                        if (onNavigate) onNavigate('user-dashboard');
                      }}
                      className="flex-1 py-3 rounded-xl bg-gold-primary hover:bg-gold-light text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-md"
                    >
                      Open Competitor Dashboard &rarr;
                    </button>
                    <button
                      onClick={handleCloseRegistrationModal}
                      className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegistration} className="space-y-4">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-gray-200 flex items-center gap-3">
                    <img
                      src={selectedTourney.image}
                      alt={selectedTourney.title}
                      className="size-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{selectedTourney.title}</h4>
                      <p className="text-[10px] text-gray-500">{selectedTourney.schedule} • {selectedTourney.prizePool}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Squad / Clan Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GodLike Esports, Soul Clan"
                        value={squadName}
                        onChange={(e) => setSquadName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Leader In-Game Name (IGN) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. JonathanGaming"
                          value={leaderIgn}
                          onChange={(e) => setLeaderIgn(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                          In-Game Character ID *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 5123456789"
                          value={characterId}
                          onChange={(e) => setCharacterId(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        WhatsApp Contact (For Room ID &amp; Password)
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Teammates In-Game Names (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Player 2 IGN, Player 3 IGN, Player 4 IGN"
                        value={teammates}
                        onChange={(e) => setTeammates(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-gold-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseRegistrationModal}
                      className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                    >
                      Close
                    </button>

                    <ButtonLoader
                      type="submit"
                      loading={isRegistering}
                      loadingText="Securing Slot..."
                      variant="gold"
                      className="px-6 py-2.5 text-xs font-bold"
                    >
                      Confirm Match Registration
                    </ButtonLoader>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
