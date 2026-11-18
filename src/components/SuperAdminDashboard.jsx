import React, { useState, useEffect, useMemo } from 'react';

/**
 * NAGULAN Unisex Salon & LiveTournaments.in Command Center
 * Built strictly against the NAGULAN Design System Specification:
 * - Colors: #F3F4F6 (Bg), #1F2937 (Text Primary), #4B5563 (Text Secondary), #6B7280 (Muted), #9CA3AF (Metadata), #D1D1D1 (Border)
 * - Accents: #D4AF37, #C5A059, #DFBD78 (Golds), #3B82F6 (Blue), #9333EA (Purple), #10B981, #059669 (Emeralds), #EF4444 (Red), #F59E0B (Amber)
 * - Typography: Inter, JetBrains Mono (Scale: 9px, 11px, 14px, 16px, 24px/28px)
 * - Shapes: radius-md (6px), radius-lg (8px), radius-xl (12px), radius-full (16px), radius-pill (9999px)
 * - Elevation: shadow-sm, shadow-md
 */
export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  // Navigation active tab: defaults to exact Nagulan Salon Dashboard ('dashboard')
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Trigger brief toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Telemetry Handler
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

  // Modal State
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState('Battlegrounds Mobile India');
  const [newPrize, setNewPrize] = useState('');
  const [newSlots, setNewSlots] = useState('32');
  const [newDate, setNewDate] = useState('');

  // Persist State
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

  // Decision Handlers
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
    <div className="nagulan-dashboard min-h-screen bg-[#F3F4F6] text-[#1F2937] flex font-['Inter',sans-serif] antialiased selection:bg-[#DFBD78]/30">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-[8px] bg-[#1F2937] text-white shadow-md border border-[#C5A059]/40 text-[11px] font-semibold tracking-wide animate-fade-in">
          <span className="material-symbols-outlined text-[#DFBD78] text-base">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* ========================================================
          LEFT DARK SIDEBAR (EXACT media_1795009600879_721f2f3a.jpg REPLICA)
          ======================================================== */}
      <aside
        style={{ minHeight: '100vh', width: '240px', backgroundColor: '#0E0E10' }}
        className={`w-60 bg-[#0E0E10] text-[#9CA3AF] flex-col border-r border-[#1F2937] shrink-0 z-50 transition-all duration-200 ${
          sidebarOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl' : 'hidden lg:flex'
        }`}
      >
        {/* Brand & Crest Header */}
        <div className="px-4 py-4 border-b border-[#1F2937]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-[#18181B] border border-[#DFBD78]/40 flex items-center justify-center text-[#DFBD78] font-bold text-xs shadow-inner">
              LT
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold tracking-tight text-white uppercase leading-tight">LiveTournaments</span>
              <span className="text-[8px] text-[#9CA3AF] tracking-wider uppercase font-medium leading-none mt-0.5">OFFICIAL ESPORTS HUB</span>
            </div>
          </div>
          <div className="size-7 rounded-[6px] bg-[#1E1911] border border-[#DFBD78]/50 flex items-center justify-center text-[#DFBD78] font-bold text-[10px]">
            HQ
          </div>
        </div>

        {/* Super Administrator Badge Row */}
        <div className="px-4 py-3 border-b border-[#1F2937]/60 flex items-center justify-between bg-[#131316]">
          <span className="text-[11px] font-semibold text-white/90">Super Administrator</span>
          <span className="px-2 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[9px] font-bold tracking-wider uppercase border border-[#DFBD78]/40">
            SUPERADMIN
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-[11px] font-medium scrollbar-thin">
          {/* Present Day (Exact gold outline/fill from screenshot) */}
          <button
            onClick={() => { setActiveTab('present-day'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'present-day' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span className="flex-1">Present Day</span>
            <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          </button>

          {/* Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span className="flex-1">Dashboard</span>
          </button>

          {/* Hosting Requests */}
          <button
            onClick={() => { setActiveTab('hosting-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'hosting-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span className="flex-1">Hosting Requests</span>
            {pendingHostingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                {pendingHostingCount}
              </span>
            )}
          </button>

          {/* Scrims Requests */}
          <button
            onClick={() => { setActiveTab('scrims-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'scrims-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">sports_esports</span>
            <span className="flex-1">Scrims Requests</span>
            {pendingScrimsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-bold border border-blue-500/30">
                {pendingScrimsCount}
              </span>
            )}
          </button>

          {/* Partner Hostings */}
          <button
            onClick={() => { setActiveTab('partner-hostings'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'partner-hostings' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
            <span className="flex-1">Partner Hostings</span>
            {pendingPartnerCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                {pendingPartnerCount}
              </span>
            )}
          </button>

          {/* Featured Requests */}
          <button
            onClick={() => { setActiveTab('featured-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'featured-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span className="flex-1">Featured Requests</span>
            {pendingFeaturedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                {pendingFeaturedCount}
              </span>
            )}
          </button>

          {/* Ad & Sponsor Deals */}
          <button
            onClick={() => { setActiveTab('ad-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'ad-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span className="flex-1">Ad & Sponsor Deals</span>
            {pendingAdCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-bold border border-rose-500/30">
                {pendingAdCount}
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="pt-2 pb-1">
            <div className="h-px bg-[#1F2937]/80 my-1"></div>
            <span className="px-3 text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">Live Platform Modules</span>
          </div>

          {/* All Tournaments */}
          <button
            onClick={() => { setActiveTab('all-in-one'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'all-in-one' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">emoji_events</span>
            <span className="flex-1">All Tournaments</span>
          </button>

          {/* Daily & Weekly Scrims */}
          <button
            onClick={() => { setActiveTab('scrims-requests'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">sports_esports</span>
            <span className="flex-1">Daily & Weekly Scrims</span>
          </button>

          {/* Active Match Rooms */}
          <button
            onClick={() => { showToast('Active automated rooms online'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">meeting_room</span>
            <span className="flex-1">Active Match Rooms</span>
          </button>

          {/* Player Database */}
          <button
            onClick={() => { showToast('52,480 registered players indexed'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span className="flex-1">Player Database</span>
          </button>

          {/* Broadcast & Stream POS */}
          <button
            onClick={() => { showToast('Production streaming console active'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">live_tv</span>
            <span className="flex-1">Broadcast & Stream POS</span>
          </button>

          {/* Reports & Analytics */}
          <button
            onClick={() => { setActiveTab('present-day'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">bar_chart</span>
            <span className="flex-1">Reports & Analytics</span>
          </button>

          {/* Platform Settings */}
          <button
            onClick={() => { showToast('Esports Hub system settings loaded'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="flex-1">Platform Settings</span>
          </button>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-3 border-t border-[#1F2937]/80 flex flex-col gap-1.5">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            style={{ backgroundColor: '#18181B', color: '#ffffff' }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-[#222226] text-white text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#DFBD78]">public</span>
            <span>Home Arena</span>
          </button>
          <button
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] hover:bg-rose-950/40 text-rose-400 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          RIGHT MAIN CONTENT CONTAINER
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR (EXACT media_1795010667791_992d00b3.jpg) */}
        <header className="bg-white border-b border-[#D1D1D1]/60 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-[6px] text-[#4B5563] hover:bg-[#F3F4F6] cursor-pointer"
              title="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-[16px] md:text-[18px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5 leading-[24px]">
                <span>Welcome,</span>
                <span className="text-[#C5A059] font-bold">Super Administrator</span>
              </h1>
              <span className="text-[11px] text-[#9CA3AF] font-medium tracking-wide leading-[15px]">
                Wed, 18 Nov, 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Black Action Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              style={{ backgroundColor: '#1F2937', color: '#ffffff' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] !bg-[#1F2937] hover:!bg-black !text-white text-[11px] font-bold tracking-wide shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] !text-white">add</span>
              <span className="!text-white">Host Tournament</span>
            </button>

            {/* User Profile Pill with Avatar Circle */}
            <div className="flex items-center gap-2 pl-3 border-l border-[#D1D1D1]/60">
              <div className="size-7 rounded-full bg-[#1F2937] text-[#DFBD78] flex items-center justify-center font-bold text-[11px] shadow-sm">
                S
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#1F2937] leading-tight">Super Administrator</span>
                <span className="text-[9px] text-[#9CA3AF] font-medium leading-none">Superadmin</span>
              </div>
            </div>
          </div>
        </header>

        {/* SUB-NAVIGATION TABS (Mobile / Small Screen Only) */}
        <nav className="lg:hidden bg-white border-b border-[#D1D1D1]/60 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">dashboard</span>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('present-day')}
          className={`px-3 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'present-day' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px] text-[#DFBD78]">calendar_today</span>
          <span>Present Day Live</span>
          <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse ml-0.5"></span>
        </button>

        <button
          onClick={() => setActiveTab('hosting-requests')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'hosting-requests' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span>Hosting Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-[#D97706] text-[9px] font-bold">
            {pendingHostingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('scrims-requests')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'scrims-requests' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span>Scrims Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[#3B82F6] text-[9px] font-bold">
            {pendingScrimsCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('partner-hostings')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'partner-hostings' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span>Partner Hostings</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#059669] text-[9px] font-bold">
            {pendingPartnerCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('featured-requests')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'featured-requests' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span>Featured Requests</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-[#9333EA] text-[9px] font-bold">
            {pendingFeaturedCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ad-requests')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'ad-requests' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span>Ad & Sponsor Deals</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-[#EF4444] text-[9px] font-bold">
            {pendingAdCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all-in-one')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'all-in-one' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span>All in One</span>
        </button>

        <div className="ml-auto flex items-center gap-2 pl-3 border-l border-[#D1D1D1]/60">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="px-2.5 py-1 rounded-[6px] bg-[#F3F4F6] hover:bg-neutral-200 text-[#4B5563] text-[11px] font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[13px]">public</span>
            <span>Home Arena</span>
          </button>
          <button
            onClick={() => onLogout && onLogout()}
            className="px-2.5 py-1 rounded-[6px] text-[#EF4444] hover:bg-rose-50 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* ========================================================
          MAIN SCROLLABLE BODY
          ======================================================== */}
      <main className="flex-1 p-5 lg:p-7 space-y-5 max-w-[1520px] w-full mx-auto">
        {/* ========================================================
            VIEW: MAIN DASHBOARD (EXACT media_1795010667791_992d00b3.jpg REPLICA)
            ======================================================== */}
        {(activeTab === 'dashboard' || activeTab === 'all-in-one') && (
          <div className="space-y-4 animate-fade-in">
            {/* ROW 1: 4 TOP HERO STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Overall Users */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      OVERALL USERS
                    </span>
                    <h2 className="text-[26px] font-bold text-[#1F2937] tracking-tight mt-1 leading-[32px] nagulan-mono">
                      52,480
                    </h2>
                    <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5 leading-[15px]">
                      1,420 Active Today
                    </p>
                  </div>
                  <div className="size-8 rounded-[8px] bg-[#F3F4F6] border border-[#D1D1D1]/50 flex items-center justify-center text-[#4B5563]">
                    <span className="material-symbols-outlined text-[18px]">groups</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#F3F4F6] flex items-center gap-1.5 text-[11px]">
                  <span className="text-[#10B981] font-semibold">↗ +13.6%</span>
                  <span className="text-[#9CA3AF]">vs yesterday</span>
                </div>
              </div>

              {/* Card 2: Live Tournaments */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      LIVE TOURNAMENTS
                    </span>
                    <h2 className="text-[26px] font-bold text-[#1F2937] tracking-tight mt-1 leading-[32px] nagulan-mono">
                      18 Live
                    </h2>
                    <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5 leading-[15px]">
                      42 Matches Today
                    </p>
                  </div>
                  <div className="size-8 rounded-[8px] bg-[#F3F4F6] border border-[#D1D1D1]/50 flex items-center justify-center text-[#4B5563]">
                    <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#F3F4F6] flex items-center gap-1.5 text-[11px]">
                  <span className="text-[#10B981] font-semibold">↗ +20.0%</span>
                  <span className="text-[#9CA3AF]">vs yesterday</span>
                </div>
              </div>

              {/* Card 3: Today Hostings */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      TODAY HOSTINGS
                    </span>
                    <h2 className="text-[26px] font-bold text-[#1F2937] tracking-tight mt-1 leading-[32px] nagulan-mono">
                      29 Hostings
                    </h2>
                    <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5 leading-[15px]">
                      148 Monthly Pro Hosts
                    </p>
                  </div>
                  <div className="size-8 rounded-[8px] bg-[#F3F4F6] border border-[#D1D1D1]/50 flex items-center justify-center text-[#4B5563]">
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#F3F4F6] flex items-center gap-1.5 text-[11px]">
                  <span className="text-[#10B981] font-semibold">↗ +20.8%</span>
                  <span className="text-[#9CA3AF]">vs last week</span>
                </div>
              </div>

              {/* Card 4: Monthly Subscription Hostings */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
                      MONTHLY SUB HOSTINGS
                    </span>
                    <h2 className="text-[26px] font-bold text-[#1F2937] tracking-tight mt-1 leading-[32px] nagulan-mono">
                      148 / 200
                    </h2>
                    <p className="text-[11px] text-[#9CA3AF] font-medium mt-0.5 leading-[15px]">
                      52 Slots Free
                    </p>
                  </div>
                  <div className="size-8 rounded-[8px] bg-[#F3F4F6] border border-[#D1D1D1]/50 flex items-center justify-center text-[#4B5563]">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#F3F4F6] flex items-center gap-1.5 text-[11px]">
                  <span className="text-[#10B981] font-semibold">↗ +12.1%</span>
                  <span className="text-[#9CA3AF]">Growth Rate</span>
                </div>
              </div>
            </div>

            {/* ROW 2: 4 COMPACT REVENUE & SCRIMS CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Daily Scrims */}
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">
                    DAILY SCRIMS
                  </span>
                  <p className="text-[16px] font-bold text-[#1F2937] tracking-tight mt-0.5 nagulan-mono">
                    36 Active Scrims
                  </p>
                </div>
                <span className="size-2 rounded-full bg-[#3B82F6]"></span>
              </div>

              {/* Weekly Scrims */}
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">
                    WEEKLY SCRIMS
                  </span>
                  <p className="text-[16px] font-bold text-[#1F2937] tracking-tight mt-0.5 nagulan-mono">
                    14 Pro Leagues
                  </p>
                </div>
                <span className="size-2 rounded-full bg-[#9333EA]"></span>
              </div>

              {/* Monthly Scrims */}
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">
                    MONTHLY SCRIMS
                  </span>
                  <p className="text-[16px] font-bold text-[#1F2937] tracking-tight mt-0.5 nagulan-mono">
                    8 Mega Cups
                  </p>
                </div>
                <span className="size-2 rounded-full bg-[#F59E0B]"></span>
              </div>

              {/* Total Registered Clans */}
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">
                    TOTAL REGISTERED CLANS
                  </span>
                  <p className="text-[16px] font-bold text-[#059669] tracking-tight mt-0.5 nagulan-mono">
                    702 Verified Teams
                  </p>
                </div>
                <span className="size-2 rounded-full bg-[#10B981]"></span>
              </div>
            </div>

            {/* ROW 3: CHARTS (7-DAY ESPORTS ACTIVITY TREND + DONUT GAME SHARE) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Chart (2 Columns): 7-Day Activity Trend */}
              <div className="lg:col-span-2 bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#DFBD78] text-[16px]">show_chart</span>
                      7-Day Tournament & Match Trend
                    </h3>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">Daily competitor registrations & match turnover</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280] text-[9px] font-semibold border border-[#D1D1D1]/40">
                    Live
                  </span>
                </div>

                {/* SVG Smooth Spline Chart */}
                <div className="relative w-full h-[240px] pt-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="nagulanGoldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DFBD78" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#DFBD78" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>

                    {/* Subtle gridlines */}
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#F3F4F6" />
                    <line x1="0" y1="65" x2="600" y2="65" stroke="#F3F4F6" />
                    <line x1="0" y1="110" x2="600" y2="110" stroke="#F3F4F6" />
                    <line x1="0" y1="155" x2="600" y2="155" stroke="#F3F4F6" />
                    <line x1="0" y1="180" x2="600" y2="180" stroke="#E5E7EB" />

                    {/* Exact curve from reference image */}
                    <path
                      d="M 0,130 Q 120,125 240,115 T 380,105 T 480,135 T 560,150 L 600,155 L 600,180 L 0,180 Z"
                      fill="url(#nagulanGoldGrad)"
                    />
                    <path
                      d="M 0,130 Q 120,125 240,115 T 380,105 T 480,135 T 560,150 L 600,155"
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="2.5"
                    />
                  </svg>

                  {/* Y-axis Labels on Left */}
                  <div className="absolute top-3 left-0 text-[9px] text-[#9CA3AF] font-medium space-y-8 pointer-events-none nagulan-mono">
                    <div>12000</div>
                    <div>9000</div>
                    <div>6000</div>
                    <div>3000</div>
                    <div>0</div>
                  </div>

                  {/* X-axis Day Labels */}
                  <div className="flex justify-between text-[11px] text-[#6B7280] font-medium mt-2 px-1">
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

              {/* Right Chart (1 Column): Game Share Donut */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#DFBD78] text-[16px]">pie_chart</span>
                    Tournament Share
                  </h3>
                  <span className="text-[11px] text-[#9CA3AF] font-medium hover:text-[#1F2937] cursor-pointer">
                    By Game Title
                  </span>
                </div>

                {/* Donut Chart SVG */}
                <div className="flex items-center justify-center py-3">
                  <svg className="size-36 overflow-visible" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F3F4F6" strokeWidth="13" />
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke="#DFBD78" strokeWidth="13"
                      strokeDasharray="107 238"
                      strokeDashoffset="60"
                    />
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke="#3B82F6" strokeWidth="13"
                      strokeDasharray="114 238"
                      strokeDashoffset="-47"
                    />
                    <circle
                      cx="50" cy="50" r="38" fill="none"
                      stroke="#10B981" strokeWidth="13"
                      strokeDasharray="17 238"
                      strokeDashoffset="-161"
                    />
                  </svg>
                </div>

                {/* Donut Legend */}
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 text-[11px] pt-3 border-t border-[#F3F4F6] font-medium">
                  <div className="flex items-center gap-1.5 text-[#1F2937]">
                    <span className="size-2 rounded-full bg-[#DFBD78]"></span>
                    <span>BGMI: <strong className="nagulan-mono">48%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1F2937]">
                    <span className="size-2 rounded-full bg-[#3B82F6]"></span>
                    <span>Free Fire: <strong className="nagulan-mono">28%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1F2937]">
                    <span className="size-2 rounded-full bg-[#10B981]"></span>
                    <span>Valorant: <strong className="nagulan-mono">14%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1F2937]">
                    <span className="size-2 rounded-full bg-[#9333EA]"></span>
                    <span>CODM: <strong className="nagulan-mono">6%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#1F2937]">
                    <span className="size-2 rounded-full bg-[#F59E0B]"></span>
                    <span>Apex: <strong className="nagulan-mono">4%</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                    <span className="size-2 rounded-full bg-[#EC4899]"></span>
                    <span>Others: 0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: BOTTOM 2 RANKED BREAKDOWN CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Bottom Left Card: Top Tournament Organizers & Hosts */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#DFBD78] text-[16px]">military_tech</span>
                    Top Organizers & Hosts
                  </h3>
                  <button onClick={() => setActiveTab('hosting-requests')} className="text-[11px] font-bold text-[#C5A059] hover:underline cursor-pointer">
                    View All &rarr;
                  </button>
                </div>

                <div className="space-y-2.5">
                  {/* Rank 1 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#1F2937] leading-snug">Clan Hydra Esports</h4>
                        <p className="text-[9px] text-[#9CA3AF]">BGMI Battle Royale Pro</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#1F2937] tracking-tight nagulan-mono">₹ 1,10,500</p>
                      <p className="text-[9px] text-[#9CA3AF]">486 matches</p>
                    </div>
                  </div>

                  {/* Rank 2 */}
                  <div className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#1F2937] leading-snug">Team Venom Gaming</h4>
                        <p className="text-[9px] text-[#9CA3AF]">Free Fire MAX Clash Squad</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#1F2937] tracking-tight nagulan-mono">₹ 51,800</p>
                      <p className="text-[9px] text-[#9CA3AF]">286 matches</p>
                    </div>
                  </div>

                  {/* Rank 3 */}
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className="size-6 rounded-full bg-[#1F2937] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#1F2937] leading-snug">Deadly 5 Esports</h4>
                        <p className="text-[9px] text-[#9CA3AF]">Valorant Mumbai Spike League</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-bold text-[#1F2937] tracking-tight nagulan-mono">₹ 10,200</p>
                      <p className="text-[9px] text-[#9CA3AF]">63 matches</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Right Card: Most Popular Esports Formats */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#DFBD78] text-[16px]">local_fire_department</span>
                    Most Popular Esports Formats
                  </h3>
                  <button onClick={() => setActiveTab('all-in-one')} className="text-[11px] font-bold text-[#C5A059] hover:underline cursor-pointer">
                    All Modes &rarr;
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#1F2937]">
                      <span className="size-1.5 rounded-full bg-[#10B981]"></span>
                      <span>BGMI Battle Royale (Squad Erangel / Miramar)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280] text-[10px] font-semibold border border-[#D1D1D1]/40">
                      451 Tournaments
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-[#F3F4F6]">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#1F2937]">
                      <span className="size-1.5 rounded-full bg-[#10B981]"></span>
                      <span>Free Fire MAX (Clash Squad 4v4 Knockout)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280] text-[10px] font-semibold border border-[#D1D1D1]/40">
                      94 Tournaments
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#1F2937]">
                      <span className="size-1.5 rounded-full bg-[#10B981]"></span>
                      <span>Valorant (5v5 Spike Plant Competitive Custom)</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#6B7280] text-[10px] font-semibold border border-[#D1D1D1]/40">
                      79 Tournaments
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: PRESENT DAY LIVE OVERVIEW (ESPORTS & REVENUE PACING)
            ======================================================== */}
        {(activeTab === 'present-day' || activeTab === 'all-in-one') && (
          <div className="space-y-4 pt-3 animate-fade-in">
            {/* Present Day Hero Card */}
            <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1F2937] text-[20px]">event_available</span>
                  <h2 className="text-[16px] font-bold tracking-tight text-[#1F2937]">
                    Present Day Live Overview
                  </h2>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#059669] text-[9px] font-bold border border-emerald-200">
                    <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#6B7280]">
                  Real-time performance for <strong className="text-[#1F2937] font-semibold">Wednesday, 18 Nov 2026</strong> compared against yesterday.
                </p>
              </div>

              <button
                onClick={handleSyncLive}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[#F3F4F6] hover:bg-neutral-200 text-[#4B5563] text-[11px] font-semibold border border-[#D1D1D1]/60 transition-colors cursor-pointer self-start md:self-auto"
              >
                <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin text-[#DFBD78]' : ''}`}>
                  sync
                </span>
                <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            </div>

            {/* ROW 1: 5 Nagulan Salon Direct Metrics (media_1795009600879_721f2f3a.jpg) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">PRESENT DAY TOTAL</span>
                  <p className="text-[20px] font-bold text-[#1F2937] mt-0.5 nagulan-mono">₹ 6,004</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-0.5">Yesterday: ₹ 7,099</p>
                </div>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#EF4444] font-semibold">↘ -15.4%</span>
                  <span className="text-[#9CA3AF]">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">PRESENT DAY BILLS</span>
                  <p className="text-[20px] font-bold text-[#1F2937] mt-0.5 nagulan-mono">29 Bills</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-0.5">Yesterday: 26 Bills</p>
                </div>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#10B981] font-semibold">↗ +11.5%</span>
                  <span className="text-[#9CA3AF]">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">PRESENT DAY CASH</span>
                  <p className="text-[20px] font-bold text-[#1F2937] mt-0.5 nagulan-mono">₹ 1,523</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-0.5">Yesterday: ₹ 2,610</p>
                </div>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#EF4444] font-semibold">↘ -41.6%</span>
                  <span className="text-[#9CA3AF]">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">PRESENT DAY UPI</span>
                  <p className="text-[20px] font-bold text-[#1F2937] mt-0.5 nagulan-mono">₹ 4,481</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-0.5">Yesterday: ₹ 4,489</p>
                </div>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#EF4444] font-semibold">↘ -0.2%</span>
                  <span className="text-[#9CA3AF]">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">PRESENT DAY CARD</span>
                  <p className="text-[20px] font-bold text-[#1F2937] mt-0.5 nagulan-mono">₹ 0</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-0.5">Yesterday: ₹ 0</p>
                </div>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#6B7280] font-semibold">↗ 0.0%</span>
                  <span className="text-[#9CA3AF]">vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* ROW 2: 2 SIDE-BY-SIDE CHARTS (Hourly Sales Pacing + Payment Channels) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Hourly Sales Pacing (Today vs Yesterday) */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#DFBD78]"></span>
                      Hourly Sales Pacing (Today vs Yesterday)
                    </h3>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">Hour-by-hour revenue pacing</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1 text-[#1F2937]">
                      <span className="size-2 rounded-full bg-[#DFBD78]"></span> Today
                    </span>
                    <span className="flex items-center gap-1 text-[#4B5563]">
                      <span className="size-2 rounded-full bg-[#3B82F6]"></span> Yesterday
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-[220px] pt-3">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="pacingGoldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#DFBD78" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#DFBD78" stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="pacingBlueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>

                    <line x1="0" y1="20" x2="600" y2="20" stroke="#F3F4F6" strokeDasharray="3 3" />
                    <line x1="0" y1="65" x2="600" y2="65" stroke="#F3F4F6" strokeDasharray="3 3" />
                    <line x1="0" y1="110" x2="600" y2="110" stroke="#F3F4F6" strokeDasharray="3 3" />
                    <line x1="0" y1="155" x2="600" y2="155" stroke="#E5E7EB" />

                    {/* Today Gold Spline (Peaking at 12 PM) */}
                    <path
                      d="M 0,140 Q 60,150 120,110 T 200,60 T 260,150 T 360,155 L 600,155 L 600,155 L 0,155 Z"
                      fill="url(#pacingGoldGrad)"
                    />
                    <path
                      d="M 0,140 Q 60,150 120,110 T 200,60 T 260,150 T 360,155 L 600,155"
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="2.5"
                    />

                    {/* Yesterday Blue Spline (Peaking at 2 PM) */}
                    <path
                      d="M 0,150 Q 80,145 150,115 T 240,150 T 320,100 T 400,155 L 600,155 L 600,155 L 0,155 Z"
                      fill="url(#pacingBlueGrad)"
                    />
                    <path
                      d="M 0,150 Q 80,145 150,115 T 240,150 T 320,100 T 400,155 L 600,155"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                  </svg>

                  <div className="absolute top-1 left-0 text-[8px] text-[#9CA3AF] font-medium space-y-7 pointer-events-none nagulan-mono">
                    <div>1.2k</div>
                    <div>800</div>
                    <div>400</div>
                    <div>0</div>
                  </div>

                  <div className="flex justify-between text-[9px] text-[#9CA3AF] font-medium mt-2 px-1">
                    <span>8 AM</span>
                    <span>10 AM</span>
                    <span>12 PM</span>
                    <span>2 PM</span>
                    <span>4 PM</span>
                    <span>6 PM</span>
                    <span>8 PM</span>
                    <span>10 PM</span>
                  </div>
                </div>
              </div>

              {/* Payment Channels (Today vs Yesterday) */}
              <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                  <div>
                    <h3 className="text-[13px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-[#3B82F6]"></span>
                      Payment Channels (Today vs Yesterday)
                    </h3>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">Cash, UPI and Card comparison</p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-semibold">
                    <span className="flex items-center gap-1 text-[#1F2937]">
                      <span className="size-2 rounded-sm bg-[#C5A059]"></span> Today
                    </span>
                    <span className="flex items-center gap-1 text-[#4B5563]">
                      <span className="size-2 rounded-sm bg-[#3B82F6]"></span> Yesterday
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-[220px] pt-3">
                  <div className="h-[180px] w-full flex items-end justify-around border-b border-[#E5E7EB] pb-1 px-4">
                    {/* Cash */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px] h-[35%]" title="Today: ₹1,523"></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px] h-[60%]" title="Yesterday: ₹2,610"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">Cash</span>
                    </div>

                    {/* UPI / QR */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px] h-[98%]" title="Today: ₹4,481"></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px] h-[100%]" title="Yesterday: ₹4,489"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">UPI / QR</span>
                    </div>

                    {/* Card (Debit/Credit) */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px] h-[3%]" title="Today: ₹0"></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px] h-[3%]" title="Yesterday: ₹0"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">Card (Debit/Credit)</span>
                    </div>

                    {/* Other / Split */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px] h-[2%]" title="Today: ₹0"></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px] h-[5%]" title="Yesterday: ₹0"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">Other / Split</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Direct Daily Variance Analysis (Today vs Yesterday) */}
            <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
                <h3 className="text-[13px] font-bold text-[#1F2937] tracking-tight flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#DFBD78] text-[16px]">stars</span>
                  Direct Daily Variance Analysis (Today vs Yesterday)
                </h3>
                <span className="text-[10px] text-[#9CA3AF] font-medium">Real-Time Ledger Audit</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-[#F3F4F6] text-[9px] uppercase tracking-wider text-[#9CA3AF]">
                      <th className="py-2.5 font-bold">METRIC DIMENSION</th>
                      <th className="py-2.5 font-bold">PRESENT DAY (TODAY)</th>
                      <th className="py-2.5 font-bold">PREVIOUS DAY (YESTERDAY)</th>
                      <th className="py-2.5 font-bold">NET VARIANCE (₹ / COUNT)</th>
                      <th className="py-2.5 font-bold text-right">TREND STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] font-medium text-[#1F2937]">
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#DFBD78] text-[15px]">trending_down</span>
                        Total Sales Revenue
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ 6,004</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 7,099</td>
                      <td className="py-2.5 text-[#EF4444] nagulan-mono font-semibold">₹ -1,095</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-rose-50 text-[#EF4444] text-[9px] font-bold border border-rose-200">
                          Low (-15.4%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10B981] text-[15px]">receipt</span>
                        Total Sales Invoices
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">29 Bills</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">26 Bills</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+3 Bills</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          High (+11.5%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3B82F6] text-[15px]">payments</span>
                        Cash Collections
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ 1,523</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 2,610</td>
                      <td className="py-2.5 text-[#EF4444] nagulan-mono font-semibold">₹ -1,087</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-rose-50 text-[#EF4444] text-[9px] font-bold border border-rose-200">
                          Low (-41.6%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#9333EA] text-[15px]">qr_code_2</span>
                        UPI / QR Collections
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ 4,481</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 4,489</td>
                      <td className="py-2.5 text-[#EF4444] nagulan-mono font-semibold">₹ -8</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-rose-50 text-[#EF4444] text-[9px] font-bold border border-rose-200">
                          Low (-0.2%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F59E0B] text-[15px]">credit_card</span>
                        Card Payments
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ 0</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 0</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono font-semibold">₹ 0</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-gray-50 text-[#6B7280] text-[9px] font-bold border border-gray-200">
                          Flat (0.0%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10B981] text-[15px]">sports_esports</span>
                        Tournament Hostings
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">29 Hostings</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">24 Hostings</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+5 Hostings</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          High (+20.8%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3B82F6] text-[15px]">group</span>
                        Active Competitors
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">52,480</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">46,200</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+6,280</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          High (+13.6%)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROW 4: 8 Live Tournament & Scrims Metrics */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] px-1">
                Live Platform & Esports Telemetry
              </span>
            </div>

            {/* 8 Live Metric Cards with Nagulan Design Tokens */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">OVERALL USERS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">52,480</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +13.6% vs yesterday</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">LIVE TOURNAMENTS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">18 Live</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +20.0% vs yesterday</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">TODAY TOURNAMENTS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">42 Matches</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +16.7% vs yesterday</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">TODAY HOSTINGS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">29 Hostings</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +20.8% vs yesterday</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">MONTHLY SUB HOSTINGS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">148 Pro Hosts</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +12.1% vs last month</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">DAILY SCRIMS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">36 Scrims</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +16.1% vs yesterday</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">WEEKLY SCRIMS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">14 Leagues</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +16.7% vs last week</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">MONTHLY SCRIMS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">8 Mega Cups</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">↗ +33.3% vs last month</p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: REQUEST SECTIONS (USER HOSTING, SCRIMS, PARTNER, FEATURED, ADS)
            ======================================================== */}
        {(activeTab === 'hosting-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DFBD78] text-[18px]">hub</span>
                Tournament Hosting Requests by Users
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#D97706] text-[10px] font-bold border border-amber-200">
                {pendingHostingCount} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {hostingRequests.map(req => (
                <div key={req.id} className="rounded-[12px] border border-[#D1D1D1]/60 p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-[13px] font-bold text-[#1F2937]">{req.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${req.status === 'APPROVED' ? 'bg-emerald-50 text-[#059669]' : req.status === 'REJECTED' ? 'bg-rose-50 text-[#EF4444]' : 'bg-amber-50 text-[#D97706]'}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#4B5563]">{req.organizer} &bull; <strong className="text-[#C5A059]">{req.clan}</strong></p>
                    <div className="text-[10px] text-[#6B7280] space-y-0.5 bg-[#F3F4F6] p-2 rounded-[6px]">
                      <p><strong>Game:</strong> {req.game} ({req.format})</p>
                      <p><strong>Slots:</strong> {req.slots}</p>
                      <p><strong>Prize Pool:</strong> <span className="text-[#059669] font-bold">{req.prizePool}</span></p>
                    </div>
                  </div>
                  {req.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                      <button onClick={() => handleApproveHosting(req.id)} className="flex-1 py-1.5 rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold transition-colors cursor-pointer">
                        Approve & Create
                      </button>
                      <button onClick={() => handleRejectHosting(req.id)} className="py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] text-[#EF4444] text-[11px] font-bold hover:bg-rose-50 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-[10px] font-bold text-[#9CA3AF] py-1">Decision Broadcasted</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'scrims-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3B82F6] text-[18px]">timer</span>
                Scrims Requests (Daily / Weekly / Monthly)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#3B82F6] text-[10px] font-bold border border-blue-200">
                {pendingScrimsCount} Pending
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {scrimsRequests.map(scrim => (
                <div key={scrim.id} className="rounded-[12px] border border-[#D1D1D1]/60 p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#3B82F6] text-[9px] font-bold uppercase">{scrim.frequencyBadge}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${scrim.status === 'APPROVED' ? 'bg-emerald-50 text-[#059669]' : 'bg-amber-50 text-[#D97706]'}`}>{scrim.status}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-[#1F2937]">{scrim.clan}</h4>
                    <div className="text-[10px] text-[#6B7280] space-y-0.5 bg-[#F3F4F6] p-2 rounded-[6px]">
                      <p><strong>Game:</strong> {scrim.game} &bull; {scrim.format}</p>
                      <p><strong>Schedule:</strong> {scrim.schedule}</p>
                    </div>
                  </div>
                  {scrim.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                      <button onClick={() => handleApproveScrim(scrim.id)} className="flex-1 py-1.5 rounded-[6px] bg-[#3B82F6] hover:bg-blue-700 text-white text-[11px] font-bold transition-colors cursor-pointer">
                        Approve Schedule
                      </button>
                      <button onClick={() => handleRejectScrim(scrim.id)} className="py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] text-[#EF4444] text-[11px] font-bold hover:bg-rose-50 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-[10px] font-bold text-[#9CA3AF] py-1">Slot Scheduled</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'partner-hostings' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#059669] text-[18px]">verified</span>
                Partner Hosting Tournaments Requests
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#059669] text-[10px] font-bold border border-emerald-200">
                {pendingPartnerCount} Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {partnerHostingRequests.map(part => (
                <div key={part.id} className="rounded-[12px] border border-[#D1D1D1]/60 p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#059669] text-[9px] font-bold uppercase">Verified Partner</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${part.status === 'APPROVED' ? 'bg-emerald-50 text-[#059669]' : 'bg-amber-50 text-[#D97706]'}`}>{part.status}</span>
                    </div>
                    <h4 className="text-[13px] font-bold text-[#1F2937]">{part.title}</h4>
                    <p className="text-[11px] font-bold text-[#C5A059]">{part.organization}</p>
                    <div className="text-[10px] text-[#6B7280] space-y-0.5 bg-[#F3F4F6] p-2 rounded-[6px]">
                      <p><strong>Prize Pool:</strong> <span className="text-[#059669] font-bold">{part.prizePool}</span></p>
                      <p><strong>Dates:</strong> {part.dates}</p>
                    </div>
                  </div>
                  {part.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                      <button onClick={() => handleApprovePartner(part.id)} className="flex-1 py-1.5 rounded-[6px] bg-[#059669] hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer">
                        Grant License
                      </button>
                      <button onClick={() => handleRejectPartner(part.id)} className="py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] text-[#EF4444] text-[11px] font-bold hover:bg-rose-50 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-[10px] font-bold text-[#9CA3AF] py-1">Partner Approved</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'featured-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9333EA] text-[18px]">star</span>
                Featured Tournaments Requests
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#9333EA] text-[10px] font-bold border border-purple-200">
                {pendingFeaturedCount} Requests
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {featuredRequests.map(feat => (
                <div key={feat.id} className="rounded-[12px] border border-[#D1D1D1]/60 p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h4 className="text-[13px] font-bold text-[#1F2937]">{feat.tournament}</h4>
                    <p className="text-[11px] text-[#4B5563] font-semibold">{feat.organizer}</p>
                    <div className="text-[10px] text-[#6B7280] space-y-0.5 bg-[#F3F4F6] p-2 rounded-[6px]">
                      <p><strong>Game:</strong> {feat.game}</p>
                      <p><strong>Placement:</strong> {feat.placement}</p>
                      <p><strong>Budget:</strong> <span className="text-[#9333EA] font-bold">{feat.budget}</span></p>
                    </div>
                  </div>
                  {feat.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                      <button onClick={() => handleApproveFeatured(feat.id)} className="flex-1 py-1.5 rounded-[6px] bg-[#9333EA] hover:bg-purple-700 text-white text-[11px] font-bold transition-colors cursor-pointer">
                        Pin to Featured
                      </button>
                      <button onClick={() => handleRejectFeatured(feat.id)} className="py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] text-[#EF4444] text-[11px] font-bold hover:bg-rose-50 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-[10px] font-bold text-[#9CA3AF] py-1">Featured Active</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'ad-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#F3F4F6]">
              <h3 className="text-[14px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#EF4444] text-[18px]">campaign</span>
                Advertisement & Sponsorship Requests
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-[#EF4444] text-[10px] font-bold border border-rose-200">
                {pendingAdCount} Active Proposals
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {adRequests.map(ad => (
                <div key={ad.id} className="rounded-[12px] border border-[#D1D1D1]/60 p-4 bg-white hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <h4 className="text-[13px] font-bold text-[#1F2937]">{ad.sponsor}</h4>
                    <div className="text-[10px] text-[#6B7280] space-y-0.5 bg-[#F3F4F6] p-2 rounded-[6px]">
                      <p><strong>Campaign:</strong> {ad.type}</p>
                      <p><strong>Proposed Budget:</strong> <span className="text-[#059669] font-bold">{ad.budget}</span></p>
                      <p><strong>Representative:</strong> {ad.representative}</p>
                    </div>
                  </div>
                  {ad.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                      <button onClick={() => handleApproveAd(ad.id)} className="flex-1 py-1.5 rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold transition-colors cursor-pointer">
                        Accept Proposal
                      </button>
                      <button onClick={() => handleRejectAd(ad.id)} className="py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] text-[#EF4444] text-[11px] font-bold hover:bg-rose-50 transition-colors cursor-pointer">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-[10px] font-bold text-[#9CA3AF] py-1">Sponsorship Confirmed</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] border border-[#D1D1D1] shadow-xl max-w-md w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
              <h3 className="text-[16px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059]">add_circle</span>
                New Tournament / Bill
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#9CA3AF] hover:text-[#1F2937] p-1">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTournament} className="space-y-3 text-[11px]">
              <div>
                <label className="block font-bold text-[#1F2937] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BGMI Pro Winter Cup"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] focus:border-[#C5A059] outline-hidden text-[#1F2937] font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1F2937] mb-1">Game / Service</label>
                <select
                  value={newGame}
                  onChange={(e) => setNewGame(e.target.value)}
                  className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] focus:border-[#C5A059] outline-hidden text-[#1F2937] font-medium"
                >
                  <option value="Battlegrounds Mobile India">Battlegrounds Mobile India (BGMI)</option>
                  <option value="Free Fire MAX">Free Fire MAX</option>
                  <option value="Valorant">Valorant</option>
                  <option value="COD Mobile">Call of Duty: Mobile</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1F2937] mb-1">Prize / Amount</label>
                  <input
                    type="text"
                    required
                    placeholder="₹50,000"
                    value={newPrize}
                    onChange={(e) => setNewPrize(e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] focus:border-[#C5A059] outline-hidden text-[#1F2937] font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1F2937] mb-1">Slots / Quantity</label>
                  <input
                    type="text"
                    value={newSlots}
                    onChange={(e) => setNewSlots(e.target.value)}
                    className="w-full px-3 py-2 rounded-[6px] border border-[#D1D1D1] focus:border-[#C5A059] outline-hidden text-[#1F2937] font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[#F3F4F6]">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-[6px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Save & Publish
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-3 rounded-[6px] border border-[#D1D1D1] text-[#4B5563] hover:bg-[#F3F4F6] text-[11px] font-bold transition-colors cursor-pointer"
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
