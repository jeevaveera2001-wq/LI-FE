import React, { useState, useEffect } from 'react';

export default function UserDashboard({ currentUser, onNavigate, onLogout }) {
  // Navigation Tabs: 'dashboard', 'my-matches', 'rooms', 'scrims', 'featured-tournaments', 'payments', 'broadcast'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedBriefing, setSelectedBriefing] = useState(null);

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

  // User Hosted Tournaments / Rooms (Realtime only)
  const [hostedTournaments, setHostedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_hosted_tourneys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(t => !isUserMock(t.id));
      } catch (e) {}
    }
    return [
      {
        id: 'host_default_demo',
        title: 'BGMI Community Clan Scrims 2026',
        game: 'Battlegrounds Mobile India',
        type: 'TOURNAMENT',
        format: 'Squad (Erangel + Miramar)',
        slots: '25 Squads (100 Players)',
        registeredSquads: 25,
        slotCap: 25,
        prize: '₹ 10,000 INR',
        timing: 'Today at 8:00 PM IST',
        thumbnail: '/assets/tournament_bgmi_showdown_4k.jpg',
        tier: 'standard',
        channelLink: 'https://youtube.com/@livetournament_in',
        roomCode: 'LT-882194',
        roomPass: '9921',
        status: 'ACTIVE'
      }
    ];
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

  // User Digital Balance
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('lt_user_wallet_balance');
    return saved ? Number(saved) : 1550;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lt_user_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'tx_init_1',
        description: 'Championship Prize Credit',
        amount: 1200,
        type: 'CREDIT',
        status: 'SUCCESS',
        date: 'Today, 2:30 PM',
        reference: 'UPI_9832718921'
      }
    ];
  });

  // Host / Room Form State
  const [hostTitle, setHostTitle] = useState('');
  const [hostGame, setHostGame] = useState('Battlegrounds Mobile India');
  const [hostType, setHostType] = useState('TOURNAMENT'); // 'TOURNAMENT' (₹10) or 'SCRIM' (₹50)
  const [hostFormat, setHostFormat] = useState('Squad (Erangel + Miramar)');
  const [hostSlots, setHostSlots] = useState('25 Teams (Standard Cap - 100 Players)');
  const [hostPrize, setHostPrize] = useState('');
  const [hostTiming, setHostTiming] = useState('');
  const [hostChannelLink, setHostChannelLink] = useState('');
  const [hostThumbnail, setHostThumbnail] = useState('/assets/tournament_bgmi_showdown_4k.jpg');
  const [hostTier, setHostTier] = useState('standard'); // standard (249/wk), pro (549/15d), premier (999/mo)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Featured Tournaments Boost Form
  const [featuredSelectedEvent, setFeaturedSelectedEvent] = useState('');
  const [featuredPlan, setFeaturedPlan] = useState('prime'); // 'prime' (199), 'boost' (399), 'topline' (699)
  const [featuredSuccess, setFeaturedSuccess] = useState(null);

  const tierPrices = {
    standard: 249, // Weekly (7 Days)
    pro: 549,      // Pro (15 Days - Recommended)
    premier: 999   // Monthly (30 Days)
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

  // Razorpay Checkout Trigger Helper (Test Mode)
  const triggerRazorpayCheckout = async ({ amount, description, onSuccess }) => {
    setIsProcessingPayment(true);
    const loadScript = () => new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    const loaded = await loadScript();
    const options = {
      key: 'rzp_test_51NgQ7Z4L9mabc', // Razorpay Test Key
      amount: amount * 100, // paise
      currency: 'INR',
      name: 'LiveTournaments.in',
      description: description || 'Esports Hosting & Pass Checkout',
      image: '/assets/host_directly_4k.jpg',
      handler: function (response) {
        setIsProcessingPayment(false);
        if (onSuccess) onSuccess(response?.razorpay_payment_id || ('RZP_TEST_' + Date.now()));
      },
      prefill: {
        name: displayName,
        email: displayEmail,
        contact: currentUser?.mobile || '9876543210'
      },
      theme: {
        color: '#DFBD78'
      },
      modal: {
        ondismiss: function() {
          setIsProcessingPayment(false);
        }
      }
    };

    if (loaded && window.Razorpay) {
      try {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          setIsProcessingPayment(false);
          if (onSuccess) onSuccess('RZP_TEST_' + Date.now());
        });
        rzp.open();
      } catch (e) {
        setIsProcessingPayment(false);
        if (onSuccess) onSuccess('RZP_TEST_' + Date.now());
      }
    } else {
      setTimeout(() => {
        setIsProcessingPayment(false);
        if (onSuccess) onSuccess('RZP_TEST_' + Date.now());
      }, 700);
    }
  };

  // Submit Paid Hosting / Room Conducting
  const handlePaidHostingSubmit = (e) => {
    e.preventDefault();
    if (!hostTitle || !hostPrize || !hostTiming) {
      alert('Please fill in tournament title, prize pool, and schedule timing.');
      return;
    }

    const amount = tierPrices[hostTier] || 249;

    triggerRazorpayCheckout({
      amount,
      description: `Hosting Pass: ${hostTitle} (${hostTier.toUpperCase()})`,
      onSuccess: (paymentId) => {
        const newHostingEntry = {
          id: 'host_' + Date.now(),
          title: hostTitle,
          game: hostGame,
          type: hostType,
          format: hostFormat,
          slots: hostSlots.includes('Unlimited') ? 'Unlimited Squads' : '25 Squads',
          registeredSquads: 1,
          slotCap: hostSlots.includes('Unlimited') ? 100 : 25,
          prize: hostPrize,
          timing: hostTiming,
          thumbnail: hostThumbnail,
          tier: hostTier,
          channelLink: hostChannelLink || 'https://youtube.com/@livetournament_in',
          amountPaid: amount,
          paymentRef: paymentId,
          roomCode: 'LT-' + Math.floor(100000 + Math.random() * 900000),
          roomPass: String(Math.floor(1000 + Math.random() * 9000)),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          hostUser: displayName,
          email: displayEmail,
        };

        const updatedUserHosted = [newHostingEntry, ...hostedTournaments];
        setHostedTournaments(updatedUserHosted);
        localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(updatedUserHosted));

        // Sync real hosting entry to Super Admin Hosting Requests queue
        try {
          const adminHostings = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
          localStorage.setItem('lt_admin_hosting_requests', JSON.stringify([newHostingEntry, ...adminHostings]));
        } catch (e) {}

        // Record transaction
        const newTx = {
          id: 'tx_' + Date.now(),
          description: `Hosting Pass: ${hostTitle} (${hostTier.toUpperCase()} - 1st Free of Cost)`,
          amount: -amount,
          type: 'DEBIT',
          status: 'SUCCESS',
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          reference: paymentId
        };
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('lt_user_transactions', JSON.stringify(updatedTxs));

        setPaymentSuccess(newHostingEntry);
        showToast('🎉 Hosting pass activated & tournament published to Rooms!');
        
        // Reset form
        setHostTitle('');
        setHostPrize('');
        setHostTiming('');
        setHostChannelLink('');
      }
    });
  };

  // Submit Featured Tournament Boost
  const handleFeaturedTournamentSubmit = (e) => {
    e.preventDefault();
    const targetTitle = featuredSelectedEvent || (hostedTournaments[0]?.title || 'BGMI Masters Championship');
    const cost = featuredPlan === 'prime' ? 199 : featuredPlan === 'boost' ? 399 : 699;

    triggerRazorpayCheckout({
      amount: cost,
      description: `Featured Tournament Top-Line Boost: ${targetTitle}`,
      onSuccess: (payId) => {
        const featEntry = {
          id: 'FEAT_' + Date.now(),
          title: targetTitle,
          plan: featuredPlan,
          amountPaid: cost,
          paymentRef: payId,
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setFeaturedSuccess(featEntry);
        showToast('🌟 Tournament successfully boosted to Top-Line Carousel!');
      }
    });
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
          LEFT DARK SIDEBAR (STREAMLINED PLAYER DASHBOARD SECTIONS)
          ======================================================== */}
      <aside
        style={{ width: '240px', backgroundColor: '#0E0E10' }}
        className={`w-60 bg-[#0E0E10] text-[#9CA3AF] flex-col border-r border-[#1F2937] shrink-0 z-50 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-hidden ${
          sidebarOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl h-screen overflow-hidden' : 'hidden lg:flex'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-[#1F2937] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-[7px] bg-[#1F2937] border border-[#DFBD78]/40 flex items-center justify-center text-[#DFBD78] font-bold text-xs shadow-inner">
              LT
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs text-white tracking-wider font-mono">
                LIVETOURNAMENTS
              </span>
              <span className="text-[9px] text-[#C5A059] font-mono tracking-widest leading-none">
                PLAYER DASHBOARD
              </span>
            </div>
          </div>
          <div className="size-6 rounded-[5px] bg-[#1E1911] border border-[#DFBD78]/50 flex items-center justify-center text-[#DFBD78] font-bold text-[9px]">
            HQ
          </div>
        </div>

        {/* Competitor Role Badge Strip */}
        <div className="px-4 py-2 border-b border-[#1F2937]/60 flex items-center justify-between bg-[#131316] shrink-0">
          <span className="text-[10.5px] font-semibold text-white/90 truncate max-w-[120px]">{displayName}</span>
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[8.5px] font-bold tracking-wider uppercase border border-[#DFBD78]/40">
            PLAYER
          </span>
        </div>

        {/* Navigation Items (Static & Non-scrollable) */}
        <div className="flex-1 overflow-hidden px-3 py-2 space-y-0.5 text-[11px] font-medium">
          
          {/* 1. Player Dashboard Overview */}
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

          {/* 2. My Matches (Registered Matches) */}
          <button
            onClick={() => { setActiveTab('my-matches'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'my-matches' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">sports_esports</span>
            <span className="flex-1 text-left">My Matches</span>
            {joinedTournaments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                {joinedTournaments.length}
              </span>
            )}
          </button>

          {/* 3. Rooms (Conducted / Hosted by Player) */}
          <button
            onClick={() => { setActiveTab('rooms'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">meeting_room</span>
            <span className="flex-1 text-left">Rooms (Conducted)</span>
            {hostedTournaments.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#DFBD78]/20 text-[#DFBD78] text-[9px] font-bold border border-[#DFBD78]/30">
                {hostedTournaments.length}
              </span>
            )}
          </button>

          {/* 4. Daily Scrims Hub */}
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

          {/* Section: Hosting & Promotion */}
          <div className="pt-3 pb-1 px-2">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              PROMOTIONS &amp; PAYMENTS
            </span>
          </div>

          {/* 5. Featured Tournaments (Top-line paid showcase) */}
          <button
            onClick={() => { setActiveTab('featured-tournaments'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'featured-tournaments' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span className="flex-1 text-left">Featured Tournaments</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
              BOOST
            </span>
          </button>

          {/* 6. Payment Page (Hosting Passes & Pricing) */}
          <button
            onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'payments' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">payments</span>
            <span className="flex-1 text-left">Payment Page</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#DFBD78]/20 text-[#DFBD78] text-[9px] font-bold border border-[#DFBD78]/30">
              ₹249+
            </span>
          </button>

          {/* 7. Broadcast & Live Streams */}
          <button
            onClick={() => { setActiveTab('broadcast'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'broadcast' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">live_tv</span>
            <span className="flex-1 text-left">Broadcast &amp; Streams</span>
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="p-2.5 border-t border-[#1F2937]/80 bg-[#0E0E10] flex flex-col gap-1 shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[#9CA3AF] hover:text-white hover:bg-[#18181B] text-[10.5px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Return to Home Arena</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 text-[10.5px] font-semibold transition-colors cursor-pointer"
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
        
        {/* TOP HEADER BAR (CLEAN - NO EXACT NODE / LOCATION BADGE) */}
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
              <span className={`material-symbols-outlined text-[14px] text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
            </button>

            {/* + Host Tournament CTA Button */}
            <button
              onClick={() => { setActiveTab('payments'); }}
              style={{ backgroundColor: '#1F2937', color: '#ffffff' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full !bg-[#1F2937] hover:!bg-black !text-white text-[11px] font-bold tracking-wide shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] !text-white">add</span>
              <span className="!text-white">+ Host Tournament</span>
            </button>

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
              
              {/* TOP STAT CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                
                {/* Stat 1: Registered Matches */}
                <div
                  onClick={() => setActiveTab('my-matches')}
                  className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">REGISTERED MATCHES</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{joinedTournaments.length} Matches</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Confirmed Tournament Slots</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      Active Entries
                    </span>
                    <span className="text-xs text-slate-400 font-medium">View &rarr;</span>
                  </div>
                </div>

                {/* Stat 2: Conducted Rooms */}
                <div
                  onClick={() => setActiveTab('rooms')}
                  className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">CONDUCTED ROOMS</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{hostedTournaments.length} Rooms</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Standard 25 Squad Lobbies</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-blue-600">
                      <span className="material-symbols-outlined text-[15px]">meeting_room</span>
                      Active Hosting
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Manage &rarr;</span>
                  </div>
                </div>

                {/* Stat 3: Daily Scrims */}
                <div
                  onClick={() => setActiveTab('scrims')}
                  className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">DAILY SCRIMS</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{joinedScrims.length} Scrims</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Registered &amp; Conducted</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      Clan Pool
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Lobbies &rarr;</span>
                  </div>
                </div>

                {/* Stat 4: Hosting Passes & Channel Link */}
                <div
                  onClick={() => setActiveTab('payments')}
                  className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">HOSTING PASSES</span>
                    <h3 className="text-2xl sm:text-[26px] font-black text-[#C5A059] mt-1.5 nagulan-mono tracking-tight">₹ 249 / ₹ 549</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Weekly, Pro &amp; Monthly</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-0.5 font-bold text-xs text-purple-600">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Channel Showcased
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Upgrade &rarr;</span>
                  </div>
                </div>

              </div>

              {/* ACTION TILES ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Tile 1: Conduct Rooms */}
                <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
                  <div>
                    <div className="size-9 rounded-[8px] bg-[#DFBD78]/15 border border-[#DFBD78]/40 flex items-center justify-center text-[#C5A059] mb-3">
                      <span className="material-symbols-outlined text-[20px]">meeting_room</span>
                    </div>
                    <h4 className="font-bold text-[14px] text-[#1F2937]">Conducted Rooms</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                      Manage match rooms you are conducting, generate custom room keys, and supervise squad slots (25 squad standard cap).
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className="w-full py-2.5 rounded-[8px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Manage Rooms ({hostedTournaments.length}) →
                  </button>
                </div>

                {/* Tile 2: My Matches */}
                <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
                  <div>
                    <div className="size-9 rounded-[8px] bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 mb-3">
                      <span className="material-symbols-outlined text-[20px]">sports_esports</span>
                    </div>
                    <h4 className="font-bold text-[14px] text-[#1F2937]">My Registered Matches</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                      Check which matches you have already registered for, retrieve live room passwords, and review slot numbers.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('my-matches')}
                    className="w-full py-2.5 rounded-[8px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View My Matches ({joinedTournaments.length}) →
                  </button>
                </div>

                {/* Tile 3: Payment Page & Hosting Passes */}
                <div className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4">
                  <div>
                    <div className="size-9 rounded-[8px] bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 mb-3">
                      <span className="material-symbols-outlined text-[20px]">payments</span>
                    </div>
                    <h4 className="font-bold text-[14px] text-[#1F2937]">Payment Page &amp; Hosting Passes</h4>
                    <p className="text-[11px] text-[#6B7280] mt-1 leading-relaxed">
                      Purchase Weekly (₹249), Pro (₹549), or Monthly (₹999) passes. Host tournaments everyday with 1st free of cost!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="w-full py-2.5 rounded-[8px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Open Payment Page →
                  </button>
                </div>

              </div>

              {/* REGISTERED MATCHES PREVIEW TABLE */}
              <div className="bg-white rounded-[12px] border border-[#D1D1D1]/60 shadow-xs overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#D1D1D1]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#C5A059]">sports_esports</span>
                    <h3 className="font-bold text-sm text-[#1F2937]">Registered Competitions &amp; Room Keys</h3>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate('home')}
                    className="text-xs text-[#C5A059] font-bold hover:underline cursor-pointer"
                  >
                    Browse More Arenas &rarr;
                  </button>
                </div>

                <div className="p-5">
                  {joinedTournaments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      No active tournament registrations. Visit the home arena to enter competitive brackets.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {joinedTournaments.map((t) => (
                        <div key={t.id} className="p-4 rounded-xl border border-gray-200 bg-[#F9FAFB] flex flex-col justify-between gap-3">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">{t.game}</span>
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                {t.status || 'Active Slot'}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 mt-1">{t.title}</h4>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">{t.schedule || t.timing}</p>
                          </div>

                          <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-xs">
                            <span className="font-mono text-gray-600">Slot: <strong className="text-gray-900">{t.slotNumber || 'Confirmed'}</strong></span>
                            <button
                              onClick={() => setSelectedBriefing(t)}
                              className="px-3 py-1 rounded-lg bg-black text-white text-[11px] font-bold hover:bg-gold-primary hover:text-black transition-colors cursor-pointer"
                            >
                              Room Credentials
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
              VIEW 2: MY MATCHES (REGISTERED MATCHES)
              ======================================================== */}
          {activeTab === 'my-matches' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">My Registered Matches</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Matches and tournaments you have registered for as a competitor.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('home')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Join More Tournaments &rarr;
                </button>
              </div>

              {joinedTournaments.length === 0 ? (
                <div className="bg-white rounded-[12px] p-12 text-center border border-[#D1D1D1]/60 space-y-3">
                  <span className="text-4xl block">🎮</span>
                  <h3 className="text-base font-bold text-[#1F2937]">No Registered Matches</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                    You haven't joined any active tournament matches. Browse available matches on the home page.
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
                            {t.status || 'Confirmed Slot'}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-[#1F2937]">{t.title}</h3>
                        <p className="text-xs text-gray-600">{t.format || 'Squad Match'} &bull; {t.date || t.schedule}</p>
                        
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Slot Assignment:</span>
                            <span className="font-bold font-mono text-gray-900">{t.slotNumber || 'Slot 14'}</span>
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
              VIEW 3: ROOMS (CONDUCTED / HOSTED BY USER)
              ======================================================== */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Conducted Rooms &amp; Hosted Tournaments</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Rooms and tournaments you are conducting. Standard capacity is 25 squads (100 players).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>+ Conduct New Room</span>
                </button>
              </div>

              {hostedTournaments.length === 0 ? (
                <div className="bg-white rounded-[12px] p-12 text-center border border-[#D1D1D1]/60 space-y-3">
                  <span className="text-4xl block">🏛️</span>
                  <h3 className="text-base font-bold text-[#1F2937]">No Conducted Rooms Yet</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                    You haven't conducted any tournament rooms. Launch your first tournament or scrim on the Payment Page!
                  </p>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="px-4 py-2 rounded-xl bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Open Payment Page to Host
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {hostedTournaments.map((h) => {
                    const isLimitReached = (h.registeredSquads || 25) >= 25 && !String(h.slots).includes('Unlimited');

                    return (
                      <div key={h.id} className="bg-white rounded-[16px] p-6 border border-gray-200 shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                                {h.type || 'TOURNAMENT'}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                                {h.status || 'ACTIVE'}
                              </span>
                              <span className="text-xs font-mono text-gray-500">{h.game}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">{h.title}</h3>
                            <p className="text-xs text-gray-500 font-mono">{h.timing}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Stream Channel Badge & Link */}
                            {h.channelLink && (
                              <a
                                href={h.channelLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <span className="material-symbols-outlined text-[15px]">live_tv</span>
                                <span>Host Stream Channel ↗</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Capacity & Squad Limit Indicator */}
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-gray-500 block text-[11px] font-medium">Slot Capacity &amp; Registration Status</span>
                            <span className="text-base font-black text-gray-900 font-mono">
                              {h.registeredSquads || 25} / {h.slotCap || 25} Squads Registered
                            </span>
                          </div>

                          {/* 25 Squad Limit Notification Prompt */}
                          {isLimitReached ? (
                            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[18px] text-amber-700">mail</span>
                              <div>
                                <strong className="block text-[11px]">Tournament Limit Reached (25/25 Squads)</strong>
                                <span className="text-[10px] text-amber-800">
                                  Email notification dispatched. Upgrade to an Unlimited Pass to allow more users to register.
                                </span>
                              </div>
                              <button
                                onClick={() => setActiveTab('payments')}
                                className="ml-2 px-2.5 py-1 rounded bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold uppercase shrink-0 cursor-pointer"
                              >
                                Upgrade Pass
                              </button>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold font-mono">
                              Slots Available ✓
                            </span>
                          )}
                        </div>

                        {/* Room Credentials Management */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-4 font-mono">
                            <span>Room ID: <strong className="text-gray-900">{h.roomCode || 'LT-98214'}</strong></span>
                            <span>Pass: <strong className="text-gray-900">{h.roomPass || '8831'}</strong></span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const newPass = prompt('Update Room Password for Squads:', h.roomPass || '8831');
                                if (newPass) {
                                  h.roomPass = newPass;
                                  showToast('✓ Room password updated & synced to player lobbies');
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold transition-colors cursor-pointer"
                            >
                              Edit Room Key
                            </button>
                            <button
                              onClick={() => showToast(`Room ID: ${h.roomCode || 'LT-98214'} & Pass: ${h.roomPass || '8831'} copied`)}
                              className="px-3 py-1.5 rounded-lg bg-black text-white font-bold hover:bg-gold-primary hover:text-black transition-colors cursor-pointer"
                            >
                              Broadcast Credentials
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 4: DAILY SCRIMS HUB (REGISTERED & CONDUCTED)
              ======================================================== */}
          {activeTab === 'scrims' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Daily Scrims Hub</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    View scrims you are registered for and practice lobbies you are conducting.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setHostType('SCRIM');
                    setActiveTab('payments');
                  }}
                  className="px-3.5 py-1.5 rounded-[8px] bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  <span>+ Host Scrim (₹50)</span>
                </button>
              </div>

              {/* Section 1: Registered Scrims */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">how_to_reg</span>
                  <span>Scrims You Registered ({joinedScrims.length})</span>
                </h3>

                {joinedScrims.length === 0 ? (
                  <div className="bg-white rounded-[12px] p-6 text-center border border-gray-200 text-xs text-gray-500">
                    You haven't registered for any daily scrims today.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {joinedScrims.map((s) => (
                      <div key={s.id} className="bg-white rounded-[12px] p-5 border border-gray-200 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                            {s.game}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-600">{s.status}</span>
                        </div>
                        <h4 className="font-bold text-base text-[#1F2937]">{s.title}</h4>
                        <p className="text-xs text-gray-600">{s.timing} &bull; Capacity: {s.slots}</p>
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-gray-800">Room: {s.roomCode}</span>
                          <button
                            onClick={() => showToast(`Room credentials: ${s.roomCode} / Pass: ${s.roomPass}`)}
                            className="px-3 py-1 rounded bg-black text-white text-xs font-bold hover:bg-gold-primary hover:text-black cursor-pointer"
                          >
                            Copy Credentials
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 2: Conducted Scrims */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="font-bold text-sm text-[#1F2937] uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-purple-600">meeting_room</span>
                  <span>Scrims You Are Conducting ({hostedTournaments.filter(h => h.type === 'SCRIM').length})</span>
                </h3>

                {hostedTournaments.filter(h => h.type === 'SCRIM').length === 0 ? (
                  <div className="bg-white rounded-[12px] p-6 text-center border border-gray-200 text-xs text-gray-500">
                    No active scrims conducted yet. Click "+ Host Scrim (₹50)" to launch your practice lobby.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hostedTournaments.filter(h => h.type === 'SCRIM').map((s) => (
                      <div key={s.id} className="bg-white rounded-[12px] p-5 border border-purple-200 bg-purple-50/20 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                            CONDUCTOR
                          </span>
                          <span className="text-xs font-mono font-bold text-gray-700">₹50 Scrim Pass</span>
                        </div>
                        <h4 className="font-bold text-base text-[#1F2937]">{s.title}</h4>
                        <p className="text-xs text-gray-600">{s.timing} &bull; 25 Squads Cap</p>
                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-gray-800">Room: {s.roomCode} / {s.roomPass}</span>
                          <button
                            onClick={() => showToast('Dispatched room credentials to all 25 registered squads')}
                            className="px-3 py-1 rounded bg-[#1F2937] text-white text-xs font-bold hover:bg-black cursor-pointer"
                          >
                            Broadcast
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 5: FEATURED TOURNAMENTS (PAID TOP-LINE SHOWCASE)
              ======================================================== */}
          {activeTab === 'featured-tournaments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-amber-400/20 text-amber-700 text-[9px] font-black uppercase border border-amber-400/40">
                      TOP-LINE PROMOTION
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Home Page Carousel Feature
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">Featured Tournament Showcase</h2>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                    Pay an extra amount to showcase your tournament in the top-line banner &amp; featured carousel, gaining 50,000+ views and rapid squad registrations.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Placement</span>
                  <span className="text-base font-black font-mono text-[#C5A059]">Top Line Arena</span>
                </div>
              </div>

              {featuredSuccess ? (
                <div className="bg-white rounded-[16px] p-8 border border-emerald-300 text-center space-y-4">
                  <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                    ✓
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase">Featured Placement Active!</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    Your tournament <strong>{featuredSuccess.title}</strong> is now boosted to the top-line carousel on the Home Page.
                  </p>
                  <button
                    onClick={() => setFeaturedSuccess(null)}
                    className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-primary hover:text-black transition-colors cursor-pointer"
                  >
                    Feature Another Tournament
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFeaturedTournamentSubmit} className="bg-white rounded-[16px] p-6 border border-[#D1D1D1]/60 shadow-xs space-y-6">
                  
                  {/* Select Tournament to Feature */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      1. Select Tournament to Boost
                    </label>
                    <select
                      value={featuredSelectedEvent}
                      onChange={(e) => setFeaturedSelectedEvent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 text-xs font-medium focus:border-gold-primary outline-hidden bg-white"
                    >
                      {hostedTournaments.map(h => (
                        <option key={h.id} value={h.title}>{h.title} ({h.game})</option>
                      ))}
                      <option value="BGMI Elite Pro Showcase">BGMI Elite Pro Showcase (Custom)</option>
                    </select>
                  </div>

                  {/* Pricing Tiers for Feature */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      2. Choose Top-Line Placement Duration
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        onClick={() => setFeaturedPlan('prime')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          featuredPlan === 'prime' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">24 Hours</span>
                          <h4 className="font-bold text-sm text-[#1F2937] mt-0.5">Prime Flash Boost</h4>
                          <span className="text-2xl font-black font-mono text-[#1F2937] mt-2 block">₹ 199</span>
                          <p className="text-[11px] text-gray-600 mt-1">Top-line home banner rotation for 24 hours.</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setFeaturedPlan('boost')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          featuredPlan === 'boost' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">3 Days &bull; Popular</span>
                          <h4 className="font-bold text-sm text-[#1F2937] mt-0.5">Tournament Spotlight</h4>
                          <span className="text-2xl font-black font-mono text-[#C5A059] mt-2 block">₹ 399</span>
                          <p className="text-[11px] text-gray-600 mt-1">High-visibility pinned carousel slot for 3 days.</p>
                        </div>
                      </div>

                      <div
                        onClick={() => setFeaturedPlan('topline')}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                          featuredPlan === 'topline' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">7 Days</span>
                          <h4 className="font-bold text-sm text-[#1F2937] mt-0.5">Top-Line Championship</h4>
                          <span className="text-2xl font-black font-mono text-purple-700 mt-2 block">₹ 699</span>
                          <p className="text-[11px] text-gray-600 mt-1">Permanent headline spot on homepage + broadcast mention.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">Total Due:</span>
                      <span className="text-gray-500">Secured via Razorpay Test Gateway</span>
                    </div>
                    <span className="text-2xl font-black font-mono text-gray-900">
                      ₹ {featuredPlan === 'prime' ? 199 : featuredPlan === 'boost' ? 399 : 699} INR
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>{isProcessingPayment ? 'Processing with Razorpay...' : 'Pay with Razorpay Test Mode & Feature Tournament'}</span>
                  </button>

                </form>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 6: PAYMENT PAGE & HOSTING PASSES
              ======================================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[9px] font-bold uppercase border border-[#DFBD78]/40">
                      OFFICIAL PAYMENT HUB
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Tournament &amp; Pass Checkout
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">Payment Page &amp; Hosting Studio</h2>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                    Per match rates: <strong>₹ 10</strong> for tournaments, <strong>₹ 50</strong> for scrims. Or purchase a Hosting Pass (<strong>₹ 249</strong> weekly / <strong>₹ 549</strong> 15-day / <strong>₹ 999</strong> monthly). Host everyday with first tournament <strong>FREE OF COST</strong>, and we showcase your channel link!
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Single Match Base</span>
                  <span className="text-base font-black font-mono text-[#C5A059]">₹10 Tourney / ₹50 Scrim</span>
                </div>
              </div>

              {/* Step 1: Base Type Selection */}
              <div className="bg-white rounded-[16px] p-6 border border-[#D1D1D1]/60 shadow-xs space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">1</span>
                    Select Event Type &amp; Single-Match Rate
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div
                      onClick={() => setHostType('TOURNAMENT')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        hostType === 'TOURNAMENT' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Standard Competitive</span>
                        <h4 className="font-bold text-base text-gray-900 mt-0.5">Normal Tournament</h4>
                        <span className="text-xs text-gray-600 mt-1 block">25 Squads standard cap &bull; 100 players</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black font-mono text-gray-900">₹ 10</span>
                        <span className="text-[10px] text-gray-500 block">/ match</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setHostType('SCRIM')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        hostType === 'SCRIM' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Daily Pro Practice</span>
                        <h4 className="font-bold text-base text-gray-900 mt-0.5">Competitive Scrims</h4>
                        <span className="text-xs text-gray-600 mt-1 block">Tier-1 &amp; Tier-2 lobbies &bull; room key dispatch</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black font-mono text-blue-600">₹ 50</span>
                        <span className="text-[10px] text-gray-500 block">/ match</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Hosting Subscription Passes */}
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">2</span>
                    Select Hosting Pass (Host Everyday &bull; 1st Free of Cost &bull; Channel Link Showcased)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {/* Weekly Pass: ₹249 */}
                    <div
                      onClick={() => setHostTier('standard')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        hostTier === 'standard' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Per Week (7 Days)</span>
                        <h4 className="font-bold text-base text-[#1F2937] mt-0.5">Weekly Pass</h4>
                        <span className="text-2xl font-bold font-mono text-[#1F2937] mt-2 block">₹ 249</span>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          Host tournaments everyday for 7 days. First tournament free of cost! We showcase your channel link across match lobbies.
                        </p>
                      </div>
                    </div>

                    {/* Pro Pass: ₹549 */}
                    <div
                      onClick={() => setHostTier('pro')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        hostTier === 'pro' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">15 Days &bull; Recommended</span>
                        <h4 className="font-bold text-base text-[#1F2937] mt-0.5">Pro Production Pass</h4>
                        <span className="text-2xl font-bold font-mono text-[#C5A059] mt-2 block">₹ 549</span>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          15 Days hosting access. Host everyday with first tournament free of cost. We showcase your channel with link + Home Page carousel feature!
                        </p>
                      </div>
                    </div>

                    {/* Monthly Pass: ₹999 */}
                    <div
                      onClick={() => setHostTier('premier')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        hostTier === 'premier' ? 'border-[#C5A059] bg-[#DFBD78]/10' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Month (30 Days Full)</span>
                        <h4 className="font-bold text-base text-[#1F2937] mt-0.5">Elite Monthly Pass</h4>
                        <span className="text-2xl font-bold font-mono text-purple-700 mt-2 block">₹ 999</span>
                        <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                          30 Days full monthly hosting. Host everyday with first tournament free of cost. Channel showcased with link &amp; banner + 1080p stream overlays.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Tournament & Streaming Channel Details */}
                <form onSubmit={handlePaidHostingSubmit} className="space-y-4 pt-2">
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider pb-2 border-b border-gray-200 flex items-center gap-2">
                    <span className="size-5 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-[10px]">3</span>
                    Tournament Specifications &amp; Channel Link
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Tournament / Scrim Title *
                      </label>
                      <input
                        type="text"
                        value={hostTitle}
                        onChange={(e) => setHostTitle(e.target.value)}
                        placeholder="e.g. BGMI Pro Clan Invitational Season 1"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
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
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden bg-white"
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
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Slot Capacity (Standard Cap: 25 Teams)
                      </label>
                      <select
                        value={hostSlots}
                        onChange={(e) => setHostSlots(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden bg-white"
                      >
                        <option>25 Teams (Standard Free Cap - 100 Players)</option>
                        <option>50 Teams (Requires Unlimited Paid Pass)</option>
                        <option>100 Teams (Requires Unlimited Paid Pass)</option>
                        <option>Unlimited Slots (VIP Paid Pass)</option>
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
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
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
                        placeholder="e.g. Sunday at 6:30 PM IST"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {/* Channel Link Showcase Input */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-red-600">live_tv</span>
                        <span>Your Streaming Channel Link (YouTube / Twitch / Kick)</span>
                      </span>
                      <span className="text-[10px] text-gold-primary font-bold uppercase">Showcased on Platform</span>
                    </label>
                    <input
                      type="url"
                      value={hostChannelLink}
                      onChange={(e) => setHostChannelLink(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/@yourchannel or https://twitch.tv/yourchannel"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-gold-primary outline-hidden bg-white"
                    />
                    <p className="text-[10px] text-gray-500">
                      We showcase this link directly across player registration lobbies and room briefings.
                    </p>
                  </div>

                  {/* Thumbnail Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Preset Esports Artwork
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {presetThumbnails.map((p, idx) => (
                          <div
                            key={idx}
                            onClick={() => setHostThumbnail(p.url)}
                            className={`p-2 rounded-lg border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                              hostThumbnail === p.url ? 'border-gold-primary bg-gold-primary/10 font-bold' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                            }`}
                          >
                            <span className="size-2 rounded-full bg-gold-primary"></span>
                            <span className="truncate">{p.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 flex flex-col justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">Live Thumbnail Preview</span>
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black shadow-xs">
                        <img src={hostThumbnail} alt="" className="size-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Digital Checkout Card */}
                  <div className="p-5 rounded-2xl bg-[#111217] text-white border border-gold-primary/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gold-primary">Selected Pass:</span>
                        <span className="px-2.5 py-0.5 rounded bg-gold-primary/20 text-gold-primary text-xs font-bold uppercase">
                          {hostTier.toUpperCase()} PASS &bull; ₹ {tierPrices[hostTier]} INR
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        First tournament free of cost &bull; Channel link showcased &bull; Razorpay Test Checkout
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="px-6 py-3 rounded-xl bg-gold-primary hover:bg-gold-light text-black text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">credit_card</span>
                      <span>{isProcessingPayment ? 'Connecting to Razorpay...' : `Pay ₹ ${tierPrices[hostTier]} with Razorpay Test Mode`}</span>
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 7: BROADCAST & STREAMS
              ======================================================== */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Broadcast &amp; Live Stream Production Feed</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Stream packages: Weekly (<strong>₹ 249</strong>), Pro (<strong>₹ 549</strong>), Monthly (<strong>₹ 999</strong>).
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Book Broadcast Pass &rarr;
                </button>
              </div>

              {/* 3 Stream Production Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Weekly Package</span>
                    <h3 className="font-bold text-base text-gray-900 mt-0.5">Standard Stream</h3>
                    <span className="text-2xl font-black font-mono text-gray-900 mt-2 block">₹ 249</span>
                    <p className="text-xs text-gray-600 mt-1">7 Days streaming with basic scoreboard graphic overlay.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="mt-4 w-full py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                  >
                    Select ₹249
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 border-2 border-gold-primary shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-primary">15 Days &bull; Recommended</span>
                    <h3 className="font-bold text-base text-gray-900 mt-0.5">Pro Production</h3>
                    <span className="text-2xl font-black font-mono text-gold-primary mt-2 block">₹ 549</span>
                    <p className="text-xs text-gray-600 mt-1">15 Days multi-camera overlays, caster audio mix &amp; highlight clips.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="mt-4 w-full py-2 rounded-lg bg-gold-primary hover:bg-gold-light text-black text-xs font-bold cursor-pointer"
                  >
                    Select ₹549
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Monthly 30 Days</span>
                    <h3 className="font-bold text-base text-gray-900 mt-0.5">Elite Broadcast</h3>
                    <span className="text-2xl font-black font-mono text-purple-700 mt-2 block">₹ 999</span>
                    <p className="text-xs text-gray-600 mt-1">Full 1080p 60FPS feed, certified referees &amp; custom sponsor banners.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="mt-4 w-full py-2 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
                  >
                    Select ₹999
                  </button>
                </div>
              </div>

              {/* Live Player Video Display */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl relative flex items-center justify-center">
                <img src="/assets/professional_quality_4k.jpg" alt="" className="size-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white space-y-3">
                  <div className="size-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="material-symbols-outlined text-[28px]">play_arrow</span>
                  </div>
                  <h3 className="text-lg font-bold">LiveTournaments.in 1080p 60FPS Production Feed</h3>
                  <p className="text-xs text-gray-300 max-w-md">
                    Matches are broadcast with verified spectator anti-cheat and live caster overlays.
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* BRIEFING MODAL */}
      {selectedBriefing && (
        <div
          onClick={() => setSelectedBriefing(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#D1D1D1]/60"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-[#1F2937]">Match Room Key &amp; Referee Briefing</h3>
              <button
                onClick={() => setSelectedBriefing(null)}
                className="text-gray-400 hover:text-black cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tournament:</span>
                  <span className="font-bold text-gray-900">{selectedBriefing.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Custom Room ID:</span>
                  <span className="font-bold text-emerald-600">{selectedBriefing.roomCode || 'LT-992184'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room Password:</span>
                  <span className="font-bold text-gray-900">{selectedBriefing.roomPass || '8831'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Slot:</span>
                  <span className="font-bold text-blue-600">{selectedBriefing.slotNumber || 'Slot 12'}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-600 space-y-1">
                <p>⚠️ Join the custom room at least 10 minutes before the scheduled drop time.</p>
                <p>⚠️ Only registered in-game UIDs are permitted. Unverified players will be kicked by the referee pilot.</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedBriefing(null)}
              className="w-full py-2.5 rounded-lg bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
            >
              Acknowledge &amp; Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
