import React, { useState, useEffect, useMemo } from 'react';
import DashboardPage from './DashboardPage';

/**
 * LiveTournaments.in Command Center
 * Built strictly against the NAGULAN Design System Specification:
 * - Colors: #F3F4F6 (Bg), #1F2937 (Text Primary), #4B5563 (Text Secondary), #6B7280 (Muted), #9CA3AF (Metadata), #D1D1D1 (Border)
 * - Accents: #D4AF37, #C5A059, #DFBD78 (Golds), #3B82F6 (Blue), #9333EA (Purple), #10B981, #059669 (Emeralds), #EF4444 (Red), #F59E0B (Amber)
 * - Typography: Inter, JetBrains Mono (Scale: 9px, 11px, 14px, 16px, 24px/28px)
 * - Shapes: radius-md (6px), radius-lg (8px), radius-xl (12px), radius-full (16px), radius-pill (9999px)
 * - Elevation: shadow-sm, shadow-md
 */
export default function SuperAdminDashboard({ currentUser, onNavigate, onLogout }) {
  // Navigation active tab: defaults to exact LiveTournaments Dashboard ('dashboard')
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Blocked Users State
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem('lt_admin_blocked_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'blk_1', name: 'Scammer Clan X', email: 'fake.host@gmail.com', reason: 'Fake prize pool listing / Invalid thumbnail', date: 'Nov 17, 2026' }
    ];
  });
  useEffect(() => { localStorage.setItem('lt_admin_blocked_users', JSON.stringify(blockedUsers)); }, [blockedUsers]);

  // Inspect Thumbnail Modal State
  const [selectedInspectImage, setSelectedInspectImage] = useState(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);


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
    return [];
  });

  // 2. SCRIMS REQUESTS (DAILY, WEEKLY, MONTHLY)
    const [scrimsRequests, setScrimsRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_scrims_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 3. HOSTING TOURNAMENTS REQUESTS (PARTNERED)
    const [partnerHostingRequests, setPartnerHostingRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_partner_hostings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 4. FEATURED TOURNAMENTS REQUESTS
    const [featuredRequests, setFeaturedRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_featured_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // 5. ADVERTISEMENT & SPONSORSHIP REQUESTS
    const [adRequests, setAdRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_ad_requests');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
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

  // Decision Handlers with Suspend & Block Options
  const handleApproveHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    showToast('✅ Tournament Hosting Request Approved & Automated Room Generated!');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
  };
  const handleRejectHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    showToast('❌ Tournament Hosting Request Declined');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
  };
  const handleSuspendHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'SUSPENDED' } : r));
    showToast('⚠️ Tournament Hosting Suspended & Terminated');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
  };
  const handleBlockUser = (name, email, reqId) => {
    if (window.confirm(`Are you sure you want to BLOCK ${name} (${email || 'User'}) from hosting tournaments?`)) {
      setBlockedUsers(prev => [...prev.filter(b => b.email !== email), {
        id: 'blk_' + Date.now(),
        name: name || 'Blocked User',
        email: email || 'user@livetournaments.in',
        reason: 'Violated tournament hosting / thumbnail guidelines',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }]);
      setHostingRequests(prev => prev.map(r => (r.id === reqId || r.email === email) ? { ...r, status: 'BLOCKED' } : r));
      setScrimsRequests(prev => prev.map(s => (s.id === reqId || s.contact === email) ? { ...s, status: 'BLOCKED' } : s));
      showToast(`🚫 User ${name} has been BLOCKED across the platform`);
      if (selectedInspectImage) setSelectedInspectImage(null);
    }
  };
  const handleUnblockUser = (email) => {
    setBlockedUsers(prev => prev.filter(b => b.email !== email));
    showToast(`✅ User unblocked successfully`);
  };

  const handleApproveScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED' } : s));
    showToast('✅ Scrim Request Approved & Match Slot Scheduled!');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
  };
  const handleRejectScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED' } : s));
    showToast('❌ Scrim Request Declined');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
  };
  const handleSuspendScrim = (id) => {
    setScrimsRequests(prev => prev.map(s => s.id === id ? { ...s, status: 'SUSPENDED' } : s));
    showToast('⚠️ Scrim Schedule Suspended & Terminated');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
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
          {/* Tournament Hostings */}
          <button
            onClick={() => { setActiveTab('hosting-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'hosting-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span className="flex-1">Tournament Hostings</span>
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
            <span className="flex-1">Daily & Weekly Scrims</span>
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

          {/* Featured Arena */}
          <button
            onClick={() => { setActiveTab('featured-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'featured-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span className="flex-1">Featured Arena</span>
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

          {/* Section Divider */}
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

          {/* Active Match Rooms */}
          <button
            onClick={() => { showToast('Active automated rooms online'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">meeting_room</span>
            <span className="flex-1">Active Match Rooms</span>
          </button>

          {/* User Database */}
          <button
            onClick={() => { showToast('52,480 registered platform users'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span className="flex-1">User Database</span>
          </button>

          {/* Broadcast & Stream Production */}
          <button
            onClick={() => { showToast('Production streaming console active'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">live_tv</span>
            <span className="flex-1">Broadcast & Stream Production</span>
          </button>

          {/* Reports & Analytics */}
          <button
            onClick={() => { setActiveTab('present-day'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">bar_chart</span>
            <span className="flex-1">Reports & Analytics</span>
          </button>

          {/* Activity Logs */}
          <button
            onClick={() => { showToast('System audit activity logs'); setSidebarOpen(false); }}
            className="nagulan-sidebar-btn"
          >
            <span className="material-symbols-outlined text-[16px]">event_note</span>
            <span className="flex-1">Activity Logs</span>
          </button>

          {/* Platform Settings */}
          <button
            onClick={() => { showToast('Esports Hub platform settings'); setSidebarOpen(false); }}
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
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full !bg-[#1F2937] hover:!bg-black !text-white text-[11px] font-bold tracking-wide shadow-sm transition-all cursor-pointer"
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
          <div className="animate-fade-in">
            <DashboardPage />
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

            {/* ROW 1: 5 Live Esports Direct Metrics (media_1795009600879_721f2f3a.jpg) */}
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
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">TODAY'S MATCHES</span>
                  <p className="text-[20px] font-bold text-[#1F2937] mt-0.5 nagulan-mono">29 Matches</p>
                  <p className="text-[9px] text-[#9CA3AF] mt-0.5">Yesterday: 26 Matches</p>
                </div>
                <div className="pt-2 border-t border-[#F3F4F6] mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-[#10B981] font-semibold">↗ +11.5%</span>
                  <span className="text-[#9CA3AF]">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">PRESENT DAY CARDS</span>
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
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">UPI, Card and NetBanking comparison</p>
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
                    {/* Cards */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px] h-[35%]" title="Today: ₹1,523"></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px] h-[60%]" title="Yesterday: ₹2,610"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">Cards</span>
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
                        Total Tournament Turnover
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
                        Total Hosted Matches
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">29 Matches</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">26 Matches</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+3 Matches</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          High (+11.5%)
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3B82F6] text-[15px]">payments</span>
                        Card Payments
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
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#DFBD78] text-[20px]">hub</span>
                  Tournament Hosting Requests by Users
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Review mandatory thumbnail graphics, organizer credentials, game formats, and enforce compliance decisions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBlockedModal(true)}
                  className="px-2.5 py-1 rounded-[6px] bg-gray-100 hover:bg-gray-200 text-[#4B5563] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Blocked Users ({blockedUsers.length})
                </button>
                <span className="px-3 py-1 rounded-full bg-amber-50 text-[#D97706] text-[11px] font-bold border border-amber-200">
                  {pendingHostingCount} Pending Review
                </span>
              </div>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Total Hostings</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">{hostingRequests.length}</span>
                </div>
                <span className="material-symbols-outlined text-[#9CA3AF] text-[22px]">format_list_bulleted</span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-[10px] border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Pending Review</span>
                  <span className="text-[18px] font-bold text-amber-800 font-mono mt-0.5 block">{pendingHostingCount}</span>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-[22px]">pending_actions</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Approved & Live</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">
                    {hostingRequests.filter(r => r.status === 'APPROVED').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">verified</span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-[10px] border border-rose-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Terminated / Blocked</span>
                  <span className="text-[18px] font-bold text-rose-800 font-mono mt-0.5 block">
                    {hostingRequests.filter(r => r.status === 'REJECTED' || r.status === 'SUSPENDED' || r.status === 'BLOCKED').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-rose-500 text-[22px]">do_not_disturb_on</span>
              </div>
            </div>

            {/* REQUEST CARDS GRID WITH MANDATORY THUMBNAILS & ADMIN CONTROLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hostingRequests.map(req => (
                <div
                  key={req.id}
                  className={`rounded-[14px] border ${req.status === 'BLOCKED' ? 'border-rose-400 bg-rose-50/20' : req.status === 'SUSPENDED' ? 'border-amber-400 bg-amber-50/20' : 'border-[#D1D1D1]/60 bg-white'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group`}
                >
                  {/* MANDATORY THUMBNAIL GRAPHIC PREVIEW */}
                  <div className="relative w-full h-40 bg-black/10 overflow-hidden shrink-0">
                    <img
                      src={req.thumbnail || '/tournament_bgmi_showdown_4k.jpg'}
                      alt={req.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-2.5">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                        {req.game}
                      </span>
                      <button
                        onClick={() => setSelectedInspectImage({ ...req, image: req.thumbnail || '/tournament_bgmi_showdown_4k.jpg' })}
                        className="px-2 py-1 rounded bg-white hover:bg-gold-primary hover:text-black text-gray-900 text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer transition-colors active:scale-95"
                      >
                        🔍 Inspect Graphic
                      </button>
                    </div>
                  </div>

                  {/* DETAILS BODY */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[13px] font-bold text-[#1F2937] leading-snug line-clamp-1">{req.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                          req.status === 'APPROVED' ? 'bg-emerald-50 text-[#059669] border border-emerald-200' :
                          req.status === 'BLOCKED' ? 'bg-black text-white' :
                          req.status === 'SUSPENDED' || req.status === 'REJECTED' ? 'bg-rose-50 text-[#EF4444] border border-rose-200' :
                          'bg-amber-50 text-[#D97706] border border-amber-200'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#4B5563]">
                        {req.organizer} &bull; <strong className="text-[#C5A059]">{req.clan}</strong>
                      </p>

                      <div className="text-[10px] text-[#4B5563] space-y-1 bg-[#F9FAFB] p-2.5 rounded-[8px] border border-[#E5E7EB]">
                        <p><strong>Format:</strong> {req.format} &bull; {req.slots}</p>
                        <p><strong>Prize Pool:</strong> <span className="text-[#059669] font-bold font-mono">{req.prizePool}</span> (Entry: {req.entryFee})</p>
                        <p><strong>Schedule:</strong> {req.timing}</p>
                        <p className="truncate text-[#6B7280]"><strong>Contact:</strong> {req.email} &bull; {req.mobile}</p>
                      </div>
                    </div>

                    {/* DECISION ACTION BUTTONS (ACCEPT, SUSPEND, BLOCK USER) */}
                    <div className="pt-2 border-t border-[#F3F4F6] flex flex-col gap-1.5">
                      {req.status === 'PENDING' ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveHosting(req.id)}
                              className="flex-1 py-1.5 rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleSuspendHosting(req.id)}
                              className="flex-1 py-1.5 rounded-[6px] bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                            >
                              ⚠️ Suspend
                            </button>
                            <button
                              onClick={() => handleRejectHosting(req.id)}
                              className="py-1.5 px-2.5 rounded-[6px] bg-rose-50 hover:bg-rose-100 text-[#EF4444] text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                          <button
                            onClick={() => handleBlockUser(req.organizer, req.email, req.id)}
                            className="w-full py-1 rounded-[6px] bg-gray-900 hover:bg-black text-rose-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">block</span>
                            Block User
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className="text-[#6B7280] font-semibold">Status: <strong className="text-[#1F2937]">{req.status}</strong></span>
                          {req.status !== 'BLOCKED' && (
                            <button
                              onClick={() => handleBlockUser(req.organizer, req.email, req.id)}
                              className="text-rose-600 hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                            >
                              Block User &rarr;
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(activeTab === 'scrims-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">timer</span>
                  Scrims Requests (Daily / Weekly / Monthly)
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Inspect clan banners and thumbnails, verify match cadence, and approve slots or suspend non-compliant requests.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#3B82F6] text-[11px] font-bold border border-blue-200">
                {pendingScrimsCount} Pending Scheduling
              </span>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Total Scrims</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">{scrimsRequests.length}</span>
                </div>
                <span className="material-symbols-outlined text-[#9CA3AF] text-[22px]">sports_esports</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-[10px] border border-blue-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Pending Requests</span>
                  <span className="text-[18px] font-bold text-blue-800 font-mono mt-0.5 block">{pendingScrimsCount}</span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">schedule</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Active Approved</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">
                    {scrimsRequests.filter(s => s.status === 'APPROVED').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">check_circle</span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-[10px] border border-rose-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Suspended / Declined</span>
                  <span className="text-[18px] font-bold text-rose-800 font-mono mt-0.5 block">
                    {scrimsRequests.filter(s => s.status === 'REJECTED' || s.status === 'SUSPENDED' || s.status === 'BLOCKED').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-rose-500 text-[22px]">cancel</span>
              </div>
            </div>

            {/* SCRIMS CARDS WITH THUMBNAIL & MODERATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scrimsRequests.map(scrim => (
                <div
                  key={scrim.id}
                  className={`rounded-[14px] border ${scrim.status === 'BLOCKED' ? 'border-rose-400 bg-rose-50/20' : scrim.status === 'SUSPENDED' ? 'border-amber-400 bg-amber-50/20' : 'border-[#D1D1D1]/60 bg-white'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group`}
                >
                  {/* SCRIM THUMBNAIL */}
                  <div className="relative w-full h-36 bg-black/10 overflow-hidden shrink-0">
                    <img
                      src={scrim.thumbnail || '/tournament_pubg_ultimate_squad_4k.jpg'}
                      alt={scrim.clan}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-2.5">
                      <span className="px-2 py-0.5 rounded bg-blue-600/80 backdrop-blur-xs text-white text-[10px] font-bold">
                        {scrim.frequencyBadge}
                      </span>
                      <button
                        onClick={() => setSelectedInspectImage({ ...scrim, title: scrim.clan, image: scrim.thumbnail || '/tournament_pubg_ultimate_squad_4k.jpg' })}
                        className="px-2 py-1 rounded bg-white hover:bg-gold-primary hover:text-black text-gray-900 text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer transition-colors active:scale-95"
                      >
                        🔍 Inspect Graphic
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[13px] font-bold text-[#1F2937] leading-snug line-clamp-1">{scrim.clan}</h4>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                          scrim.status === 'APPROVED' ? 'bg-emerald-50 text-[#059669] border border-emerald-200' :
                          scrim.status === 'BLOCKED' ? 'bg-black text-white' :
                          scrim.status === 'SUSPENDED' || scrim.status === 'REJECTED' ? 'bg-rose-50 text-[#EF4444] border border-rose-200' :
                          'bg-blue-50 text-[#3B82F6] border border-blue-200'
                        }`}>
                          {scrim.status}
                        </span>
                      </div>

                      <div className="text-[10px] text-[#4B5563] space-y-1 bg-[#F9FAFB] p-2.5 rounded-[8px] border border-[#E5E7EB]">
                        <p><strong>Tier:</strong> <span className="text-blue-700 font-bold">{scrim.tier}</span> &bull; {scrim.game}</p>
                        <p><strong>Format:</strong> {scrim.format}</p>
                        <p><strong>Schedule:</strong> {scrim.schedule}</p>
                        <p className="truncate text-[#6B7280]"><strong>Contact:</strong> {scrim.contact}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F3F4F6] flex flex-col gap-1.5">
                      {scrim.status === 'PENDING' ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveScrim(scrim.id)}
                              className="flex-1 py-1.5 rounded-[6px] bg-[#3B82F6] hover:bg-blue-700 text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleSuspendScrim(scrim.id)}
                              className="flex-1 py-1.5 rounded-[6px] bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                            >
                              ⚠️ Suspend
                            </button>
                            <button
                              onClick={() => handleRejectScrim(scrim.id)}
                              className="py-1.5 px-2.5 rounded-[6px] bg-rose-50 hover:bg-rose-100 text-[#EF4444] text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                          <button
                            onClick={() => handleBlockUser(scrim.clan, scrim.contact, scrim.id)}
                            className="w-full py-1 rounded-[6px] bg-gray-900 hover:bg-black text-rose-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[13px]">block</span>
                            Block User
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between text-[10px] pt-1">
                          <span className="text-[#6B7280] font-semibold">Status: <strong className="text-[#1F2937]">{scrim.status}</strong></span>
                          {scrim.status !== 'BLOCKED' && (
                            <button
                              onClick={() => handleBlockUser(scrim.clan, scrim.contact, scrim.id)}
                              className="text-rose-600 hover:underline font-bold text-[10px] flex items-center gap-0.5 cursor-pointer"
                            >
                              Block Clan &rarr;
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
                New Tournament Hosting Entry
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

      {/* ========================================================
          MODAL: FULLSCREEN THUMBNAIL & GRAPHIC INSPECTION (ADMIN VERIFICATION)
          ======================================================== */}
      {selectedInspectImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider block">
                  Mandatory Graphic Inspection
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {selectedInspectImage.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInspectImage(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Graphic Image Preview */}
            <div className="relative w-full h-72 sm:h-80 bg-black overflow-hidden flex items-center justify-center">
              <img
                src={selectedInspectImage.image || selectedInspectImage.thumbnail || '/tournament_bgmi_showdown_4k.jpg'}
                alt={selectedInspectImage.title}
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold font-mono">
                Verified 16:9 Esports Graphic
              </span>
            </div>

            {/* Organizer & Meta Specs */}
            <div className="p-4 bg-gray-50/70 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Organizer</span>
                <span className="font-bold text-gray-900 truncate block">{selectedInspectImage.organizer || selectedInspectImage.clan || 'Community Host'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Game Title</span>
                <span className="font-bold text-blue-600 block">{selectedInspectImage.game || 'Esports'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Prize Pool</span>
                <span className="font-bold text-emerald-600 block">{selectedInspectImage.prizePool || 'Custom Prize'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold block text-[10px] uppercase">Current Status</span>
                <span className="font-bold text-amber-600 block">{selectedInspectImage.status || 'PENDING'}</span>
              </div>
            </div>

            {/* Quick Decision Actions in Modal */}
            <div className="p-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleApproveHosting(selectedInspectImage.id);
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  ✓ Accept & Approve
                </button>
                <button
                  onClick={() => {
                    handleSuspendHosting(selectedInspectImage.id);
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  ⚠️ Suspend & Terminate
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleBlockUser(selectedInspectImage.organizer || selectedInspectImage.clan, selectedInspectImage.email || selectedInspectImage.contact, selectedInspectImage.id);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-black text-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">block</span>
                  Block User
                </button>
                <button
                  onClick={() => setSelectedInspectImage(null)}
                  className="px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: BLOCKED USERS & CLANS REGISTRY
          ======================================================== */}
      {showBlockedModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-rose-500 text-[18px]">block</span>
                Blocked Users & Organizers Registry ({blockedUsers.length})
              </h3>
              <button
                onClick={() => setShowBlockedModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {blockedUsers.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-6">No users currently blocked.</p>
              ) : (
                blockedUsers.map(b => (
                  <div key={b.id || b.email} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <h5 className="font-bold text-gray-900">{b.name}</h5>
                      <p className="text-gray-500 text-[11px]">{b.email} &bull; <span className="text-rose-600">{b.reason}</span></p>
                      <span className="text-[10px] text-gray-400">Blocked on {b.date}</span>
                    </div>
                    <button
                      onClick={() => handleUnblockUser(b.email)}
                      className="px-2.5 py-1 rounded bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 text-[11px] font-bold border border-gray-200 transition-colors cursor-pointer"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setShowBlockedModal(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
