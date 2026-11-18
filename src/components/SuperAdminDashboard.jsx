import React, { useState, useEffect, useMemo } from 'react';

export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  // Active navigation tab: default to 'dashboard' matching the newly requested image!
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Trigger brief toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync Live Handler
  const handleSyncLive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('⚡ Live dashboard telemetry synced in real-time');
    }, 600);
  };

  // 1. TOURNAMENT HOSTING REQUESTS BY USERS
  const [hostingRequests, setHostingRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_hosting_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'req_h1',
        title: 'BGMI Underdog Showdown S4',
        organizer: 'Aditya Sharma',
        clan: 'Clan Hydra Esports',
        game: 'Battlegrounds Mobile India',
        format: 'Squad (Erangel + Miramar)',
        slots: '64 Teams (256 Players)',
        timing: 'Today, 8:30 PM IST',
        prizePool: '₹25,000',
        entryFee: 'Free Entry',
        email: 'aditya.hydra@gmail.com',
        mobile: '+91 98765 12345',
        status: 'PENDING',
        requestedAt: '12 mins ago'
      },
      {
        id: 'req_h2',
        title: 'Free Fire MAX Clutch Masters Cup',
        organizer: 'Karan Patel',
        clan: 'Team Venom Gaming',
        game: 'Free Fire MAX',
        format: 'Clash Squad 4v4 Knockout',
        slots: '32 Teams (128 Players)',
        timing: 'Tomorrow, 6:00 PM IST',
        prizePool: '₹15,000',
        entryFee: '₹50 / team',
        email: 'karan.venom@gmail.com',
        mobile: '+91 98111 88990',
        status: 'PENDING',
        requestedAt: '35 mins ago'
      },
      {
        id: 'req_h3',
        title: 'Valorant Mumbai Spike League',
        organizer: 'Rohan Mehra',
        clan: 'Deadly 5 Esports',
        game: 'Valorant',
        format: '5v5 Competitive Custom',
        slots: '16 Teams',
        timing: 'Nov 21, 7:00 PM IST',
        prizePool: '₹30,000',
        entryFee: '₹100 / team',
        email: 'rohan.val@gmail.com',
        mobile: '+91 98222 77889',
        status: 'PENDING',
        requestedAt: '1 hour ago'
      },
      {
        id: 'req_h4',
        title: 'COD Mobile Battle Royale War',
        organizer: 'Sameer Khan',
        clan: 'Delta Force India',
        game: 'COD Mobile',
        format: 'Isolated Squad BR',
        slots: '25 Squads (100 Players)',
        timing: 'Nov 22, 5:00 PM IST',
        prizePool: '₹10,000',
        entryFee: 'Free',
        email: 'sameer.delta@gmail.com',
        mobile: '+91 98444 33221',
        status: 'PENDING',
        requestedAt: '2 hours ago'
      },
      {
        id: 'req_h5',
        title: 'Apex Legends Predators Rumble',
        organizer: 'Vikram Sethi',
        clan: 'Apex Gladiators',
        game: 'Apex Legends',
        format: 'Trios Worlds Edge',
        slots: '20 Squads (60 Players)',
        timing: 'Nov 23, 8:00 PM IST',
        prizePool: '₹20,000',
        entryFee: 'Free',
        email: 'vikram.apex@gmail.com',
        mobile: '+91 98555 44332',
        status: 'PENDING',
        requestedAt: '3 hours ago'
      },
      {
        id: 'req_h6',
        title: 'BGMI Weekend Midnight Custom',
        organizer: 'Pooja Verma',
        clan: 'Shadow Strikers',
        game: 'Battlegrounds Mobile India',
        format: 'Duo Sanhok Blitz',
        slots: '50 Duos (100 Players)',
        timing: 'Nov 22, 11:00 PM IST',
        prizePool: '₹12,000',
        entryFee: '₹20 / duo',
        email: 'pooja.shadow@gmail.com',
        mobile: '+91 98666 55443',
        status: 'PENDING',
        requestedAt: '4 hours ago'
      }
    ];
  });

  // 2. SCRIMS REQUESTS (DAILY, WEEKLY, MONTHLY)
  const [scrimsRequests, setScrimsRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_scrims_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'scrim_1',
        clan: 'Team Soul Tier-1 Pro Scrims',
        tier: 'Tier 1 Pro',
        type: 'DAILY',
        game: 'BGMI',
        format: 'Squad (Miramar + Erangel)',
        slots: '20 Pro Teams',
        schedule: 'Daily 6:00 PM & 9:00 PM IST',
        contact: 'scrims@teamsoul.in',
        status: 'PENDING',
        frequencyBadge: 'Daily Scrim'
      },
      {
        id: 'scrim_2',
        clan: 'GodLike Practice Cup',
        tier: 'Tier 1 Invited',
        type: 'DAILY',
        game: 'BGMI',
        format: 'Squad (Sanhok + Erangel)',
        slots: '20 Teams',
        schedule: 'Daily 8:00 PM IST',
        contact: 'management@godlike.in',
        status: 'PENDING',
        frequencyBadge: 'Daily Scrim'
      },
      {
        id: 'scrim_3',
        clan: '7Sea Esports Weekly League',
        tier: 'Tier 2 Open',
        type: 'WEEKLY',
        game: 'Free Fire MAX',
        format: 'Squad (Bermuda + Purgatory)',
        slots: '24 Teams',
        schedule: 'Every Saturday 7:00 PM IST',
        contact: 'ops@7seaesports.com',
        status: 'PENDING',
        frequencyBadge: 'Weekly Scrim'
      },
      {
        id: 'scrim_4',
        clan: 'Entity Gaming Weekly Clash',
        tier: 'Tier 1 / 2 Semi-Pro',
        type: 'WEEKLY',
        game: 'BGMI',
        format: 'Squad (4 Matches Rotation)',
        slots: '22 Teams',
        schedule: 'Every Sunday 5:00 PM IST',
        contact: 'entity@gaming.in',
        status: 'PENDING',
        frequencyBadge: 'Weekly Scrim'
      },
      {
        id: 'scrim_5',
        clan: 'Reckoning Monthly Qualifier',
        tier: 'Tier 1 Championship',
        type: 'MONTHLY',
        game: 'Valorant',
        format: '5v5 Single Elimination Bracket',
        slots: '32 Teams',
        schedule: 'Last Weekend of Every Month',
        contact: 'esports@reckoning.in',
        status: 'PENDING',
        frequencyBadge: 'Monthly Scrim'
      },
      {
        id: 'scrim_6',
        clan: 'Orangutan Daily Scrims Pool',
        tier: 'Tier 2 Elite',
        type: 'DAILY',
        game: 'BGMI',
        format: 'Squad (Erangel)',
        slots: '20 Teams',
        schedule: 'Daily 4:00 PM IST',
        contact: 'scrims@orangutan.in',
        status: 'PENDING',
        frequencyBadge: 'Daily Scrim'
      }
    ];
  });

  // 3. HOSTING TOURNAMENTS REQUESTS (PARTNERED)
  const [partnerHostingRequests, setPartnerHostingRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_partner_hostings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'part_1',
        organization: 'Villager Esports',
        title: 'Villager Pro Invitational - Winter 2026',
        game: 'Battlegrounds Mobile India',
        tier: 'National Tier-1 Invited Championship',
        prizePool: '₹10,00,000',
        dates: 'Dec 05 - Dec 12, 2026',
        verification: 'Verified Partner · GSTIN: 27AABCV1234F1Z5',
        requestedBy: 'Ankit Panth (Head of Tournaments)',
        status: 'PENDING'
      },
      {
        id: 'part_2',
        organization: 'Upthrust Esports',
        title: 'Diwali Battleground Wars 2026',
        game: 'Free Fire MAX',
        tier: 'National Open Championship',
        prizePool: '₹5,00,000',
        dates: 'Nov 28 - Nov 30, 2026',
        verification: 'Verified Partner · GSTIN: 07AAEFU4321D1Z2',
        requestedBy: 'Karthik Rao (Operations Lead)',
        status: 'PENDING'
      },
      {
        id: 'part_3',
        organization: 'Nodwin Gaming Partner League',
        title: 'All-India College Esports Cup',
        game: 'Valorant + BGMI',
        tier: 'Collegiate National Series',
        prizePool: '₹7,50,000',
        dates: 'Dec 15 - Dec 22, 2026',
        verification: 'Verified Partner · GSTIN: 06AABCN8899K1Z9',
        requestedBy: 'Rhea Sen (Campus Outreach Director)',
        status: 'PENDING'
      }
    ];
  });

  // 4. FEATURED TOURNAMENTS REQUESTS
  const [featuredRequests, setFeaturedRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_featured_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'feat_1',
        organizer: 'Red Bull Campus Clutch India',
        tournament: 'Red Bull Valorant Championship 2026',
        game: 'Valorant',
        placement: 'Top Hero Carousel Banner + Pinned Featured Arena',
        duration: '7 Days (Nov 20 - Nov 27)',
        budget: '₹2,50,000 Promotional Fee',
        contact: 'partnerships@redbull.in',
        status: 'PENDING'
      },
      {
        id: 'feat_2',
        organizer: 'KRAFTON Community Official',
        tournament: 'Battlegrounds All-Stars Grand Finale',
        game: 'Battlegrounds Mobile India',
        placement: 'Featured Tournaments Row 1 (Pinned #1)',
        duration: '14 Days (Dec 01 - Dec 14)',
        budget: 'Official Publisher Sponsored',
        contact: 'esports-in@krafton.com',
        status: 'PENDING'
      },
      {
        id: 'feat_3',
        organizer: 'Skyesports Masters India',
        tournament: 'Skyesports CS2 Winter Invitational',
        game: 'Counter-Strike 2',
        placement: 'Featured Carousel + Live Stream Watermark',
        duration: '10 Days (Dec 10 - Dec 20)',
        budget: '₹1,75,000 Promotion Package',
        contact: 'marketing@skyesports.in',
        status: 'PENDING'
      }
    ];
  });

  // 5. ADVERTISEMENT & SPONSORSHIP REQUESTS
  const [adRequests, setAdRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_ad_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ad_1',
        sponsor: 'Monster Energy India',
        type: 'Hero Banner Ad + Live Stream Branding',
        budget: '₹1,50,000 / month',
        representative: 'Rahul Malhotra (Director of Partnerships)',
        email: 'rahul.m@monsterenergy.in',
        phone: '+91 98990 12345',
        status: 'PENDING',
        requestedDate: 'Nov 18, 2026'
      },
      {
        id: 'ad_2',
        sponsor: 'Razer Gaming Gear',
        type: 'Official Peripherals Partner + Product Placements',
        budget: '₹85,000 / event',
        representative: 'Sneha Rao (Brand Lead India)',
        email: 'sneha.r@razer.com',
        phone: '+91 98770 54321',
        status: 'PENDING',
        requestedDate: 'Nov 17, 2026'
      },
      {
        id: 'ad_3',
        sponsor: 'iQOO India (Smartphone Series)',
        type: 'BGMI Championship Title Sponsor',
        budget: '₹3,00,000 / season',
        representative: 'Vikram Joshi (Head of Brand Marketing)',
        email: 'vikram.j@iqoo.in',
        phone: '+91 98660 99887',
        status: 'PENDING',
        requestedDate: 'Nov 16, 2026'
      },
      {
        id: 'ad_4',
        sponsor: 'boAt Lifestyle (Audio Partner)',
        type: 'Player Rewards & Stream Overlay Sponsor',
        budget: '₹1,20,000 / month',
        representative: 'Amit Trivedi',
        email: 'esports@boat-lifestyle.com',
        phone: '+91 98123 45678',
        status: 'PENDING',
        requestedDate: 'Nov 15, 2026'
      }
    ];
  });

  // 6. ALL TOURNAMENTS
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_admin_tournaments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 't1', title: 'BGMI Pro Invitational 2026', game: 'Battlegrounds Mobile India', prize: '₹5,00,000', teams: '64 / 64', status: 'LIVE', date: 'Nov 18 - Nov 25, 2026' },
      { id: 't2', title: 'Free Fire MAX Grand Finals', game: 'Free Fire MAX', prize: '₹3,50,000', teams: '48 / 48', status: 'LIVE', date: 'Nov 18 - Nov 20, 2026' },
      { id: 't3', title: 'Valorant India Championship', game: 'Valorant', prize: '₹4,00,000', teams: '32 / 32', status: 'LIVE', date: 'Nov 18 - Nov 22, 2026' },
      { id: 't4', title: 'Call of Duty: Mobile Masters', game: 'COD Mobile', prize: '₹2,50,000', teams: '28 / 32', status: 'REGISTRATION OPEN', date: 'Dec 15 - Dec 18, 2026' },
      { id: 't5', title: 'Apex Legends Global Series Cup', game: 'Apex Legends', prize: '₹3,00,000', teams: '20 / 20', status: 'UPCOMING', date: 'Dec 01 - Dec 05, 2026' },
    ];
  });

  // New Tournament Form State
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState('Battlegrounds Mobile India');
  const [newPrize, setNewPrize] = useState('');
  const [newSlots, setNewSlots] = useState('32');
  const [newDate, setNewDate] = useState('');

  // Persist state to localStorage
  useEffect(() => { localStorage.setItem('lt_admin_hosting_requests', JSON.stringify(hostingRequests)); }, [hostingRequests]);
  useEffect(() => { localStorage.setItem('lt_admin_scrims_requests', JSON.stringify(scrimsRequests)); }, [scrimsRequests]);
  useEffect(() => { localStorage.setItem('lt_admin_partner_hostings', JSON.stringify(partnerHostingRequests)); }, [partnerHostingRequests]);
  useEffect(() => { localStorage.setItem('lt_admin_featured_requests', JSON.stringify(featuredRequests)); }, [featuredRequests]);
  useEffect(() => { localStorage.setItem('lt_admin_ad_requests', JSON.stringify(adRequests)); }, [adRequests]);
  useEffect(() => { localStorage.setItem('lt_admin_tournaments', JSON.stringify(tournaments)); }, [tournaments]);

  // LIVE PENDING COUNTS
  const pendingHostingCount = useMemo(() => hostingRequests.filter(r => r.status === 'PENDING').length, [hostingRequests]);
  const pendingScrimsCount = useMemo(() => scrimsRequests.filter(r => r.status === 'PENDING').length, [scrimsRequests]);
  const pendingPartnerCount = useMemo(() => partnerHostingRequests.filter(r => r.status === 'PENDING').length, [partnerHostingRequests]);
  const pendingFeaturedCount = useMemo(() => featuredRequests.filter(r => r.status === 'PENDING').length, [featuredRequests]);
  const pendingAdCount = useMemo(() => adRequests.filter(r => r.status === 'PENDING').length, [adRequests]);

  // Actions for Requests
  const handleApproveHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    showToast('✅ Tournament Hosting Request Approved & Automated Room Generated!');
  };
  const handleRejectHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast('❌ Tournament Hosting Request Declined');
  };

  const handleApproveScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    showToast('✅ Scrim Request Approved & Match Slot Scheduled!');
  };
  const handleRejectScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
    showToast('❌ Scrim Request Declined');
  };

  const handleApprovePartner = (id) => {
    setPartnerHostingRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
    showToast('✅ Partner Hosting License Granted & Tournament Published!');
  };
  const handleRejectPartner = (id) => {
    setPartnerHostingRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    showToast('❌ Partner Hosting Proposal Declined');
  };

  const handleApproveFeatured = (id) => {
    setFeaturedRequests(prev => prev.map(f => f.id === id ? { ...f, status: 'APPROVED' } : f));
    showToast('⭐ Tournament Pinned to Official Featured Arena!');
  };
  const handleRejectFeatured = (id) => {
    setFeaturedRequests(prev => prev.map(f => f.id === id ? { ...f, status: 'REJECTED' } : f));
    showToast('❌ Featured Placement Request Declined');
  };

  const handleApproveAd = (id) => {
    setAdRequests(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    showToast('💼 Sponsorship Proposal Accepted & Media Invoice Issued!');
  };
  const handleRejectAd = (id) => {
    setAdRequests(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
    showToast('❌ Sponsorship Deal Declined');
  };

  const handleCreateTournament = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrize) return;

    const newTourney = {
      id: `t_${Date.now()}`,
      title: newTitle,
      game: newGame,
      prize: newPrize.startsWith('₹') ? newPrize : `₹${newPrize}`,
      teams: `0 / ${newSlots}`,
      status: 'REGISTRATION OPEN',
      date: newDate || 'Dec 2026',
    };

    setTournaments([newTourney, ...tournaments]);
    setNewTitle('');
    setNewPrize('');
    setNewDate('');
    setShowCreateModal(false);
    showToast('🏆 New Tournament Created Successfully!');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] font-sans antialiased flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-[#111217] text-white shadow-2xl border border-[#D4AF37]/40 animate-fade-in">
          <span className="material-symbols-outlined text-[#D4AF37] text-lg">verified</span>
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          TOP HEADER BAR (EXACT MATCH FOR media_1795010667791_992d00b3.jpg)
          ======================================================== */}
      <header className="bg-white border-b border-[#E5E7EB] px-6 lg:px-10 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex flex-col">
          <h1 className="text-base md:text-lg font-bold text-[#111827] tracking-tight flex items-center gap-1.5">
            <span>Welcome,</span>
            <span className="text-[#C59B27] font-extrabold">Super Administrator</span>
          </h1>
          <span className="text-[11px] text-neutral-400 font-medium tracking-wide">
            Wed, 18 Nov, 2026
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Black Pill Action Button (Matches [+ New Bill] in image) */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E1015] hover:bg-black text-white text-xs font-bold tracking-wide shadow-xs transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-bold">add</span>
            <span>New Tournament</span>
          </button>

          {/* User Profile Pill with Avatar Circle */}
          <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
            <div className="size-8 rounded-full bg-[#111217] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs border border-[#D4AF37]/30">
              S
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-neutral-900 leading-tight">Super Administrator</span>
              <span className="text-[10px] text-neutral-400 font-medium leading-none">Superadmin</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          SUB-NAVIGATION TABS (CLEAN, NEAT, PROFESSIONAL)
          ======================================================== */}
      <nav className="bg-white border-b border-[#E5E7EB] px-6 lg:px-10 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('present-day')}
          className={`px-3.5 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'present-day' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span className="material-symbols-outlined text-sm text-[#D4AF37]">calendar_today</span>
          <span>Present Day Live</span>
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5"></span>
        </button>

        <button
          onClick={() => setActiveTab('hosting-requests')}
          className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'hosting-requests' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span>Hosting Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
            {pendingHostingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scrims-requests')}
          className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'scrims-requests' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span>Scrims Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
            {pendingScrimsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('partner-hostings')}
          className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'partner-hostings' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span>Partner Hostings</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
            {pendingPartnerCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('featured-requests')}
          className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'featured-requests' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span>Featured Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
            {pendingFeaturedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ad-requests')}
          className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'ad-requests' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span>Ad & Sponsor Deals</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
            {pendingAdCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all-in-one')}
          className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'all-in-one' ? 'bg-[#0E1015] text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'}`}
        >
          <span>All in One</span>
        </button>

        <div className="ml-auto flex items-center gap-2 pl-4 border-l border-neutral-200">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">public</span>
            <span>Home Arena</span>
          </button>
          <button
            onClick={() => onLogout && onLogout()}
            className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ========================================================
          MAIN SCROLLABLE BODY
          ======================================================== */}
      <main className="flex-1 p-5 lg:p-8 space-y-6 max-w-[1520px] w-full mx-auto">
        {/* ========================================================
            VIEW: MAIN DASHBOARD (EXACT media_1795010667791_992d00b3.jpg REPLICA)
            ======================================================== */}
        {(activeTab === 'dashboard' || activeTab === 'all-in-one') && (
          <div className="space-y-5 animate-fade-in">
            {/* ROW 1: 4 TOP HERO STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Today's Revenue */}
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      TODAY'S REVENUE
                    </span>
                    <h2 className="text-2xl md:text-[28px] font-extrabold text-neutral-900 tracking-tight mt-1">
                      ₹ 6,004
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                      29 Bills Today
                    </p>
                  </div>
                  <div className="size-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700">
                    <span className="material-symbols-outlined text-lg">attach_money</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs">
                  <span className="text-rose-500 font-semibold">↘ -15.4%</span>
                  <span className="text-neutral-400">vs yesterday</span>
                </div>
              </div>

              {/* Card 2: Weekly Sales */}
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      WEEKLY SALES
                    </span>
                    <h2 className="text-2xl md:text-[28px] font-extrabold text-neutral-900 tracking-tight mt-1">
                      ₹ 32,468
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                      149 Bills this week
                    </p>
                  </div>
                  <div className="size-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700">
                    <span className="material-symbols-outlined text-lg">receipt_long</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs">
                  <span className="text-rose-500 font-semibold">↘ -40.6%</span>
                  <span className="text-neutral-400">vs last week</span>
                </div>
              </div>

              {/* Card 3: Monthly Sales */}
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      MONTHLY SALES
                    </span>
                    <h2 className="text-2xl md:text-[28px] font-extrabold text-neutral-900 tracking-tight mt-1">
                      ₹ 1,69,400
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                      724 Bills this month
                    </p>
                  </div>
                  <div className="size-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700">
                    <span className="material-symbols-outlined text-lg">trending_up</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs">
                  <span className="text-emerald-500 font-semibold">↗ +1025.1%</span>
                  <span className="text-neutral-400">vs last month</span>
                </div>
              </div>

              {/* Card 4: Styling Stations / Tournament Arenas */}
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      STYLING STATIONS
                    </span>
                    <h2 className="text-2xl md:text-[28px] font-extrabold text-neutral-900 tracking-tight mt-1">
                      0 / 9
                    </h2>
                    <p className="text-xs text-neutral-400 font-medium mt-0.5">
                      9 Stations Free
                    </p>
                  </div>
                  <div className="size-9 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-700">
                    <span className="material-symbols-outlined text-lg">chair</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 text-xs">
                  <span className="text-rose-500 font-semibold">↘ 0%</span>
                  <span className="text-neutral-400">Occupancy Rate</span>
                </div>
              </div>
            </div>

            {/* ROW 2: 4 COMPACT REVENUE & CLIENT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Cash Collections */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    CASH COLLECTIONS
                  </span>
                  <p className="text-lg font-extrabold text-neutral-900 tracking-tight mt-0.5">
                    ₹ 73,151
                  </p>
                </div>
                <span className="size-2.5 rounded-full bg-blue-500"></span>
              </div>

              {/* UPI / QR Payments */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    UPI / QR PAYMENTS
                  </span>
                  <p className="text-lg font-extrabold text-neutral-900 tracking-tight mt-0.5">
                    ₹ 85,484
                  </p>
                </div>
                <span className="size-2.5 rounded-full bg-purple-500"></span>
              </div>

              {/* Card Payments */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    CARD PAYMENTS
                  </span>
                  <p className="text-lg font-extrabold text-neutral-900 tracking-tight mt-0.5">
                    ₹ 0
                  </p>
                </div>
                <span className="size-2.5 rounded-full bg-amber-500"></span>
              </div>

              {/* Total Clients / Registered Gamers */}
              <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    TOTAL CLIENTS
                  </span>
                  <p className="text-lg font-extrabold text-emerald-600 tracking-tight mt-0.5">
                    702 Registered
                  </p>
                </div>
                <span className="size-2.5 rounded-full bg-emerald-500"></span>
              </div>
            </div>

            {/* ROW 3: CHARTS (7-DAY REVENUE TREND + DONUT PAYMENT SHARE) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Chart (2 Columns): 7-Day Revenue Trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-lg">show_chart</span>
                      7-Day Revenue Trend
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Daily gross turnover</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-[10px] font-bold">
                    Live
                  </span>
                </div>

                {/* SVG Smooth Golden Spline Area Chart */}
                <div className="relative w-full h-[260px] pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#E5A93C" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Y-axis subtle gridlines */}
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#F1F5F9" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#F1F5F9" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#F1F5F9" />
                    <line x1="0" y1="170" x2="600" y2="170" stroke="#F1F5F9" />
                    <line x1="0" y1="200" x2="600" y2="200" stroke="#E2E8F0" />

                    {/* Smooth Golden Spline (Matching the exact curve in media_1795010667791_992d00b3.jpg) */}
                    <path
                      d="M 0,135 Q 100,130 200,120 T 350,110 T 450,140 T 550,160 L 600,165 L 600,200 L 0,200 Z"
                      fill="url(#goldAreaGrad)"
                    />
                    <path
                      d="M 0,135 Q 100,130 200,120 T 350,110 T 450,140 T 550,160 L 600,165"
                      fill="none"
                      stroke="#C59B27"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* Y-axis Labels on Left */}
                  <div className="absolute top-4 left-0 text-[10px] text-neutral-400 font-medium space-y-9 pointer-events-none">
                    <div>12000</div>
                    <div>9000</div>
                    <div>6000</div>
                    <div>3000</div>
                    <div>0</div>
                  </div>

                  {/* X-axis Day Labels */}
                  <div className="flex justify-between text-[11px] text-neutral-400 font-medium mt-2 px-1">
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                  </div>
                </div>
              </div>

              {/* Right Chart (1 Column): Payment Share Donut */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">pie_chart</span>
                    Payment Share
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-medium hover:text-neutral-700 cursor-pointer">
                    By Mode
                  </span>
                </div>

                {/* Donut Chart SVG */}
                <div className="flex items-center justify-center py-4">
                  <svg className="size-40 overflow-visible" viewBox="0 0 100 100">
                    {/* Ring background */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="14" />
                    {/* Segment 1: Gold (Cash 45%) */}
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke="#D4AF37" strokeWidth="14"
                      strokeDasharray="107 238"
                      strokeDashoffset="60"
                    />
                    {/* Segment 2: Blue (UPI 48%) */}
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke="#3B82F6" strokeWidth="14"
                      strokeDasharray="114 238"
                      strokeDashoffset="-47"
                    />
                    {/* Segment 3: Green (Split/Other 7%) */}
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke="#10B981" strokeWidth="14"
                      strokeDasharray="17 238"
                      strokeDashoffset="-161"
                    />
                  </svg>
                </div>

                {/* Donut Legend (Exact items from media_1795010667791_992d00b3.jpg) */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] pt-3 border-t border-neutral-100 font-medium">
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <span className="size-2 rounded-full bg-[#D4AF37]"></span>
                    <span>Cash: <strong>₹73,151</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <span className="size-2 rounded-full bg-[#3B82F6]"></span>
                    <span>UPI: <strong>₹85,484</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    <span>Debit card: ₹0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span className="size-2 rounded-full bg-purple-500"></span>
                    <span>Credit card: ₹0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-700">
                    <span className="size-2 rounded-full bg-amber-500"></span>
                    <span>Split: <strong>₹18,765</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <span className="size-2 rounded-full bg-rose-500"></span>
                    <span>Other: ₹0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: BOTTOM 2 RANKED BREAKDOWN CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Bottom Left Card: Top Stylists & Attendants (Top Tournament Hosts) */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">star</span>
                    Top Stylists & Attendants
                  </h3>
                  <button className="text-xs font-bold text-[#C59B27] hover:underline cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Rank 1 */}
                  <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">mohan</h4>
                        <p className="text-[11px] text-neutral-400">Hair Cut, Beard Styling</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-neutral-900 tracking-tight">₹ 1,10,528</p>
                      <p className="text-[10px] text-neutral-400">485 services</p>
                    </div>
                  </div>

                  {/* Rank 2 */}
                  <div className="flex items-center justify-between py-2 border-b border-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">SAKTHI 1031</h4>
                        <p className="text-[11px] text-neutral-400">Hair Cut, Beard Styling</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-neutral-900 tracking-tight">₹ 51,881</p>
                      <p className="text-[10px] text-neutral-400">286 services</p>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">SANU</h4>
                        <p className="text-[11px] text-neutral-400">Hair Cut, Beard Styling</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-neutral-900 tracking-tight">₹ 10,203</p>
                      <p className="text-[10px] text-neutral-400">63 services</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Right Card: Most Popular Services (Most Popular Formats) */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">local_fire_department</span>
                    Most Popular Services
                  </h3>
                  <button className="text-xs font-bold text-[#C59B27] hover:underline cursor-pointer">
                    Menu &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 border-b border-neutral-50">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                      <span className="size-2 rounded-full bg-emerald-500"></span>
                      <span>Haircut,Trimming(or)shaving</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-[#C59B27] text-xs font-bold border border-amber-200">
                      451 Bookings
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5 border-b border-neutral-50">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                      <span className="size-2 rounded-full bg-emerald-500"></span>
                      <span>beard trimming (OR) shaving</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-[#C59B27] text-xs font-bold border border-amber-200">
                      94 Bookings
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-2 text-sm font-medium text-neutral-800">
                      <span className="size-2 rounded-full bg-emerald-500"></span>
                      <span>haircut only</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-[#C59B27] text-xs font-bold border border-amber-200">
                      79 Bookings
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: PRESENT DAY LIVE (FROM FIRST REFERENCE IMAGE)
            ======================================================== */}
        {(activeTab === 'present-day' || activeTab === 'all-in-one') && (
          <div className="space-y-6 pt-4 animate-fade-in">
            {/* Present Day Hero Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-neutral-800 text-2xl">event_available</span>
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-neutral-900">
                    Present Day Live Overview
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                <p className="text-xs md:text-sm text-neutral-500 font-normal">
                  Real-time performance for <strong className="text-neutral-700 font-semibold">Wednesday, 18 Nov 2026</strong> compared against yesterday.
                </p>
              </div>

              <button
                onClick={handleSyncLive}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-colors cursor-pointer self-start md:self-auto"
              >
                <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin text-[#D4AF37]' : ''}`}>
                  sync
                </span>
                <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            </div>

            {/* Live Counts Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">OVERALL USERS</span>
                <p className="text-2xl font-extrabold text-neutral-900 mt-1">52,480</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">↗ +13.6% vs yesterday</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">LIVE TOURNAMENTS</span>
                <p className="text-2xl font-extrabold text-neutral-900 mt-1">18 Live</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">↗ +20.0% vs yesterday</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">TODAY TOURNAMENTS</span>
                <p className="text-2xl font-extrabold text-neutral-900 mt-1">42 Matches</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">↗ +16.7% vs yesterday</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">TODAY HOSTINGS</span>
                <p className="text-2xl font-extrabold text-neutral-900 mt-1">29 Hostings</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">↗ +20.8% vs yesterday</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: REQUEST SECTIONS (USER HOSTING, SCRIMS, PARTNER, FEATURED, ADS)
            ======================================================== */}
        {(activeTab === 'hosting-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">hub</span>
                Tournament Hosting Requests by Users
              </h3>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                {pendingHostingCount} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hostingRequests.map(req => (
                <div key={req.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-neutral-900">{req.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 font-medium">{req.organizer} &bull; <strong className="text-[#C59B27]">{req.clan}</strong></p>
                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong>Game:</strong> {req.game} ({req.format})</p>
                      <p><strong>Slots:</strong> {req.slots}</p>
                      <p><strong>Prize Pool:</strong> <span className="text-emerald-600 font-bold">{req.prizePool}</span></p>
                    </div>
                  </div>
                  {req.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button onClick={() => handleApproveHosting(req.id)} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer">
                        Approve & Create
                      </button>
                      <button onClick={() => handleRejectHosting(req.id)} className="py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-neutral-400 py-1">Decision Broadcasted</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'scrims-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">timer</span>
                Scrims Requests (Daily / Weekly / Monthly)
              </h3>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                {pendingScrimsCount} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scrimsRequests.map(scrim => (
                <div key={scrim.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">{scrim.frequencyBadge}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${scrim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : scrim.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{scrim.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900">{scrim.clan}</h4>
                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong>Game:</strong> {scrim.game} &bull; {scrim.format}</p>
                      <p><strong>Schedule:</strong> {scrim.schedule}</p>
                    </div>
                  </div>
                  {scrim.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button onClick={() => handleApproveScrim(scrim.id)} className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer">
                        Approve Schedule
                      </button>
                      <button onClick={() => handleRejectScrim(scrim.id)} className="py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-neutral-400 py-1">Slot Scheduled</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'partner-hostings' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500">verified</span>
                Partner Hosting Tournaments Requests
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                {pendingPartnerCount} Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerHostingRequests.map(part => (
                <div key={part.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Verified Partner</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${part.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{part.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900">{part.title}</h4>
                    <p className="text-xs font-bold text-[#C59B27]">{part.organization}</p>
                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong>Prize Pool:</strong> <span className="text-emerald-600 font-bold">{part.prizePool}</span></p>
                      <p><strong>Dates:</strong> {part.dates}</p>
                    </div>
                  </div>
                  {part.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button onClick={() => handleApprovePartner(part.id)} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer">
                        Grant License
                      </button>
                      <button onClick={() => handleRejectPartner(part.id)} className="py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-neutral-400 py-1">Partner Approved</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'featured-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">star</span>
                Featured Tournaments Requests
              </h3>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                {pendingFeaturedCount} Requests
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredRequests.map(feat => (
                <div key={feat.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-neutral-900">{feat.tournament}</h4>
                    <p className="text-xs text-neutral-600 font-semibold">{feat.organizer}</p>
                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong>Game:</strong> {feat.game}</p>
                      <p><strong>Placement:</strong> {feat.placement}</p>
                      <p><strong>Budget:</strong> <span className="text-purple-600 font-bold">{feat.budget}</span></p>
                    </div>
                  </div>
                  {feat.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button onClick={() => handleApproveFeatured(feat.id)} className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer">
                        Pin to Featured
                      </button>
                      <button onClick={() => handleRejectFeatured(feat.id)} className="py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-neutral-400 py-1">Featured Active</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'ad-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-500">campaign</span>
                Advertisement & Sponsorship Requests
              </h3>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                {pendingAdCount} Active Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adRequests.map(ad => (
                <div key={ad.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-neutral-900">{ad.sponsor}</h4>
                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong>Campaign:</strong> {ad.type}</p>
                      <p><strong>Budget:</strong> <span className="text-emerald-600 font-bold">{ad.budget}</span></p>
                      <p><strong>Representative:</strong> {ad.representative}</p>
                    </div>
                  </div>
                  {ad.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button onClick={() => handleApproveAd(ad.id)} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer">
                        Accept Proposal
                      </button>
                      <button onClick={() => handleRejectAd(ad.id)} className="py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-xs font-bold text-neutral-400 py-1">Sponsorship Confirmed</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C59B27]">emoji_events</span>
                Create New Tournament
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-neutral-400 hover:text-neutral-600 p-1">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BGMI Pro Winter Cup"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#C59B27] outline-hidden text-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Game Title</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#C59B27] outline-hidden text-neutral-900 font-medium"
                >
                  <option value="Battlegrounds Mobile India">Battlegrounds Mobile India (BGMI)</option>
                  <option value="Free Fire MAX">Free Fire MAX</option>
                  <option value="Valorant">Valorant</option>
                  <option value="COD Mobile">Call of Duty: Mobile</option>
                  <option value="Apex Legends">Apex Legends</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    required
                    placeholder="₹50,000"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#C59B27] outline-hidden text-neutral-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Slots / Teams</label>
                  <input
                    type="text"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#C59B27] outline-hidden text-neutral-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Schedule Dates</label>
                <input
                  type="text"
                  placeholder="e.g. Dec 05 - Dec 10, 2026"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#C59B27] outline-hidden text-neutral-900 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#0E1015] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Publish Tournament
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
