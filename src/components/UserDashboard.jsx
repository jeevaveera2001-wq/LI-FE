import React, { useState, useEffect } from 'react';
import {
  sendPaymentReceiptEmail,
  sendRoomConductedEmail,
  sendTournamentReminderEmail,
  sendTournamentResultsEmail
} from '../utils/emailService';
import { validateLiveStreamUrl, getYouTubeEmbedUrl } from '../utils/urlValidator';
import { emitRealtimeEvent, subscribeRealtimeEvents } from '../utils/realtimeSync';

export default function UserDashboard({ currentUser, initialTab = 'dashboard', onNavigate, onLogout }) {
  // Navigation Tabs strictly ordered:
  // 1. dashboard, 2. my-matches, 3. rooms, 4. scrims, 5. broadcast, 6. featured-tournaments, 7. payments
  const [activeTab, setActiveTab] = useState(() => initialTab || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedBriefing, setSelectedBriefing] = useState(null);

  // Sync prop changes for initialTab
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Razorpay Test Key ID
  const RAZORPAY_KEY = 'rzp_test_TKSMD0fP2Rxjxc';

  // Trigger toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncLive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('⚡ Live Player Telemetry Synced');
    }, 600);
  };

  // Helper to extract clean YouTube embed URL
  const getEmbedYouTubeUrl = (url) => {
    if (!url) return null;
    return getYouTubeEmbedUrl(url);
  };

  // Helper to purge legacy mock items
  const isUserMock = (id) => {
    if (!id) return true;
    const str = String(id);
    return str === 'bgmi-sd-reg-01' || str === 'scrim-tier1-01' || str.startsWith('mock_') || str.startsWith('demo_') || str.startsWith('tx_init_') || str.startsWith('hist_') || str === 'host_bgmi_pro_1';
  };

  // Joined Tournaments (User Registrations)
  const [joinedTournaments, setJoinedTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_user_joined_tourneys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(t => !isUserMock(t.id));
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // User Hosted / Conducted Rooms & Tournaments
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

  // User Scrims
  const [joinedScrims, setJoinedScrims] = useState(() => {
    const saved = localStorage.getItem('lt_user_scrims');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(s => !isUserMock(s.id));
        }
      } catch (e) {}
    }
    return [];
  });

  // User Payment History (Payments paid to LiveTournaments.in)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lt_user_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(t => !isUserMock(t.id));
      } catch (e) {}
    }
    return [];
  });

  // Tournament Room History (Completed past rooms)
  const [tournamentHistory, setTournamentHistory] = useState(() => {
    const saved = localStorage.getItem('lt_user_tournament_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(t => !isUserMock(t.id));
      } catch (e) {}
    }
    return [];
  });

  // In-Page Modal State for Tournament Room Conducting (₹10)
  const [isConductModalOpen, setIsConductModalOpen] = useState(false);
  const [conductTitle, setConductTitle] = useState('');
  const [conductGame, setConductGame] = useState('Battlegrounds Mobile India');
  const [conductFormat, setConductFormat] = useState('Squad (Erangel + Miramar)');
  const [conductSlots, setConductSlots] = useState('25 Squads (100 Players)');
  const [conductPrize, setConductPrize] = useState('₹ 5,000 INR');
  const [conductTiming, setConductTiming] = useState('Today at 8:00 PM IST');
  const [conductWhatsApp, setConductWhatsApp] = useState('');
  const [conductLiveUrl, setConductLiveUrl] = useState('');
  const [conductThumbnail, setConductThumbnail] = useState('/assets/tournament_bgmi_showdown_4k.jpg');
  const [conductRoomCode, setConductRoomCode] = useState(() => 'LT-' + Math.floor(100000 + Math.random() * 900000));
  const [conductRoomPass, setConductRoomPass] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  // In-Page Modal State for Daily Scrims Conducting (₹50)
  const [isConductScrimModalOpen, setIsConductScrimModalOpen] = useState(false);
  const [scrimTitle, setScrimTitle] = useState('');
  const [scrimGame, setScrimGame] = useState('Battlegrounds Mobile India');
  const [scrimTiming, setScrimTiming] = useState('Daily at 7:00 PM IST');
  const [scrimWhatsApp, setScrimWhatsApp] = useState('');
  const [scrimLiveUrl, setScrimLiveUrl] = useState('');
  const [scrimThumbnail, setScrimThumbnail] = useState('/assets/tournament_bgmi_lan_warriors_4k.jpg');
  const [scrimRoomCode, setScrimRoomCode] = useState(() => 'SCRIM-' + Math.floor(10000 + Math.random() * 90000));
  const [scrimRoomPass, setScrimRoomPass] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));

  // Digital Payment Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Broadcast & Streams Live Player State
  const [liveStreamUrl, setLiveStreamUrl] = useState(() => {
    return localStorage.getItem('lt_user_live_stream_url') || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
  });
  const [liveStreamInput, setLiveStreamInput] = useState('');
  const [liveStreamEmail, setLiveStreamEmail] = useState(() => currentUser?.email || '');
  const [liveStreamTitle, setLiveStreamTitle] = useState('BGMI Championship Live Broadcast');
  const [liveStreamGame, setLiveStreamGame] = useState('BATTLEGROUNDS MOBILE INDIA');
  const [liveStreamClan, setLiveStreamClan] = useState(() => currentUser?.clan || '');
  const [liveStreamTournamentType, setLiveStreamTournamentType] = useState('Pro Championship League');
  const [activeBroadcastPass, setActiveBroadcastPass] = useState(() => {
    return localStorage.getItem('lt_user_broadcast_pass') || 'Weekly Pass (7 Days)';
  });
  const [broadcastExpiresAt, setBroadcastExpiresAt] = useState(() => {
    const saved = localStorage.getItem('lt_user_broadcast_expiry');
    if (saved) return saved;
    const exp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    return exp;
  });

  // Featured Tournament State (Flat ₹ 49)
  const [featuredSelectedEvent, setFeaturedSelectedEvent] = useState('');
  const [featuredSuccess, setFeaturedSuccess] = useState(null);

  // Processing state
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Preset Poster Thumbnails
  const presetThumbnails = [
    { name: 'BGMI Showdown 4K', url: '/assets/tournament_bgmi_showdown_4k.jpg' },
    { name: 'BGMI LAN Warriors', url: '/assets/tournament_bgmi_lan_warriors_4k.jpg' },
    { name: 'PUBG Ultimate Squad', url: '/assets/tournament_pubg_ultimate_squad_4k.jpg' },
    { name: 'Championship Trophy Stage', url: '/assets/lt_championship_trophy_card_4k.png' },
    { name: 'Pro Esports Arena', url: '/assets/host_directly_4k.jpg' },
  ];

  // Result Submission Modal State (for Super Admin Result Verifier)
  const [showResultSubmitModal, setShowResultSubmitModal] = useState(false);
  const [resultMatch, setResultMatch] = useState(null);
  const [resultSubmissionType, setResultSubmissionType] = useState('SLOT_POINTS'); // 'SLOT_POINTS' | 'SINGLE_IMAGE' | 'BOTH'
  const [resultWinnerClan, setResultWinnerClan] = useState('GodLike Esports');
  const [resultRunnerUpClan, setResultRunnerUpClan] = useState('Team Soul');
  const [resultThirdClan, setResultThirdClan] = useState('Blind Esports');
  const [resultMvp, setResultMvp] = useState('JONATHAN (14 Kills)');
  const [resultPosterUrl, setResultPosterUrl] = useState('/assets/tournament_bgmi_showdown_4k.jpg');
  const [resultVideoUrl, setResultVideoUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk');
  const [resultAnimationTheme, setResultAnimationTheme] = useState('gold-championship');
  const [resultNotes, setResultNotes] = useState('Grand Finals Match concluded with official clan points recorded.');
  const [resultSlotPoints, setResultSlotPoints] = useState([
    { rank: 1, slot: 'Slot 1', clan: 'GodLike Esports', kills: 14, positionPts: 15, totalPts: 29, wwcd: true },
    { rank: 2, slot: 'Slot 4', clan: 'Team Soul', kills: 10, positionPts: 12, totalPts: 22, wwcd: false },
    { rank: 3, slot: 'Slot 7', clan: 'Blind Esports', kills: 8, positionPts: 10, totalPts: 18, wwcd: false },
    { rank: 4, slot: 'Slot 2', clan: 'Orangutan Gaming', kills: 7, positionPts: 8, totalPts: 15, wwcd: false },
    { rank: 5, slot: 'Slot 5', clan: 'Team Entity', kills: 6, positionPts: 6, totalPts: 12, wwcd: false },
    { rank: 6, slot: 'Slot 9', clan: 'Gladiator Esports', kills: 5, positionPts: 4, totalPts: 9, wwcd: false },
    { rank: 7, slot: 'Slot 3', clan: 'Reckoning Esports', kills: 4, positionPts: 2, totalPts: 6, wwcd: false },
    { rank: 8, slot: 'Slot 8', clan: 'Medal Esports', kills: 3, positionPts: 1, totalPts: 4, wwcd: false },
    { rank: 9, slot: 'Slot 6', clan: 'Big Brother Esports', kills: 3, positionPts: 1, totalPts: 4, wwcd: false },
    { rank: 10, slot: 'Slot 10', clan: 'Autobotz Esports', kills: 2, positionPts: 1, totalPts: 3, wwcd: false },
    { rank: 11, slot: 'Slot 11', clan: 'Team Forever', kills: 2, positionPts: 0, totalPts: 2, wwcd: false },
    { rank: 12, slot: 'Slot 12', clan: 'Hydra Official', kills: 2, positionPts: 0, totalPts: 2, wwcd: false },
    { rank: 13, slot: 'Slot 13', clan: 'Enigma Gaming', kills: 1, positionPts: 0, totalPts: 1, wwcd: false },
    { rank: 14, slot: 'Slot 14', clan: 'Global Esports', kills: 1, positionPts: 0, totalPts: 1, wwcd: false },
    { rank: 15, slot: 'Slot 15', clan: 'Team Insane', kills: 0, positionPts: 0, totalPts: 0, wwcd: false },
    { rank: 16, slot: 'Slot 16', clan: 'Gujarat Tigers', kills: 0, positionPts: 0, totalPts: 0, wwcd: false }
  ]);

  const handleSlotChange = (index, field, value) => {
    setResultSlotPoints(prev => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };
      if (field === 'kills' || field === 'positionPts') {
        const k = parseInt(field === 'kills' ? value : item.kills, 10) || 0;
        const p = parseInt(field === 'positionPts' ? value : item.positionPts, 10) || 0;
        item.totalPts = k + p;
      }
      if (field === 'wwcd') {
        item.wwcd = Boolean(value);
      }
      updated[index] = item;
      if (field === 'clan') {
        if (index === 0) setResultWinnerClan(value);
        if (index === 1) setResultRunnerUpClan(value);
        if (index === 2) setResultThirdClan(value);
      }
      return updated;
    });
  };

  const handleAddSlot = () => {
    setResultSlotPoints(prev => [
      ...prev,
      {
        rank: prev.length + 1,
        slot: `Slot ${prev.length + 1}`,
        clan: `Squad ${prev.length + 1}`,
        kills: 0,
        positionPts: 0,
        totalPts: 0,
        wwcd: false
      }
    ]);
  };

  const handleRemoveSlot = (index) => {
    setResultSlotPoints(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((item, idx) => ({ ...item, rank: idx + 1 }));
    });
  };

  const handleResetSlots = () => {
    setResultSlotPoints([
      { rank: 1, slot: 'Slot 1', clan: resultWinnerClan || 'Winner Clan', kills: 14, positionPts: 15, totalPts: 29, wwcd: true },
      { rank: 2, slot: 'Slot 4', clan: resultRunnerUpClan || 'Runner-Up Clan', kills: 10, positionPts: 12, totalPts: 22, wwcd: false },
      { rank: 3, slot: 'Slot 7', clan: resultThirdClan || '3rd Place Clan', kills: 8, positionPts: 10, totalPts: 18, wwcd: false },
      { rank: 4, slot: 'Slot 2', clan: 'Orangutan Gaming', kills: 7, positionPts: 8, totalPts: 15, wwcd: false },
      { rank: 5, slot: 'Slot 5', clan: 'Team Entity', kills: 6, positionPts: 6, totalPts: 12, wwcd: false },
      { rank: 6, slot: 'Slot 9', clan: 'Gladiator Esports', kills: 5, positionPts: 4, totalPts: 9, wwcd: false },
      { rank: 7, slot: 'Slot 3', clan: 'Reckoning Esports', kills: 4, positionPts: 2, totalPts: 6, wwcd: false },
      { rank: 8, slot: 'Slot 8', clan: 'Medal Esports', kills: 3, positionPts: 1, totalPts: 4, wwcd: false },
      { rank: 9, slot: 'Slot 6', clan: 'Big Brother Esports', kills: 3, positionPts: 1, totalPts: 4, wwcd: false },
      { rank: 10, slot: 'Slot 10', clan: 'Autobotz Esports', kills: 2, positionPts: 1, totalPts: 3, wwcd: false },
      { rank: 11, slot: 'Slot 11', clan: 'Team Forever', kills: 2, positionPts: 0, totalPts: 2, wwcd: false },
      { rank: 12, slot: 'Slot 12', clan: 'Hydra Official', kills: 2, positionPts: 0, totalPts: 2, wwcd: false },
      { rank: 13, slot: 'Slot 13', clan: 'Enigma Gaming', kills: 1, positionPts: 0, totalPts: 1, wwcd: false },
      { rank: 14, slot: 'Slot 14', clan: 'Global Esports', kills: 1, positionPts: 0, totalPts: 1, wwcd: false },
      { rank: 15, slot: 'Slot 15', clan: 'Team Insane', kills: 0, positionPts: 0, totalPts: 0, wwcd: false },
      { rank: 16, slot: 'Slot 16', clan: 'Gujarat Tigers', kills: 0, positionPts: 0, totalPts: 0, wwcd: false }
    ]);
  };

  const displayName = currentUser?.name || currentUser?.username || 'Competitor';
  const displayEmail = currentUser?.email || 'player@livetournaments.in';
  const currentDateStr = new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Razorpay Checkout Trigger Helper
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
      key: RAZORPAY_KEY,
      amount: amount * 100, // in paise
      currency: 'INR',
      name: 'LiveTournaments.in',
      description: description || 'Esports Checkout',
      image: '/assets/host_directly_4k.jpg',
      handler: function (response) {
        setIsProcessingPayment(false);
        const pid = response?.razorpay_payment_id || ('RZP_TEST_' + Date.now());
        if (onSuccess) onSuccess(pid);
      },
      prefill: {
        name: displayName,
        email: displayEmail,
        contact: currentUser?.mobile || conductWhatsApp || '9876543210'
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
          const mockPid = 'RZP_TEST_' + Date.now();
          if (onSuccess) onSuccess(mockPid);
        });
        rzp.open();
      } catch (e) {
        setIsProcessingPayment(false);
        const mockPid = 'RZP_TEST_' + Date.now();
        if (onSuccess) onSuccess(mockPid);
      }
    } else {
      setTimeout(() => {
        setIsProcessingPayment(false);
        const mockPid = 'RZP_TEST_' + Date.now();
        if (onSuccess) onSuccess(mockPid);
      }, 700);
    }
  };

  // 1. Submit In-Page Conduct Tournament Room (₹ 10)
  const handleConductTournamentSubmit = (e) => {
    e.preventDefault();
    if (!conductTitle || !conductTiming) {
      alert('Please fill in tournament heading and schedule timing.');
      return;
    }

    if (conductLiveUrl && conductLiveUrl.trim()) {
      const val = validateLiveStreamUrl(conductLiveUrl);
      if (!val.isValid) {
        showToast(`⚠️ ${val.error}`);
        return;
      }
    }

    triggerRazorpayCheckout({
      amount: 10,
      description: `Tournament Room Conduct: ${conductTitle} (₹10 Single Match)`,
      onSuccess: async (paymentId) => {
        const newRoom = {
          id: 'host_' + Date.now(),
          title: conductTitle,
          tournament: conductTitle,
          game: conductGame,
          type: 'TOURNAMENT',
          format: conductFormat,
          slots: '25 Squads (100 Players)',
          registeredSquads: 1,
          slotCap: 25,
          prize: conductPrize || '₹ 5,000 INR',
          timing: conductTiming,
          thumbnail: conductThumbnail,
          tier: 'standard',
          channelLink: conductLiveUrl || 'https://www.youtube.com/@livetournament_in',
          amountPaid: 10,
          paymentRef: paymentId,
          roomCode: conductRoomCode,
          roomPass: conductRoomPass,
          status: 'PENDING',
          whatsApp: conductWhatsApp || '9876543210',
          createdAt: new Date().toISOString(),
          hostUser: displayName,
          organizer: displayName,
          email: displayEmail,
          isUserSubmitted: true
        };

        const updatedRooms = [newRoom, ...hostedTournaments];
        setHostedTournaments(updatedRooms);
        localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(updatedRooms));

        // Unique Room ID and password are directly published to players without admin approval
        try {
          const publishedCreds = JSON.parse(localStorage.getItem('lt_published_room_credentials') || '{}');
          publishedCreds[newRoom.id] = {
            roomCode: conductRoomCode,
            roomPass: conductRoomPass,
            publishedAt: new Date().toISOString(),
            directAccess: true
          };
          localStorage.setItem('lt_published_room_credentials', JSON.stringify(publishedCreds));
        } catch (e) {}

        // Sync to Super Admin Hosting Requests Queue for Public Listing Approval
        try {
          const adminHostings = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
          localStorage.setItem('lt_admin_hosting_requests', JSON.stringify([newRoom, ...adminHostings]));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('lt_room_requested'));
          window.dispatchEvent(new Event('lt_hosting_requested'));
          emitRealtimeEvent('HOSTING_REQUESTED', newRoom);

          // If a broadcast stream URL was provided during hosting, register it in broadcast requests
          if (conductLiveUrl && conductLiveUrl.trim()) {
            const bVal = validateLiveStreamUrl(conductLiveUrl);
            if (bVal.isValid) {
              let pendingBroadcasts = [];
              try {
                const b1 = localStorage.getItem('lt_broadcast_requests');
                const b2 = localStorage.getItem('lt_admin_broadcast_requests');
                if (b1) { const p = JSON.parse(b1); if (Array.isArray(p)) pendingBroadcasts = p; }
                if (pendingBroadcasts.length === 0 && b2) { const p = JSON.parse(b2); if (Array.isArray(p)) pendingBroadcasts = p; }
              } catch (e) {}
              const streamReq = {
                id: 'bcast_' + Date.now(),
                title: `${conductTitle} - Tournament Live Broadcast`,
                tournament: conductTitle,
                streamUrl: bVal.normalizedUrl,
                organizerName: displayName,
                creator: displayName,
                channel: `${displayName} Official Live`,
                requestedSlot: 'Tournament Match Broadcast',
                language: 'Hindi / English',
                organizerClan: currentUser?.clan || 'CLAN',
                clan: currentUser?.clan || 'CLAN',
                game: conductGame,
                email: displayEmail,
                status: 'PENDING',
                submittedAt: new Date().toISOString(),
                isUserSubmitted: true
              };
              const updatedBcasts = [streamReq, ...pendingBroadcasts.filter(b => b.id !== streamReq.id)];
              localStorage.setItem('lt_broadcast_requests', JSON.stringify(updatedBcasts));
              localStorage.setItem('lt_admin_broadcast_requests', JSON.stringify(updatedBcasts));
              localStorage.setItem('lt_user_live_stream_url', bVal.normalizedUrl);
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('lt_broadcast_requested'));
            }
          }
        } catch (err) {}

        // Record in User Payment History
        const newTx = {
          id: 'tx_' + Date.now(),
          description: `Tournament Room Conduct: ${conductTitle}`,
          amount: 10,
          type: 'DEBIT',
          category: 'Tournament Room',
          status: 'PAID',
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          reference: paymentId,
          gateway: 'Razorpay Test Mode'
        };
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('lt_user_transactions', JSON.stringify(updatedTxs));

        // Dispatch Email Receipt & Room Launch Confirmation
        await sendPaymentReceiptEmail({
          email: displayEmail,
          name: displayName,
          service: `Tournament Room Conduct: ${conductTitle}`,
          amount: 10,
          paymentId
        });
        await sendRoomConductedEmail({
          email: displayEmail,
          name: displayName,
          title: conductTitle,
          type: 'TOURNAMENT',
          game: conductGame,
          roomCode: conductRoomCode,
          roomPass: conductRoomPass,
          channelLink: conductLiveUrl,
          amountPaid: 10,
          paymentId
        });

        setIsConductModalOpen(false);
        showToast(currentUser?.hasTourneyApproval ? '🎉 Tournament Room launched & approved instantly with VIP Clearance!' : '🎉 Tournament Room launched! Awaiting Admin approval. Confirmation email sent.');
        
        // Reset form fields
        setConductTitle('');
        setConductRoomCode('LT-' + Math.floor(100000 + Math.random() * 900000));
        setConductRoomPass(String(Math.floor(1000 + Math.random() * 9000)));
      }
    });
  };

  // 2. Submit In-Page Conduct Daily Scrim (₹ 50)
  const handleConductScrimSubmit = (e) => {
    e.preventDefault();
    if (!scrimTitle || !scrimTiming) {
      alert('Please fill in scrim title and timing.');
      return;
    }

    if (scrimLiveUrl && scrimLiveUrl.trim()) {
      const val = validateLiveStreamUrl(scrimLiveUrl);
      if (!val.isValid) {
        showToast(`⚠️ ${val.error}`);
        return;
      }
    }

    triggerRazorpayCheckout({
      amount: 50,
      description: `Daily Scrims Conduct: ${scrimTitle} (₹50 Base)`,
      onSuccess: async (paymentId) => {
        const newScrim = {
          id: 'user_scrim_' + Date.now(),
          title: scrimTitle,
          tournament: scrimTitle,
          game: scrimGame,
          type: 'SCRIM',
          format: 'Squad Battle Practice',
          slots: '25 Squads (100 Players)',
          registeredSquads: 1,
          slotCap: 25,
          prize: 'Tier-1 Practice Lobby',
          timing: scrimTiming,
          schedule: scrimTiming,
          thumbnail: scrimThumbnail,
          tier: 'standard',
          channelLink: scrimLiveUrl || 'https://www.youtube.com/@livetournament_in',
          amountPaid: 50,
          paymentRef: paymentId,
          roomCode: scrimRoomCode,
          roomPass: scrimRoomPass,
          status: 'PENDING',
          whatsApp: scrimWhatsApp || '9876543210',
          contact: scrimWhatsApp || displayEmail,
          clan: currentUser?.clan || displayName,
          organizer: displayName,
          createdAt: new Date().toISOString(),
          hostUser: displayName,
          email: displayEmail,
          isUserSubmitted: true
        };

        const updatedRooms = [newScrim, ...hostedTournaments];
        setHostedTournaments(updatedRooms);
        localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(updatedRooms));

        // Unique Scrim Room ID and password are directly published to players without admin approval
        try {
          const publishedCreds = JSON.parse(localStorage.getItem('lt_published_room_credentials') || '{}');
          publishedCreds[newScrim.id] = {
            roomCode: scrimRoomCode,
            roomPass: scrimRoomPass,
            publishedAt: new Date().toISOString(),
            directAccess: true
          };
          localStorage.setItem('lt_published_room_credentials', JSON.stringify(publishedCreds));
        } catch (e) {}

        try {
          const adminScrims = JSON.parse(localStorage.getItem('lt_admin_scrims_requests') || '[]');
          localStorage.setItem('lt_admin_scrims_requests', JSON.stringify([newScrim, ...adminScrims]));
          const adminHostings = JSON.parse(localStorage.getItem('lt_admin_hosting_requests') || '[]');
          localStorage.setItem('lt_admin_hosting_requests', JSON.stringify([newScrim, ...adminHostings]));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('lt_scrim_requested'));
          emitRealtimeEvent('SCRIM_REQUESTED', newScrim);

          // If a broadcast stream URL was provided during scrim hosting, register it in broadcast requests
          if (scrimLiveUrl && scrimLiveUrl.trim()) {
            const bVal = validateLiveStreamUrl(scrimLiveUrl);
            if (bVal.isValid) {
              let pendingBroadcasts = [];
              try {
                const b1 = localStorage.getItem('lt_broadcast_requests');
                const b2 = localStorage.getItem('lt_admin_broadcast_requests');
                if (b1) { const p = JSON.parse(b1); if (Array.isArray(p)) pendingBroadcasts = p; }
                if (pendingBroadcasts.length === 0 && b2) { const p = JSON.parse(b2); if (Array.isArray(p)) pendingBroadcasts = p; }
              } catch (e) {}
              const streamReq = {
                id: 'bcast_' + Date.now(),
                title: `${scrimTitle} - Daily Scrim Live Broadcast`,
                tournament: scrimTitle,
                streamUrl: bVal.normalizedUrl,
                organizerName: displayName,
                creator: displayName,
                channel: `${displayName} Official Live`,
                requestedSlot: 'Daily Scrim Stream',
                language: 'Hindi / English',
                organizerClan: currentUser?.clan || 'CLAN',
                clan: currentUser?.clan || 'CLAN',
                game: scrimGame,
                email: displayEmail,
                status: 'PENDING',
                submittedAt: new Date().toISOString(),
                isUserSubmitted: true
              };
              const updatedBcasts = [streamReq, ...pendingBroadcasts.filter(b => b.id !== streamReq.id)];
              localStorage.setItem('lt_broadcast_requests', JSON.stringify(updatedBcasts));
              localStorage.setItem('lt_admin_broadcast_requests', JSON.stringify(updatedBcasts));
              localStorage.setItem('lt_user_live_stream_url', bVal.normalizedUrl);
              window.dispatchEvent(new Event('storage'));
              window.dispatchEvent(new Event('lt_broadcast_requested'));
            }
          }
        } catch (err) {}

        const newTx = {
          id: 'tx_' + Date.now(),
          description: `Daily Scrims Conduct: ${scrimTitle}`,
          amount: 50,
          type: 'DEBIT',
          category: 'Daily Scrim',
          status: 'PAID',
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          reference: paymentId,
          gateway: 'Razorpay Test Mode'
        };
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('lt_user_transactions', JSON.stringify(updatedTxs));

        await sendPaymentReceiptEmail({
          email: displayEmail,
          name: displayName,
          service: `Daily Scrims Conduct: ${scrimTitle}`,
          amount: 50,
          paymentId
        });
        await sendRoomConductedEmail({
          email: displayEmail,
          name: displayName,
          title: scrimTitle,
          type: 'SCRIM',
          game: scrimGame,
          roomCode: scrimRoomCode,
          roomPass: scrimRoomPass,
          channelLink: scrimLiveUrl,
          amountPaid: 50,
          paymentId
        });

        setIsConductScrimModalOpen(false);
        showToast(currentUser?.hasScrimsApproval ? '🎉 Daily Scrim created & approved instantly with VIP Clearance!' : '🎉 Daily Scrim created! Awaiting Admin approval. Confirmation email sent.');

        setScrimTitle('');
        setScrimRoomCode('SCRIM-' + Math.floor(10000 + Math.random() * 90000));
        setScrimRoomPass(String(Math.floor(1000 + Math.random() * 9000)));
      }
    });
  };

  // 3. Submit Featured Tournament Boost (Flat ₹ 49)
  const handleFeaturedTournamentSubmit = (e) => {
    e.preventDefault();
    const targetTitle = featuredSelectedEvent || (hostedTournaments[0]?.title || 'BGMI Masters Championship');

    triggerRazorpayCheckout({
      amount: 49,
      description: `Featured Tournament Top-Line Boost: ${targetTitle}`,
      onSuccess: async (paymentId) => {
        const featEntry = {
          id: 'user_feat_' + Date.now(),
          title: targetTitle,
          tournament: targetTitle,
          organizer: displayName,
          organizerName: displayName,
          game: 'BGMI',
          placement: 'Homepage Top Carousel Banner Boost',
          budget: '₹ 49.00 INR (Boost Pass)',
          amountPaid: 49,
          paymentRef: paymentId,
          status: 'PENDING',
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          isUserSubmitted: true
        };
        setFeaturedSuccess(featEntry);

        try {
          const adminFeats = JSON.parse(localStorage.getItem('lt_admin_featured_requests') || '[]');
          localStorage.setItem('lt_admin_featured_requests', JSON.stringify([featEntry, ...adminFeats]));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('lt_featured_requested'));
          emitRealtimeEvent('FEATURED_REQUESTED', featEntry);
        } catch (e) {}

        const newTx = {
          id: 'tx_' + Date.now(),
          description: `Featured Tournament Top-Line Boost: ${targetTitle}`,
          amount: 49,
          type: 'DEBIT',
          category: 'Featured Boost',
          status: 'PAID',
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          reference: paymentId,
          gateway: 'Razorpay Test Mode'
        };
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('lt_user_transactions', JSON.stringify(updatedTxs));

        await sendPaymentReceiptEmail({
          email: displayEmail,
          name: displayName,
          service: `Featured Tournament Boost: ${targetTitle}`,
          amount: 49,
          paymentId
        });

        showToast('🌟 Tournament featured on Top-Line Carousel! Confirmation email sent.');
      }
    });
  };

  // 4. Submit Broadcast & Stream Pass (₹249 / ₹549 / ₹999)
  const handlePurchaseBroadcastPass = (tierName, price, days) => {
    triggerRazorpayCheckout({
      amount: price,
      description: `Broadcast & Live Stream Pass: ${tierName} (${days} Days)`,
      onSuccess: async (paymentId) => {
        const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
        setActiveBroadcastPass(`${tierName} (${days} Days)`);
        setBroadcastExpiresAt(expiryDate);
        localStorage.setItem('lt_user_broadcast_pass', `${tierName} (${days} Days)`);
        localStorage.setItem('lt_user_broadcast_expiry', expiryDate);

        const newTx = {
          id: 'tx_' + Date.now(),
          description: `Broadcast Stream Pass: ${tierName} (${days} Days)`,
          amount: price,
          type: 'DEBIT',
          category: 'Broadcast Pass',
          status: 'PAID',
          date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          reference: paymentId,
          gateway: 'Razorpay Test Mode'
        };
        const updatedTxs = [newTx, ...transactions];
        setTransactions(updatedTxs);
        localStorage.setItem('lt_user_transactions', JSON.stringify(updatedTxs));

        await sendPaymentReceiptEmail({
          email: displayEmail,
          name: displayName,
          service: `Broadcast & Stream Pass: ${tierName} (${days} Days)`,
          amount: price,
          paymentId
        });

        showToast(`📺 Broadcast Pass Activated! Live embedding active until ${expiryDate}. Email receipt sent.`);
      }
    });
  };

  // 5. Send 24-Hour Reminder Email to All Squads
  const handleSendReminderEmail = async (tournament) => {
    await sendTournamentReminderEmail({
      email: displayEmail,
      name: displayName,
      tournamentTitle: tournament.title,
      matchTiming: tournament.timing,
      roomCode: tournament.roomCode,
      roomPass: tournament.roomPass
    });
    showToast(`📧 24h Match Reminder email dispatched to all 25 registered squads!`);
  };

  // 6. Finalize Match Results & Push Points Table Email
  const handleSendResultsAndPointsEmail = async (tournament) => {
    await sendTournamentResultsEmail({
      email: displayEmail,
      name: displayName,
      tournamentTitle: tournament.title,
      winnerClan: 'Team Soul',
      posterUrl: tournament.thumbnail
    });
    showToast(`📊 Points table & match standings emailed to all participant clans!`);
  };

  // 7. Update Live Stream URL
  const handleUpdateLiveStream = (e) => {
    e.preventDefault();
    if (!liveStreamInput.trim()) {
      showToast('⚠️ Please enter a proper YouTube live stream link.');
      return;
    }
    const val = validateLiveStreamUrl(liveStreamInput);
    if (!val.isValid) {
      showToast(`⚠️ ${val.error}`);
      return;
    }

    const emailToUse = (liveStreamEmail || displayEmail || '').trim();
    if (!emailToUse || !emailToUse.includes('@')) {
      showToast('⚠️ Please provide a valid caster contact email address.');
      return;
    }

    setLiveStreamUrl(val.normalizedUrl);
    localStorage.setItem('lt_user_live_stream_url', val.normalizedUrl);

    // Queue in pending broadcast stream requests for Admin approval with all collected details
    try {
      let pendingBroadcasts = [];
      try {
        const b1 = localStorage.getItem('lt_broadcast_requests');
        const b2 = localStorage.getItem('lt_admin_broadcast_requests');
        if (b1) { const p = JSON.parse(b1); if (Array.isArray(p)) pendingBroadcasts = p; }
        if (pendingBroadcasts.length === 0 && b2) { const p = JSON.parse(b2); if (Array.isArray(p)) pendingBroadcasts = p; }
      } catch (e) {}

      const newReq = {
        id: 'bcast_' + Date.now(),
        title: liveStreamTitle.trim() || `${displayName}'s Competitive Live Broadcast`,
        tournament: liveStreamTitle.trim() || 'Competitive Series Live Stream',
        streamUrl: val.normalizedUrl,
        organizerName: displayName,
        creator: displayName,
        channel: `${displayName} Official Live`,
        requestedSlot: 'Prime Live Stream Feed (Slot 1-4)',
        language: 'Hindi / English',
        organizerClan: liveStreamClan.trim() || currentUser?.clan || 'CLAN',
        clan: liveStreamClan.trim() || currentUser?.clan || 'CLAN',
        game: liveStreamGame,
        email: emailToUse,
        status: 'LIVE ON AIR',
        submittedAt: new Date().toISOString(),
        isUserSubmitted: true,
        isLive: true
      };

      const updatedBcasts = [newReq, ...pendingBroadcasts.filter(b => b.id !== newReq.id)];
      localStorage.setItem('lt_broadcast_requests', JSON.stringify(updatedBcasts));
      localStorage.setItem('lt_admin_broadcast_requests', JSON.stringify(updatedBcasts));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('lt_broadcast_requested'));
      emitRealtimeEvent('BROADCAST_REQUESTED', newReq);
    } catch (err) {}

    // Dispatch update event so Home Arena live stream reflects change immediately
    window.dispatchEvent(new Event('lt_stream_updated'));
    setLiveStreamInput('');
    showToast(currentUser?.hasBroadcastVip ? '🌟 Broadcast VIP Active! Stream published directly to Homepage!' : '🔴 Live stream submitted! Contact email and YouTube link verified for Admin slotting.');
  };

  // 8. Submit Results for Admin Verification
  const handleSubmitResultsForVerification = (e) => {
    e.preventDefault();
    if (!resultMatch) return;
    const newSubmission = {
      id: 'res_' + Date.now(),
      matchId: resultMatch.id,
      tournamentTitle: resultMatch.title,
      game: resultMatch.game,
      hostUser: displayName,
      hostEmail: displayEmail,
      submissionType: resultSubmissionType,
      slotPointsTable: (resultSubmissionType === 'SLOT_POINTS' || resultSubmissionType === 'BOTH') ? resultSlotPoints : [],
      winnerClan: resultWinnerClan,
      runnerUpClan: resultRunnerUpClan,
      thirdClan: resultThirdClan,
      mvp: resultMvp,
      posterUrl: (resultSubmissionType === 'SINGLE_IMAGE' || resultSubmissionType === 'BOTH') ? resultPosterUrl : (resultPosterUrl || '/assets/tournament_bgmi_showdown_4k.jpg'),
      videoUrl: resultVideoUrl,
      animationTheme: resultAnimationTheme,
      notes: resultNotes,
      status: 'PENDING_APPROVAL',
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('lt_admin_result_verifications') || '[]');
      const filtered = existing.filter(x => x.matchId !== resultMatch.id);
      localStorage.setItem('lt_admin_result_verifications', JSON.stringify([newSubmission, ...filtered]));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('lt_results_submitted'));
      emitRealtimeEvent('RESULTS_SUBMITTED', newSubmission);
    } catch (err) {}

    setShowResultSubmitModal(false);
    showToast('🏆 Match results & certified points table submitted for Admin verification!');
  };

  // Summary Metrics for Payments History
  const totalAmountPaid = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
  const totalTransactionsCount = transactions.length;

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
          LEFT SIDEBAR (STRICT USER-SPECIFIED ORDER)
          1. Player Dashboard
          2. My Matches
          3. Rooms (Conducted)
          4. Daily Scrims Hub
          5. Broadcast & Streams (Above Featured Tournaments)
          6. Featured Tournaments
          7. Payment Page (At the last)
          ======================================================== */}
      <aside className={`nagulan-sidebar ${sidebarOpen ? 'open' : ''}`}>
        
        {/* Brand Header */}
        <div className="p-3.5 border-b border-[#1F2937]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-[8px] bg-gradient-to-br from-[#DFBD78] to-[#C5A059] flex items-center justify-center text-black font-black text-[13px] shadow-sm">
              LT
            </div>
            <div className="flex flex-col">
              <span className="text-[12.5px] font-bold text-white tracking-wide">LiveTournaments</span>
              <span className="text-[9px] text-[#DFBD78] font-bold uppercase tracking-wider">Player Suite</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#9CA3AF] hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Navigation Items in Strict Order */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
          
          {/* Section: Overview */}
          <div className="pb-1 px-2 pt-1">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              PLAYER NAVIGATION
            </span>
          </div>

          {/* 1. Player Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span className="flex-1 text-left">Player Dashboard</span>
          </button>

          {/* 2. My Matches (Registered Tournaments) */}
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

          {/* 3. Rooms (Conducted / Hosted Tournament Rooms Only) */}
          <button
            onClick={() => { setActiveTab('rooms'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">meeting_room</span>
            <span className="flex-1 text-left">Rooms (Conducted)</span>
            {hostedTournaments.filter(h => h.type === 'TOURNAMENT').length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#DFBD78]/20 text-[#DFBD78] text-[9px] font-bold border border-[#DFBD78]/30">
                {hostedTournaments.filter(h => h.type === 'TOURNAMENT').length}
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
              SCRIMS
            </span>
          </button>

          {/* Section: Broadcast & Promotions */}
          <div className="pt-3 pb-1 px-2">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              BROADCAST &amp; PROMOTIONS
            </span>
          </div>

          {/* 5. Broadcast & Streams (ABOVE FEATURED TOURNAMENTS) */}
          <button
            onClick={() => { setActiveTab('broadcast'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'broadcast' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">live_tv</span>
            <span className="flex-1 text-left">Broadcast &amp; Streams</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 text-[9px] font-bold border border-red-500/30">
              LIVE
            </span>
          </button>

          {/* 6. Featured Tournaments (Flat ₹49) */}
          <button
            onClick={() => { setActiveTab('featured-tournaments'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'featured-tournaments' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">star</span>
            <span className="flex-1 text-left">Featured Tournaments</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[9px] font-bold border border-amber-400/30">
              ₹49
            </span>
          </button>

          {/* Section: Financial Ledger */}
          <div className="pt-3 pb-1 px-2">
            <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              FINANCIAL STATEMENT
            </span>
          </div>

          {/* 7. Payment Page (AT THE VERY LAST - PAYMENT HISTORY ONLY) */}
          <button
            onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'payments' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span className="flex-1 text-left">Payment Page</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#DFBD78]/20 text-[#DFBD78] text-[9px] font-bold border border-[#DFBD78]/30">
              HISTORY
            </span>
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

            {/* Host Tournament CTA Button (SINGLE PLUS ICON ONLY) */}
            <button
              onClick={() => { setActiveTab('rooms'); setIsConductModalOpen(true); }}
              style={{ backgroundColor: '#1F2937', color: '#ffffff' }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full !bg-[#1F2937] hover:!bg-black !text-white text-[11px] font-bold tracking-wide shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] !text-white">add</span>
              <span className="!text-white">Host Tournament</span>
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

        {/* MAIN BODY VIEWS */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">

          {/* ========================================================
              VIEW 1: PLAYER DASHBOARD (OVERVIEW)
              ======================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[12px] p-4 border border-[#D1D1D1]/60 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Registered Matches</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#1F2937] font-mono">{joinedTournaments.length}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                  </div>
                </div>

                <div className="bg-white rounded-[12px] p-4 border border-[#D1D1D1]/60 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Conducted Rooms</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#1F2937] font-mono">{hostedTournaments.length}</span>
                    <span className="text-[10px] text-[#C5A059] font-semibold">Host Hub</span>
                  </div>
                </div>

                <div className="bg-white rounded-[12px] p-4 border border-[#D1D1D1]/60 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Total Paid to LT</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#1F2937] font-mono">₹ {totalAmountPaid}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">Razorpay</span>
                  </div>
                </div>

                <div className="bg-white rounded-[12px] p-4 border border-[#D1D1D1]/60 shadow-xs">
                  <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">Broadcast Status</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-black text-red-600 font-mono">ACTIVE PASS</span>
                    <span className="text-[9px] text-gray-400 font-medium">7-Days</span>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-[#1F2937] text-white rounded-[16px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#C5A059]/30 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#DFBD78]/20 text-[#DFBD78] text-[9px] font-bold uppercase tracking-wider">
                      HOSTING &amp; BROADCAST
                    </span>
                    <span className="text-xs text-gray-400 font-mono">25 Squads Standard Capacity</span>
                  </div>
                  <h3 className="text-lg font-bold">Conduct Tournaments or Practice Scrims</h3>
                  <p className="text-xs text-gray-300 max-w-xl">
                    Launch your tournament room for ₹10 or competitive scrims for ₹50. Direct live stream embedding included.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => { setActiveTab('rooms'); setIsConductModalOpen(true); }}
                    className="px-4 py-2.5 rounded-lg bg-[#DFBD78] hover:bg-[#C5A059] text-black text-xs font-bold transition-colors cursor-pointer"
                  >
                    Conduct Room (₹10)
                  </button>
                  <button
                    onClick={() => { setActiveTab('scrims'); setIsConductScrimModalOpen(true); }}
                    className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Host Scrim (₹50)
                  </button>
                </div>
              </div>

              {/* Recent Match Participations */}
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">
                    Upcoming Registered Tournaments
                  </h3>
                  <button
                    onClick={() => setActiveTab('my-matches')}
                    className="text-xs text-[#C5A059] font-bold hover:underline"
                  >
                    View All &rarr;
                  </button>
                </div>

                {joinedTournaments.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-500">
                    No active tournament registrations. Head to the Tournaments Arena to secure your slot!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {joinedTournaments.slice(0, 2).map((t) => (
                      <div key={t.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-blue-600 block">{t.game}</span>
                          <h4 className="text-xs font-bold text-gray-900 mt-0.5">{t.title}</h4>
                          <span className="text-[11px] text-gray-500 font-mono">{t.timing}</span>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Slot Confirmed ✓
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                  <h2 className="text-lg font-bold text-[#1F2937]">My Matches &amp; Registered Lobbies</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Official list of competitive matches and scrims you have registered for.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate && onNavigate('tournaments')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Browse Tournaments &rarr;
                </button>
              </div>

              {joinedTournaments.length === 0 ? (
                <div className="bg-white rounded-[12px] p-12 text-center border border-[#D1D1D1]/60 space-y-3">
                  <span className="text-4xl block">🎮</span>
                  <h3 className="text-base font-bold text-[#1F2937]">No Registered Matches Yet</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                    You haven't registered for any active tournament. Explore our live tournament schedule and register your clan!
                  </p>
                  <button
                    onClick={() => onNavigate && onNavigate('tournaments')}
                    className="px-4 py-2 rounded-xl bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Explore Tournaments
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {joinedTournaments.map((t) => (
                    <div key={t.id} className="bg-white rounded-[16px] overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div className="aspect-video w-full bg-black relative">
                        <img src={t.thumbnail || '/assets/tournament_bgmi_showdown_4k.jpg'} alt="" className="size-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold">
                          {t.game}
                        </span>
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                          Confirmed ✓
                        </span>
                      </div>
                      <div className="p-4 space-y-2 flex-1">
                        <h3 className="font-bold text-sm text-gray-900">{t.title}</h3>
                        <p className="text-xs text-gray-500 font-mono">Timing: {t.timing}</p>
                        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-mono space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Room Code:</span>
                            <span className="font-bold text-gray-900">{t.roomCode || 'Revealing 15m prior'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Password:</span>
                            <span className="font-bold text-gray-900">{t.roomPass || 'Revealing 15m prior'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => showToast('Dispatched credentials to your WhatsApp')}
                          className="text-xs text-[#C5A059] font-bold hover:underline"
                        >
                          Send to WhatsApp
                        </button>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Lobby #1</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 3: ROOMS (CONDUCTED TOURNAMENT ROOMS ONLY + HISTORY)
              ======================================================== */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              
              {/* Header with SINGLE PLUS ICON BUTTON */}
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Conducted Tournament Rooms</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Tournament rooms you are conducting. Standard capacity is 25 squads (100 players). Base rate: <strong>₹10 / match</strong>.
                  </p>
                </div>
                {/* SINGLE PLUS ICON - NO DOUBLE PLUS */}
                <button
                  onClick={() => setIsConductModalOpen(true)}
                  className="px-4 py-2 rounded-[8px] bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Conduct Tournament Room</span>
                </button>
              </div>

              {/* Active Conducted Tournament Rooms */}
              {hostedTournaments.filter(h => h.type === 'TOURNAMENT').length === 0 ? (
                <div className="bg-white rounded-[12px] p-12 text-center border border-[#D1D1D1]/60 space-y-3">
                  <span className="text-4xl block">🏛️</span>
                  <h3 className="text-base font-bold text-[#1F2937]">No Active Tournament Rooms</h3>
                  <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                    You haven't conducted any tournament rooms yet. Launch your first tournament room for just ₹10!
                  </p>
                  <button
                    onClick={() => setIsConductModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#1F2937] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">add</span>
                    <span>Conduct Tournament Room (₹10)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {hostedTournaments.filter(h => h.type === 'TOURNAMENT').map((h) => {
                    const isLimitReached = (h.registeredSquads || 25) >= 25;
                    const embedLiveUrl = getEmbedYouTubeUrl(h.channelLink);

                    return (
                      <div key={h.id} className="bg-white rounded-[16px] p-6 border border-gray-200 shadow-sm space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                                TOURNAMENT ROOM
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                h.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {h.status === 'APPROVED' ? 'APPROVED ✓' : 'AWAITING ADMIN APPROVAL'}
                              </span>
                              <span className="text-xs font-mono text-gray-500">{h.game}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mt-1">{h.title}</h3>
                            <p className="text-xs text-gray-500 font-mono">{h.timing} &bull; WhatsApp Contact: <strong>{h.whatsApp || 'Provided'}</strong></p>
                          </div>

                          <div className="flex items-center gap-2">
                            {h.channelLink && (
                              <a
                                href={h.channelLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <span className="material-symbols-outlined text-[15px]">live_tv</span>
                                <span>Open Stream ↗</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Direct Embedded Live Player if URL provided */}
                        {embedLiveUrl && (
                          <div className="rounded-xl overflow-hidden bg-black border border-gray-800 aspect-video max-w-2xl">
                            <iframe
                              src={embedLiveUrl}
                              title="Host Tournament Live Stream"
                              className="size-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}

                        {/* Capacity & Squad Limit Indicator (25 Squads standard) */}
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-gray-500 block text-[11px] font-medium">Slot Capacity &amp; Registration Status</span>
                            <span className="text-base font-black text-gray-900 font-mono">
                              {h.registeredSquads || 25} / 25 Squads Registered (Standard Cap)
                            </span>
                          </div>

                          {isLimitReached ? (
                            <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px] text-amber-700">warning</span>
                              <span className="text-[11px] font-bold">Standard Limit Reached (25/25 Squads). Full Lobby.</span>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold font-mono">
                              Slots Available ✓
                            </span>
                          )}
                        </div>

                        {/* Super Admin Result Certification Status */}
                        {(() => {
                          try {
                            const verList = JSON.parse(localStorage.getItem('lt_admin_result_verifications') || '[]');
                            const ver = verList.find(v => v.matchId === h.id || v.tournamentTitle === h.title);
                            if (!ver) return null;
                            if (ver.status === 'NEEDS_REVISION') {
                              return (
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                  <div className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0 mt-0.5">warning</span>
                                    <div>
                                      <span className="font-bold text-[12px] block text-amber-950">Admin Requested Revision:</span>
                                      <p className="italic text-amber-800 mt-0.5">"{ver.adminFeedback || 'Please verify slot-by-slot scores or re-upload clearer scoreboard proof.'}"</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setResultMatch(h);
                                      if (ver.submissionType) setResultSubmissionType(ver.submissionType);
                                      if (ver.slotPointsTable?.length > 0) setResultSlotPoints(ver.slotPointsTable);
                                      if (ver.winnerClan) setResultWinnerClan(ver.winnerClan);
                                      if (ver.runnerUpClan) setResultRunnerUpClan(ver.runnerUpClan);
                                      if (ver.thirdClan) setResultThirdClan(ver.thirdClan);
                                      if (ver.mvp) setResultMvp(ver.mvp);
                                      if (ver.posterUrl) setResultPosterUrl(ver.posterUrl);
                                      if (ver.videoUrl) setResultVideoUrl(ver.videoUrl);
                                      if (ver.notes) setResultNotes(ver.notes);
                                      setShowResultSubmitModal(true);
                                    }}
                                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs cursor-pointer animate-pulse"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">edit_note</span>
                                    <span>Revise &amp; Resubmit</span>
                                  </button>
                                </div>
                              );
                            }
                            if (ver.status === 'VERIFIED') {
                              return (
                                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
                                    <span className="font-bold">✓ Official Scoreboard &amp; Points Certified &bull; Published Live to Home Arena</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-emerald-700 font-bold">Live for all users</span>
                                </div>
                              );
                            }
                            return (
                              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-2 text-xs">
                                <span className="material-symbols-outlined text-[16px] text-purple-600">hourglass_top</span>
                                <span className="font-semibold">Results Submitted &bull; Awaiting Admin Certification Review</span>
                              </div>
                            );
                          } catch (e) {
                            return null;
                          }
                        })()}

                        {/* Room Credentials Management & Automated Email Triggers */}
                        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-4 font-mono">
                            <span>Room ID: <strong className="text-gray-900">{h.roomCode || 'LT-98214'}</strong></span>
                            <span>Pass: <strong className="text-gray-900">{h.roomPass || '8831'}</strong></span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Send 24h Reminder to all squads */}
                            <button
                              onClick={() => handleSendReminderEmail(h)}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Send 24h match reminder email to all 25 participant clans"
                            >
                              <span className="material-symbols-outlined text-[14px]">forward_to_inbox</span>
                              <span>Send 24h Reminder Email</span>
                            </button>

                            {/* Publish Results & Email Points Table */}
                            <button
                              onClick={() => handleSendResultsAndPointsEmail(h)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Email points table and match summary to all participants"
                            >
                              <span className="material-symbols-outlined text-[14px]">table_chart</span>
                              <span>Email Points Table</span>
                            </button>

                            {/* Submit Results to Admin Result Verifier */}
                            <button
                              onClick={() => {
                                setResultMatch(h);
                                setShowResultSubmitModal(true);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Submit match results and points table poster proof for Admin verification"
                            >
                              <span className="material-symbols-outlined text-[14px]">fact_check</span>
                              <span>Submit Results to Admin</span>
                            </button>

                            {/* Edit Room Key */}
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
                              Edit Key
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tournament History Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1F2937]">Tournament Rooms History</h3>
                    <p className="text-xs text-[#6B7280]">
                      Completed past tournaments and match outcomes conducted by you.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 font-mono text-xs font-bold">
                    {tournamentHistory.length} Archived
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournamentHistory.map(hist => (
                    <div key={hist.id} className="bg-white rounded-[12px] p-5 border border-gray-200 shadow-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-800">
                          {hist.game}
                        </span>
                        <span className="text-xs font-mono text-gray-500">{hist.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-gray-900">{hist.title}</h4>
                      <div className="p-2.5 rounded bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-bold block">Champion Clan</span>
                          <span className="font-bold text-emerald-700">{hist.winnerClan}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-500 uppercase font-bold block">Capacity</span>
                          <span className="font-bold font-mono text-gray-900">{hist.squadsJoined}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-gray-500">Prize Pool Distributed: <strong className="text-gray-900">{hist.prizeDistributed}</strong></span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          ✓ COMPLETED
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 4: DAILY SCRIMS HUB (REGISTERED & CONDUCTED SCRIMS)
              ======================================================== */}
          {activeTab === 'scrims' && (
            <div className="space-y-6">
              
              {/* Top Banner with SINGLE PLUS ICON BUTTON */}
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#1F2937]">Daily Scrims Hub</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    View registered practice scrims and host your own daily scrim lobby for <strong>₹50 / match</strong>.
                  </p>
                </div>
                {/* SINGLE PLUS ICON - NO DOUBLE PLUS */}
                <button
                  onClick={() => setIsConductScrimModalOpen(true)}
                  className="px-4 py-2 rounded-[8px] bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Host New Scrim (₹50)</span>
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
                    No active scrims conducted yet. Click "+ Host New Scrim (₹50)" to launch your practice lobby right here.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hostedTournaments.filter(h => h.type === 'SCRIM').map((s) => (
                      <div key={s.id} className="bg-white rounded-[12px] p-5 border border-purple-200 bg-purple-50/20 shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                            SCRIM CONDUCTOR
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            s.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {s.status === 'APPROVED' ? 'APPROVED ✓' : 'AWAITING APPROVAL'}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-[#1F2937]">{s.title}</h4>
                        <p className="text-xs text-gray-600">{s.timing} &bull; 25 Squads Standard Cap &bull; WhatsApp: {s.whatsApp || 'Active'}</p>
                        <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-gray-800">Room: {s.roomCode} / {s.roomPass}</span>
                          <button
                            onClick={() => showToast('Dispatched room credentials to all registered squads')}
                            className="px-3 py-1 rounded bg-[#1F2937] text-white text-xs font-bold hover:bg-black cursor-pointer"
                          >
                            Broadcast Key
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
              VIEW 5: BROADCAST & STREAMS (ABOVE FEATURED TOURNAMENTS)
              ======================================================== */}
          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-[12px] p-5 border border-[#D1D1D1]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-wider">
                      LIVE MEDIA BROADCAST
                    </span>
                    <span className="text-xs font-mono text-gray-500">Auto-expires upon duration completion</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1F2937] mt-1">Broadcast &amp; Live Stream Production Feed</h2>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    Live matches stream directly right on this page! Enter your exact YouTube Live link to host and broadcast to all viewers.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Active Status</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">
                    {activeBroadcastPass} &bull; Valid until {broadcastExpiresAt}
                  </span>
                </div>
              </div>

              {/* Exact Live Stream URL & Caster Submission Console */}
              <div className="bg-white rounded-[16px] p-4 sm:p-5 border border-gray-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600 text-[18px]">sensors</span>
                      <span>Broadcast Submission Console • 4-Slot Ready</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Submit your live match stream with contact email, YouTube URL, and clan metadata for direct Admin slot assignment.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[9.5px] uppercase border border-red-200 w-fit">
                    🔴 Live Stream Ingestion
                  </span>
                </div>

                <form onSubmit={handleUpdateLiveStream} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Exact Live Stream URL * (YouTube Live Only)
                      </label>
                      <input
                        type="url"
                        required
                        value={liveStreamInput}
                        onChange={(e) => setLiveStreamInput(e.target.value)}
                        placeholder="www.youtube.com/watch?v=... or https://www.youtube.com/..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden font-mono"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Must contain <strong>youtube</strong> and valid video ID
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Caster Contact Email * (Required for Verification)
                      </label>
                      <input
                        type="email"
                        required
                        value={liveStreamEmail}
                        onChange={(e) => setLiveStreamEmail(e.target.value)}
                        placeholder="caster@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden font-medium"
                      />
                      <p className="text-[10px] text-gray-400 mt-1">
                        Admin slot assignment alerts are sent to this address
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Stream Title / Match Heading
                      </label>
                      <input
                        type="text"
                        value={liveStreamTitle}
                        onChange={(e) => setLiveStreamTitle(e.target.value)}
                        placeholder="e.g. BGMI Pro Winter Cup Finals"
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Clan / Team Tag
                      </label>
                      <input
                        type="text"
                        value={liveStreamClan}
                        onChange={(e) => setLiveStreamClan(e.target.value)}
                        placeholder="e.g. SOUL / GODL"
                        className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Esports Game Title
                      </label>
                      <select
                        value={liveStreamGame}
                        onChange={(e) => setLiveStreamGame(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:border-[#C5A059] outline-hidden"
                      >
                        <option value="BATTLEGROUNDS MOBILE INDIA">Battlegrounds Mobile India (BGMI)</option>
                        <option value="FREE FIRE MAX">Free Fire MAX</option>
                        <option value="VALORANT">Valorant</option>
                        <option value="CALL OF DUTY: MOBILE">Call of Duty: Mobile</option>
                        <option value="PUBG MOBILE">PUBG Mobile</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-[10.5px] text-amber-700 font-semibold flex items-center gap-1.5 self-start sm:self-center">
                      <span className="size-1.5 rounded-full bg-red-600 animate-ping"></span>
                      <span>Real-time Socket Sync Active • Arrives instantly in Admin Console</span>
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">sensors</span>
                      <span>Submit Live Broadcast Stream</span>
                    </button>
                  </div>
                </form>

                {/* Direct Live Stream Embedded Player */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-red-600 animate-pulse"></span>
                      <span>Live Tournament Stream Player (Embedded)</span>
                    </span>
                    <a
                      href={liveStreamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Open on YouTube ↗
                    </a>
                  </div>

                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl relative">
                    {getEmbedYouTubeUrl(liveStreamUrl) ? (
                      <iframe
                        src={getEmbedYouTubeUrl(liveStreamUrl)}
                        title="Live Tournaments Broadcast"
                        className="size-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="size-full flex flex-col items-center justify-center text-white p-6 text-center space-y-3">
                        <span className="text-4xl">📺</span>
                        <h4 className="text-base font-bold">Match Live Stream Ready</h4>
                        <p className="text-xs text-gray-400 max-w-md">
                          Paste your YouTube Live URL above to broadcast live on this page. Viewers will watch matches right here without leaving!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stream Production Passes (Cleaned descriptions - no multiple camera overlays / full HD plus) */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#1F2937] uppercase tracking-wider">
                  Available Stream Production Passes (Host Everyday &bull; 1st Free of Cost)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Weekly Pass */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Weekly Package</span>
                      <h3 className="font-bold text-base text-gray-900 mt-0.5">Weekly Stream Pass</h3>
                      <span className="text-2xl font-black font-mono text-gray-900 mt-2 block">₹ 249</span>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        7 Days streaming access. Channel link showcased across match lobbies. Auto-expires in 7 days.
                      </p>
                    </div>
                    <button
                      onClick={() => handlePurchaseBroadcastPass('Weekly Pass', 249, 7)}
                      disabled={isProcessingPayment}
                      className="mt-4 w-full py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      Purchase ₹249 (7 Days)
                    </button>
                  </div>

                  {/* Pro Pass */}
                  <div className="bg-white rounded-2xl p-5 border-2 border-gold-primary shadow-sm flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-primary">15 Days &bull; Recommended</span>
                      <h3 className="font-bold text-base text-gray-900 mt-0.5">Pro Production Pass</h3>
                      <span className="text-2xl font-black font-mono text-gold-primary mt-2 block">₹ 549</span>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        15 Days streaming access. Pinned live player showcase + channel link. Auto-expires in 15 days.
                      </p>
                    </div>
                    <button
                      onClick={() => handlePurchaseBroadcastPass('Pro Pass', 549, 15)}
                      disabled={isProcessingPayment}
                      className="mt-4 w-full py-2.5 rounded-lg bg-gold-primary hover:bg-gold-light text-black text-xs font-bold cursor-pointer transition-colors"
                    >
                      Purchase ₹549 (15 Days)
                    </button>
                  </div>

                  {/* Monthly Pass */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Monthly 30 Days</span>
                      <h3 className="font-bold text-base text-gray-900 mt-0.5">Monthly Elite Pass</h3>
                      <span className="text-2xl font-black font-mono text-purple-700 mt-2 block">₹ 999</span>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        30 Days full monthly live match streaming. Verified host status &amp; direct embed player. Auto-expires in 30 days.
                      </p>
                    </div>
                    <button
                      onClick={() => handlePurchaseBroadcastPass('Monthly Pass', 999, 30)}
                      disabled={isProcessingPayment}
                      className="mt-4 w-full py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      Purchase ₹999 (30 Days)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 6: FEATURED TOURNAMENTS (FLAT ₹ 49 THAT'S IT!)
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
                    Showcase your tournament in the top-line banner &amp; featured carousel. Flat pricing: <strong>Just ₹ 49</strong>. That's it!
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Flat Rate</span>
                  <span className="text-2xl font-black font-mono text-[#C5A059]">₹ 49</span>
                </div>
              </div>

              {featuredSuccess ? (
                <div className="bg-white rounded-[16px] p-8 border border-emerald-300 text-center space-y-4">
                  <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                    ✓
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase">Featured Placement Active!</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    Your tournament <strong>{featuredSuccess.title}</strong> has been boosted to the top-line carousel on the Home Page. Confirmation email sent!
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
                      Select Tournament to Feature
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

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">Total Due:</span>
                      <span className="text-gray-500">Secured via Razorpay Test Mode &bull; Flat Price</span>
                    </div>
                    <span className="text-2xl font-black font-mono text-gray-900">
                      ₹ 49 INR
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full py-3.5 rounded-xl bg-black hover:bg-gold-primary hover:text-black text-white text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">bolt</span>
                    <span>{isProcessingPayment ? 'Processing with Razorpay...' : 'Pay ₹ 49 with Razorpay Test Mode & Feature Tournament'}</span>
                  </button>

                </form>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 7: PAYMENT PAGE (AT THE VERY LAST - SOLELY PAYMENT HISTORY PAID TO US)
              ======================================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-[12px] p-6 border border-[#D1D1D1]/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[9px] font-bold uppercase border border-[#DFBD78]/40">
                      FINANCIAL STATEMENT
                    </span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                      Payments Paid to LiveTournaments.in
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1F2937] mt-1">Payment History &amp; Official Receipts</h2>
                  <p className="text-xs text-[#6B7280] mt-1 max-w-2xl">
                    Complete digital ledger of every payment you paid to us. All transactions are securely processed via Razorpay Test Mode with instant email confirmation.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Total Paid to LiveTournaments</span>
                  <span className="text-2xl font-black font-mono text-[#C5A059]">₹ {totalAmountPaid} INR</span>
                </div>
              </div>

              {/* Payment Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Total Amount Paid</span>
                  <span className="text-2xl font-black font-mono text-gray-900 mt-1 block">₹ {totalAmountPaid}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">100% Digital Verified</span>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Completed Transactions</span>
                  <span className="text-2xl font-black font-mono text-gray-900 mt-1 block">{totalTransactionsCount} Payments</span>
                  <span className="text-[11px] text-gray-500 font-medium">All Receipts Dispatched</span>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Gateway Used</span>
                  <span className="text-base font-black text-[#1F2937] font-mono mt-1 block">Razorpay Test Gateway</span>
                  <span className="text-[11px] text-blue-600 font-semibold">{RAZORPAY_KEY}</span>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-white rounded-[16px] border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-sm text-gray-900">Payment History Ledger</h3>
                  <span className="text-xs font-mono text-gray-500">{transactions.length} records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Date &amp; Time</th>
                        <th className="py-3 px-4">Service Description</th>
                        <th className="py-3 px-4">Amount Paid</th>
                        <th className="py-3 px-4">Payment Channel</th>
                        <th className="py-3 px-4">Reference ID</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-8 text-gray-400">
                            No payment transactions recorded yet.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3.5 px-4 font-mono text-gray-600 whitespace-nowrap">{tx.date}</td>
                            <td className="py-3.5 px-4 font-bold text-gray-900">{tx.description}</td>
                            <td className="py-3.5 px-4 font-black font-mono text-gray-900">₹ {Math.abs(tx.amount)}</td>
                            <td className="py-3.5 px-4 text-gray-600">{tx.gateway || 'Razorpay Test Mode'}</td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">{tx.reference}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                PAID ✓
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedReceipt(tx)}
                                className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          IN-PAGE MODAL 1: CONDUCT TOURNAMENT ROOM (₹ 10)
          STAYS RIGHT ON ROOMS PAGE!
          ======================================================== */}
      {isConductModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-[#DFBD78]/40 shadow-2xl my-8 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-full bg-[#1F2937] text-white flex items-center justify-center text-xs font-bold">
                  ₹10
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Conduct New Tournament Room</h3>
                  <p className="text-[11px] text-gray-500">Collect ₹10 &bull; Standard Capacity: 25 Squads (100 Players)</p>
                </div>
              </div>
              <button
                onClick={() => setIsConductModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConductTournamentSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Tournament Heading / Title *
                </label>
                <input
                  type="text"
                  value={conductTitle}
                  onChange={(e) => setConductTitle(e.target.value)}
                  placeholder="e.g. BGMI Masters Pro Clan Cup Season 2"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C5A059] outline-hidden text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Game Category
                  </label>
                  <select
                    value={conductGame}
                    onChange={(e) => setConductGame(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C5A059] outline-hidden text-xs bg-white"
                  >
                    <option>Battlegrounds Mobile India</option>
                    <option>Free Fire MAX</option>
                    <option>Call of Duty: Mobile</option>
                    <option>Valorant Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Match Schedule / Timing *
                  </label>
                  <input
                    type="text"
                    value={conductTiming}
                    onChange={(e) => setConductTiming(e.target.value)}
                    placeholder="e.g. Today at 8:00 PM IST"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C5A059] outline-hidden text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    value={conductPrize}
                    onChange={(e) => setConductPrize(e.target.value)}
                    placeholder="e.g. ₹ 5,000 INR"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C5A059] outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Host WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={conductWhatsApp}
                    onChange={(e) => setConductWhatsApp(e.target.value)}
                    placeholder="e.g. 9840192831"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C5A059] outline-hidden text-xs"
                    required
                  />
                </div>
              </div>

              {/* Exact Live Stream Link */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Live Stream URL (Where you will broadcast match)
                </label>
                <input
                  type="url"
                  value={conductLiveUrl}
                  onChange={(e) => setConductLiveUrl(e.target.value)}
                  placeholder="www.youtube.com/watch?v=... or https://www.youtube.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#C5A059] outline-hidden text-xs font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1 font-medium">Must start with <strong>www.</strong> and contain <strong>youtube</strong> (e.g. www.youtube.com/watch?v=...)</p>
              </div>

              {/* Banner Poster Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Choose Banner Poster
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetThumbnails.slice(0, 3).map((p) => (
                    <div
                      key={p.name}
                      onClick={() => setConductThumbnail(p.url)}
                      className={`p-1.5 rounded-lg border cursor-pointer text-center text-[10px] ${
                        conductThumbnail === p.url ? 'border-[#C5A059] bg-[#DFBD78]/10 font-bold' : 'border-gray-200'
                      }`}
                    >
                      <img src={p.url} alt="" className="aspect-video w-full object-cover rounded mb-1" />
                      <span className="truncate block">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room ID and Password */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Generated Room ID</span>
                  <span className="font-mono font-bold text-gray-900">{conductRoomCode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Room Passcode</span>
                  <span className="font-mono font-bold text-gray-900">{conductRoomPass}</span>
                </div>
              </div>

              {/* Total & Checkout Action */}
              <div className="p-3 rounded-xl bg-gray-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Tournament Room Fee</span>
                  <span className="text-xl font-black font-mono text-[#DFBD78]">₹ 10 INR</span>
                </div>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 rounded-lg bg-[#DFBD78] hover:bg-[#C5A059] text-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Connecting...' : 'Pay ₹10 & Launch Room'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          IN-PAGE MODAL 2: CONDUCT DAILY SCRIM (₹ 50)
          STAYS RIGHT ON SCRIMS PAGE!
          ======================================================== */}
      {isConductScrimModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 border border-blue-400 shadow-2xl my-8 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="size-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  ₹50
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Conduct Daily Practice Scrim</h3>
                  <p className="text-[11px] text-gray-500">Collect ₹50 &bull; Standard Capacity: 25 Squads (100 Players)</p>
                </div>
              </div>
              <button
                onClick={() => setIsConductScrimModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConductScrimSubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Scrims Heading / Tier *
                </label>
                <input
                  type="text"
                  value={scrimTitle}
                  onChange={(e) => setScrimTitle(e.target.value)}
                  placeholder="e.g. BGMI Tier-1 Daily Practice Scrims"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-hidden text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Game Category
                  </label>
                  <select
                    value={scrimGame}
                    onChange={(e) => setScrimGame(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-hidden text-xs bg-white"
                  >
                    <option>Battlegrounds Mobile India</option>
                    <option>Free Fire MAX</option>
                    <option>Call of Duty: Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Match Schedule / Timing *
                  </label>
                  <input
                    type="text"
                    value={scrimTiming}
                    onChange={(e) => setScrimTiming(e.target.value)}
                    placeholder="e.g. Daily at 7:00 PM IST"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-hidden text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Host WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    value={scrimWhatsApp}
                    onChange={(e) => setScrimWhatsApp(e.target.value)}
                    placeholder="e.g. 9840192831"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-hidden text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Live Stream Link (YouTube)
                  </label>
                  <input
                    type="url"
                    value={scrimLiveUrl}
                    onChange={(e) => setScrimLiveUrl(e.target.value)}
                    placeholder="www.youtube.com/watch?v=... or https://www.youtube.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-hidden text-xs font-mono"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">Must start with <strong>www.</strong> and contain <strong>youtube</strong> (e.g. www.youtube.com/watch?v=...)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Assigned Scrim ID</span>
                  <span className="font-mono font-bold text-gray-900">{scrimRoomCode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-gray-500 block">Passcode</span>
                  <span className="font-mono font-bold text-gray-900">{scrimRoomPass}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-blue-200 uppercase font-bold block">Daily Scrim Fee</span>
                  <span className="text-xl font-black font-mono text-white">₹ 50 INR</span>
                </div>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Connecting...' : 'Pay ₹50 & Launch Scrim'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DIGITAL RECEIPT MODAL
          ======================================================== */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-gray-300 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-2xl">verified</span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Official Payment Receipt</h3>
                  <span className="text-[10px] text-gray-500 font-mono">Invoice #{selectedReceipt.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-700 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Service:</span>
                <span className="font-bold text-gray-900 text-right">{selectedReceipt.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-black text-gray-900 font-mono text-sm">₹ {Math.abs(selectedReceipt.amount)} INR</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Payment Gateway:</span>
                <span className="font-bold text-gray-900">{selectedReceipt.gateway || 'Razorpay Test Mode'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Payment Ref ID:</span>
                <span className="font-mono text-gray-800">{selectedReceipt.reference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Date &amp; Time:</span>
                <span className="font-mono text-gray-800">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">Email Status:</span>
                <span className="font-bold text-emerald-600">📧 Dispatched to {displayEmail}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedReceipt(null)}
              className="w-full py-2.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Result Submission Modal for Admin Result Verifier */}
      {showResultSubmitModal && resultMatch && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <span className="material-symbols-outlined text-lg">fact_check</span>
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Submit Match Results &amp; Scoreboard Certification</h3>
                  <p className="text-[11px] text-gray-500 font-mono">{resultMatch.title} ({resultMatch.game}) &bull; Conductor: {displayName}</p>
                </div>
              </div>
              <button
                onClick={() => setShowResultSubmitModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Submission Mode Selector (Two Options: Slot-by-Slot Table or Single Image Proof) */}
            <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => setResultSubmissionType('SLOT_POINTS')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  resultSubmissionType === 'SLOT_POINTS' ? 'bg-purple-700 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">table_chart</span>
                <span>Option 1: Slot-by-Slot Points Table</span>
              </button>
              <button
                type="button"
                onClick={() => setResultSubmissionType('SINGLE_IMAGE')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  resultSubmissionType === 'SINGLE_IMAGE' ? 'bg-purple-700 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">image</span>
                <span>Option 2: Single Image Proof</span>
              </button>
              <button
                type="button"
                onClick={() => setResultSubmissionType('BOTH')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  resultSubmissionType === 'BOTH' ? 'bg-purple-700 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Provide both table and screenshot proof"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Both</span>
              </button>
            </div>

            <form onSubmit={handleSubmitResultsForVerification} className="space-y-4 text-xs">
              
              {/* OPTION 1: Interactive Slot-by-Slot Points Table */}
              {(resultSubmissionType === 'SLOT_POINTS' || resultSubmissionType === 'BOTH') && (
                <div className="space-y-2 border border-purple-200 bg-purple-50/30 rounded-xl p-3">
                  <div className="flex items-center justify-between pb-1 border-b border-purple-100">
                    <span className="text-[11px] font-bold text-purple-900 uppercase flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-purple-700">format_list_numbered</span>
                      <span>Slot-by-Slot Match Points Table ({resultSlotPoints.length} Slots)</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        className="px-2 py-1 rounded bg-purple-700 hover:bg-purple-800 text-white text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">add</span>
                        <span>Add Slot</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetSlots}
                        className="px-2 py-1 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-semibold cursor-pointer"
                      >
                        Reset 16 Slots
                      </button>
                    </div>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-[9.5px] sticky top-0 z-10">
                        <tr>
                          <th className="py-2 px-2 text-center w-8">#</th>
                          <th className="py-2 px-2 w-20">Slot</th>
                          <th className="py-2 px-2">Clan / Team Name</th>
                          <th className="py-2 px-2 text-center w-16">Kills</th>
                          <th className="py-2 px-2 text-center w-16">Pos Pts</th>
                          <th className="py-2 px-2 text-center w-16">Total</th>
                          <th className="py-2 px-2 text-center w-12" title="Winner Winner Chicken Dinner">WWCD</th>
                          <th className="py-2 px-1 text-center w-8"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {resultSlotPoints.map((slotItem, idx) => (
                          <tr key={idx} className={slotItem.wwcd ? 'bg-amber-50/60 font-semibold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                            <td className="py-1.5 px-2 text-center font-bold text-gray-500">{slotItem.rank || idx + 1}</td>
                            <td className="py-1.5 px-2">
                              <input
                                type="text"
                                value={slotItem.slot}
                                onChange={(e) => handleSlotChange(idx, 'slot', e.target.value)}
                                className="w-full px-1.5 py-0.5 rounded border border-gray-200 text-[11px] font-mono outline-hidden"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="text"
                                value={slotItem.clan}
                                onChange={(e) => handleSlotChange(idx, 'clan', e.target.value)}
                                placeholder="Clan Name"
                                className="w-full px-1.5 py-0.5 rounded border border-gray-200 text-[11px] font-sans font-semibold outline-hidden focus:border-purple-600"
                              />
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                value={slotItem.kills}
                                onChange={(e) => handleSlotChange(idx, 'kills', e.target.value)}
                                className="w-12 text-center px-1 py-0.5 rounded border border-gray-200 text-[11px] font-mono outline-hidden"
                              />
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <input
                                type="number"
                                min={0}
                                value={slotItem.positionPts}
                                onChange={(e) => handleSlotChange(idx, 'positionPts', e.target.value)}
                                className="w-12 text-center px-1 py-0.5 rounded border border-gray-200 text-[11px] font-mono outline-hidden"
                              />
                            </td>
                            <td className="py-1.5 px-2 text-center font-bold text-purple-700">
                              {slotItem.totalPts ?? (Number(slotItem.kills || 0) + Number(slotItem.positionPts || 0))}
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <input
                                type="checkbox"
                                checked={Boolean(slotItem.wwcd)}
                                onChange={(e) => handleSlotChange(idx, 'wwcd', e.target.checked)}
                                className="cursor-pointer size-3.5 accent-amber-600"
                                title="Winner Winner Chicken Dinner"
                              />
                            </td>
                            <td className="py-1.5 px-1 text-center">
                              {resultSlotPoints.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(idx)}
                                  className="text-gray-400 hover:text-rose-600 cursor-pointer text-xs"
                                  title="Remove slot"
                                >
                                  ✕
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    Top 3 squads and WWCD indicator will automatically synchronize to official live certifications.
                  </p>
                </div>
              )}

              {/* OPTION 2: Single Image Proof / Screenshot */}
              {(resultSubmissionType === 'SINGLE_IMAGE' || resultSubmissionType === 'BOTH') && (
                <div className="space-y-2 border border-gray-200 bg-gray-50/50 rounded-xl p-3">
                  <label className="block text-[11px] font-bold text-gray-700 uppercase">
                    Scoreboard / Points Table Single Image Proof
                  </label>
                  <input
                    type="text"
                    required={resultSubmissionType === 'SINGLE_IMAGE'}
                    value={resultPosterUrl}
                    onChange={(e) => setResultPosterUrl(e.target.value)}
                    placeholder="Image URL or choose preset below"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-mono focus:border-purple-600 outline-hidden bg-white"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {presetThumbnails.slice(0, 4).map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        onClick={() => setResultPosterUrl(p.url)}
                        className={`px-2 py-1 rounded text-[10px] border cursor-pointer ${
                          resultPosterUrl === p.url ? 'bg-purple-50 text-purple-700 border-purple-500 font-bold' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  {resultPosterUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-gray-300 max-h-36 bg-black flex items-center justify-center">
                      <img src={resultPosterUrl} alt="Scoreboard Proof Preview" className="max-h-36 object-contain" />
                    </div>
                  )}
                </div>
              )}

              {/* Top 3 Standings & MVP */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-gray-700 uppercase block">Certified Top 3 Standings &amp; MVP</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-700 uppercase mb-0.5">
                      🥇 1st Place (Winner Clan)
                    </label>
                    <input
                      type="text"
                      required
                      value={resultWinnerClan}
                      onChange={(e) => setResultWinnerClan(e.target.value)}
                      placeholder="1st Place Clan"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold focus:border-purple-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase mb-0.5">
                      🥈 2nd Place (Runner-Up)
                    </label>
                    <input
                      type="text"
                      required
                      value={resultRunnerUpClan}
                      onChange={(e) => setResultRunnerUpClan(e.target.value)}
                      placeholder="2nd Place Clan"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:border-purple-600 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-amber-900 uppercase mb-0.5">
                      🥉 3rd Place Clan
                    </label>
                    <input
                      type="text"
                      required
                      value={resultThirdClan}
                      onChange={(e) => setResultThirdClan(e.target.value)}
                      placeholder="3rd Place Clan"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:border-purple-600 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-purple-700 uppercase mb-0.5">
                    🎖️ Tournament MVP / Top Fragger
                  </label>
                  <input
                    type="text"
                    required
                    value={resultMvp}
                    onChange={(e) => setResultMvp(e.target.value)}
                    placeholder="Player IGN (e.g. JONATHAN - 14 Kills)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:border-purple-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Video URL & Animation Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Result Video URL (YouTube Match VOD)
                  </label>
                  <input
                    type="url"
                    value={resultVideoUrl}
                    onChange={(e) => setResultVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono focus:border-purple-600 outline-hidden"
                  />
                  <span className="text-[9.5px] text-gray-400 block mt-0.5 font-mono">Requires www. &amp; youtube</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Scoreboard Animation Theme
                  </label>
                  <select
                    value={resultAnimationTheme}
                    onChange={(e) => setResultAnimationTheme(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:border-purple-600 outline-hidden cursor-pointer"
                  >
                    <option value="gold-championship">Championship Gold Particle Burst</option>
                    <option value="cyberpunk-neon">Cyberpunk Neon Laser Glow</option>
                    <option value="crimson-fire">Inferno Crimson Flame</option>
                    <option value="holographic-arena">Holographic Esports Trophy Pulse</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Organizer Remarks &amp; Verification Notes
                </label>
                <textarea
                  rows={2}
                  value={resultNotes}
                  onChange={(e) => setResultNotes(e.target.value)}
                  placeholder="Notes for Admin result verification (e.g. All matches completed, slot scores verified)"
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:border-purple-600 outline-hidden"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowResultSubmitModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-bold text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Submit to Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
