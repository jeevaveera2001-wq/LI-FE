import React, { useState, useEffect, useMemo } from 'react';

export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  // Active navigation tab
  const [activeTab, setActiveTab] = useState('present-day');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
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
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('⚡ Live dashboard telemetry synced in real-time');
    }, 700);
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

  // 3. HOSTING TOURNAMENTS REQUESTS (PARTNERED / VERIFIED ORGS)
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

  // 7. REGISTERED USERS
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('lt_admin_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'u1', name: 'Super Administrator', email: 'superadmin@lt.in', mobile: '+91 98765 43210', role: 'superadmin', joined: 'Nov 18, 2026', status: 'ACTIVE' },
      { id: 'u2', name: 'Phoenix_Ace', email: 'champion@gmail.com', mobile: '+91 98111 22334', role: 'user', joined: 'Nov 18, 2026', status: 'ACTIVE' },
      { id: 'u3', name: 'Vortex_Sniper', email: 'vortex@esports.in', mobile: '+91 98222 33445', role: 'user', joined: 'Nov 17, 2026', status: 'ACTIVE' },
      { id: 'u4', name: 'Shadow_Ninja', email: 'shadow@gmail.com', mobile: '+91 98333 44556', role: 'user', joined: 'Nov 16, 2026', status: 'ACTIVE' },
      { id: 'u5', name: 'Titan_Ruler', email: 'titan@livetournaments.in', mobile: '+91 98444 55667', role: 'user', joined: 'Nov 15, 2026', status: 'ACTIVE' },
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
  useEffect(() => { localStorage.setItem('lt_admin_users', JSON.stringify(usersList)); }, [usersList]);

  // LIVE PENDING COUNTS
  const pendingHostingCount = useMemo(() => hostingRequests.filter(r => r.status === 'PENDING').length, [hostingRequests]);
  const pendingScrimsCount = useMemo(() => scrimsRequests.filter(r => r.status === 'PENDING').length, [scrimsRequests]);
  const pendingPartnerCount = useMemo(() => partnerHostingRequests.filter(r => r.status === 'PENDING').length, [partnerHostingRequests]);
  const pendingFeaturedCount = useMemo(() => featuredRequests.filter(r => r.status === 'PENDING').length, [featuredRequests]);
  const pendingAdCount = useMemo(() => adRequests.filter(r => r.status === 'PENDING').length, [adRequests]);

  // Actions for User Hosting Requests
  const handleApproveHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    showToast('✅ Tournament Hosting Request Approved & Automated Room Generated!');
  };
  const handleRejectHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast('❌ Tournament Hosting Request Declined');
  };

  // Actions for Scrims Requests
  const handleApproveScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    showToast('✅ Scrim Request Approved & Match Slot Scheduled!');
  };
  const handleRejectScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
    showToast('❌ Scrim Request Declined');
  };

  // Actions for Partner Hostings
  const handleApprovePartner = (id) => {
    setPartnerHostingRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'APPROVED' } : p));
    showToast('✅ Partner Hosting License Granted & Tournament Published!');
  };
  const handleRejectPartner = (id) => {
    setPartnerHostingRequests(prev => prev.map(p => p.id === id ? { ...p, status: 'REJECTED' } : p));
    showToast('❌ Partner Hosting Proposal Declined');
  };

  // Actions for Featured Requests
  const handleApproveFeatured = (id) => {
    setFeaturedRequests(prev => prev.map(f => f.id === id ? { ...f, status: 'APPROVED' } : f));
    showToast('⭐ Tournament Pinned to Official Featured Arena!');
  };
  const handleRejectFeatured = (id) => {
    setFeaturedRequests(prev => prev.map(f => f.id === id ? { ...f, status: 'REJECTED' } : f));
    showToast('❌ Featured Placement Request Declined');
  };

  // Actions for Ad Requests
  const handleApproveAd = (id) => {
    setAdRequests(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
    showToast('💼 Sponsorship Proposal Accepted & Media Invoice Issued!');
  };
  const handleRejectAd = (id) => {
    setAdRequests(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
    showToast('❌ Sponsorship Deal Declined');
  };

  // Create Tournament Handler
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

  // Filtered lists
  const filteredHostingRequests = hostingRequests.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScrimsRequests = scrimsRequests.filter(s =>
    s.clan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.game.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-[#111827] font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#111217] text-white shadow-2xl border border-[#D4AF37]/40 animate-fade-in">
          <span className="material-symbols-outlined text-[#D4AF37] text-xl">verified</span>
          <span className="text-xs font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ========================================================
          LEFT SIDEBAR: SLEEK DARK PALETTE (EXACT IMAGE REPLICA)
          ======================================================== */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-[260px] bg-[#0E1015] text-[#A1A1AA] flex flex-col border-r border-[#1F232B] transition-transform duration-300 ease-in-out shrink-0 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1F232B] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#997A15] flex items-center justify-center text-black font-extrabold text-sm shadow-md">
                LT
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-base tracking-tight leading-none">
                  LiveTournaments
                </span>
                <span className="text-[10px] text-[#A1A1AA] font-semibold tracking-wider uppercase mt-0.5">
                  Esports Arena
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#A1A1AA] hover:text-white p-1"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1F232B]/80">
            <span className="text-xs font-medium text-[#71717A]">Super Administrator</span>
            <span className="px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase border border-[#D4AF37]/30">
              SUPERADMIN
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-semibold">
          {/* Present Day Overview (Active Gold Outline Pill) */}
          <button
            onClick={() => { setActiveTab('present-day'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'present-day' ? 'bg-[#181B22] text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#D4AF37]">calendar_today</span>
              <span className="tracking-wide">Present Day Live</span>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>

          {/* Quick Nav to User Hosting Requests */}
          <button
            onClick={() => {
              setActiveTab('hosting-requests');
              setMobileSidebarOpen(false);
              const el = document.getElementById('hosting-requests-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'hosting-requests' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">hub</span>
              <span className="tracking-wide">Hosting Requests</span>
            </div>
            {pendingHostingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                {pendingHostingCount}
              </span>
            )}
          </button>

          {/* Scrims Requests */}
          <button
            onClick={() => {
              setActiveTab('scrims-requests');
              setMobileSidebarOpen(false);
              const el = document.getElementById('scrims-requests-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'scrims-requests' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">timer</span>
              <span className="tracking-wide">Scrims Requests</span>
            </div>
            {pendingScrimsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                {pendingScrimsCount}
              </span>
            )}
          </button>

          {/* Partner Hosting Requests */}
          <button
            onClick={() => {
              setActiveTab('partner-hostings');
              setMobileSidebarOpen(false);
              const el = document.getElementById('partner-hostings-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'partner-hostings' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">verified</span>
              <span className="tracking-wide">Partner Hostings</span>
            </div>
            {pendingPartnerCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                {pendingPartnerCount}
              </span>
            )}
          </button>

          {/* Featured Tournaments Requests */}
          <button
            onClick={() => {
              setActiveTab('featured-requests');
              setMobileSidebarOpen(false);
              const el = document.getElementById('featured-requests-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'featured-requests' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">star</span>
              <span className="tracking-wide">Featured Requests</span>
            </div>
            {pendingFeaturedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold border border-purple-500/30">
                {pendingFeaturedCount}
              </span>
            )}
          </button>

          {/* Advertisement & Sponsorship Requests */}
          <button
            onClick={() => {
              setActiveTab('ad-requests');
              setMobileSidebarOpen(false);
              const el = document.getElementById('ad-requests-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'ad-requests' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              <span className="tracking-wide">Ad & Sponsor Deals</span>
            </div>
            {pendingAdCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                {pendingAdCount}
              </span>
            )}
          </button>

          <div className="pt-3 pb-1 px-3.5 text-[10px] font-bold uppercase tracking-widest text-[#52525B]">
            Live Administration
          </div>

          {/* Live Tournaments */}
          <button
            onClick={() => { setActiveTab('tournaments'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'tournaments' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <span className="material-symbols-outlined text-[20px]">sports_esports</span>
            <span className="tracking-wide">All Tournaments</span>
          </button>

          {/* Gamers & Rosters */}
          <button
            onClick={() => { setActiveTab('users'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${activeTab === 'users' ? 'bg-[#181B22] text-white border border-white/20' : 'text-[#A1A1AA] hover:text-white hover:bg-[#161820]'}`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span className="tracking-wide">Gamers & Users</span>
          </button>

          {/* Platform Analytics */}
          <button
            onClick={() => { setActiveTab('present-day'); setMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#A1A1AA] hover:text-white hover:bg-[#161820] transition-all cursor-pointer`}
          >
            <span className="material-symbols-outlined text-[20px]">bar_chart</span>
            <span className="tracking-wide">Reports & Analytics</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#1F232B] flex flex-col gap-2">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">public</span>
            <span>Return to Home Arena</span>
          </button>
          <button
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA (MATCHING THE NAGULAN IMAGE)
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-5 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#111827]">
                Welcome, <span className="text-[#B89628]">Super Administrator</span>
              </h1>
              <p className="text-xs text-neutral-500 font-medium tracking-wide">
                Wednesday, 18 Nov, 2026 &bull; Live Telemetry Feed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111217] hover:bg-black text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span className="hidden sm:inline">Host Tournament</span>
            </button>

            {/* Admin Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
              <div className="size-8 rounded-full bg-[#111217] text-[#D4AF37] flex items-center justify-center font-bold text-xs shadow-xs border border-[#D4AF37]/30">
                S
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-neutral-900 leading-tight">Super Administrator</span>
                <span className="text-[10px] text-neutral-500 leading-none">superadmin@lt.in</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Scroll Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ========================================================
              PRESENT DAY LIVE OVERVIEW HERO BANNER
              ======================================================== */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <p className="text-xs md:text-sm text-neutral-500 font-normal leading-relaxed">
                Real-time performance for <strong className="text-neutral-700 font-semibold">Wednesday, 18 Nov 2026</strong> compared against yesterday.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-neutral-400 font-medium hidden sm:inline">
                Last updated: {lastSyncTime}
              </span>
              <button
                onClick={handleSyncLive}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold border border-neutral-200 transition-colors cursor-pointer"
              >
                <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin text-[#D4AF37]' : ''}`}>
                  sync
                </span>
                <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              LIVE METRIC CARDS ROW (EXACT REFERENCE IMAGE CARDS)
              ======================================================== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 md:gap-4">
            {/* 1. Overall Users */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  OVERALL USERS
                </span>
                <div className="size-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">group</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  52,480
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Yesterday: 46,200
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +13.6%
                </span>
                <span className="text-neutral-400">vs Yesterday</span>
              </div>
            </div>

            {/* 2. Live Tournaments */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  LIVE TOURNAMENTS
                </span>
                <div className="size-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">sports_esports</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  18 Live
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Yesterday: 15 Live
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +20.0%
                </span>
                <span className="text-neutral-400">vs Yesterday</span>
              </div>
            </div>

            {/* 3. Today Tournaments */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  TODAY TOURNAMENTS
                </span>
                <div className="size-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">emoji_events</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  42 Matches
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Yesterday: 36 Matches
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +16.7%
                </span>
                <span className="text-neutral-400">vs Yesterday</span>
              </div>
            </div>

            {/* 4. Today Hostings */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  TODAY HOSTINGS
                </span>
                <div className="size-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">hub</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  29 Hostings
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Yesterday: 24 Hostings
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +20.8%
                </span>
                <span className="text-neutral-400">vs Yesterday</span>
              </div>
            </div>

            {/* 5. Monthly Subscription Hostings */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  MONTHLY SUB HOSTINGS
                </span>
                <div className="size-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">loyalty</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  148 Pro Hosts
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Last Month: 132 Hosts
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +12.1%
                </span>
                <span className="text-neutral-400">vs Last Month</span>
              </div>
            </div>

            {/* 6. Daily Scrims */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  DAILY SCRIMS
                </span>
                <div className="size-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">timer</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  36 Scrims
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Yesterday: 31 Scrims
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +16.1%
                </span>
                <span className="text-neutral-400">vs Yesterday</span>
              </div>
            </div>

            {/* 7. Weekly Scrims */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  WEEKLY SCRIMS
                </span>
                <div className="size-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">date_range</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  14 Leagues
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Last Week: 12 Leagues
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +16.7%
                </span>
                <span className="text-neutral-400">vs Last Week</span>
              </div>
            </div>

            {/* 8. Monthly Scrims */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  MONTHLY SCRIMS
                </span>
                <div className="size-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">military_tech</span>
                </div>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  8 Mega Cups
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Last Month: 6 Mega Cups
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                <span className="inline-flex items-center text-emerald-600 font-semibold">
                  ↗ +33.3%
                </span>
                <span className="text-neutral-400">vs Last Month</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              LIVE CHARTS SECTION (2 COLUMNS - EXACT IMAGE REPLICA)
              ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Chart 1: Hourly Sales / Tournament Pacing (Today vs Yesterday) */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">schedule</span>
                    Hourly Tournament Pacing (Today vs Yesterday)
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Hour-by-hour live tournament and match execution pacing
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-neutral-700">
                    <span className="size-2.5 rounded-full bg-[#D4AF37]"></span>
                    Today
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <span className="size-2.5 rounded-full bg-[#3B82F6]"></span>
                    Yesterday
                  </span>
                </div>
              </div>

              {/* SVG Smooth Spline Chart */}
              <div className="relative w-full h-[220px] pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="todayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.02" />
                    </linearGradient>
                    <linearGradient id="yesterdayGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="#F1F5F9" strokeDasharray="3 3" />
                  <line x1="0" y1="180" x2="500" y2="180" stroke="#E2E8F0" />

                  {/* Yesterday Curve & Area (Blue Dashed) */}
                  <path
                    d="M 0,160 Q 40,120 80,140 T 160,110 T 240,135 T 320,80 T 400,165 T 500,175 L 500,180 L 0,180 Z"
                    fill="url(#yesterdayGrad)"
                  />
                  <path
                    d="M 0,160 Q 40,120 80,140 T 160,110 T 240,135 T 320,80 T 400,165 T 500,175"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />

                  {/* Today Curve & Area (Gold Smooth Spline - Matches Image Peak at 12 PM) */}
                  <path
                    d="M 0,110 Q 30,175 70,160 T 140,145 T 190,30 T 240,150 T 320,175 T 420,180 T 500,180 L 500,180 L 0,180 Z"
                    fill="url(#todayGrad)"
                  />
                  <path
                    d="M 0,110 Q 30,175 70,160 T 140,145 T 190,30 T 240,150 T 320,175 T 420,180 T 500,180"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                  />

                  {/* Peak Marker at 12 PM */}
                  <circle cx="190" cy="30" r="4.5" fill="#D4AF37" stroke="#FFFFFF" strokeWidth="2" />
                </svg>

                {/* X-Axis Hour Labels */}
                <div className="flex justify-between text-[10px] text-neutral-400 mt-2 font-medium">
                  <span>8 AM</span>
                  <span>9 AM</span>
                  <span>10 AM</span>
                  <span>11 AM</span>
                  <span className="font-bold text-neutral-800">12 PM</span>
                  <span>1 PM</span>
                  <span>2 PM</span>
                  <span>3 PM</span>
                  <span>4 PM</span>
                  <span>6 PM</span>
                  <span>8 PM</span>
                  <span>10 PM</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Game Channels & Categories Distribution (Today vs Yesterday) */}
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500 text-lg">bar_chart</span>
                    Game Channels & Categories (Today vs Yesterday)
                  </h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Match volume by title and competitive format
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-neutral-700">
                    <span className="size-2.5 rounded-sm bg-[#D4AF37]"></span>
                    Today
                  </span>
                  <span className="flex items-center gap-1.5 text-neutral-400">
                    <span className="size-2.5 rounded-sm bg-[#3B82F6]"></span>
                    Yesterday
                  </span>
                </div>
              </div>

              {/* Paired Bar Chart */}
              <div className="relative w-full h-[220px] pt-4 flex flex-col justify-end">
                {/* Horizontal Baseline Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="border-b border-neutral-100 w-full"></div>
                  <div className="border-b border-neutral-100 w-full"></div>
                  <div className="border-b border-neutral-100 w-full"></div>
                  <div className="border-b border-neutral-200 w-full"></div>
                </div>

                {/* Bars Row */}
                <div className="grid grid-cols-5 gap-3 h-[180px] items-end z-10 px-2">
                  {/* Category 1: BGMI */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      <div className="w-5 bg-[#D4AF37] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '75%' }} title="Today: 48 Matches" />
                      <div className="w-5 bg-[#3B82F6] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '55%' }} title="Yesterday: 36 Matches" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 truncate max-w-full">BGMI</span>
                  </div>

                  {/* Category 2: Free Fire */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      <div className="w-5 bg-[#D4AF37] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '85%' }} title="Today: 54 Matches" />
                      <div className="w-5 bg-[#3B82F6] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '80%' }} title="Yesterday: 50 Matches" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 truncate max-w-full">Free Fire</span>
                  </div>

                  {/* Category 3: Valorant */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      <div className="w-5 bg-[#D4AF37] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '50%' }} title="Today: 28 Matches" />
                      <div className="w-5 bg-[#3B82F6] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '42%' }} title="Yesterday: 22 Matches" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 truncate max-w-full">Valorant</span>
                  </div>

                  {/* Category 4: Scrims */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      <div className="w-5 bg-[#D4AF37] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '95%' }} title="Today: 62 Scrims" />
                      <div className="w-5 bg-[#3B82F6] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '60%' }} title="Yesterday: 40 Scrims" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 truncate max-w-full">Daily Scrims</span>
                  </div>

                  {/* Category 5: COD / Other */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="flex items-end gap-1.5 h-full w-full justify-center">
                      <div className="w-5 bg-[#D4AF37] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '35%' }} title="Today: 18 Matches" />
                      <div className="w-5 bg-[#3B82F6] rounded-t-md transition-all group-hover:brightness-110" style={{ height: '45%' }} title="Yesterday: 24 Matches" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 truncate max-w-full">COD & Other</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              DIRECT PLATFORM VARIANCE TABLE (EXACT IMAGE REPLICA)
              ======================================================== */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-100">
              <span className="material-symbols-outlined text-amber-500 text-lg">auto_awesome</span>
              <h3 className="text-sm md:text-base font-bold text-neutral-900 tracking-tight">
                Direct Platform Activity Analysis (Today vs Yesterday)
              </h3>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-bold tracking-wider uppercase text-[10px]">
                    <th className="py-3 px-3">Metric Dimension</th>
                    <th className="py-3 px-3">Present Day (Today)</th>
                    <th className="py-3 px-3">Previous Day (Yesterday)</th>
                    <th className="py-3 px-3">Net Variance (Count)</th>
                    <th className="py-3 px-3 text-right">Trend Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="material-symbols-outlined text-indigo-500 text-base">group</span>
                      Total Registered Gamers
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">52,480</td>
                    <td className="py-3.5 px-3 text-neutral-500">46,200</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">+6,280 Users</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                        High (+13.6%)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="material-symbols-outlined text-emerald-500 text-base">sports_esports</span>
                      Live Tournaments In-Progress
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">18 Matches</td>
                    <td className="py-3.5 px-3 text-neutral-500">15 Matches</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">+3 Live</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                        High (+20.0%)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="material-symbols-outlined text-amber-500 text-base">emoji_events</span>
                      Today's Scheduled Tournaments
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">42 Matches</td>
                    <td className="py-3.5 px-3 text-neutral-500">36 Matches</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">+6 Matches</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                        High (+16.7%)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="material-symbols-outlined text-cyan-500 text-base">hub</span>
                      Today Community Hostings
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">29 Hostings</td>
                    <td className="py-3.5 px-3 text-neutral-500">24 Hostings</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">+5 Hostings</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                        High (+20.8%)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="material-symbols-outlined text-purple-500 text-base">loyalty</span>
                      Monthly Subscription Hostings
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">148 Pro Hosts</td>
                    <td className="py-3.5 px-3 text-neutral-500">132 Pro Hosts</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">+16 Hosts</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                        High (+12.1%)
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3.5 px-3 flex items-center gap-2 font-bold text-neutral-900">
                      <span className="material-symbols-outlined text-blue-500 text-base">timer</span>
                      Daily Practice Scrims
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">36 Scrims</td>
                    <td className="py-3.5 px-3 text-neutral-500">31 Scrims</td>
                    <td className="py-3.5 px-3 text-emerald-600 font-bold">+5 Scrims</td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
                        High (+16.1%)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ========================================================
              SECTION 1: TOURNAMENT HOSTING REQUESTS BY USERS
              ======================================================== */}
          <section id="hosting-requests-section" className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">hub</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Tournament Hosting Requests by Users
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Community and clan organizers requesting to conduct custom tournaments
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 self-start sm:self-auto">
                {pendingHostingCount} Pending Requests
              </span>
            </div>

            {/* Request Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHostingRequests.map(req => (
                <div key={req.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                        {req.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 flex items-center gap-1.5 font-medium">
                      <span className="material-symbols-outlined text-neutral-400 text-sm">person</span>
                      {req.organizer} &bull; <span className="text-[#B89628] font-bold">{req.clan}</span>
                    </p>

                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong className="text-neutral-700">Game:</strong> {req.game} ({req.format})</p>
                      <p><strong className="text-neutral-700">Slots:</strong> {req.slots}</p>
                      <p><strong className="text-neutral-700">Schedule:</strong> {req.timing}</p>
                      <p><strong className="text-neutral-700">Prize Pool:</strong> <span className="text-emerald-600 font-bold">{req.prizePool}</span> ({req.entryFee})</p>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      Contact: {req.email} &bull; {req.mobile}
                    </p>
                  </div>

                  {req.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button
                        onClick={() => handleApproveHosting(req.id)}
                        className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Approve & Create
                      </button>
                      <button
                        onClick={() => handleRejectHosting(req.id)}
                        className="py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs font-bold text-neutral-400">
                      Decision Recorded & Broadcasted
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 2: SCRIMS REQUESTS (DAILY, WEEKLY, MONTHLY)
              ======================================================== */}
          <section id="scrims-requests-section" className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">timer</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Scrims Requests (Daily / Weekly / Monthly)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Tier-1 and Clan practice scrims scheduling requests
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 self-start sm:self-auto">
                {pendingScrimsCount} Pending Scrims
              </span>
            </div>

            {/* Scrim Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredScrimsRequests.map(scrim => (
                <div key={scrim.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase">
                          {scrim.frequencyBadge}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {scrim.tier}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 ${scrim.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : scrim.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {scrim.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                      {scrim.clan}
                    </h4>

                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong className="text-neutral-700">Game:</strong> {scrim.game} &bull; {scrim.format}</p>
                      <p><strong className="text-neutral-700">Capacity:</strong> {scrim.slots}</p>
                      <p><strong className="text-neutral-700">Cadence:</strong> {scrim.schedule}</p>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      Contact: {scrim.contact}
                    </p>
                  </div>

                  {scrim.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button
                        onClick={() => handleApproveScrim(scrim.id)}
                        className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">event_available</span>
                        Approve Schedule
                      </button>
                      <button
                        onClick={() => handleRejectScrim(scrim.id)}
                        className="py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs font-bold text-neutral-400">
                      Scrim Slot Confirmed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 3: HOSTING TOURNAMENTS REQUESTS (PARTNERED)
              ======================================================== */}
          <section id="partner-hostings-section" className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">verified</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Partner Hosting Tournaments Requests
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Verified esports corporations, agencies, and publishers hosting championships
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 self-start sm:self-auto">
                {pendingPartnerCount} Verified Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partnerHostingRequests.map(part => (
                <div key={part.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                        Verified Partner
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 ${part.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : part.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {part.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                      {part.title}
                    </h4>

                    <p className="text-xs font-semibold text-[#B89628]">
                      {part.organization}
                    </p>

                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong className="text-neutral-700">Game:</strong> {part.game}</p>
                      <p><strong className="text-neutral-700">Tier:</strong> {part.tier}</p>
                      <p><strong className="text-neutral-700">Prize Pool:</strong> <span className="text-emerald-600 font-bold">{part.prizePool}</span></p>
                      <p><strong className="text-neutral-700">Dates:</strong> {part.dates}</p>
                    </div>

                    <p className="text-[10px] text-neutral-400 font-medium">
                      {part.verification}
                    </p>
                  </div>

                  {part.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button
                        onClick={() => handleApprovePartner(part.id)}
                        className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">verified_user</span>
                        Grant Host License
                      </button>
                      <button
                        onClick={() => handleRejectPartner(part.id)}
                        className="py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs font-bold text-neutral-400">
                      Partner License Granted
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 4: FEATURED TOURNAMENTS REQUESTS
              ======================================================== */}
          <section id="featured-requests-section" className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">star</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Featured Tournaments Requests
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Organizers requesting to pin and feature championships on hero banners and home page
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 self-start sm:self-auto">
                {pendingFeaturedCount} Featured Requests
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredRequests.map(feat => (
                <div key={feat.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                        Spotlight Feature
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 ${feat.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : feat.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {feat.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                      {feat.tournament}
                    </h4>

                    <p className="text-xs font-semibold text-neutral-700">
                      {feat.organizer}
                    </p>

                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong className="text-neutral-700">Game:</strong> {feat.game}</p>
                      <p><strong className="text-neutral-700">Placement:</strong> {feat.placement}</p>
                      <p><strong className="text-neutral-700">Duration:</strong> {feat.duration}</p>
                      <p><strong className="text-neutral-700">Budget:</strong> <span className="text-purple-600 font-bold">{feat.budget}</span></p>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      Contact: {feat.contact}
                    </p>
                  </div>

                  {feat.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button
                        onClick={() => handleApproveFeatured(feat.id)}
                        className="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">star</span>
                        Pin to Featured
                      </button>
                      <button
                        onClick={() => handleRejectFeatured(feat.id)}
                        className="py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs font-bold text-neutral-400">
                      Featured Status Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              SECTION 5: ADVERTISEMENT & SPONSORSHIP REQUESTS
              ======================================================== */}
          <section id="ad-requests-section" className="bg-white rounded-2xl p-5 md:p-6 border border-[#E5E7EB] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">campaign</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                    Advertisement & Sponsorship Requests
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Brands and advertising partners requesting sponsorships, banner ads, and stream overlays
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 self-start sm:self-auto">
                {pendingAdCount} Active Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adRequests.map(ad => (
                <div key={ad.id} className="rounded-xl border border-neutral-200 p-4 bg-neutral-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                        Brand Sponsor
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase shrink-0 ${ad.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : ad.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {ad.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                      {ad.sponsor}
                    </h4>

                    <div className="text-[11px] text-neutral-500 space-y-1 bg-white p-2.5 rounded-lg border border-neutral-100">
                      <p><strong className="text-neutral-700">Campaign Type:</strong> {ad.type}</p>
                      <p><strong className="text-neutral-700">Proposed Budget:</strong> <span className="text-emerald-600 font-bold">{ad.budget}</span></p>
                      <p><strong className="text-neutral-700">Representative:</strong> {ad.representative}</p>
                    </div>

                    <p className="text-[11px] text-neutral-400">
                      Contact: {ad.email} &bull; {ad.phone}
                    </p>
                  </div>

                  {ad.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
                      <button
                        onClick={() => handleApproveAd(ad.id)}
                        className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-sm">handshake</span>
                        Accept Proposal
                      </button>
                      <button
                        onClick={() => handleRejectAd(ad.id)}
                        className="py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs font-bold text-neutral-400">
                      Sponsorship Agreement Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* ========================================================
          CREATE TOURNAMENT MODAL
          ======================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#D4AF37]">emoji_events</span>
                Create New Tournament
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1"
              >
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
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-hidden text-neutral-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Game Title</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#D4AF37] outline-hidden text-neutral-900 font-medium"
                >
                  <option value="Battlegrounds Mobile India">Battlegrounds Mobile India (BGMI)</option>
                  <option value="Free Fire MAX">Free Fire MAX</option>
                  <option value="Valorant">Valorant</option>
                  <option value="COD Mobile">Call of Duty: Mobile</option>
                  <option value="Apex Legends">Apex Legends</option>
                  <option value="Counter-Strike 2">Counter-Strike 2</option>
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
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#D4AF37] outline-hidden text-neutral-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Slots / Teams</label>
                  <input
                    type="text"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#D4AF37] outline-hidden text-neutral-900 font-medium"
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
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:border-[#D4AF37] outline-hidden text-neutral-900 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#111217] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
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
