import React, { useState, useEffect } from 'react';

export default function UserDashboard({ currentUser, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('my-tournaments');
  const [selectedBriefing, setSelectedBriefing] = useState(null);

  // Joined Tournaments (User Registrations) - Starts clean from localStorage
  const [joinedTournaments, setJoinedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_joined_tourneys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // User Hosted Tournaments - Starts clean from localStorage
  const [hostedTournaments, setHostedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_hosted_tourneys');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // User Scrims - Starts clean from localStorage
  const [joinedScrims, setJoinedScrims] = useState(() => {
    const saved = localStorage.getItem('lt_user_scrims');
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

  // Host Form State
  const [hostTitle, setHostTitle] = useState('');
  const [hostGame, setHostGame] = useState('Battlegrounds Mobile India');
  const [hostType, setHostType] = useState('TOURNAMENT');
  const [hostFormat, setHostFormat] = useState('Squad (Erangel + Miramar)');
  const [hostSlots, setHostSlots] = useState('64 Teams');
  const [hostPrize, setHostPrize] = useState('');
  const [hostTiming, setHostTiming] = useState('');
  const [hostThumbnail, setHostThumbnail] = useState('/tournament_bgmi_showdown_4k.jpg');
  const [hostTier, setHostTier] = useState('standard'); // standard (199), pro (499), premier (999)
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, NETBANKING
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const tierPrices = {
    standard: 199,
    pro: 499,
    premier: 999
  };

  const presetThumbnails = [
    { name: 'BGMI Showdown 4K', url: '/tournament_bgmi_showdown_4k.jpg' },
    { name: 'BGMI LAN Warriors', url: '/tournament_bgmi_lan_warriors_4k.jpg' },
    { name: 'PUBG Ultimate Squad', url: '/tournament_pubg_ultimate_squad_4k.jpg' },
    { name: 'Championship Trophy Stage', url: '/lt_trophy_stage_4k.jpg' },
    { name: 'Pro Esports Arena', url: '/professional_quality_4k.jpg' },
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
    if (!hostThumbnail) {
      alert('A thumbnail banner image is required to submit your tournament for verification.');
      return;
    }

    setIsProcessingPayment(true);

    setTimeout(() => {
      const txnId = 'LT-TXN-' + Math.floor(100000 + Math.random() * 900000);
      const feePaid = tierPrices[hostTier];
      
      const newHostingEntry = {
        id: 'req_user_' + Date.now(),
        title: hostTitle,
        organizer: currentUser?.name || currentUser?.username || 'Community Organizer',
        clan: currentUser?.clan || 'Independent Clan',
        game: hostGame,
        format: hostFormat,
        slots: hostSlots,
        timing: hostTiming,
        prizePool: hostPrize,
        entryFee: hostTier === 'standard' ? 'Free Entry' : '₹50 / team',
        email: currentUser?.email || 'user@livetournaments.in',
        mobile: currentUser?.mobile || '+91 98765 43210',
        thumbnail: hostThumbnail,
        status: 'PENDING',
        requestedAt: 'Just now',
        tier: hostTier,
        paidFee: `₹${feePaid}`,
        txnId: txnId,
        paymentMethod: paymentMethod
      };

      // 1. Save to user's hosted list
      const updatedUserHosted = [newHostingEntry, ...hostedTournaments];
      setHostedTournaments(updatedUserHosted);
      localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(updatedUserHosted));

      // 2. Submit directly into Super Admin's queue with thumbnail!
      try {
        const adminQueue = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
        const updatedAdminQueue = [newHostingEntry, ...adminQueue];
        localStorage.setItem('lt_admin_hosting_requests', JSON.stringify(updatedAdminQueue));
      } catch (err) {
        console.error('Failed to sync to admin queue:', err);
      }

      setIsProcessingPayment(false);
      setPaymentSuccess({
        txnId,
        amount: feePaid,
        title: hostTitle,
        method: paymentMethod
      });
      showToast('🎉 Hosting fee paid! Request submitted to Super Admin with your thumbnail.');

      // Reset form
      setHostTitle('');
      setHostPrize('');
      setHostTiming('');
    }, 1500);
  };

  const displayName = currentUser?.name || currentUser?.username || 'Competitor';
  const displayEmail = currentUser?.email || 'user@livetournaments.in';

  return (
    <section className="relative block-default-horizontal-spacing block-default-vertical-spacing w-full bg-[#FAFAFA] min-h-screen">
      <div className="block-default-content-width mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#1F2937] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="flex items-center gap-1.5 text-dark-default hover:text-gold-primary primary-bold-s12-lh120 uppercase transition-colors cursor-pointer"
          >
            <span>← Home Arena</span>
          </button>
          <span className="text-[#858585]">&bull;</span>
          <span className="primary-bold-s12-lh120 uppercase tracking-wider text-gold-primary">
            Player Hub & Live Dashboard
          </span>
        </div>

        {/* User Profile Header Card */}
        <div className="rounded-2xl lg:rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-[#EBEBEB]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="text-dark-default section-title flex flex-col gap-1 text-left">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gold-primary/10 border border-gold-primary/30 text-gold-primary primary-bold-s10-lh130 uppercase tracking-wider">
                  👤 Verified Competitor
                </span>
                <span className="primary-regular-s12-lh130 text-[#858585]">
                  Role: User &bull; {displayEmail}
                </span>
              </div>
              <h1 className="font-heading primary-bold-s28-lh120 md:primary-bold-s36-lh120 uppercase tracking-tight text-gray-900 mt-1">
                Welcome, {displayName}
              </h1>
              <p className="primary-regular-s14-lh140 text-[#6B7280]">
                Live competitive tournament terminal. Host paid custom tournaments, participate in daily scrims, and manage your digital winnings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('host-studio')}
                className="px-5 py-2.5 rounded-xl bg-gold-primary hover:bg-[#c29330] text-black primary-bold-s12-lh120 uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>+ Host Paid Tournament</span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 primary-bold-s12-lh120 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* OVERALL COUNTER (LIVE DASHBOARD METRICS STRIP ABOVE ALL SECTIONS) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-xl border border-[#EBEBEB] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Registered Matches</span>
            <span className="text-2xl font-bold text-gray-900 font-mono mt-1">{joinedTournaments.length}</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">Live Slots Assigned</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EBEBEB] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">My Hosted Tournaments</span>
            <span className="text-2xl font-bold text-gold-primary font-mono mt-1">{hostedTournaments.length}</span>
            <span className="text-[10px] text-blue-600 font-semibold mt-1">
              {hostedTournaments.filter(h => h.status === 'APPROVED').length} Active &bull; {hostedTournaments.filter(h => h.status === 'PENDING').length} In Review
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EBEBEB] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Active Scrims</span>
            <span className="text-2xl font-bold text-blue-600 font-mono mt-1">{joinedScrims.length}</span>
            <span className="text-[10px] text-gray-500 font-semibold mt-1">Daily / Weekly Pools</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EBEBEB] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Prize Won</span>
            <span className="text-2xl font-bold text-emerald-600 font-mono mt-1">₹ 0</span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-1">Verified Digital Payouts</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#EBEBEB] shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Platform Credits</span>
            <span className="text-2xl font-bold text-purple-600 font-mono mt-1">₹ 0</span>
            <span className="text-[10px] text-purple-600 font-semibold mt-1">UPI & Card Fast-Pay</span>
          </div>
        </div>

        {/* DASHBOARD TAB NAVIGATION BAR */}
        <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('my-tournaments')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'my-tournaments'
                ? 'border-gold-primary text-gray-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            🎮 My Registered Matches ({joinedTournaments.length})
          </button>
          <button
            onClick={() => setActiveTab('host-studio')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'host-studio'
                ? 'border-gold-primary text-gray-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            🏆 Paid Hosting Studio ({hostedTournaments.length})
          </button>
          <button
            onClick={() => setActiveTab('scrims-hub')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'scrims-hub'
                ? 'border-gold-primary text-gray-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            ⏱ Scrims Hub ({joinedScrims.length})
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wallet'
                ? 'border-gold-primary text-gray-900 bg-white shadow-xs rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            💳 Digital Wallet & UPI Payouts
          </button>
        </div>

        {/* ========================================================
            TAB 1: MY REGISTERED MATCHES & TOURNAMENTS
            ======================================================== */}
        {activeTab === 'my-tournaments' && (
          <div className="space-y-4">
            {joinedTournaments.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center space-y-3">
                <span className="text-4xl block">🎮</span>
                <h3 className="text-base font-bold text-gray-900">No Tournament Registrations Yet</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  You haven't joined any competitive tournaments yet. Browse the official arenas on the home page or submit your own paid tournament in the Hosting Studio.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate && onNavigate('home')}
                    className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Browse Active Tournaments &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {joinedTournaments.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          {t.status || 'CONFIRMED'}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">{t.slot}</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900">{t.title}</h4>
                      <p className="text-xs text-blue-600 font-semibold">{t.game}</p>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                        <p className="text-gray-700"><strong>Schedule:</strong> {t.matchTime}</p>
                        <p className="text-gray-700 font-mono"><strong>Credentials:</strong> {t.roomId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: PAID TOURNAMENT & SCRIM HOSTING STUDIO
            ======================================================== */}
        {activeTab === 'host-studio' && (
          <div className="space-y-6">
            {/* Hosting Studio Workflow Banner */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[10px] font-bold text-gold-primary uppercase tracking-wider block">
                  Automated Tournament Host System
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                  Host a Tournament or Scrim with Mandatory Thumbnail Verification
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Submit your custom tournament specs, upload your official tournament thumbnail banner, select a hosting tier, and pay via UPI or Card. Super Admins verify graphics before publishing.
                </p>
              </div>

              {/* Payment Success Receipt Card */}
              {paymentSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      ✓ Payment Received · {paymentSuccess.txnId}
                    </span>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Successfully paid <strong>₹{paymentSuccess.amount}</strong> via {paymentSuccess.method} for <strong>"{paymentSuccess.title}"</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentSuccess(null)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer self-start sm:self-center"
                  >
                    Dismiss Receipt
                  </button>
                </div>
              )}

              {/* Paid Hosting Form */}
              <form onSubmit={handlePaidHostingSubmit} className="space-y-5">
                {/* Step 1: Tournament Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gold-primary text-black flex items-center justify-center text-[10px]">1</span>
                    Tournament Basic Specifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Tournament Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Clan Hydra BGMI Invitational S5"
                        value={hostTitle}
                        onChange={(e) => setHostTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-primary outline-hidden text-gray-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Game Title *</label>
                      <select
                        value={hostGame}
                        onChange={(e) => setHostGame(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-primary outline-hidden text-gray-900 font-medium"
                      >
                        <option value="Battlegrounds Mobile India">Battlegrounds Mobile India (BGMI)</option>
                        <option value="Free Fire MAX">Free Fire MAX</option>
                        <option value="Valorant">Valorant</option>
                        <option value="COD Mobile">Call of Duty: Mobile</option>
                        <option value="Apex Legends">Apex Legends</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Total Prize Pool (₹) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. ₹20,000"
                        value={hostPrize}
                        onChange={(e) => setHostPrize(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-primary outline-hidden text-gray-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Match Date & Schedule *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Tomorrow, 8:00 PM IST"
                        value={hostTiming}
                        onChange={(e) => setHostTiming(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-primary outline-hidden text-gray-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Format & Map</label>
                      <input
                        type="text"
                        value={hostFormat}
                        onChange={(e) => setHostFormat(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-primary outline-hidden text-gray-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Slots / Team Capacity</label>
                      <input
                        type="text"
                        value={hostSlots}
                        onChange={(e) => setHostSlots(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-gold-primary outline-hidden text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: MANDATORY THUMBNAIL UPLOAD / SELECTION */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gold-primary text-black flex items-center justify-center text-[10px]">2</span>
                    Mandatory Tournament Thumbnail Graphic (Required for Admin Approval)
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-3">
                    Super Admins inspect and verify every thumbnail image before authorizing tournaments. Upload your poster or choose an esports preset below.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Live Preview Container */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-gold-primary/60 bg-black flex items-center justify-center shadow-md">
                      <img
                        src={hostThumbnail}
                        alt="Thumbnail Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                        <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                          ✓ Active Graphic Preview
                        </span>
                        <span className="px-2.5 py-1 rounded bg-gold-primary text-black text-[10px] font-bold">
                          16:9 HD Ready
                        </span>
                      </div>
                    </div>

                    {/* Selector & File Upload */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1.5">Option A: Upload Custom Graphic Banner</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCustomThumbnailUpload}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gold-primary hover:file:text-black cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-gray-700 mb-1.5">Option B: Choose Verified Esports Preset</label>
                        <div className="grid grid-cols-2 gap-2">
                          {presetThumbnails.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setHostThumbnail(preset.url)}
                              className={`p-2 rounded-lg border text-left text-[11px] font-bold transition-all cursor-pointer truncate ${
                                hostThumbnail === preset.url
                                  ? 'border-gold-primary bg-gold-primary/10 text-gray-900 shadow-xs'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: PAID HOSTING PACKAGE TIERS */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gold-primary text-black flex items-center justify-center text-[10px]">3</span>
                    Select Paid Hosting Tier
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <label className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      hostTier === 'standard' ? 'border-gold-primary bg-gold-primary/5 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Standard Host</span>
                          <input
                            type="radio"
                            name="tier"
                            checked={hostTier === 'standard'}
                            onChange={() => setHostTier('standard')}
                            className="text-gold-primary"
                          />
                        </div>
                        <span className="text-xl font-bold text-gray-900 font-mono mt-1 block">₹ 199</span>
                        <p className="text-[11px] text-gray-500 mt-1">Automated match room, bracket generator, and automated team slot distribution.</p>
                      </div>
                      <span className="text-[10px] font-bold text-gold-primary uppercase">Standard Room Bot</span>
                    </label>

                    <label className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      hostTier === 'pro' ? 'border-blue-600 bg-blue-50/20 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Pro Verified Host</span>
                          <input
                            type="radio"
                            name="tier"
                            checked={hostTier === 'pro'}
                            onChange={() => setHostTier('pro')}
                            className="text-blue-600"
                          />
                        </div>
                        <span className="text-xl font-bold text-blue-600 font-mono mt-1 block">₹ 499</span>
                        <p className="text-[11px] text-gray-500 mt-1">Verified host checkmark, in-app player registration with UPI collections, priority support.</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Most Popular</span>
                    </label>

                    <label className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      hostTier === 'premier' ? 'border-purple-600 bg-purple-50/20 shadow-xs' : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900">Championship Sponsor</span>
                          <input
                            type="radio"
                            name="tier"
                            checked={hostTier === 'premier'}
                            onChange={() => setHostTier('premier')}
                            className="text-purple-600"
                          />
                        </div>
                        <span className="text-xl font-bold text-purple-600 font-mono mt-1 block">₹ 999</span>
                        <p className="text-[11px] text-gray-500 mt-1">Pinned to official Home Page Featured Tournaments carousel and broadcast push notification.</p>
                      </div>
                      <span className="text-[10px] font-bold text-purple-600 uppercase">Maximum Visibility</span>
                    </label>
                  </div>
                </div>

                {/* Step 4: DIGITAL PAYMENT INTEGRATION (UPI & CARD ONLY - ZERO CASH) */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-gold-primary text-black flex items-center justify-center text-[10px]">4</span>
                    Digital Payment Gateway Integration (UPI & Cards Only)
                  </h4>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                        />
                        <span>⚡ Direct UPI / Instant QR (Google Pay, PhonePe, Paytm)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'CARD'}
                          onChange={() => setPaymentMethod('CARD')}
                        />
                        <span>💳 Debit & Credit Card (Visa, Mastercard, RuPay)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'NETBANKING'}
                          onChange={() => setPaymentMethod('NETBANKING')}
                        />
                        <span>🏦 NetBanking (HDFC, SBI, ICICI, Axis)</span>
                      </label>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="p-3 bg-white rounded-lg border border-purple-200 text-xs flex items-center justify-between gap-4">
                        <div>
                          <span className="font-bold text-purple-900 block">UPI Virtual Payment Address</span>
                          <span className="font-mono text-purple-700 font-semibold block mt-0.5">livetournaments@upi</span>
                          <span className="text-[10px] text-gray-500">Scan via any UPI app with 0% transaction fee.</span>
                        </div>
                        <span className="px-3 py-1 rounded bg-purple-100 text-purple-800 text-[11px] font-bold font-mono shrink-0">
                          Total: ₹{tierPrices[hostTier]}
                        </span>
                      </div>
                    )}

                    {paymentMethod === 'CARD' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <input
                          type="text"
                          placeholder="Card Number (•••• •••• •••• ••••)"
                          defaultValue="4111 2222 3333 4444"
                          className="sm:col-span-2 px-3 py-2 rounded-lg border border-gray-300 font-mono"
                        />
                        <div className="flex gap-2">
                          <input type="text" placeholder="MM/YY" defaultValue="12/28" className="w-1/2 px-2.5 py-2 rounded-lg border border-gray-300 font-mono text-center" />
                          <input type="password" placeholder="CVV" defaultValue="982" className="w-1/2 px-2.5 py-2 rounded-lg border border-gray-300 font-mono text-center" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 rounded-xl bg-gold-primary hover:bg-[#c29330] text-black font-bold uppercase tracking-wider text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="animate-spin text-base">⏳</span>
                        <span>Processing ₹{tierPrices[hostTier]} via Secure Gateway...</span>
                      </>
                    ) : (
                      <>
                        <span>💳 Pay ₹{tierPrices[hostTier]} & Submit Tournament for Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* My Submitted Hosted Tournaments Grid */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">
                  My Submitted Tournaments ({hostedTournaments.length})
                </h3>
                <span className="text-xs text-gray-500 font-semibold">
                  Track live approval and room distribution
                </span>
              </div>

              {hostedTournaments.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  You haven't submitted any tournaments yet. Use the form above to host your first tournament.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hostedTournaments.map(h => (
                    <div key={h.id} className="rounded-xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between">
                      <div className="relative w-full h-36 bg-black">
                        <img src={h.thumbnail} alt={h.title} className="w-full h-full object-cover" />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase shadow-sm ${
                          h.status === 'APPROVED' ? 'bg-emerald-500 text-white' :
                          h.status === 'BLOCKED' ? 'bg-black text-white' :
                          h.status === 'SUSPENDED' ? 'bg-rose-500 text-white' :
                          'bg-amber-500 text-white'
                        }`}>
                          {h.status}
                        </span>
                      </div>
                      <div className="p-3.5 space-y-2">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{h.title}</h4>
                        <p className="text-[11px] text-blue-600 font-semibold">{h.game}</p>
                        <div className="p-2 bg-gray-50 rounded text-[10px] space-y-0.5 text-gray-600">
                          <p><strong>Prize Pool:</strong> {h.prizePool}</p>
                          <p><strong>Schedule:</strong> {h.timing}</p>
                          <p><strong>Txn ID:</strong> {h.txnId} ({h.paidFee})</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: SCRIMS HUB
            ======================================================== */}
        {activeTab === 'scrims-hub' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Competitive Scrims Hub</h3>
            <p className="text-xs text-gray-500">
              Participate in daily, weekly, and monthly scrim schedules with India's top clans. Slots open daily at 12:00 PM IST.
            </p>
            <div className="text-center py-8 text-xs text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No active scrim slot bookings today. Check back during daily pool registration at 12:00 PM IST.
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: DIGITAL WALLET & PAYOUTS
            ======================================================== */}
        {activeTab === 'wallet' && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Digital Wallet & Direct UPI Payouts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Available Digital Balance</span>
                <span className="text-2xl font-bold text-gray-900 font-mono block">₹ 0.00</span>
                <p className="text-[10px] text-gray-500">Earnings from verified tournament victories & prize distribution.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-500">Instant UPI Withdrawal</span>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfc)" className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono" />
                  <button className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black cursor-pointer">
                    Withdraw
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 block">Transfers to your bank account via IMPS/UPI in seconds.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
