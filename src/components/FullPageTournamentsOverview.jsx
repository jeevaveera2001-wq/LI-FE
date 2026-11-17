import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Calendar, Shield, Users, User, ArrowLeft, LogOut, Search, Clock, MapPin, CheckCircle2, ChevronRight, AlertCircle, Sparkles, Filter, Check, Copy, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { getStoredTournaments, getStoredHallOfFame, submitTournamentRegistration, getStoredRegistrations } from '../utils/portalData';
import confetti from 'canvas-confetti';

export const FullPageTournamentsOverview = ({
  currentUser,
  onLogout,
  onBackToPortal,
  onOpenAdmin,
  onOpenSuperAdmin
}) => {
  // Category state (matching user's reference UI)
  const [matchCategory, setMatchCategory] = useState('SQUAD'); // 'SQUAD' | 'DUO' | 'SOLO'
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'LIVE' | 'UPCOMING' | 'SCRIMS' | 'LEADERBOARD'
  const [searchQuery, setSearchQuery] = useState('');

  // Tournaments & Scrims Data
  const [tournaments, setTournaments] = useState(getStoredTournaments());
  const [hofData, setHofData] = useState(() => getStoredHallOfFame());
  const [registrations, setRegistrations] = useState(getStoredRegistrations());

  // Quick In-Page Registration Modal State
  const [registeringItem, setRegisteringItem] = useState(null); // tournament or scrim
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

  // Upcoming Tournaments List
  const upcomingTournaments = [
    {
      id: 'up-1',
      title: 'UPCOMING TOURNAMENT 1 (SOLO WAR)',
      category: 'SOLO',
      format: 'Solo TPP Sanhok',
      prize: '₹2,50,000 INR',
      date: 'Starts July 05, 2026',
      time: '6:00 PM IST',
      map: 'Sanhok',
      totalSlots: 100,
      filledSlots: 14,
      status: 'UPCOMING',
      tag: 'SOLO BATTLE'
    },
    {
      id: 'up-2',
      title: 'UPCOMING TOURNAMENT 2 (DUO WAR)',
      category: 'DUO',
      format: 'Duo TPP Miramar',
      prize: '₹2,50,000 INR',
      date: 'Starts July 12, 2026',
      time: '7:00 PM IST',
      map: 'Miramar',
      totalSlots: 50,
      filledSlots: 12,
      status: 'UPCOMING',
      tag: 'DUO CLASH'
    },
    {
      id: 'up-3',
      title: 'UPCOMING TOURNAMENT 3 (SQUAD WAR)',
      category: 'SQUAD',
      format: 'Squad TPP Erangel',
      prize: '₹2,50,000 INR',
      date: 'Starts July 19, 2026',
      time: '7:30 PM IST',
      map: 'Erangel',
      totalSlots: 25,
      filledSlots: 9,
      status: 'UPCOMING',
      tag: 'SQUAD WAR'
    },
    {
      id: 'up-4',
      title: 'UPCOMING TOURNAMENT 4 (CHAMPIONSHIP)',
      category: 'SQUAD',
      format: 'Squad TPP All Maps',
      prize: '₹5,00,000 INR',
      date: 'Starts July 26, 2026',
      time: '8:00 PM IST',
      map: 'Erangel / Miramar / Sanhok',
      totalSlots: 25,
      filledSlots: 18,
      status: 'UPCOMING',
      tag: 'MEGA GRAND FINALE'
    }
  ];

  // Daily Scrims Schedule Data
  const dailyScrims = [
    {
      id: 'scrim-1',
      title: 'DAILY TIER-1 SQUAD SCRIM (MATCH 1)',
      category: 'SQUAD',
      format: 'Squad TPP Erangel',
      time: '5:00 PM IST',
      checkinTime: '4:45 PM IST',
      map: 'Erangel',
      totalSlots: 25,
      filledSlots: 21,
      status: 'OPEN',
      mode: 'Custom Competitive Room'
    },
    {
      id: 'scrim-2',
      title: 'DAILY TIER-1 SQUAD SCRIM (MATCH 2)',
      category: 'SQUAD',
      format: 'Squad TPP Miramar',
      time: '7:00 PM IST',
      checkinTime: '6:45 PM IST',
      map: 'Miramar',
      totalSlots: 25,
      filledSlots: 18,
      status: 'OPEN',
      mode: 'Custom Competitive Room'
    },
    {
      id: 'scrim-3',
      title: 'HIGH-KILL SPRINT SCRIM (MATCH 3)',
      category: 'SQUAD',
      format: 'Squad TPP Sanhok',
      time: '9:00 PM IST',
      checkinTime: '8:45 PM IST',
      map: 'Sanhok',
      totalSlots: 25,
      filledSlots: 15,
      status: 'OPEN',
      mode: 'Custom Competitive Room'
    },
    {
      id: 'scrim-4',
      title: 'DUO INTENSE PRACTICE SCRIM',
      category: 'DUO',
      format: 'Duo TPP Miramar',
      time: '6:00 PM IST',
      checkinTime: '5:45 PM IST',
      map: 'Miramar',
      totalSlots: 50,
      filledSlots: 38,
      status: 'OPEN',
      mode: 'Custom Competitive Room'
    },
    {
      id: 'scrim-5',
      title: 'SOLO DEATHMATCH BOOTCAMP SCRIM',
      category: 'SOLO',
      format: 'Solo TPP Sanhok',
      time: '8:00 PM IST',
      checkinTime: '7:45 PM IST',
      map: 'Sanhok',
      totalSlots: 100,
      filledSlots: 82,
      status: 'OPEN',
      mode: 'Custom Competitive Room'
    }
  ];

  // Filter Live Tournaments by category
  const filteredLive = tournaments.filter(t => {
    const text = `${t.title || ''} ${t.format || ''} ${t.category || ''}`.toUpperCase();
    if (matchCategory === 'SOLO') return text.includes('SOLO');
    if (matchCategory === 'DUO') return text.includes('DUO');
    return !text.includes('SOLO') && !text.includes('DUO');
  });

  // Filter Upcoming Tournaments by category
  const filteredUpcoming = upcomingTournaments.filter(t => {
    return t.category === matchCategory;
  });

  // Filter Scrims by category
  const filteredScrims = dailyScrims.filter(s => {
    return s.category === matchCategory;
  });

  // Standings Leaderboard for current category
  const currentLeaderboard = hofData[matchCategory] || getStoredHallOfFame(matchCategory) || [];

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
      matchType: matchCategory,
      player1Name: regIglName,
      player1Id: regPlayer1Id,
      player2Name: 'Player 2',
      player2Id: regPlayer2Id,
      player3Name: 'Player 3',
      player3Id: regPlayer3Id,
      player4Name: 'Player 4',
      player4Id: regPlayer4Id,
      tournamentTitle: registeringItem?.title || `${matchCategory} Championship`
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
        
        {/* Welcome Banner */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Match Operations & Live Arena</span>
            </div>
            <h1 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
              Overall Tournaments & Scrims Hub
            </h1>
            <p className="text-sm text-[#64748B] mt-1.5 max-w-2xl leading-relaxed">
              Register your squad for official high-stakes championships, practice in daily competitive custom room scrims, and check live verified standings.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="px-5 py-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Total Prize Pool</div>
              <div className="text-xl font-extrabold text-[#0F172A]">₹10,00,000+</div>
            </div>
            <div className="px-5 py-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
              <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Daily Scrims</div>
              <div className="text-xl font-extrabold text-emerald-600">3 Matches</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Row (MATCH CATEGORY - Matching the User's Screenshot Exactly) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Match Category Buttons (SQUAD / DUO / SOLO) */}
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] block mb-1.5">
              MATCH CATEGORY
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMatchCategory('SQUAD');
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  matchCategory === 'SQUAD'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                }`}
              >
                SQUAD (4P)
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMatchCategory('DUO');
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  matchCategory === 'DUO'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                }`}
              >
                DUO (2P)
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setMatchCategory('SOLO');
                }}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  matchCategory === 'SOLO'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white border border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                }`}
              >
                SOLO (1P)
              </button>
            </div>
          </div>

          {/* Section View Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
            {[
              { id: 'ALL', label: 'All Overview' },
              { id: 'LIVE', label: 'Live Tournaments' },
              { id: 'UPCOMING', label: 'Upcoming Tournaments' },
              { id: 'SCRIMS', label: 'Daily Scrims' },
              { id: 'LEADERBOARD', label: 'Scrims Standings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: LIVE TOURNAMENTS                             */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'LIVE') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h2 className="font-montserrat font-bold text-lg text-[#0F172A] uppercase tracking-wide">
                  Live Tournaments ({matchCategory} Format)
                </h2>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Registration Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredLive.length > 0 ? (
                filteredLive.slice(0, 4).map((tournament, idx) => (
                  <div
                    key={tournament.id || idx}
                    className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                          Active War
                        </span>
                        <span className="text-[#64748B]">{tournament.category || 'BOTSQUADWAR'}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-montserrat font-extrabold text-sm text-[#0F172A] leading-snug line-clamp-2">
                        {tournament.title}
                      </h3>

                      {/* Details */}
                      <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Map:</span>
                          <span className="font-bold text-[#0F172A]">{tournament.map || 'Erangel'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Format:</span>
                          <span className="font-bold text-[#0F172A]">{tournament.format || 'Squad War'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Prize:</span>
                          <span className="font-bold text-amber-600">{tournament.prizePool || tournament.prize || '₹2,50,000 INR'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#64748B]">Slots:</span>
                          <span className="font-bold text-[#0F172A]">{tournament.totalSlots || 25} Squads Limit</span>
                        </div>
                      </div>

                      {/* Slot Progress Bar */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[10px] text-[#64748B] mb-1 font-semibold">
                          <span>Slots Filled</span>
                          <span>18 / {tournament.totalSlots || 25} (72%)</span>
                        </div>
                        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                          <div className="bg-[#0F172A] h-full rounded-full" style={{ width: '72%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playModalOpen();
                        setRegisteringItem(tournament);
                        setRegistrationSuccessData(null);
                      }}
                      className="mt-4 w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Swords className="w-3.5 h-3.5 text-amber-400" />
                      <span>Register {matchCategory}</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center text-sm text-[#64748B]">
                  No tournaments found for {matchCategory} category. Switch category or view upcoming events.
                </div>
              )}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: UPCOMING TOURNAMENTS                         */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'UPCOMING') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h2 className="font-montserrat font-bold text-lg text-[#0F172A] uppercase tracking-wide">
                  Upcoming Tournaments
                </h2>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                Pre-Registrations Open
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredUpcoming.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold mb-2">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {item.tag}
                      </span>
                      <span className="text-[#64748B]">{item.time}</span>
                    </div>

                    <h3 className="font-montserrat font-extrabold text-sm text-[#0F172A] leading-snug">
                      {item.title}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Schedule:</span>
                        <span className="font-bold text-[#0F172A]">{item.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Format & Map:</span>
                        <span className="font-bold text-[#0F172A]">{item.format}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Prize Pool:</span>
                        <span className="font-bold text-amber-600">{item.prize}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Cap:</span>
                        <span className="font-bold text-[#0F172A]">{item.totalSlots} Slots</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playModalOpen();
                      setRegisteringItem(item);
                      setRegistrationSuccessData(null);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-white border border-[#CBD5E1] hover:bg-slate-100 text-[#0F172A] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Pre-Register Now</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* SECTION 3: DAILY SCRIMS SCHEDULE                        */}
        {/* ======================================================== */}
        {(activeTab === 'ALL' || activeTab === 'SCRIMS') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="font-montserrat font-bold text-lg text-[#0F172A] uppercase tracking-wide">
                  Daily Scrims & Custom Room Schedule
                </h2>
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                Daily Practice Lobbies
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredScrims.map((scrim) => (
                <div
                  key={scrim.id}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:border-[#CBD5E1] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                        {scrim.category} SCRIM
                      </span>
                      <span className="text-emerald-700 font-bold">{scrim.filledSlots}/{scrim.totalSlots} Slots</span>
                    </div>

                    <h3 className="font-montserrat font-extrabold text-sm text-[#0F172A]">
                      {scrim.title}
                    </h3>

                    <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Match Time:</span>
                        <span className="font-bold text-[#0F172A]">{scrim.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Check-in Opens:</span>
                        <span className="font-bold text-[#0F172A]">{scrim.checkinTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Map:</span>
                        <span className="font-bold text-[#0F172A]">{scrim.map}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#64748B]">Room Release:</span>
                        <span className="font-bold text-slate-700">15m before start</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playModalOpen();
                      setRegisteringItem(scrim);
                      setRegistrationSuccessData(null);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Book Scrim Slot</span>
                  </button>
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
                  Scrims & Official Top 10 Standings ({matchCategory})
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
                    <span className="font-mono font-bold text-[#0F172A]">{registrationSuccessData.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Assigned Slot:</span>
                    <span className="font-bold text-emerald-600 text-sm">Slot #{registrationSuccessData.slotNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Team Passcode:</span>
                    <span className="font-mono font-bold text-[#0F172A]">{registrationSuccessData.passcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748B]">Match Category:</span>
                    <span className="font-bold text-[#0F172A]">{matchCategory}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setRegisteringItem(null);
                    setRegistrationSuccessData(null);
                  }}
                  className="w-full py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleQuickRegister} className="mt-4 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                    Team Name / Clan Tag
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Soul, GodLike, Velocity"
                    value={regTeamName}
                    onChange={(e) => setRegTeamName(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                      Captain / IGL Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Captain Name"
                      value={regIglName}
                      onChange={(e) => setRegIglName(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                      WhatsApp Phone
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={regIglPhone}
                      onChange={(e) => setRegIglPhone(e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                  </div>
                </div>

                {/* Player 1 IGID */}
                <div>
                  <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                    Player 1 (IGL) BGMI Numeric ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="5123456789 (digits only)"
                    value={regPlayer1Id}
                    onChange={(e) => setRegPlayer1Id(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                  />
                </div>

                {/* Additional Players based on Match Category */}
                {(matchCategory === 'DUO' || matchCategory === 'SQUAD') && (
                  <div>
                    <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                      Player 2 BGMI Numeric ID
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="5123456780 (digits only)"
                      value={regPlayer2Id}
                      onChange={(e) => setRegPlayer2Id(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                  </div>
                )}

                {matchCategory === 'SQUAD' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                        Player 3 Numeric ID
                      </label>
                      <input
                        type="text"
                        placeholder="Player 3 IGID"
                        value={regPlayer3Id}
                        onChange={(e) => setRegPlayer3Id(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#334155] mb-1 uppercase tracking-wider">
                        Player 4 Numeric ID
                      </label>
                      <input
                        type="text"
                        placeholder="Player 4 IGID"
                        value={regPlayer4Id}
                        onChange={(e) => setRegPlayer4Id(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-sm font-mono text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-3 py-3 rounded-xl bg-[#0F172A] hover:bg-black text-white font-montserrat font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Confirming Registration...' : 'Complete Slot Registration'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-[#94A3B8] border-t border-[#E2E8F0] bg-white">
        © {new Date().getFullYear()} Live tournaments.in. Official Competitive BGMI Portal.
      </footer>

    </div>
  );
};

export default FullPageTournamentsOverview;
