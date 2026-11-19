import React, { useState, useEffect } from 'react';

export default function UserDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'present-day', 'my-tournaments', 'host-studio', 'scrims', 'wallet', 'broadcast'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedBriefing, setSelectedBriefing] = useState(null);
  const [showHostModal, setShowHostModal] = useState(false);

  // Trigger toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncLive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('⚡ Live Player Telemetry Synced');
    }, 600);
  };

  // Helper to purge legacy mock items from competitor session
  const isUserMock = (id) => {
    if (!id) return true;
    const str = String(id);
    return str === 'bgmi-sd-reg-01' || str === 'scrim-tier1-01' || str.startsWith('mock_') || str.startsWith('demo_');
  };

  // Joined Tournaments (User Registrations - Realtime only)
  const [joinedTournaments, setJoinedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_joined_tourneys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(t => !isUserMock(t.id));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // User Hosted Tournaments (Realtime only)
  const [hostedTournaments, setHostedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_hosted_tourneys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(t => !isUserMock(t.id));
      } catch (e) {}
    }
    return [];
  });

  // User Scrims (Realtime only)
  const [joinedScrims, setJoinedScrims] = useState(() => {
    const saved = localStorage.getItem('lt_user_scrims');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(s => !isUserMock(s.id));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_user_scrims', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // Proactive cleanup of any legacy user mock entries in localStorage
  useEffect(() => {
    ['lt_user_joined_tourneys', 'lt_user_hosted_tourneys', 'lt_user_scrims'].forEach(k => {
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter(item => !isUserMock(item?.id));
            localStorage.setItem(k, JSON.stringify(clean));
          }
        }
      } catch (e) {}
    });
  }, []);

  // User Digital Wallet & Transactions
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('lt_user_wallet_balance');
    return saved ? Number(saved) : 0;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lt_user_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('lt_user_joined_tourneys', JSON.stringify(joinedTournaments));
  }, [joinedTournaments]);

  useEffect(() => {
    localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(hostedTournaments));
  }, [hostedTournaments]);

  useEffect(() => {
    localStorage.setItem('lt_user_scrims', JSON.stringify(joinedScrims));
  }, [joinedScrims]);

  useEffect(() => {
    localStorage.setItem('lt_user_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('lt_user_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Host Form State
  const [hostTitle, setHostTitle] = useState('');
  const [hostGame, setHostGame] = useState('Battlegrounds Mobile India');
  const [hostType, setHostType] = useState('TOURNAMENT');
  const [hostFormat, setHostFormat] = useState('Squad (Erangel + Miramar)');
  const [hostSlots, setHostSlots] = useState('64 Teams');
  const [hostPrize, setHostPrize] = useState('');
  const [hostTiming, setHostTiming] = useState('');
  const [hostThumbnail, setHostThumbnail] = useState('/assets/tournament_bgmi_showdown_4k.jpg');
  const [hostTier, setHostTier] = useState('standard'); // standard (199), pro (499), premier (999)
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, NETBANKING
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const tierPrices = {
    standard: 199,
    pro: 499,
    premier: 999
  };

  const presetThumbnails = [
    { name: 'BGMI Showdown 4K', url: '/assets/tournament_bgmi_showdown_4k.jpg' },
    { name: 'BGMI LAN Warriors', url: '/assets/tournament_bgmi_lan_warriors_4k.jpg' },
    { name: 'PUBG Ultimate Squad', url: '/assets/tournament_pubg_ultimate_squad_4k.jpg' },
    { name: 'Championship Trophy Stage', url: '/assets/lt_championship_trophy_card_4k.png' },
    { name: 'Pro Esports Arena', url: '/assets/host_directly_4k.jpg' },
  ];

  const handleCustomThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHostThumbnail(reader.result);
        showToast('✓ Custom thumbnail uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaidHostingSubmit = (e) => {
    e.preventDefault();
    if (!hostTitle || !hostPrize || !hostTiming) {
      alert('Please fill in tournament title, prize pool, and schedule timing.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const amount = tierPrices[hostTier];
      const newHostingEntry = {
        id: 'host_' + Date.now(),
        title: hostTitle,
        game: hostGame,
        type: hostType,
        format: hostFormat,
        slots: hostSlots,
        prize: hostPrize,
        timing: hostTiming,
        thumbnail: hostThumbnail,
        tier: hostTier,
        amountPaid: amount,
        paymentRef: 'UPI_' + Math.floor(1000000000 + Math.random() * 9000000000),
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        hostUser: displayName,
        email: displayEmail,
      };

      const updatedUserHosted = [newHostingEntry, ...hostedTournaments];
      setHostedTournaments(updatedUserHosted);

      // Sync real hosting entry to Super Admin Hosting Requests queue
      try {
        const adminHostings = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
        localStorage.setItem('lt_admin_hosting_requests', JSON.stringify([newHostingEntry, ...adminHostings]));
      } catch (e) {}

      // Record transaction
      const newTx = {
        id: 'tx_' + Date.now(),
        description: `Hosting Fee: ${hostTitle} (${hostTier.toUpperCase()})`,
        amount: -amount,
        type: 'DEBIT',
        status: 'SUCCESS',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        reference: newHostingEntry.paymentRef
      };
      setTransactions([newTx, ...transactions]);

      setIsProcessingPayment(false);
      setPaymentSuccess(newHostingEntry);
      showToast('🎉 Hosting submitted & fee processed successfully!');
      setShowHostModal(false);

      // Reset form
      setHostTitle('');
      setHostPrize('');
      setHostTiming('');
    }, 1200);
  };

  const displayName = currentUser?.name || currentUser?.username || 'Competitor';
  const displayEmail = currentUser?.email || 'user@livetournaments.in';
  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Live Indian Standard Time (IST) Clock
  const [currentIndiaTime, setCurrentIndiaTime] = useState(() => {
    return new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' IST';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndiaTime(new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="nagulan-dashboard min-h-screen bg-[#F3F4F6] text-[#1F2937] flex font-['Inter',sans-serif] antialiased selection:bg-[#DFBD78]/30">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-[8px] bg-[#1F2937] text-white shadow-xl border border-[#C5A059]/40 text-[11px] font-semibold tracking-wide animate-fade-in">
          <span className="material-symbols-outlined text-[#DFBD78] text-base">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      {/* ========================================================
          LEFT DARK SIDEBAR (EXACT NAGULAN SUPERADMIN REPLICA)
          ======================================================== */}
      <aside
        style={{ minHeight: '100vh', width: '240px', backgroundColor: '#0E0E10' }}
        className={`w-60 bg-[#0E0E10] text-[#9CA3AF] flex-col border-r border-[#1F2937] shrink-0 z-50 transition-all duration-200 ${
          sidebarOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl' : 'hidden lg:flex'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 py-4 border-b border-[#1F2937]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
            <div className="size-9 rounded-full bg-[#18181B] border border-[#DFBD78]/40 flex items-center justify-center text-[#DFBD78] font-bold text-xs shadow-inner">
              LT
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold tracking-tight text-white uppercase leading-tight">LiveTournaments</span>
              <span className="text-[8px] text-[#9CA3AF] tracking-wider uppercase font-medium leading-none mt-0.5">COMPETITOR HUB</span>
            </div>
          </div>
          <div className="size-7 rounded-[6px] bg-[#1E1911] border border-[#DFBD78]/50 flex items-center justify-center text-[#DFBD78] font-bold text-[10px]">
            HQ
          </div>
        </div>

        {/* Competitor Role Badge Strip */}
        <div className="px-4 py-3 border-b border-[#1F2937]/60 flex items-center justify-between bg-[#131316]">
          <span className="text-[11px] font-semibold text-white/90 truncate max-w-[120px]">{displayName}</span>
          <span className="px-2 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[9px] font-bold tracking-wider uppercase border border-[#DFBD78]/40">
            PLAYER
          </span>
        </div>

        {/* Navigation Items (Exact Nagulan Classes) */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-[11px] font-medium scrollbar-thin">
          
          {/* Present Day */}
          <button
            onClick={() => { setActiveTab('present-day'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'present-day' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            <span className="flex-1 text-left">Present Day</span>
            <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          </button>

          {/* Competitor Dashboard Overview */}
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span className="flex-1 text-left">Player Dashboard</span>
          </button>

          {/* Section: Competitive Operations */}
          <div className="pt-3 pb-1 px-2">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              ARENA OPERATIONS
            </span>
          </div>

          {/* My Tournaments & Match Rooms */}
          <button
            onClick={() => { setActiveTab('my-tournaments'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'my-tournaments' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">sports_esports</span>
            <span className="flex-1 text-left">My Matches &amp; Rooms</span>
            {joinedTournaments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                {joinedTournaments.length}
              </span>
            )}
          </button>

          {/* Paid Hosting Studio */}
          <button
            onClick={() => { setActiveTab('host-studio'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'host-studio' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span className="flex-1 text-left">Paid Hosting Studio</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#DFBD78]/20 text-[#DFBD78] text-[9px] font-bold border border-[#DFBD78]/30">
              PAID
            </span>
          </button>

          {/* Daily Scrims Hub */}
          <button
            onClick={() => { setActiveTab('scrims'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'scrims' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span className="flex-1 text-left">Daily Scrims Hub</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-bold border border-blue-500/30">
              LIVE
            </span>
          </button>

          {/* Section: Finance & Media */}
          <div className="pt-3 pb-1 px-2">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              FINANCE &amp; MEDIA
            </span>
          </div>

          {/* Digital Wallet & Payouts */}
          <button
            onClick={() => { setActiveTab('wallet'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'wallet' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
            <span className="flex-1 text-left">Digital Wallet &amp; UPI</span>
          </button>

          {/* Broadcast & Live Stream */}
          <button
            onClick={() => { setActiveTab('broadcast'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'broadcast' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">live_tv</span>
            <span className="flex-1 text-left">Broadcast &amp; Streams</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#1F2937]/80 bg-[#0E0E10] space-y-2">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-[#9CA3AF] hover:text-white hover:bg-[#18181B] text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Return to Home Arena</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[6px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          RIGHT MAIN CONTENT CONTAINER (EXACT NAGULAN LAYOUT)
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP HEADER BAR */}
        <header className="bg-white border-b border-[#D1D1D1]/60 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
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
                <span className="text-[#C5A059] font-bold">{displayName}</span>
              </h1>
              <span className="text-[11px] text-[#9CA3AF] font-medium tracking-wide leading-[15px]">
                {currentDateStr}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sync Telemetry Button */}
            <button
              onClick={handleSyncLive}
              disabled={isSyncing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] border border-[#D1D1D1]/80 text-[#4B5563] hover:bg-[#F3F4F6] text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[15px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
              <span>Sync Telemetry</span>
            </button>

            {/* + Host Tournament CTA Button */}
            <button
              onClick={() => { setActiveTab('host-studio'); }}
              style={{ backgroundColor: '#1F2937', color: '#ffffff' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full !bg-[#1F2937] hover:!bg-black !text-white text-[11px] font-bold tracking-wide shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] !text-white">add</span>
              <span className="!text-white">+ Host Tournament</span>
            </button>

            {/* Exact Verified Login Node Badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Exact Node:</span>
              <span className="font-semibold text-gray-800 text-[11px] truncate max-w-[210px]" title={currentUser?.location || 'Chennai, Tamil Nadu [GPS Verified]'}>
                {currentUser?.location || 'Chennai, Tamil Nadu [GPS Verified]'}
              </span>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-[#D1D1D1]/60">
              <div className="size-7 rounded-full bg-[#1F2937] text-[#DFBD78] flex items-center justify-center font-bold text-[11px] shadow-sm uppercase">
                {displayName.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#1F2937] leading-tight truncate max-w-[110px]">{displayName}</span>
                <span className="text-[9px] text-[#9CA3AF] font-medium leading-none">Competitor</span>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 overflow-y-auto">

          {/* ========================================================
              VIEW 1: DASHBOARD OVERVIEW (DEFAULT)
              ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* TOP STAT CARDS (EXACT NAGULAN METRICS ROW) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* Stat 1: Registered Matches */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">REGISTERED MATCHES</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{joinedTournaments.length} Matches</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Active Tournament Entries</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      Confirmed
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Live Synced</span>
                  </div>
                </div>

                {/* Stat 2: My Hosted Tournaments */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">HOSTED TOURNAMENTS</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{hostedTournaments.length} Events</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Total Hosted Competitions</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-blue-600">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      {hostedTournaments.filter(h => h.status === 'APPROVED').length} Active
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Organizer Studio</span>
                  </div>
                </div>

                {/* Stat 3: Daily Scrims */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">DAILY SCRIMS</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{joinedScrims.length} Scrims</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Practice Slot Bookings</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      Clan Pool
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Live Allocated</span>
                  </div>
                </div>

                {/* Stat 4: Wallet Balance */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">WALLET BALANCE</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(walletBalance).toLocaleString('en-IN')}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Available Credits</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-purple-600">
                      <span className="material-symbols-outlined text-[15px]">account_balance_wallet</span>
                      UPI Ready
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Instant</span>
                  </div>
                </div>

              </div>

              {/* ACTION TILES ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Tile 1: Paid Hosting Studio */}
                <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
                  <div>
                    <div className="size-9 rounded-[8px] bg-[#DFBD78]/15 border border-[#DFBD78]/40 flex items-center justify-center text-[#C5A059] mb-3">
                      <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                    </div>
                    <h4 className="font-bold text-[14px] text-[#1F2937]">Paid Hosting Studio</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                      Launch your custom BGMI or PUBG tournament with automatic UPI payment processing and Super Admin approval.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('host-studio')}
                    className="w-full py-2.5 rounded-[8px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Open Hosting Studio →
                  </button>
                </div>

                {/* Tile 2: Match Rooms & Brackets */}
                <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
                  <div>
                    <div className="size-9 rounded-[8px] bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-3">
                      <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                    </div>
                    <h4 className="font-bold text-[14px] text-[#1F2937]">My Match Rooms</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                      View your registered team slots, live room keys, match timings, and bracket advancement.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('my-tournaments')}
                    className="w-full py-2.5 rounded-[8px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View Match Rooms ({joinedTournaments.length}) →
                  </button>
                </div>

                {/* Tile 3: Digital Wallet */}
                <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
                  <div>
                    <div className="size-9 rounded-[8px] bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 mb-3">
                      <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                    </div>
                    <h4 className="font-bold text-[14px] text-[#1F2937]">Digital Wallet &amp; Payouts</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                      Instant UPI prize payouts, payment transaction history, and deposit gateway with zero hidden charges.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('wallet')}
                    className="w-full py-2.5 rounded-[8px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Manage Wallet &amp; UPI →
                  </button>
                </div>

              </div>

              {/* REGISTERED TOURNAMENTS PREVIEW */}
              <div className="bg-white rounded-[12px] border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#D1D1D1]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#C5A059]">emoji_events</span>
                    <h3 className="font-bold text-sm text-[#1F2937]">Current Active Registrations</h3>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate('home')}
                    className="text-xs text-[#C5A059] font-bold hover:underline cursor-pointer"
                  >
                    Browse Arenas &rarr;
                  </button>
                </div>

                <div className="p-5">
                  {joinedTournaments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      No active tournament registrations. Visit the home page to join official competitions.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {joinedTournaments.map((t) => (
                        <div key={t.id} className="p-4 rounded-xl border border-gray-200 bg-[#F9FAFB] flex flex-col justify-between gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">{t.game}</span>
                              <h4 className="font-bold text-sm text-[#1F2937]">{t.title}</h4>
                              <p className="text-xs text-[#6B7280] mt-0.5">{t.format}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                              {t.status}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-xs">
                            <span className="font-mono text-gray-600 font-semibold">{t.slotNumber}</span>
                            <button
                              onClick={() => setSelectedBriefing(t)}
                              className="px-3 py-1 rounded bg-[#1F2937] text-white text-[11px] font-bold hover:bg-black transition-colors cursor-pointer"
                            >
                              Room Key Briefing
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 2: PRESENT DAY
              ======================================================== */}
          {activeTab === 'present-day' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Live Match Day</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">Today's Schedule &bull; {currentDateStr}</h2>
                  <p className="text-xs text-[#6B7280] mt-1">
                    All scheduled matches, practice scrim drop windows, and verified clan lobby codes for today.
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-[#1E1911] border border-[#DFBD78]/40 text-[#DFBD78] font-mono font-bold text-sm flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>IST: {currentIndiaTime}</span>
                </div>
              </div>

              {/* 4 Present Day Core Metric Cards (Realtime Competitor Metrics) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* 1. Present Day Total */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">PRESENT DAY TOTAL</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">
                      ₹ {transactions.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + Math.abs(t.amount || 0), 0).toLocaleString('en-IN')}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Realtime Tournament Volume</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Live Synced
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Session Active</span>
                  </div>
                </div>

                {/* 2. Today's Matches */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">TODAY'S MATCHES</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">
                      {joinedTournaments.length + joinedScrims.length} Matches
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Active Clan &amp; Squad Lobbies</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                      Live Arena
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Auto Refreshed</span>
                  </div>
                </div>

                {/* 3. Present Day UPI */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">PRESENT DAY UPI</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">
                      ₹ {transactions.filter(t => t.type === 'DEBIT' && String(t.reference || '').includes('UPI')).reduce((acc, t) => acc + Math.abs(t.amount || 0), 0).toLocaleString('en-IN')}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Instant QR &amp; VPA Transfers</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">bolt</span>
                      Instant
                    </span>
                    <span className="text-xs text-slate-400 font-medium">0% Fee</span>
                  </div>
                </div>

                {/* 4. Present Day Card */}
                <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">PRESENT DAY CARD</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">
                      ₹ {transactions.filter(t => t.type === 'DEBIT' && !String(t.reference || '').includes('UPI')).reduce((acc, t) => acc + Math.abs(t.amount || 0), 0).toLocaleString('en-IN')}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Gateway Direct &amp; NetBanking</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">credit_card</span>
                      Secure
                    </span>
                    <span className="text-xs text-slate-400 font-medium">RBI Compliant</span>
                  </div>
                </div>

              </div>

              {/* Today's Match Cards (Dynamic & Zero Mock Data) */}
              {joinedTournaments.length === 0 && joinedScrims.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-[16px] border border-dashed border-[#D1D1D1]/80 p-8 shadow-xs">
                  <div className="size-12 rounded-full bg-[#DFBD78]/10 border border-[#DFBD78]/30 flex items-center justify-center text-[#C5A059] mx-auto mb-3">
                    <span className="material-symbols-outlined text-[24px]">sports_esports</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#1F2937]">No Matches Scheduled for Today</h4>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-md mx-auto">
                    You haven't joined any live match rooms or scheduled scrims for today yet. Browse active tournaments to register your squad!
                  </p>
                  <button
                    onClick={() => onNavigate && onNavigate('home')}
                    className="mt-4 px-4 py-2 rounded-xl bg-[#1E1911] text-[#DFBD78] font-bold text-xs border border-[#DFBD78]/40 hover:bg-black transition-all cursor-pointer"
                  >
                    Browse Tournaments
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {joinedTournaments.map(t => (
                    <div key={t.id} className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                          🔴 {t.status || 'Active'}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{t.time || 'Today'}</span>
                      </div>
                      <h3 className="font-bold text-base text-[#1F2937]">{t.title}</h3>
                      <p className="text-xs text-gray-600">{t.format} &bull; {t.slotNumber}</p>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-gray-900">Room: {t.roomCode || 'TBD'}</span>
                        <button
                          onClick={() => setSelectedBriefing(t)}
                          className="px-3 py-1 rounded bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                  {joinedScrims.map(s => (
                    <div key={s.id} className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700 border border-blue-200">
                          ⏱ {s.status || 'Upcoming Scrim'}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{s.timing}</span>
                      </div>
                      <h3 className="font-bold text-base text-[#1F2937]">{s.title}</h3>
                      <p className="text-xs text-gray-600">{s.game} &bull; Capacity: {s.slots}</p>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-gray-900">Room: {s.roomCode || 'TBD'}</span>
                        <button
                          onClick={() => showToast(`Room credentials: ${s.roomCode} / Pass: ${s.roomPass}`)}
                          className="px-3 py-1 rounded bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                        >
                          Check Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 3: MY TOURNAMENTS & MATCH ROOMS
              ======================================================== */}
          {activeTab === 'my-tournaments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">My Registered Matches &amp; Tournament Rooms</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Your confirmed squad slots, room ID credentials, and referee briefings.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Join More Arenas &rarr;
                </button>
              </div>

              {joinedTournaments.length === 0 ? (
                <div className="bg-white rounded-[12px] p-12 text-center border border-[#D1D1D1]/60 space-y-3">
                  <span className="text-4xl block">🎮</span>
                  <h3 className="text-base font-bold text-[#1F2937]">No Registered Matches</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                    You haven't joined any active tournament matches. Visit the Home Arena to register for upcoming BGMI and PUBG showdowns.
                  </p>
                  <button
                    onClick={() => onNavigate && onNavigate('home')}
                    className="px-4 py-2 rounded-xl bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Browse Tournaments
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {joinedTournaments.map((t) => (
                    <div key={t.id} className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">{t.game}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            {t.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#1F2937]">{t.title}</h3>
                        <p className="text-xs text-gray-600">{t.format} &bull; {t.date} at {t.time}</p>
                        
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Slot Assignment:</span>
                            <span className="font-bold font-mono text-gray-900">{t.slotNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Prize Pool:</span>
                            <span className="font-bold text-emerald-600 font-mono">{t.prizePool}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Room Code Active</span>
                        <button
                          onClick={() => setSelectedBriefing(t)}
                          className="px-4 py-2 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                        >
                          View Room Key &amp; Rules
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 4: PAID HOSTING STUDIO
              ======================================================== */}
          {activeTab === 'host-studio' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[9px] font-bold uppercase border border-[#DFBD78]/40">
                      PAID HOSTING WORKFLOW
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Verified Tournament Organizer
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">Tournament Hosting Studio</h2>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                    Configure your tournament specifications, select a paid hosting tier, upload your banner thumbnail, and complete digital checkout.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Hosted by You</span>
                  <span className="text-xl font-bold font-mono text-[#C5A059]">{hostedTournaments.length} Events</span>
                </div>
              </div>

              {/* 4-Step Hosting Form */}
              <form onSubmit={handlePaidHostingSubmit} className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs space-y-6">
                
                {/* Step 1: Basic Specifications */}
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">1</span>
                    Tournament Basic Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Tournament Title *
                      </label>
                      <input
                        type="text"
                        value={hostTitle}
                        onChange={(e) => setHostTitle(e.target.value)}
                        placeholder="e.g. BGMI Elite Clan Championship Season 1"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Game Title
                      </label>
                      <select
                        value={hostGame}
                        onChange={(e) => setHostGame(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-none bg-white"
                      >
                        <option>Battlegrounds Mobile India</option>
                        <option>PUBG Mobile</option>
                        <option>Free Fire MAX</option>
                        <option>Call of Duty: Mobile</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Match Format &amp; Map
                      </label>
                      <input
                        type="text"
                        value={hostFormat}
                        onChange={(e) => setHostFormat(e.target.value)}
                        placeholder="e.g. Squad (Erangel + Miramar) 4 Matches"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Slot Capacity
                      </label>
                      <select
                        value={hostSlots}
                        onChange={(e) => setHostSlots(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-none bg-white"
                      >
                        <option>32 Teams (128 Players)</option>
                        <option>64 Teams (256 Players)</option>
                        <option>100 Solo Players</option>
                        <option>24 Pro Squads</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Prize Pool Distribution *
                      </label>
                      <input
                        type="text"
                        value={hostPrize}
                        onChange={(e) => setHostPrize(e.target.value)}
                        placeholder="e.g. ₹ 25,000 INR (1st: 15K, 2nd: 7K, 3rd: 3K)"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Schedule Date &amp; Time *
                      </label>
                      <input
                        type="text"
                        value={hostTiming}
                        onChange={(e) => setHostTiming(e.target.value)}
                        placeholder="e.g. Sunday, Nov 22, 2026 at 6:30 PM IST"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Thumbnail Banner Image (Mandatory) */}
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">2</span>
                    Tournament Thumbnail Poster
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Select an Esports Preset Thumbnail
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {presetThumbnails.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => setHostThumbnail(p.url)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                              hostThumbnail === p.url
                                ? 'border-[#C5A059] bg-[#DFBD78]/10 font-bold text-[#1F2937]'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <span className="size-2 rounded-full bg-[#C5A059]"></span>
                            <span className="truncate">{p.name}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Or Upload Custom Clan Poster (JPG/PNG)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomThumbnailUpload}
                          className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Thumbnail Preview Card */}
                    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 block">
                        Live Preview on Platform
                      </span>
                      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-black shadow-sm">
                        <img src={hostThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 text-center">
                        Verified by Super Admin before room code broadcast
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3: Hosting Tier Selection */}
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">3</span>
                    Select Paid Hosting Tier
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Tier 1: Standard */}
                    <div
                      onClick={() => setHostTier('standard')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        hostTier === 'standard'
                          ? 'border-[#C5A059] bg-[#DFBD78]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Tier 1</span>
                        <h4 className="font-bold text-base text-[#1F2937] mt-0.5">Standard Hosting</h4>
                        <span className="text-2xl font-bold font-mono text-[#1F2937] mt-2 block">₹ 199</span>
                        <p className="text-xs text-gray-600 mt-2">
                          Lobby room code distribution, automated slot assignment, and referee match supervision.
                        </p>
                      </div>
                    </div>

                    {/* Tier 2: Pro */}
                    <div
                      onClick={() => setHostTier('pro')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        hostTier === 'pro'
                          ? 'border-[#C5A059] bg-[#DFBD78]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Tier 2 &bull; Recommended</span>
                        <h4 className="font-bold text-base text-[#1F2937] mt-0.5">Pro Production</h4>
                        <span className="text-2xl font-bold font-mono text-[#C5A059] mt-2 block">₹ 499</span>
                        <p className="text-xs text-gray-600 mt-2">
                          Everything in Standard + Home Page Carousel feature + certified anti-cheat spectator pilot.
                        </p>
                      </div>
                    </div>

                    {/* Tier 3: Premier */}
                    <div
                      onClick={() => setHostTier('premier')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        hostTier === 'premier'
                          ? 'border-[#C5A059] bg-[#DFBD78]/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Tier 3</span>
                        <h4 className="font-bold text-base text-[#1F2937] mt-0.5">Elite Broadcast</h4>
                        <span className="text-2xl font-bold font-mono text-purple-700 mt-2 block">₹ 999</span>
                        <p className="text-xs text-gray-600 mt-2">
                          Full 1080p 60FPS stream broadcast overlays, caster audio mixing, and instant highlight reels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Digital Payment Gateway */}
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">4</span>
                    Digital Payment Gateway Integration (₹ {tierPrices[hostTier]})
                  </h3>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mt-4 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Payment Channel:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">UPI / QR Code</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        Official Merchant VPA: <span className="font-mono font-bold text-gray-900">livetournaments.in@upi</span>
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Zero transaction fees. Payment goes directly to LiveTournaments verified merchant account.
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-gray-500 block">Total Due:</span>
                      <span className="text-2xl font-bold font-mono text-[#1F2937]">₹ {tierPrices[hostTier]} INR</span>
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="px-6 py-3 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                        <span>Authorizing Payment &amp; Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Pay ₹{tierPrices[hostTier]} &amp; Submit Tournament</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* User's Submitted Tournaments Table */}
              <div className="bg-white rounded-[12px] border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#D1D1D1]/60 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1F2937]">My Submitted Tournaments ({hostedTournaments.length})</h3>
                  <span className="text-xs text-gray-500 font-semibold">Real-Time Review Pipeline</span>
                </div>

                {hostedTournaments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    You haven't submitted any tournaments yet. Fill out the studio form above to host your first tournament.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {hostedTournaments.map((h) => (
                      <div key={h.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <img src={h.thumbnail} alt="" className="size-12 rounded-lg object-cover bg-black" />
                          <div>
                            <h4 className="font-bold text-sm text-[#1F2937]">{h.title}</h4>
                            <p className="text-xs text-gray-500">{h.game} &bull; {h.timing}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="font-bold text-gray-900">₹{h.amountPaid}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            h.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {h.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 5: DAILY SCRIMS HUB
              ======================================================== */}
          {activeTab === 'scrims' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Daily Competitive Scrims Hub</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Tier-1, Tier-2, and Open practice lobbies for verified squads.
                  </p>
                </div>
                <button
                  onClick={() => showToast('Auto-assigning next available scrim slot...')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                >
                  Quick Slot Book &rarr;
                </button>
              </div>

              {joinedScrims.length === 0 ? (
                <div className="bg-white rounded-[12px] p-12 text-center border border-[#D1D1D1]/60 space-y-3">
                  <span className="text-4xl block">🎯</span>
                  <h3 className="text-base font-bold text-[#1F2937]">No Active Scrims Assigned</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                    You haven't booked any daily practice scrims for today. Click Quick Slot Book to allocate clan room codes and schedule briefings.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {joinedScrims.map((s) => (
                    <div key={s.id} className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                          {s.game}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-600">{s.status}</span>
                      </div>
                      <h3 className="font-bold text-base text-[#1F2937]">{s.title}</h3>
                      <p className="text-xs text-gray-600">{s.timing} &bull; Capacity: {s.slots}</p>
                      
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-gray-800">Room: {s.roomCode}</span>
                        <button
                          onClick={() => showToast(`Room credentials copied: ${s.roomCode} / Pass: ${s.roomPass}`)}
                          className="px-3 py-1 rounded bg-gray-900 text-white text-xs font-bold hover:bg-black cursor-pointer"
                        >
                          Copy Credentials
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 6: DIGITAL WALLET & PAYOUTS
              ======================================================== */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              
              {/* Wallet Summary Card */}
              <div className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Available Digital Balance</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl md:text-4xl font-extrabold font-mono text-[#1F2937]">₹ {walletBalance}.00</span>
                    <span className="text-xs text-emerald-600 font-semibold font-mono">INR Verified</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Connected UPI: <strong className="text-gray-900">{displayEmail.split('@')[0]}@okaxis</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const amount = prompt('Enter deposit amount in INR (e.g. 500):', '500');
                      if (amount && !isNaN(amount)) {
                        const newBal = walletBalance + Number(amount);
                        setWalletBalance(newBal);
                        const newTx = {
                          id: 'dep_' + Date.now(),
                          description: 'Fast-Pay UPI Wallet Deposit',
                          amount: Number(amount),
                          type: 'CREDIT',
                          status: 'SUCCESS',
                          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
                          reference: 'UPI_' + Math.floor(1000000000 + Math.random() * 9000000000)
                        };
                        setTransactions([newTx, ...transactions]);
                        showToast(`✓ Deposited ₹${amount} successfully!`);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                  >
                    + Add Funds
                  </button>

                  <button
                    onClick={() => {
                      if (walletBalance <= 0) {
                        alert('No withdrawable balance available.');
                        return;
                      }
                      showToast('Withdrawal request initiated to your linked UPI address.');
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Request Payout
                  </button>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="bg-white rounded-[12px] border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#D1D1D1]/60 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1F2937]">Transaction Ledger</h3>
                  <span className="text-xs text-gray-500">{transactions.length} Records</span>
                </div>

                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-gray-500">
                    No transactions recorded yet. Platform prize payouts and paid hosting entries will appear here.
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 flex items-center justify-between text-xs hover:bg-gray-50">
                        <div>
                          <p className="font-bold text-gray-900">{tx.description}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">{tx.reference} &bull; {tx.date}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className={`font-bold block ${tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {tx.type === 'CREDIT' ? '+' : ''}₹{Math.abs(tx.amount)}
                          </span>
                          <span className="text-[10px] text-emerald-600 uppercase font-semibold">{tx.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 7: BROADCAST & STREAMS
              ======================================================== */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs">
                <h2 className="text-lg font-bold text-[#1F2937]">Live Broadcast &amp; Stream Production Feed</h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Watch official tournament feeds with spectator telemetry overlays.
                </p>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl relative flex items-center justify-center">
                <img src="/assets/professional_quality_4k.jpg" alt="" className="size-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
                  <div className="size-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="material-symbols-outlined text-[28px]">play_arrow</span>
                  </div>
                  <h3 className="text-lg font-bold">Official LiveTournaments 1080p Stream</h3>
                  <p className="text-xs text-gray-300 max-w-md">
                    Matches are broadcast with caster commentary and real-time kill feed graphics.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ROOM CODE BRIEFING MODAL */}
      {selectedBriefing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#D1D1D1]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-[#1F2937] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#C5A059]">vpn_key</span>
                Match Room Key Briefing
              </h3>
              <button
                onClick={() => setSelectedBriefing(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-gray-600"><strong className="text-gray-900">Tournament:</strong> {selectedBriefing.title}</p>
              <p className="text-gray-600"><strong className="text-gray-900">Format:</strong> {selectedBriefing.format}</p>
              
              <div className="p-4 rounded-xl bg-gray-900 text-white space-y-2 font-mono mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Custom Room ID:</span>
                  <span className="text-[#DFBD78] font-bold text-sm">{selectedBriefing.roomCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Password:</span>
                  <span className="text-[#DFBD78] font-bold text-sm">{selectedBriefing.roomPass}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Assigned Slot:</span>
                  <span className="text-emerald-400 font-bold">{selectedBriefing.slotNumber}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                ⚠️ Fair Play Policy: Teaming or use of unauthorized third-party plugins results in immediate ban and forfeiture of prize pool.
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText?.(`Room ID: ${selectedBriefing.roomCode} | Pass: ${selectedBriefing.roomPass}`);
                showToast('✓ Credentials copied to clipboard!');
                setSelectedBriefing(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#1F2937] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Copy Credentials &amp; Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}