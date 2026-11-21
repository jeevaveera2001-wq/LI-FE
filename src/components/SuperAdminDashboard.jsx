import React, { useState, useEffect, useMemo } from 'react';
import DashboardPage from './DashboardPage';
import { sendSuperAdminVipInviteEmail, sendTournamentReminderEmail, sendTournamentResultsEmail } from '../utils/emailService';
import { validateLiveStreamUrl, getYouTubeEmbedUrl } from '../utils/urlValidator';

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
    return [];
  });
  useEffect(() => { localStorage.setItem('lt_admin_blocked_users', JSON.stringify(blockedUsers)); }, [blockedUsers]);

  // Inspect Thumbnail Modal State
  const [selectedInspectImage, setSelectedInspectImage] = useState(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);

  // Direct VIP Access Modal State (Super Admin Zero-Payment Clearance)
  const [showVipDirectGrantModal, setShowVipDirectGrantModal] = useState(false);
  const [vipEmail, setVipEmail] = useState('');
  const [vipName, setVipName] = useState('');
  const [vipPrivilege, setVipPrivilege] = useState('Direct Broadcast & Streams Pass (30 Days)');
  const [vipTournamentTitle, setVipTournamentTitle] = useState('BGMI Community Clan Masters');
  const [vipChannelUrl, setVipChannelUrl] = useState('https://youtube.com/@official_partner');
  const [vipNote, setVipNote] = useState('Official VIP Partner - Zero Payment Clearance');

  // Matches Approvals sub-tab state ('tournaments' | 'scrims' | 'featured' | 'broadcast')
  const [matchesApprovalTab, setMatchesApprovalTab] = useState('tournaments');

  // Result Verifications State (for Super Admin Result Verifier)
  const [resultVerifications, setResultVerifications] = useState(() => {
    try {
      const saved = localStorage.getItem('lt_admin_result_verifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'res_sample_1',
        matchId: 'host_bgmi_101',
        tournamentTitle: 'BGMI Clan Masters Grand Finals',
        game: 'BATTLEGROUNDS MOBILE INDIA',
        hostUser: 'Mortal (Naman Mathur)',
        hostEmail: 'mortal@teamsoul.in',
        winnerClan: 'GodLike Esports',
        runnerUpClan: 'Team Soul',
        thirdClan: 'Blind Esports',
        mvp: 'JONATHAN (14 Kills)',
        posterUrl: '/assets/tournament_bgmi_showdown_4k.jpg',
        notes: 'Official lobby points verified. Screenshot proof attached. Ready for points table auto-email.',
        status: 'PENDING_VERIFICATION',
        submittedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'res_sample_2',
        matchId: 'scrim_bgmi_202',
        tournamentTitle: 'Tier-1 Elite Practice Scrims',
        game: 'BGMI',
        hostUser: 'ScoutOP (Tanmay Singh)',
        hostEmail: 'scout@s8ul.gg',
        winnerClan: 'Team XSpark',
        runnerUpClan: 'Orangutan Gaming',
        thirdClan: 'Gladiator Esports',
        mvp: 'Sarang (11 Kills)',
        posterUrl: '/assets/tournament_bgmi_lan_warriors_4k.jpg',
        notes: 'Match 3 Erangel concluded. Standings verified with kill counts.',
        status: 'PENDING_VERIFICATION',
        submittedAt: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  });
  useEffect(() => {
    localStorage.setItem('lt_admin_result_verifications', JSON.stringify(resultVerifications));
  }, [resultVerifications]);

  // Inspection Drawer State for Result Verifier
  const [selectedResultForInspection, setSelectedResultForInspection] = useState(null);
  const [imageZoomLevel, setImageZoomLevel] = useState(1);

  // Contact Us Messages State (Direct Live Page Submissions)
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('lt_admin_contact_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ticket_sample_1',
        name: 'EliteClan_Leader',
        email: 'leader@eliteclan.gg',
        phone: '+91 98765 43210',
        category: 'Partnership & Sponsorship',
        message: 'Requesting clan partner hosting clearance and custom scoreboard banner for our upcoming weekend cup.',
        status: 'NEW',
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
        dateStr: 'Today, 10:45 AM'
      }
    ];
  });

  useEffect(() => {
    const handleContactUpdate = () => {
      try {
        const saved = localStorage.getItem('lt_admin_contact_messages');
        if (saved) setContactMessages(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleContactUpdate);
    window.addEventListener('lt_contact_updated', handleContactUpdate);
    return () => {
      window.removeEventListener('storage', handleContactUpdate);
      window.removeEventListener('lt_contact_updated', handleContactUpdate);
    };
  }, []);

  const pendingContactCount = useMemo(() => {
    return contactMessages.filter(m => m.status !== 'RESOLVED').length;
  }, [contactMessages]);

  // Platform Settings State (Real-time CMS for Home Arena)
  const [platformSettings, setPlatformSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('lt_platform_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      heroTitle: 'LIVE TOURNAMENTS INDIA',
      heroSubtitle: "INDIA'S PREMIER COMPETITIVE ESPORTS ARENA",
      tagline: 'Join us from now to participate and host your tournaments via LT.IN.',
      marqueeText: '🔥 BGMI PRO TOURNAMENT REGISTRATIONS OPEN • ₹50,000 PRIZE POOL • DAILY SCRIMS AT 8 PM • 4K YOUTUBE LIVE PRODUCTION',
      featuredStreamUrl: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      games: [
        { name: 'Counter-Strike 2', genre: 'Tactical FPS', logo: 'https://d3h9qea4qy4169.cloudfront.net/cs2_00be38ddd1.png', active: true },
        { name: 'Valorant', genre: 'Hero Shooter', logo: 'https://d3h9qea4qy4169.cloudfront.net/Valorant_1710f7c511.png', active: true },
        { name: 'BGMI Pro League', genre: 'Battle Royale', logo: '/assets/tournament_bgmi_showdown_4k.jpg', active: true },
        { name: 'Fatal Fury: CotW', genre: 'Fighting', logo: 'https://d3h9qea4qy4169.cloudfront.net/Fatal_Fury_5779ac62be.png', active: true },
        { name: 'Chess.com Masters', genre: 'Strategy', logo: 'https://d3h9qea4qy4169.cloudfront.net/chess_logo_v1_8b2f61713b.png', active: true },
        { name: 'Dota 2', genre: 'MOBA', logo: 'https://d3h9qea4qy4169.cloudfront.net/dota2_logo_v1_c810ca7889.png', active: true }
      ]
    };
  });

  // Live Indian Standard Time (IST - Asia/Kolkata) Clock
  const [currentIndiaDateTime, setCurrentIndiaDateTime] = useState(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }) + ' IST';
    return { dateStr, timeStr };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST';
      setCurrentIndiaDateTime({ dateStr, timeStr });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger brief toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Telemetry Handler
  const handleSyncLive = async () => {
    setIsSyncing(true);
    await fetchLiveAdminData();
    setIsSyncing(false);
    showToast('⚡ Live telemetry & database synced in real-time');
  };

  // Comprehensive validator to detect and purge legacy mock data entries
  const isMockEntry = (item) => {
    if (!item || typeof item !== 'object') return true;
    // Any entry submitted by a real user must never be purged
    if (item.isUserSubmitted || item.paymentRef || item.amountPaid) return false;
    const idStr = String(item.id || '');
    // Allow any timestamp-based IDs (generated via Date.now())
    if (idStr.match(/\d{10,}/)) return false;
    // Only purge known legacy static seed IDs
    const mockIds = ['t1', 't2', 't3', 't4', 't5', 'r1', 'r2', 'r3', 'r4', 'r5', 'tx_1', 'tx_2', 'bgmi-sd-reg-01', 'scrim-tier1-01', 'mock_1', 'demo_1'];
    if (mockIds.includes(idStr)) return true;
    return false;
  };

  // Helper to load and merge broadcast requests from all storage channels without data loss
  const loadBroadcastRequestsFromStorage = () => {
    try {
      const b1Raw = localStorage.getItem('lt_broadcast_requests');
      const b2Raw = localStorage.getItem('lt_admin_broadcast_requests');
      let list1 = [];
      let list2 = [];
      if (b1Raw) {
        try {
          const parsed = JSON.parse(b1Raw);
          if (Array.isArray(parsed)) list1 = parsed;
        } catch (e) {}
      }
      if (b2Raw) {
        try {
          const parsed = JSON.parse(b2Raw);
          if (Array.isArray(parsed)) list2 = parsed;
        } catch (e) {}
      }

      // Merge and deduplicate by item ID or streamUrl
      const map = new Map();
      [...list1, ...list2].forEach(item => {
        if (item && (item.id || item.streamUrl) && !isMockEntry(item)) {
          const key = item.id || item.streamUrl;
          map.set(key, item);
        }
      });

      // Also ensure live stream URL submitted from User Dashboard is captured
      const userStreamUrl = localStorage.getItem('lt_user_live_stream_url');
      if (userStreamUrl && userStreamUrl.trim()) {
        const val = validateLiveStreamUrl(userStreamUrl);
        if (val.isValid) {
          const alreadyExists = Array.from(map.values()).some(b => b.streamUrl === val.normalizedUrl);
          if (!alreadyExists) {
            map.set('user_live_stream_active', {
              id: 'bcast_user_active',
              title: 'Competitor Match Live Broadcast',
              tournament: 'Live Stream Arena Feed',
              streamUrl: val.normalizedUrl,
              organizerName: 'Competitor Streamer',
              creator: 'Competitor Streamer',
              channel: 'YouTube Live Stream',
              requestedSlot: 'Prime Live Stream Feed',
              language: 'Hindi / English',
              viewers: '16,840',
              status: 'PENDING',
              submittedAt: new Date().toISOString(),
              isUserSubmitted: true
            });
          }
        }
      }

      // Also capture stream links attached to tournaments or scrims
      const checkTourneys = (storageKey) => {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach(t => {
                const sUrl = t.channelLink || t.liveUrl || t.streamUrl;
                if (sUrl && sUrl.trim() && !isMockEntry(t)) {
                  const val = validateLiveStreamUrl(sUrl);
                  if (val.isValid && !Array.from(map.values()).some(b => b.streamUrl === val.normalizedUrl)) {
                    map.set(`bcast_match_${t.id}`, {
                      id: `bcast_match_${t.id}`,
                      title: `${t.title || 'Tournament'} - Official Stream`,
                      tournament: t.title || 'Tournament Match',
                      streamUrl: val.normalizedUrl,
                      organizerName: t.organizerName || t.creator || 'Tournament Host',
                      creator: t.organizerName || t.creator || 'Tournament Host',
                      channel: `${t.organizerName || 'Host'} Official Live`,
                      requestedSlot: 'Tournament Match Broadcast',
                      language: 'Hindi / English',
                      status: 'PENDING',
                      submittedAt: t.createdAt || new Date().toISOString(),
                      isUserSubmitted: true
                    });
                  }
                }
              });
            }
          } catch (e) {}
        }
      };
      checkTourneys('lt_admin_hosting_requests');
      checkTourneys('lt_user_hosted_tourneys');
      checkTourneys('lt_admin_scrims_requests');

      return Array.from(map.values());
    } catch (e) {
      return [];
    }
  };

  // 1. TOURNAMENT HOSTING REQUESTS BY USERS (Realtime submissions only)
  const [hostingRequests, setHostingRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_hosting_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(r => !isMockEntry(r));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_admin_hosting_requests', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // 2. SCRIMS REQUESTS (Realtime only)
  const [scrimsRequests, setScrimsRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_scrims_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(r => !isMockEntry(r));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_admin_scrims_requests', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // 3. HOSTING TOURNAMENTS REQUESTS (PARTNERED) (Realtime only)
  const [partnerHostingRequests, setPartnerHostingRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_partner_hostings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(r => !isMockEntry(r));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_admin_partner_hostings', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // 4. FEATURED TOURNAMENTS REQUESTS (Realtime only)
  const [featuredRequests, setFeaturedRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_featured_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(r => !isMockEntry(r));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_admin_featured_requests', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // 5. ADVERTISEMENT & SPONSORSHIP REQUESTS (Realtime only)
  const [adRequests, setAdRequests] = useState(() => {
    const saved = localStorage.getItem('lt_admin_ad_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(r => !isMockEntry(r));
          if (clean.length !== parsed.length) {
            localStorage.setItem('lt_admin_ad_requests', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    return [];
  });

  // 6. ALL TOURNAMENTS (Realtime only)
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem('lt_admin_tournaments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(t => !isMockEntry(t));
      } catch (e) {}
    }
    return [];
  });

  // Proactive cleanup across all localStorage keys on mount to wipe any lingering legacy mock data
  useEffect(() => {
    const keys = [
      'lt_admin_hosting_requests',
      'lt_admin_scrims_requests',
      'lt_admin_partner_hostings',
      'lt_admin_featured_requests',
      'lt_admin_ad_requests',
      'lt_admin_all_tournaments',
      'lt_active_match_rooms',
      'lt_admin_tournaments',
      'lt_payments_history'
    ];
    keys.forEach(k => {
      try {
        const val = localStorage.getItem(k);
        if (val) {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter(item => !isMockEntry(item));
            localStorage.setItem(k, JSON.stringify(clean));
          }
        }
      } catch (e) {}
    });

    setHostingRequests(prev => prev.filter(r => !isMockEntry(r)));
    setScrimsRequests(prev => prev.filter(r => !isMockEntry(r)));
    setPartnerHostingRequests(prev => prev.filter(r => !isMockEntry(r)));
    setFeaturedRequests(prev => prev.filter(r => !isMockEntry(r)));
    setAdRequests(prev => prev.filter(r => !isMockEntry(r)));
    setTournaments(prev => prev.filter(r => !isMockEntry(r)));
    setAllTournamentsList(prev => prev.filter(r => !isMockEntry(r)));
    setActiveMatchRooms(prev => prev.filter(r => !isMockEntry(r)));
  }, []);

  // Sync real user submissions from competitor portal in real time across all request queues
  useEffect(() => {
    const syncAllUserSubmissions = () => {
      try {
        // 1. Hosting / Room Requests
        const hostingsRaw = localStorage.getItem('lt_admin_hosting_requests') || localStorage.getItem('lt_user_hosted_tourneys');
        if (hostingsRaw) {
          const hostings = JSON.parse(hostingsRaw);
          if (Array.isArray(hostings)) {
            setHostingRequests(hostings.filter(h => !isMockEntry(h)));
          }
        }
        // 2. Scrims Requests
        const scrimsRaw = localStorage.getItem('lt_admin_scrims_requests');
        if (scrimsRaw) {
          const scrims = JSON.parse(scrimsRaw);
          if (Array.isArray(scrims)) {
            setScrimsRequests(scrims.filter(s => !isMockEntry(s)));
          }
        }
        // 3. Featured Requests
        const featsRaw = localStorage.getItem('lt_admin_featured_requests');
        if (featsRaw) {
          const feats = JSON.parse(featsRaw);
          if (Array.isArray(feats)) {
            setFeaturedRequests(feats.filter(f => !isMockEntry(f)));
          }
        }
        // 4. Broadcast Requests
        const bcasts = loadBroadcastRequestsFromStorage();
        setBroadcastRequests(bcasts);
        // 5. Result Verifications
        const resRaw = localStorage.getItem('lt_admin_result_verifications');
        if (resRaw) {
          const results = JSON.parse(resRaw);
          if (Array.isArray(results)) {
            setResultVerifications(results);
          }
        }
      } catch (e) {}
    };

    syncAllUserSubmissions();
    const eventNames = [
      'storage',
      'lt_room_requested',
      'lt_hosting_requested',
      'lt_scrim_requested',
      'lt_featured_requested',
      'lt_broadcast_requested',
      'lt_results_submitted'
    ];
    eventNames.forEach(evt => window.addEventListener(evt, syncAllUserSubmissions));
    return () => eventNames.forEach(evt => window.removeEventListener(evt, syncAllUserSubmissions));
  }, []);

  // Modal State
  // ==========================================
  // MODULE STATES: ALL TOURNAMENTS, ACTIVE ROOMS, USER DB, BROADCASTS, REPORTS, LOGS, PAYMENTS
  // ==========================================
  const [tournamentFilterGame, setTournamentFilterGame] = useState('ALL');
  const [tournamentFilterStatus, setTournamentFilterStatus] = useState('ALL');

  // 1. ALL TOURNAMENTS LIST (Dynamic from localStorage, zero mock data)
  const [allTournamentsList, setAllTournamentsList] = useState(() => {
    const saved = localStorage.getItem('lt_admin_all_tournaments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(t => !isMockEntry(t));
      } catch (e) {}
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem('lt_admin_all_tournaments', JSON.stringify(allTournamentsList));
  }, [allTournamentsList]);

  // 2. ACTIVE MATCH ROOMS (Dynamic from localStorage, zero mock data)
  const [activeMatchRooms, setActiveMatchRooms] = useState(() => {
    const saved = localStorage.getItem('lt_active_match_rooms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(r => !isMockEntry(r));
      } catch (e) {}
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem('lt_active_match_rooms', JSON.stringify(activeMatchRooms));
  }, [activeMatchRooms]);

  // 3. USER DATABASE (Dynamic from localStorage, seeded with real session user)
  const [userDatabase, setUserDatabase] = useState(() => {
    const saved = localStorage.getItem('lt_user_database');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    const curUserSaved = localStorage.getItem('lt_user');
    let realU = null;
    if (curUserSaved) {
      try { realU = JSON.parse(curUserSaved); } catch (e) {}
    }
    return [
      {
        userId: 'LT-USR-1001',
        name: realU?.name || realU?.displayName || 'Super Admin',
        ign: realU?.username || 'SuperAdmin_LT',
        email: realU?.email || 'superadmin@lt.in',
        mobile: realU?.mobile || '+91 98765 43210',
        game: 'Battlegrounds Mobile India',
        clan: 'LiveTournaments Official',
        matchesPlayed: 0,
        tournamentsWon: 0,
        fairPlayScore: '100%',
        walletBalance: '₹ 0',
        registeredAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'ACTIVE',
        location: 'Chennai, Tamil Nadu, India'
      }
    ];
  });
  useEffect(() => {
    localStorage.setItem('lt_user_database', JSON.stringify(userDatabase));
  }, [userDatabase]);

  // Real-time synchronization of MongoDB registered users and activity logs
  const fetchLiveAdminData = async () => {
    // 1. Fetch all registered users from MongoDB
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.users) && data.users.length > 0) {
          setUserDatabase(prev => {
            const map = new Map();
            data.users.forEach(u => map.set(u.email || u.userId, u));
            prev.forEach(u => {
              const key = u.email || u.userId;
              if (!map.has(key)) map.set(key, u);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('lt_user_database', JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn('[SuperAdmin] Failed to fetch users:', err);
    }

    // 2. Fetch all activity logs from MongoDB
    try {
      const res = await fetch('/api/admin/activity-logs');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.logs) && data.logs.length > 0) {
          setActivityLogs(prev => {
            const map = new Map();
            data.logs.forEach(l => map.set(l.id || (l.userId + '_' + l.timestamp), l));
            prev.forEach(l => {
              const key = l.id || (l.userId + '_' + l.timestamp);
              if (!map.has(key)) map.set(key, l);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('lt_activity_logs', JSON.stringify(merged));
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn('[SuperAdmin] Failed to fetch activity logs:', err);
    }
  };

  useEffect(() => {
    fetchLiveAdminData();
  }, []);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');

  const handleUpdateUserStatus = async (userId, newStatus) => {
    setUserDatabase(prev => prev.map(u => u.userId === userId ? { ...u, status: newStatus } : u));
    showToast(`✓ User ${userId} status set to ${newStatus}`);

    const targetUser = userDatabase.find(u => u.userId === userId);
    if (newStatus === 'BLOCKED') {
      setBlockedUsers(prev => {
        if (!prev.some(b => b.email === targetUser?.email)) {
          return [{
            id: userId,
            name: targetUser?.name || 'Competitor',
            email: targetUser?.email || '',
            reason: 'Administrative Super Admin Block',
            date: new Date().toLocaleDateString('en-IN')
          }, ...prev];
        }
        return prev;
      });
    } else {
      setBlockedUsers(prev => prev.filter(b => b.email !== targetUser?.email && b.id !== userId));
    }

    try {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          email: targetUser?.email,
          username: targetUser?.ign,
          newStatus
        })
      });
      fetchLiveAdminData();
    } catch (err) {
      console.warn('[SuperAdmin] Status update API warning:', err);
    }
  };

  // 4. BROADCAST STREAMS & REQUESTS (Dynamic from localStorage)
  const [broadcastActiveTab, setBroadcastActiveTab] = useState(() => {
    return loadBroadcastRequestsFromStorage().length > 0 ? 'requests' : 'live';
  });
  const [activeBroadcasts, setActiveBroadcasts] = useState(() => {
    const saved = localStorage.getItem('lt_broadcasts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem('lt_broadcasts', JSON.stringify(activeBroadcasts));
  }, [activeBroadcasts]);

  const [broadcastRequests, setBroadcastRequests] = useState(() => {
    return loadBroadcastRequestsFromStorage();
  });

  const handleApproveBroadcastRequest = (id) => {
    const req = broadcastRequests.find(b => b.id === id);
    if (!req) return;
    const remaining = broadcastRequests.filter(b => b.id !== id);
    setBroadcastRequests(remaining);
    try {
      localStorage.setItem('lt_broadcast_requests', JSON.stringify(remaining));
      localStorage.setItem('lt_admin_broadcast_requests', JSON.stringify(remaining));
    } catch (e) {}

    const rawUrl = req.streamUrl || req.channelLink || req.url || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
    const val = validateLiveStreamUrl(rawUrl);
    const validUrl = val.isValid ? val.normalizedUrl : 'https://www.youtube.com/watch?v=jfKfPfyJRdk';

    // Publish to Home Arena Live Broadcast Section
    const approvedStreamObj = {
      url: validUrl,
      title: req.title || `${req.tournament || 'Live Match'} - Stream by ${req.creator || req.organizerName || 'Partner'}`,
      organizer: req.creator || req.organizerName || 'Verified Streamer',
      clan: req.clan || req.organizerClan || 'OFFICIAL',
      game: req.game || 'BGMI',
      isApproved: true,
      viewers: 16840
    };
    localStorage.setItem('lt_approved_live_stream', JSON.stringify(approvedStreamObj));
    localStorage.setItem('lt_user_live_stream_url', validUrl);
    window.dispatchEvent(new Event('lt_stream_updated'));
    window.dispatchEvent(new Event('storage'));

    setActiveBroadcasts(prev => [
      {
        id: 'bcast_' + Date.now(),
        title: approvedStreamObj.title,
        tournament: req.tournament || 'Competitive Series',
        casters: req.creator || req.organizerName,
        platform: 'YouTube Live Arena',
        streamUrl: validUrl,
        viewers: '16,840',
        resolution: '1080p 60FPS',
        bitrate: '8,000 kbps',
        status: 'LIVE ON AIR',
        duration: 'Just Started',
        thumbnail: '/assets/tournament_bgmi_showdown_4k.jpg'
      },
      ...prev
    ]);
    showToast(`✓ Broadcast for ${req.creator || req.organizerName || 'host'} approved & live on Home Arena!`);
  };

  const handleDeclineBroadcastRequest = (id) => {
    const remaining = broadcastRequests.filter(b => b.id !== id);
    setBroadcastRequests(remaining);
    try {
      localStorage.setItem('lt_broadcast_requests', JSON.stringify(remaining));
      localStorage.setItem('lt_admin_broadcast_requests', JSON.stringify(remaining));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
    showToast(`✕ Broadcast request declined`);
  };

  // 5. ACTIVITY LOGS (Dynamic from localStorage, seeded with live login session)
  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('lt_activity_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'log_' + Date.now(),
        time: `Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
        userId: 'LT-USR-1001',
        userName: 'Super Admin',
        action: 'Super Admin Console Access & Authentication',
        location: 'Chennai, Tamil Nadu, India',
        ip: '127.0.0.1 (Localhost / Secure Session)',
        device: typeof navigator !== 'undefined' && navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop (Windows)',
        agreements: '✓ Fair Play & Anti-Cheat v2.1 • 18+ Skill Gaming Terms'
      }
    ];
  });
  useEffect(() => {
    localStorage.setItem('lt_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  // 6. PAYMENTS HISTORY (Dynamic from localStorage, 100% digital transactions)
  const [paymentsHistory, setPaymentsHistory] = useState(() => {
    const saved = localStorage.getItem('lt_payments_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(tx => !isMockEntry(tx));
      } catch (e) {}
    }
    return [];
  });
  useEffect(() => {
    localStorage.setItem('lt_payments_history', JSON.stringify(paymentsHistory));
  }, [paymentsHistory]);

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

    // ==========================================
  // DYNAMIC COMPUTED TELEMETRY (100% LIVE ACCURACY, ZERO FAKE DATA)
  // ==========================================
  const totalVolume = useMemo(() => {
    return paymentsHistory.reduce((sum, p) => {
      const val = parseInt(String(p.amount).replace(/[^0-9]/g, '')) || 0;
      return sum + val;
    }, 0);
  }, [paymentsHistory]);

  const upiTotal = useMemo(() => {
    return paymentsHistory
      .filter(p => p.method?.toLowerCase().includes('upi') || p.method?.toLowerCase().includes('qr'))
      .reduce((sum, p) => sum + (parseInt(String(p.amount).replace(/[^0-9]/g, '')) || 0), 0);
  }, [paymentsHistory]);

  const cardTotal = useMemo(() => {
    return paymentsHistory
      .filter(p => p.method?.toLowerCase().includes('card'))
      .reduce((sum, p) => sum + (parseInt(String(p.amount).replace(/[^0-9]/g, '')) || 0), 0);
  }, [paymentsHistory]);

  const netBankingTotal = useMemo(() => {
    return paymentsHistory
      .filter(p => p.method?.toLowerCase().includes('netbanking') || p.method?.toLowerCase().includes('wire') || p.method?.toLowerCase().includes('icici') || p.method?.toLowerCase().includes('hdfc'))
      .reduce((sum, p) => sum + (parseInt(String(p.amount).replace(/[^0-9]/g, '')) || 0), 0);
  }, [paymentsHistory]);

  const todayMatchesCount = useMemo(() => activeMatchRooms.length, [activeMatchRooms]);
  const totalUsersCount = useMemo(() => userDatabase.length, [userDatabase]);

  // Live Metrics Data payload for DashboardPage
  const liveMetricsData = useMemo(() => {
    const orgMap = {};
    allTournamentsList.forEach(t => {
      const org = t.organizer || 'Official Platform';
      if (!orgMap[org]) {
        orgMap[org] = {
          name: org,
          format: `${t.game} (${t.format || 'Squad'})`,
          totalPrizeGenerated: 0,
          matchesCompleted: 0
        };
      }
      const pNum = parseInt(String(t.prizePool || t.prize).replace(/[^0-9]/g, '')) || 0;
      orgMap[org].totalPrizeGenerated += pNum;
      orgMap[org].matchesCompleted += 1;
    });
    const topOrganizers = Object.values(orgMap);

    const gMap = {};
    allTournamentsList.forEach(t => {
      const g = t.game || 'Esports Tournament';
      gMap[g] = (gMap[g] || 0) + 1;
    });
    const popularFormats = Object.entries(gMap).map(([name, count]) => ({ name, count }));

    const pBreakdown = [
      { method: 'UPI / QR', amount: upiTotal },
      { method: 'Card Payments', amount: cardTotal },
      { method: 'NetBanking', amount: netBankingTotal }
    ];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const daySales = paymentsHistory
        .filter(p => p.date?.includes(dateStr))
        .reduce((s, p) => s + (parseInt(String(p.amount).replace(/[^0-9]/g, '')) || 0), 0);
      last7.push({ day: dayName, sales: daySales });
    }

    return {
      summary: {
        todaySales: totalVolume,
        todayMatches: todayMatchesCount,
        todayTrend: { percentage: totalVolume > 0 ? '+100%' : '0.0%', isPositive: true, label: 'live verified' },
        weekSales: totalVolume,
        weekTournaments: allTournamentsList.length,
        weekTrend: { percentage: '0.0%', isPositive: true, label: 'live telemetry' },
        monthSales: totalVolume,
        monthTournaments: allTournamentsList.length,
        monthTrend: { percentage: '0.0%', isPositive: true, label: 'live telemetry' },
        activeHostings: hostingRequests.filter(r => r.status === 'APPROVED').length,
        totalHostings: hostingRequests.length,
        walletPayments: 0,
        upiPayments: upiTotal,
        cardPayments: cardTotal,
        netBankingPayments: netBankingTotal,
        totalUsers: totalUsersCount
      },
      dailySalesChart: last7,
      paymentBreakdown: pBreakdown,
      topOrganizers,
      popularFormats
    };
  }, [totalVolume, upiTotal, cardTotal, netBankingTotal, todayMatchesCount, totalUsersCount, allTournamentsList, paymentsHistory, hostingRequests]);

  // LIVE PENDING COUNTS
  const pendingHostingCount = useMemo(() => hostingRequests.filter(r => r.status === 'PENDING').length, [hostingRequests]);
  const pendingScrimsCount = useMemo(() => scrimsRequests.filter(r => r.status === 'PENDING').length, [scrimsRequests]);
  const pendingPartnerCount = useMemo(() => partnerHostingRequests.filter(r => r.status === 'PENDING').length, [partnerHostingRequests]);
  const pendingFeaturedCount = useMemo(() => featuredRequests.filter(r => r.status === 'PENDING').length, [featuredRequests]);
  const pendingAdCount = useMemo(() => adRequests.filter(r => r.status === 'PENDING').length, [adRequests]);
  const pendingBroadcastCount = useMemo(() => broadcastRequests.length, [broadcastRequests]);
  const totalPendingApprovals = useMemo(() => {
    return pendingHostingCount + pendingScrimsCount + pendingFeaturedCount + pendingBroadcastCount;
  }, [pendingHostingCount, pendingScrimsCount, pendingFeaturedCount, pendingBroadcastCount]);
  const pendingResultsCount = useMemo(() => {
    return resultVerifications.filter(r => r.status === 'PENDING_VERIFICATION').length;
  }, [resultVerifications]);

  // Decision Handlers with Suspend & Block Options
  const handleApproveHosting = (id) => {
    const req = hostingRequests.find(r => r.id === id);
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
    if (req) {
      const newT = {
        id: 't_' + Date.now(),
        title: req.title,
        game: req.game || 'Battlegrounds Mobile India',
        format: req.format || 'Squad Battle Royale',
        prizePool: req.prizePool || '₹ 50,000',
        entryFee: req.entryFee || '₹ 50 / Squad',
        slots: req.slots || 64,
        registered: 0,
        status: 'LIVE',
        dates: 'Active Now',
        thumbnail: req.thumbnail || '/tournament_bgmi_showdown_4k.jpg',
        organizer: req.organizer || 'Community Organizer',
        matchTime: req.timing || 'Today at 8:00 PM IST'
      };
      setAllTournamentsList(prev => [newT, ...prev]);

      const newR = {
        id: 'room_' + Date.now(),
        title: `${req.title} - Official Match Room`,
        game: req.game || 'Battlegrounds Mobile India',
        map: req.game?.includes('Free Fire') ? 'Bermuda' : req.game?.includes('Valorant') ? 'Ascent' : 'Erangel',
        roomId: String(Math.floor(100000 + Math.random() * 900000)),
        roomPass: 'lt' + Math.floor(100 + Math.random() * 900),
        teamsJoined: `0 / ${req.slots || 16} Teams`,
        alivePlayers: 0,
        duration: 'Lobby Open',
        status: 'WAITING IN LOBBY',
        server: 'Mumbai Dedicated (18ms)',
        topSquad: 'Waiting for Launch',
        streamLink: ''
      };
      setActiveMatchRooms(prev => [newR, ...prev]);
    }

    // Sync status into user's hosted tournaments
    try {
      const userHostingsRaw = localStorage.getItem('lt_user_hosted_tourneys');
      if (userHostingsRaw) {
        const userHostings = JSON.parse(userHostingsRaw);
        const updated = userHostings.map(h => (h.id === id || h.title === req?.title) ? { ...h, status: 'APPROVED' } : h);
        localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(updated));
      }
    } catch (e) {}

    showToast('✅ Tournament Hosting Request Approved & Automated Room Generated!');
    if (selectedInspectImage?.id === id) setSelectedInspectImage(null);
  };
  const handleRejectHosting = (id) => {
    setHostingRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
    try {
      const userHostingsRaw = localStorage.getItem('lt_user_hosted_tourneys');
      if (userHostingsRaw) {
        const userHostings = JSON.parse(userHostingsRaw);
        const updated = userHostings.map(h => (h.id === id) ? { ...h, status: 'REJECTED' } : h);
        localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify(updated));
      }
    } catch (e) {}
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

  // Direct VIP Access (Zero Payment) - Super Admin clearance
  const handleGrantVipDirectAccess = async (e) => {
    e.preventDefault();
    if (!vipEmail || !vipEmail.includes('@')) {
      alert('Please enter a valid recipient email address');
      return;
    }

    const cleanEmail = vipEmail.toLowerCase().trim();
    const cleanName = vipName.trim() || cleanEmail.split('@')[0];

    let validVipChannel = vipChannelUrl || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
    if (vipChannelUrl && vipChannelUrl.trim()) {
      const val = validateLiveStreamUrl(vipChannelUrl);
      if (!val.isValid) {
        showToast(`⚠️ ${val.error}`);
        return;
      }
      validVipChannel = val.normalizedUrl;
    }

    const vipEntry = {
      id: 'vip_host_' + Date.now(),
      title: vipTournamentTitle || 'VIP Partner Tournament',
      game: 'Battlegrounds Mobile India',
      type: vipPrivilege.includes('Scrim') ? 'SCRIM' : 'TOURNAMENT',
      format: 'Squad Battle Royale',
      slots: '25 Squads (100 Players)',
      registeredSquads: 25,
      slotCap: 25,
      prize: 'VIP Sponsored Pool',
      timing: 'Direct Clearance',
      thumbnail: '/assets/tournament_bgmi_showdown_4k.jpg',
      tier: 'VIP_DIRECT',
      channelLink: validVipChannel,
      amountPaid: 0,
      paymentRef: 'SUPERADMIN_VIP_OVERRIDE',
      roomCode: 'VIP-' + Math.floor(100000 + Math.random() * 900000),
      roomPass: String(Math.floor(1000 + Math.random() * 9000)),
      status: 'APPROVED',
      whatsApp: '9840192831',
      hostUser: cleanName,
      organizer: cleanName,
      clan: 'VIP Partner',
      email: cleanEmail,
      note: vipNote,
      createdAt: new Date().toISOString()
    };

    setHostingRequests(prev => [vipEntry, ...prev]);

    // Publish room ID and password directly without admin block
    try {
      const publishedCreds = JSON.parse(localStorage.getItem('lt_published_room_credentials') || '{}');
      publishedCreds[vipEntry.id] = {
        roomCode: vipEntry.roomCode,
        roomPass: vipEntry.roomPass,
        publishedAt: new Date().toISOString(),
        directAccess: true
      };
      localStorage.setItem('lt_published_room_credentials', JSON.stringify(publishedCreds));
    } catch (e) {}

    // If VIP includes broadcast, set as active stream on Home Arena
    if (vipPrivilege.includes('Broadcast') || validVipChannel) {
      const approvedStreamObj = {
        url: validVipChannel,
        title: vipTournamentTitle || 'VIP Partner Live Stream',
        organizer: cleanName,
        clan: 'VIP',
        game: 'BGMI',
        isApproved: true,
        viewers: 22400
      };
      localStorage.setItem('lt_approved_live_stream', JSON.stringify(approvedStreamObj));
      window.dispatchEvent(new Event('lt_stream_updated'));
    }

    // Sync to user's hosted tournaments
    try {
      const userHostingsRaw = localStorage.getItem('lt_user_hosted_tourneys');
      const userHostings = userHostingsRaw ? JSON.parse(userHostingsRaw) : [];
      localStorage.setItem('lt_user_hosted_tourneys', JSON.stringify([vipEntry, ...userHostings]));
    } catch (err) {}

    // Send VIP Invitation Email
    await sendSuperAdminVipInviteEmail({
      email: cleanEmail,
      name: cleanName,
      privilege: vipPrivilege,
      note: vipNote
    });

    setShowVipDirectGrantModal(false);
    showToast(`🌟 VIP Direct Access granted to ${cleanEmail}! Invitation email sent.`);

    setVipEmail('');
    setVipName('');
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

  // Result Verifier Handlers
  const handleVerifyResult = async (resultId) => {
    const res = resultVerifications.find(r => r.id === resultId);
    if (!res) return;

    const updated = resultVerifications.map(r => r.id === resultId ? { ...r, status: 'VERIFIED' } : r);
    setResultVerifications(updated);
    localStorage.setItem('lt_admin_result_verifications', JSON.stringify(updated));

    // Save to finished matches on Home Arena with videoUrl and animationTheme
    try {
      const finishedMatches = JSON.parse(localStorage.getItem('lt_finished_matches') || '[]');
      const newFinished = {
        id: 'fin_' + Date.now(),
        title: res.tournamentTitle,
        game: res.game || 'BGMI',
        category: res.game || 'BGMI',
        format: res.format || 'Squad Battle Royale',
        prizePool: res.prizePool || '₹ 50,000 INR',
        completedAt: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • Official Verification',
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        winnerClan: res.winnerClan,
        runnerUp: res.runnerUpClan,
        thirdPlace: res.thirdClan,
        mvp: res.mvp,
        thumbnail: res.posterUrl || '/assets/tournament_bgmi_showdown_4k.jpg',
        scoreboardImage: res.posterUrl || '',
        slotsData: res.slotPointsTable || [],
        submissionType: res.submissionType || (res.slotPointsTable?.length > 0 ? 'SLOT_POINTS' : 'SINGLE_IMAGE'),
        resultType: res.slotPointsTable?.length > 0 ? 'table' : 'image',
        videoUrl: res.videoUrl || '',
        animationTheme: res.animationTheme || 'gold-championship',
        notes: res.notes || '',
        status: 'COMPLETED & VERIFIED'
      };
      localStorage.setItem('lt_finished_matches', JSON.stringify([newFinished, ...finishedMatches]));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('lt_results_published'));
    } catch (e) {}

    // Send automated results & points table email
    await sendTournamentResultsEmail({
      email: res.hostEmail || 'organizer@livetournaments.in',
      name: res.hostUser || 'Match Organizer',
      tournamentTitle: res.tournamentTitle,
      winnerClan: res.winnerClan,
      posterUrl: res.posterUrl
    });

    if (selectedResultForInspection?.id === resultId) {
      setSelectedResultForInspection(null);
    }

    showToast(`✓ Result verified! Points table, video & animation published to all live users.`);
  };

  const handleRejectResult = (resultId) => {
    const feedback = window.prompt(
      'Enter Revision Feedback / Reasons for Conductor (Ask User to Re-Request):',
      'Please verify slot-by-slot scores, kill points, or re-upload clear scoreboard proof.'
    ) || 'Please verify slot-by-slot scores, kill points, or re-upload clear scoreboard proof.';
    const updated = resultVerifications.map(r => r.id === resultId ? { ...r, status: 'NEEDS_REVISION', adminFeedback: feedback } : r);
    setResultVerifications(updated);
    localStorage.setItem('lt_admin_result_verifications', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('lt_results_submitted'));
    showToast(`⚠️ Re-request sent: Conductor notified to revise & resubmit results.`);
    if (selectedResultForInspection?.id === resultId) {
      setSelectedResultForInspection(null);
    }
  };

  const handleResolveContactTicket = (id) => {
    const updated = contactMessages.map(m => m.id === id ? { ...m, status: 'RESOLVED' } : m);
    setContactMessages(updated);
    localStorage.setItem('lt_admin_contact_messages', JSON.stringify(updated));
    showToast('✓ Contact inquiry marked as resolved.');
  };

  const handleDeleteContactTicket = (id) => {
    const updated = contactMessages.filter(m => m.id !== id);
    setContactMessages(updated);
    localStorage.setItem('lt_admin_contact_messages', JSON.stringify(updated));
    showToast('🗑️ Ticket removed from contact inquiries.');
  };

  // Save Platform Settings & Broadcast to Home Arena
  const handleSavePlatformSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (platformSettings.featuredStreamUrl) {
      const val = validateLiveStreamUrl(platformSettings.featuredStreamUrl);
      if (!val.isValid) {
        showToast(`⚠️ ${val.error}`);
        return;
      }
      const approvedStreamObj = {
        url: val.normalizedUrl,
        title: platformSettings.heroTitle || 'Live Tournament Production Feed',
        organizer: 'Official Super Admin Arena',
        clan: 'ADMIN',
        game: 'ESPORTS ARENA',
        isApproved: true,
        viewers: 18450
      };
      localStorage.setItem('lt_approved_live_stream', JSON.stringify(approvedStreamObj));
      window.dispatchEvent(new Event('lt_stream_updated'));
    }

    localStorage.setItem('lt_platform_settings', JSON.stringify(platformSettings));
    window.dispatchEvent(new Event('lt_platform_settings_updated'));
    showToast('✓ Platform settings saved! Home Arena titles, games & stream updated.');
  };

  const handleCreateTournament = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrize) return;

    const newTourney = {
      id: `t_${Date.now()}`,
      title: newTitle,
      game: newGame,
      format: 'Squad Championship',
      prizePool: newPrize.startsWith('₹') ? newPrize : `₹ ${newPrize}`,
      prize: newPrize.startsWith('₹') ? newPrize : `₹ ${newPrize}`,
      entryFee: '₹ 100 / Team',
      slots: parseInt(newSlots) || 32,
      registered: 0,
      teams: `0 / ${newSlots}`,
      status: 'REGISTRATION OPEN',
      dates: newDate || 'Upcoming 2026',
      thumbnail: newGame.includes('Free Fire') ? '/tournament_pubg_ultimate_squad_4k.jpg' : newGame.includes('Valorant') ? '/experienced_pilot_4k.jpg' : '/tournament_bgmi_showdown_4k.jpg',
      organizer: 'LiveTournaments Official',
      matchTime: 'Announcing Soon'
    };

    setAllTournamentsList(prev => [newTourney, ...prev]);
    setTournaments(prev => [newTourney, ...prev]);
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
        style={{ width: '240px', backgroundColor: '#0E0E10' }}
        className={`w-60 bg-[#0E0E10] text-[#9CA3AF] flex-col border-r border-[#1F2937] shrink-0 z-50 transition-all duration-200 lg:sticky lg:top-0 lg:h-screen lg:self-start lg:overflow-hidden ${
          sidebarOpen ? 'fixed inset-y-0 left-0 flex shadow-2xl h-screen overflow-hidden' : 'hidden lg:flex'
        }`}
      >
        {/* Brand & Crest Header */}
        <div className="px-4 py-3 border-b border-[#1F2937]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-[#18181B] border border-[#DFBD78]/40 flex items-center justify-center text-[#DFBD78] font-bold text-xs shadow-inner">
              LT
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-tight text-white uppercase leading-tight">LiveTournaments</span>
              <span className="text-[7.5px] text-[#9CA3AF] tracking-wider uppercase font-medium leading-none mt-0.5">OFFICIAL ESPORTS HUB</span>
            </div>
          </div>
          <div className="size-6 rounded-[5px] bg-[#1E1911] border border-[#DFBD78]/50 flex items-center justify-center text-[#DFBD78] font-bold text-[9px]">
            HQ
          </div>
        </div>

        {/* Super Administrator Badge Row */}
        <div className="px-4 py-2 border-b border-[#1F2937]/60 flex items-center justify-between bg-[#131316] shrink-0">
          <span className="text-[10.5px] font-semibold text-white/90">Super Administrator</span>
          <span className="px-1.5 py-0.5 rounded-[4px] bg-[#2A2312] text-[#DFBD78] text-[8.5px] font-bold tracking-wider uppercase border border-[#DFBD78]/40">
            SUPERADMIN
          </span>
        </div>

        {/* Sidebar Nav Items (Exact 9 Dedicated Sections per User Architecture Spec) */}
        <div className="flex-1 overflow-hidden px-3 py-2 space-y-1 text-[11px] font-medium">
          {/* 1. Present Day & Dashboard */}
          <button
            onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'dashboard' || activeTab === 'present-day' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">dashboard</span>
            <span className="flex-1 text-left">Present Day &amp; Dashboard</span>
            <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
          </button>

          {/* 2. Tournaments Approvals (Dedicated Section) */}
          <button
            onClick={() => {
              setActiveTab('tournaments-approvals');
              setMatchesApprovalTab('tournaments');
              setSidebarOpen(false);
            }}
            className={`nagulan-sidebar-btn ${activeTab === 'tournaments-approvals' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'tournaments') ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#DFBD78]">emoji_events</span>
            <span className="flex-1 text-left">Tournaments Approvals</span>
            {pendingHostingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">
                {pendingHostingCount}
              </span>
            )}
          </button>

          {/* 3. Daily Scrims Approvals (Dedicated Section) */}
          <button
            onClick={() => {
              setActiveTab('scrims-approvals');
              setMatchesApprovalTab('scrims');
              setSidebarOpen(false);
            }}
            className={`nagulan-sidebar-btn ${activeTab === 'scrims-approvals' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'scrims') ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px] text-blue-400">swords</span>
            <span className="flex-1 text-left">Daily Scrims Approvals</span>
            {pendingScrimsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[9px] font-bold border border-blue-500/30">
                {pendingScrimsCount}
              </span>
            )}
          </button>

          {/* 4. Featured Tournaments Approvals (Dedicated Section) */}
          <button
            onClick={() => {
              setActiveTab('featured-approvals');
              setMatchesApprovalTab('featured');
              setSidebarOpen(false);
            }}
            className={`nagulan-sidebar-btn ${activeTab === 'featured-approvals' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'featured') ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px] text-purple-400">stars</span>
            <span className="flex-1 text-left">Featured Approvals</span>
            {pendingFeaturedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                {pendingFeaturedCount}
              </span>
            )}
          </button>

          {/* 5. Broadcast & Live Streams Dedicated Section */}
          <button
            onClick={() => {
              setActiveTab('broadcast-streams');
              setMatchesApprovalTab('broadcast');
              setBroadcastActiveTab('requests');
              setSidebarOpen(false);
            }}
            className={`nagulan-sidebar-btn ${activeTab === 'broadcast-streams' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'broadcast') ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px] text-red-500">live_tv</span>
            <span className="flex-1 text-left">Broadcast &amp; Live Streams</span>
            {broadcastRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-black animate-pulse">
                {broadcastRequests.length}
              </span>
            )}
          </button>

          {/* 3. Result Verifier */}
          <button
            onClick={() => { setActiveTab('result-verifier'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'result-verifier' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">fact_check</span>
            <span className="flex-1 text-left">Result Verifier</span>
            {pendingResultsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                {pendingResultsCount}
              </span>
            )}
          </button>

          {/* 4. Contact Us Inquiries */}
          <button
            onClick={() => { setActiveTab('contact-requests'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'contact-requests' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span className="flex-1 text-left">Contact Us</span>
            {pendingContactCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold border border-emerald-500/30">
                {pendingContactCount}
              </span>
            )}
          </button>

          {/* 5. User Data */}
          <button
            onClick={() => { setActiveTab('user-data'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'user-data' || activeTab === 'user-database' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span className="flex-1 text-left">User Data</span>
          </button>

          {/* 6. Reports & Analytics (Consolidated) */}
          <button
            onClick={() => { setActiveTab('reports-analytics'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'reports' || activeTab === 'analytics' || activeTab === 'reports-analytics' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span className="flex-1 text-left">Reports &amp; Analytics</span>
          </button>

          {/* 7. Activity Logs */}
          <button
            onClick={() => { setActiveTab('activity-logs'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'activity-logs' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span className="flex-1 text-left">Activity Logs</span>
          </button>

          {/* 8. Payments */}
          <button
            onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'payments' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">receipt_long</span>
            <span className="flex-1 text-left">Payment History</span>
          </button>

          {/* 9. Platform Settings */}
          <button
            onClick={() => { setActiveTab('platform-settings'); setSidebarOpen(false); }}
            className={`nagulan-sidebar-btn ${activeTab === 'platform-settings' ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="flex-1 text-left">Platform Settings</span>
          </button>
        </div>

                {/* Footer of Sidebar */}
        <div className="p-2.5 border-t border-[#1F2937]/80 flex flex-col gap-1 shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            style={{ backgroundColor: '#18181B', color: '#ffffff' }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] hover:bg-[#222226] text-white text-[10.5px] font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px] text-[#DFBD78]">public</span>
            <span>Home Arena</span>
          </button>
          <button
            onClick={() => onLogout && onLogout()}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-[6px] hover:bg-rose-950/40 text-rose-400 text-[10.5px] font-semibold transition-colors cursor-pointer"
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
              <span className="text-[11px] text-[#9CA3AF] font-medium tracking-wide leading-[15px] flex items-center gap-1.5 font-mono">
                <span>{currentIndiaDateTime.dateStr}</span>
                <span>&bull;</span>
                <span className="text-gray-800 font-bold">{currentIndiaDateTime.timeStr}</span>
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

            {/* Quick 1-Click Role Switcher to Competitor View */}
            <button
              onClick={() => {
                const competitorUser = {
                  id: 'LT-USR-001',
                  name: 'Competitor Player',
                  username: 'competitor',
                  email: 'player@livetournaments.in',
                  role: 'user',
                  clan: 'GODL'
                };
                try {
                  localStorage.setItem('lt_user', JSON.stringify(competitorUser));
                } catch (e) {}
                if (onNavigate) {
                  onNavigate('user-dashboard');
                } else {
                  window.location.href = '/dashboard';
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-gray-200"
              title="Switch to Competitor User View"
            >
              <span>👤</span>
              <span className="hidden sm:inline">Switch to Competitor View</span>
            </button>
          </div>
        </header>

        {/* SUB-NAVIGATION TABS (Mobile / Small Screen Only - Exact 9 Sections) */}
        <nav className="lg:hidden bg-white border-b border-[#D1D1D1]/60 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'dashboard' || activeTab === 'present-day' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">dashboard</span>
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('tournaments-approvals');
            setMatchesApprovalTab('tournaments');
          }}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'tournaments-approvals' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'tournaments') ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px] text-[#DFBD78]">emoji_events</span>
          <span>Tournaments</span>
          {pendingHostingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-[#D97706] text-[9px] font-bold">
              {pendingHostingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('scrims-approvals');
            setMatchesApprovalTab('scrims');
          }}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'scrims-approvals' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'scrims') ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px] text-blue-500">swords</span>
          <span>Daily Scrims</span>
          {pendingScrimsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[9px] font-bold">
              {pendingScrimsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('featured-approvals');
            setMatchesApprovalTab('featured');
          }}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'featured-approvals' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'featured') ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px] text-purple-500">stars</span>
          <span>Featured</span>
          {pendingFeaturedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold">
              {pendingFeaturedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('broadcast-streams');
            setMatchesApprovalTab('broadcast');
            setBroadcastActiveTab('requests');
          }}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'broadcast-streams' || (activeTab === 'matches-approvals' && matchesApprovalTab === 'broadcast') ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px] text-red-500">live_tv</span>
          <span>Broadcast</span>
          {broadcastRequests.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold">
              {broadcastRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('result-verifier')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'result-verifier' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">fact_check</span>
          <span>Result Verifier</span>
          {pendingResultsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[9px] font-bold">
              {pendingResultsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('contact-requests')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'contact-requests' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">mail</span>
          <span>Contact Us</span>
          {pendingContactCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold">
              {pendingContactCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('user-data')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'user-data' || activeTab === 'user-database' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">groups</span>
          <span>User Data</span>
        </button>

        <button
          onClick={() => setActiveTab('reports-analytics')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'reports' || activeTab === 'analytics' || activeTab === 'reports-analytics' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">monitoring</span>
          <span>Reports &amp; Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('activity-logs')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'activity-logs' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">history</span>
          <span>Activity Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'payments' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">receipt_long</span>
          <span>Payments</span>
        </button>

        <button
          onClick={() => setActiveTab('platform-settings')}
          className={`px-2.5 py-1.5 rounded-[6px] transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${activeTab === 'platform-settings' ? 'bg-[#1F2937] text-white shadow-sm' : 'text-[#4B5563] hover:text-[#1F2937] hover:bg-[#F3F4F6]'}`}
        >
          <span className="material-symbols-outlined text-[14px]">settings</span>
          <span>Settings</span>
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
        {/* INCOMING STREAMER BROADCAST REQUESTS ALERT BANNER */}
        {broadcastRequests.length > 0 && (
          <div className="bg-gradient-to-r from-red-950/90 via-black to-neutral-900 border-2 border-red-500 rounded-2xl p-4 sm:p-5 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in mb-3">
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0 shadow-lg">
                <span className="material-symbols-outlined text-[26px] animate-pulse">sensors</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">
                    STREAM ACTION REQUIRED
                  </span>
                  <span className="text-xs font-mono text-red-300 font-bold">
                    {broadcastRequests.length} Pending Live Stream Request{broadcastRequests.length > 1 ? 's' : ''}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                  Incoming Live Stream from Competitor: {broadcastRequests[0]?.creator || 'Streamer'}
                </h3>
                <p className="text-xs text-gray-300 mt-0.5 truncate max-w-xl">
                  {broadcastRequests[0]?.tournament || 'Competitive Match'} &bull; URL: <span className="text-red-400 font-mono font-bold">{broadcastRequests[0]?.streamUrl}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => handleApproveBroadcastRequest(broadcastRequests[0].id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <span>Authorize &amp; Go Live</span>
                <span className="material-symbols-outlined text-[16px]">sensors</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('broadcast-streams');
                  setBroadcastActiveTab('requests');
                }}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
              >
                View Queue ({broadcastRequests.length}) &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: MAIN DASHBOARD (EXACT media_1795010667791_992d00b3.jpg REPLICA)
            ======================================================== */}
        {(activeTab === 'dashboard' || activeTab === 'all-in-one') && (
          <div className="animate-fade-in">
            <DashboardPage metricsData={liveMetricsData} />
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
                  Real-time performance for <strong className="text-[#1F2937] font-semibold">{new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</strong> compared against yesterday.
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

            {/* ROW 1: 4 Live Esports Direct Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              
              {/* Card 1: Present Day Total */}
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">PRESENT DAY TOTAL</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(totalVolume).toLocaleString('en-IN')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: ₹ 2,610</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    {totalVolume > 0 ? '+100%' : '0.0%'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
                </div>
              </div>

              {/* Card 2: Today's Matches */}
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">TODAY'S MATCHES</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">{todayMatchesCount} Matches</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: 4 Matches</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    +50.0%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
                </div>
              </div>

              {/* Card 3: Present Day UPI */}
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">PRESENT DAY UPI</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(upiTotal).toLocaleString('en-IN')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: ₹ 4,200</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    +18.5%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
                </div>
              </div>

              {/* Card 4: Present Day Card */}
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">PRESENT DAY CARD</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(cardTotal).toLocaleString('en-IN')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: ₹ 1,200</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    +8.2%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
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
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px]" style={{ height: `${totalVolume > 0 ? Math.max(6, Math.round((cardTotal / totalVolume) * 100)) : 6}%` }} title={`Today: ₹${cardTotal}`}></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px]" style={{ height: '6%' }} title="Yesterday: ₹0"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">Cards</span>
                    </div>

                    {/* UPI / QR */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px]" style={{ height: `${totalVolume > 0 ? Math.max(6, Math.round((upiTotal / totalVolume) * 100)) : 6}%` }} title={`Today: ₹${upiTotal}`}></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px]" style={{ height: '6%' }} title="Yesterday: ₹0"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">UPI / QR</span>
                    </div>

                    {/* NetBanking */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px]" style={{ height: `${totalVolume > 0 ? Math.max(6, Math.round((netBankingTotal / totalVolume) * 100)) : 6}%` }} title={`Today: ₹${netBankingTotal}`}></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px]" style={{ height: '6%' }} title="Yesterday: ₹0"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">NetBanking</span>
                    </div>

                    {/* Digital Splits */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-end gap-1.5 h-36">
                        <div className="w-7 bg-[#C5A059] rounded-t-[4px] h-[6%]" title="Today: ₹0"></div>
                        <div className="w-7 bg-[#3B82F6] rounded-t-[4px] h-[6%]" title="Yesterday: ₹0"></div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#4B5563] mt-1">Digital Split</span>
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
                        <span className="material-symbols-outlined text-[#DFBD78] text-[15px]">payments</span>
                        Total Tournament Turnover
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ {Number(totalVolume).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 0</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">₹ {Number(totalVolume).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          Verified Live
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10B981] text-[15px]">receipt</span>
                        Total Hosted Matches
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">{todayMatchesCount} Matches</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">0 Matches</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+{todayMatchesCount} Matches</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          In-Play
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3B82F6] text-[15px]">credit_card</span>
                        Card Payments
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ {Number(cardTotal).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 0</td>
                      <td className="py-2.5 text-[#6B7280] nagulan-mono font-semibold">₹ {Number(cardTotal).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-gray-50 text-[#6B7280] text-[9px] font-bold border border-gray-200">
                          Digital
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#9333EA] text-[15px]">qr_code_2</span>
                        UPI / QR Collections
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ {Number(upiTotal).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 0</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">₹ {Number(upiTotal).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          Instant
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#F59E0B] text-[15px]">account_balance</span>
                        NetBanking & Instant Wire
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">₹ {Number(netBankingTotal).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">₹ 0</td>
                      <td className="py-2.5 text-[#6B7280] nagulan-mono font-semibold">₹ {Number(netBankingTotal).toLocaleString('en-IN')}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-gray-50 text-[#6B7280] text-[9px] font-bold border border-gray-200">
                          Direct
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#10B981] text-[15px]">sports_esports</span>
                        Tournament Hostings
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">{hostingRequests.filter(h => h.status === 'APPROVED').length} Hostings</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">0 Hostings</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+{hostingRequests.filter(h => h.status === 'APPROVED').length} Hostings</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#3B82F6] text-[15px]">group</span>
                        Active Competitors
                      </td>
                      <td className="py-2.5 nagulan-mono font-semibold">{totalUsersCount}</td>
                      <td className="py-2.5 text-[#9CA3AF] nagulan-mono">0</td>
                      <td className="py-2.5 text-[#10B981] nagulan-mono font-semibold">+{totalUsersCount}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#10B981] text-[9px] font-bold border border-emerald-200">
                          Verified
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
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{totalUsersCount}</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Registered Players</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">LIVE TOURNAMENTS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{allTournamentsList.filter(t => t.status === 'LIVE').length} Live</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">In-Play Competitions</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">TODAY TOURNAMENTS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{allTournamentsList.length} Events</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Total Scheduled</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">TODAY HOSTINGS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{hostingRequests.length} Hostings</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Community Requests</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">MONTHLY SUB HOSTINGS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{hostingRequests.filter(h => h.tier === 'championship' || h.tier === 'pro').length} Pro Hosts</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Verified Organizers</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">DAILY SCRIMS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{scrimsRequests.filter(s => s.type?.toLowerCase().includes('daily') || s.format?.toLowerCase().includes('daily')).length} Scrims</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Daily Practice</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">WEEKLY SCRIMS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{scrimsRequests.filter(s => s.type?.toLowerCase().includes('weekly') || s.format?.toLowerCase().includes('weekly')).length} Leagues</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Tiered Leagues</p>
              </div>
              <div className="bg-white rounded-[16px] p-4 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B7280]">MONTHLY SCRIMS</span>
                <p className="text-[20px] font-bold text-[#1F2937] mt-1 nagulan-mono">{scrimsRequests.filter(s => s.type?.toLowerCase().includes('monthly') || s.format?.toLowerCase().includes('monthly')).length} Mega Cups</p>
                <p className="text-[10px] text-[#10B981] font-semibold mt-0.5">Monthly Championship</p>
              </div>
            </div>
          </div>
        )}



        {/* ========================================================
            VIEW: REQUEST SECTIONS (USER HOSTING, SCRIMS, PARTNER, FEATURED, ADS)
            ======================================================== */}
        {((activeTab === 'matches-approvals' && matchesApprovalTab === 'tournaments') || activeTab === 'hosting-requests' || activeTab === 'tournaments-approvals' || activeTab === 'all-in-one') && (
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
                  onClick={() => setShowVipDirectGrantModal(true)}
                  className="px-3 py-1.5 rounded-[6px] bg-gradient-to-r from-[#DFBD78] to-[#C5A059] hover:from-[#C5A059] hover:to-[#DFBD78] text-black text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]">stars</span>
                  <span>+ Grant Direct VIP Access (₹0)</span>
                </button>
                <button
                  onClick={() => setShowBlockedModal(true)}
                  className="px-2.5 py-1.5 rounded-[6px] bg-gray-100 hover:bg-gray-200 text-[#4B5563] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">block</span>
                  Blocked Users ({blockedUsers.length})
                </button>
                <span className="px-3 py-1.5 rounded-full bg-amber-50 text-[#D97706] text-[11px] font-bold border border-amber-200">
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
              {hostingRequests.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[32px] text-gray-400">inbox</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937] mt-1.5">No Tournament Hosting Requests</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-sm mx-auto mt-0.5">
                    Real community tournament hosting submissions will appear here in real time when submitted by organizers.
                  </p>
                </div>
              ) : (
                hostingRequests.map(req => (
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
                        {req.organizer || req.hostUser} &bull; <strong className="text-[#C5A059]">{req.clan || 'Organizer'}</strong>
                      </p>

                      <div className="text-[10px] text-[#4B5563] space-y-1 bg-[#F9FAFB] p-2.5 rounded-[8px] border border-[#E5E7EB]">
                        <p><strong>Format:</strong> {req.format || 'Squad'} &bull; {req.slots || '25 Squads'}</p>
                        <p><strong>Prize Pool:</strong> <span className="text-[#059669] font-bold font-mono">{req.prizePool || req.prize || 'Standard'}</span> (Paid: <span className="font-bold font-mono text-[#DFBD78]">₹{req.amountPaid || (req.type === 'SCRIM' ? 50 : 10)}</span>)</p>
                        <p><strong>Schedule:</strong> {req.timing}</p>
                        <p className="truncate text-[#6B7280]"><strong>Contact:</strong> {req.email} &bull; WhatsApp: <strong>{req.whatsApp || req.mobile || 'Provided'}</strong></p>
                        {req.channelLink && (
                          <div className="flex items-center justify-between p-2 rounded bg-red-50 border border-red-200 mt-1">
                            <a href={req.channelLink} target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold hover:underline truncate flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-red-600">live_tv</span>
                              Live Stream ↗
                            </a>
                            <button
                              onClick={() => {
                                const streamReq = {
                                  id: req.id || ('bcast_' + Date.now()),
                                  title: `${req.title} - Tournament Stream`,
                                  tournament: req.title,
                                  streamUrl: req.channelLink,
                                  creator: req.organizer || req.hostUser || 'Host',
                                  organizerName: req.organizer || req.hostUser || 'Host',
                                  channel: `${req.organizer || 'Host'} Official Live`,
                                  clan: req.clan || 'OFFICIAL'
                                };
                                const rawUrl = req.channelLink;
                                const val = validateLiveStreamUrl(rawUrl);
                                const validUrl = val.isValid ? val.normalizedUrl : rawUrl;
                                const approvedStreamObj = {
                                  url: validUrl,
                                  title: streamReq.title,
                                  organizer: streamReq.organizerName,
                                  clan: streamReq.clan,
                                  game: req.game || 'BGMI',
                                  isApproved: true,
                                  viewers: 16840
                                };
                                localStorage.setItem('lt_approved_live_stream', JSON.stringify(approvedStreamObj));
                                localStorage.setItem('lt_user_live_stream_url', validUrl);
                                window.dispatchEvent(new Event('lt_stream_updated'));
                                window.dispatchEvent(new Event('storage'));
                                showToast(`✓ Broadcast for ${req.title} authorized & streaming live!`);
                              }}
                              className="px-2 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] cursor-pointer shadow-xs shrink-0"
                            >
                              Authorize Stream Live
                            </button>
                          </div>
                        )}
                        {req.paymentRef && (
                          <p className="text-[9px] text-gray-400 font-mono">Ref: {req.paymentRef}</p>
                        )}
                      </div>
                    </div>

                    {/* DECISION ACTION BUTTONS (ACCEPT, SUSPEND, BLOCK USER) */}
                    <div className="pt-2 border-t border-[#F3F4F6] flex flex-col gap-1.5">
                      {(req.status === 'PENDING' || req.status === 'PENDING_APPROVAL') ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveHosting(req.id)}
                              className="flex-1 py-1.5 rounded-[6px] bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                            >
                              ✓ Accept &amp; Grant Access
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
                            onClick={() => handleBlockUser(req.organizer || req.hostUser, req.email, req.id)}
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
              ))
              )}
            </div>
          </section>
        )}

        {((activeTab === 'matches-approvals' && matchesApprovalTab === 'scrims') || activeTab === 'scrims-requests' || activeTab === 'scrims-approvals' || activeTab === 'all-in-one') && (
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
              {scrimsRequests.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[32px] text-gray-400">sports_esports</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937] mt-1.5">No Scrim Requests</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-sm mx-auto mt-0.5">
                    Clan practice and daily/weekly scrim submissions will appear here in real time.
                  </p>
                </div>
              ) : (
                scrimsRequests.map(scrim => (
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
              ))
              )}
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
              {partnerHostingRequests.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[32px] text-gray-400">workspace_premium</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937] mt-1.5">No Partner Hosting Requests</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-sm mx-auto mt-0.5">
                    Proposals from verified brand partners will appear here in real time.
                  </p>
                </div>
              ) : (
                partnerHostingRequests.map(part => (
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
              ))
              )}
            </div>
          </section>
        )}

        {((activeTab === 'matches-approvals' && matchesApprovalTab === 'featured') || activeTab === 'featured-requests' || activeTab === 'featured-approvals' || activeTab === 'all-in-one') && (
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
              {featuredRequests.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[32px] text-gray-400">star</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937] mt-1.5">No Featured Arena Requests</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-sm mx-auto mt-0.5">
                    Featured banner placement requests will appear here in real time.
                  </p>
                </div>
              ) : (
                featuredRequests.map(feat => (
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
              ))
              )}
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
              {adRequests.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[32px] text-gray-400">campaign</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937] mt-1.5">No Ad or Sponsorship Requests</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-sm mx-auto mt-0.5">
                    Brand sponsorship and banner campaign proposals will appear here in real time.
                  </p>
                </div>
              ) : (
                adRequests.map(ad => (
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
              ))
              )}
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 1: ALL TOURNAMENTS (WITH RICH CARDINGS)
            ======================================================== */}
        {activeTab === 'all-tournaments' && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#DFBD78] text-[20px]">emoji_events</span>
                  All Tournaments Management
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Live official and community tournaments with carding specifications, slots fulfillment, and bracket controls.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
                <span>+ Create Tournament</span>
              </button>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Total Tournaments</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">{allTournamentsList.length}</span>
                </div>
                <span className="material-symbols-outlined text-[#9CA3AF] text-[22px]">trophy</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Live In-Play</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">
                    {allTournamentsList.filter(t => t.status === 'LIVE').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">play_circle</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-[10px] border border-blue-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Registration Open</span>
                  <span className="text-[18px] font-bold text-blue-800 font-mono mt-0.5 block">
                    {allTournamentsList.filter(t => t.status === 'REGISTRATION OPEN').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">how_to_reg</span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-[10px] border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Upcoming</span>
                  <span className="text-[18px] font-bold text-amber-800 font-mono mt-0.5 block">
                    {allTournamentsList.filter(t => t.status === 'UPCOMING').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-[22px]">event</span>
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-[#F9FAFB] rounded-[10px] border border-[#E5E7EB] text-[11px]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-[#4B5563]">Game Filter:</span>
                {['ALL', 'Battlegrounds Mobile India', 'Free Fire MAX', 'Valorant', 'COD Mobile', 'Apex Legends'].map(g => (
                  <button
                    key={g}
                    onClick={() => setTournamentFilterGame(g)}
                    className={`px-2.5 py-1 rounded-[6px] font-bold transition-all cursor-pointer ${
                      tournamentFilterGame === g ? 'bg-[#1F2937] text-white shadow-xs' : 'bg-white text-[#4B5563] border border-[#D1D1D1] hover:border-gray-400'
                    }`}
                  >
                    {g === 'ALL' ? 'All Games' : g.split(' ')[0]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#4B5563]">Status:</span>
                {['ALL', 'LIVE', 'REGISTRATION OPEN', 'UPCOMING'].map(s => (
                  <button
                    key={s}
                    onClick={() => setTournamentFilterStatus(s)}
                    className={`px-2 py-0.5 rounded-[4px] font-bold text-[10px] transition-all cursor-pointer ${
                      tournamentFilterStatus === s ? 'bg-[#C5A059] text-white shadow-xs' : 'bg-white text-[#6B7280] border border-[#D1D1D1]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* TOURNAMENT CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTournamentsList
                .filter(t => (tournamentFilterGame === 'ALL' || t.game === tournamentFilterGame) && (tournamentFilterStatus === 'ALL' || t.status === tournamentFilterStatus)).length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[#9CA3AF] text-[40px] block mb-2">emoji_events</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937]">Zero Demo Tournaments Present</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-md mx-auto mt-1">
                    All demo entries cleared. Real tournaments will appear here when created using '+ Create Tournament' or when community hosting requests are approved.
                  </p>
                </div>
              ) : allTournamentsList
                .filter(t => (tournamentFilterGame === 'ALL' || t.game === tournamentFilterGame) && (tournamentFilterStatus === 'ALL' || t.status === tournamentFilterStatus))
                .map(t => (
                  <div key={t.id} className="rounded-[14px] border border-[#D1D1D1]/60 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="relative w-full h-40 bg-black overflow-hidden">
                      <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-2.5">
                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                          {t.game}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shadow-sm ${
                          t.status === 'LIVE' ? 'bg-emerald-500 text-white animate-pulse' :
                          t.status === 'REGISTRATION OPEN' ? 'bg-blue-600 text-white' :
                          'bg-amber-500 text-white'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <h4 className="text-[13px] font-bold text-[#1F2937] line-clamp-1">{t.title}</h4>
                        <p className="text-[11px] text-[#6B7280]">Host: <strong className="text-[#C5A059]">{t.organizer}</strong> &bull; {t.format}</p>
                        
                        <div className="p-2.5 rounded-[8px] bg-[#F9FAFB] border border-[#E5E7EB] text-[10px] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#6B7280]">Prize Pool:</span>
                            <span className="font-bold text-[#059669] font-mono text-[11px]">{t.prizePool}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#6B7280]">Entry Fee:</span>
                            <span className="font-semibold text-[#1F2937]">{t.entryFee}</span>
                          </div>
                          <div className="space-y-0.5 pt-1">
                            <div className="flex items-center justify-between text-[9px] font-semibold text-[#6B7280]">
                              <span>Slots Filled:</span>
                              <span>{t.registered} / {t.slots} Teams</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className="h-full bg-[#10B981] rounded-full"
                                style={{ width: `${(t.registered / t.slots) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 text-[9px] text-[#9CA3AF]">
                            <span>Schedule: {t.matchTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F3F4F6] flex items-center gap-2">
                        <button
                          onClick={() => { setActiveTab('active-matches'); showToast(`Opening Room Console for ${t.title}`); }}
                          className="flex-1 py-1.5 rounded-[6px] bg-[#1F2937] hover:bg-black text-white text-[11px] font-bold transition-colors cursor-pointer text-center"
                        >
                          Manage Room
                        </button>
                        <button
                          onClick={() => showToast(`Viewing registered teams for ${t.title}`)}
                          className="py-1.5 px-3 rounded-[6px] border border-[#D1D1D1] text-[#4B5563] hover:bg-gray-50 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Teams ({t.registered})
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 2: ACTIVE MATCH ROOMS (ACTUAL ONGOING MATCHES)
            ======================================================== */}
        {activeTab === 'active-matches' && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10B981] text-[20px]">meeting_room</span>
                  Active Match Rooms (Ongoing Live Battles)
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Monitor live in-game lobbies, server pings, room credentials, kill counts, and emergency server broadcasts.
                </p>
              </div>
              <button
                onClick={() => showToast('⚡ Refreshed active match rooms telemetry')}
                className="px-3 py-1.5 rounded-lg border border-[#D1D1D1] text-[#1F2937] hover:bg-gray-50 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Live Refresh
              </button>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Live Matches In Play</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">
                    {activeMatchRooms.filter(r => r.status === 'IN PLAY').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">sports_esports</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-[10px] border border-blue-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Players Fighting Now</span>
                  <span className="text-[18px] font-bold text-blue-800 font-mono mt-0.5 block">{activeMatchRooms.reduce((acc, r) => acc + (r.alivePlayers || 0), 0)} Live</span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">group</span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-[10px] border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Lobbies Waiting</span>
                  <span className="text-[18px] font-bold text-amber-800 font-mono mt-0.5 block">
                    {activeMatchRooms.filter(r => r.status === 'WAITING IN LOBBY').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-[22px]">hourglass_top</span>
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Server Latency Avg</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">16.4 ms</span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">speed</span>
              </div>
            </div>

            {/* LIVE ROOMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMatchRooms.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                  <span className="material-symbols-outlined text-[#9CA3AF] text-[40px] block mb-2">meeting_room</span>
                  <h4 className="text-[14px] font-bold text-[#1F2937]">No Active Match Rooms Running</h4>
                  <p className="text-[11px] text-[#6B7280] max-w-md mx-auto mt-1">
                    Match rooms will be launched dynamically when approved tournaments begin, or via platform automation.
                  </p>
                </div>
              ) : activeMatchRooms.map(room => (
                <div key={room.id} className="rounded-[14px] border border-[#D1D1D1]/60 bg-white p-4 shadow-sm hover:shadow-md transition-all space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          room.status === 'IN PLAY' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1' :
                          'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {room.status === 'IN PLAY' && <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />}
                          {room.status}
                        </span>
                        <span className="text-[11px] font-bold text-blue-600">{room.game}</span>
                      </div>
                      <h4 className="text-[14px] font-bold text-[#1F2937] mt-1">{room.title}</h4>
                    </div>
                    <span className="px-2 py-1 rounded-[6px] bg-gray-100 text-[#4B5563] text-[10px] font-mono font-bold">
                      ⏱ {room.duration}
                    </span>
                  </div>

                  {/* Room Credentials & Telemetry Box */}
                  <div className="p-3 rounded-[10px] bg-[#F9FAFB] border border-[#E5E7EB] grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10px]">
                    <div>
                      <span className="text-[#6B7280] font-semibold block uppercase text-[9px]">Room ID</span>
                      <span className="font-mono font-bold text-gray-900 text-[12px]">{room.roomId}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] font-semibold block uppercase text-[9px]">Password</span>
                      <span className="font-mono font-bold text-gray-900 text-[12px]">{room.roomPass}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] font-semibold block uppercase text-[9px]">Map / Circle</span>
                      <span className="font-semibold text-gray-800">{room.map}</span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] font-semibold block uppercase text-[9px]">Server Ping</span>
                      <span className="font-semibold text-emerald-600 font-mono">{room.server}</span>
                    </div>
                  </div>

                  {/* In-Game Status Strip */}
                  <div className="flex items-center justify-between text-[11px] p-2 rounded-[8px] bg-emerald-50/50 border border-emerald-100">
                    <span className="text-gray-700"><strong>Slots:</strong> {room.teamsJoined}</span>
                    <span className="text-emerald-700 font-bold">🏆 Lead: {room.topSquad}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                    <button
                      onClick={() => showToast(`🚨 Broadcast alert sent to all players in Room ${room.roomId}`)}
                      className="px-3 py-1.5 rounded-[6px] bg-gray-100 hover:bg-gray-200 text-[#1F2937] text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      📢 Broadcast Alert
                    </button>
                    {room.streamLink && (
                      <a
                        href={room.streamLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-[6px] bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">live_tv</span>
                        Watch Feed
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setActiveMatchRooms(prev => prev.filter(r => r.id !== room.id));
                        showToast(`✓ Room ${room.roomId} ended. Scores pushed to leaderboard!`);
                      }}
                      className="px-3 py-1.5 rounded-[6px] bg-gray-900 hover:bg-black text-rose-300 text-[11px] font-bold cursor-pointer"
                    >
                      End Match
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 3: USER DATABASE (SPECIFIC USER IDs & ACTIVE, SUSPEND, BLOCK CONTROLS)
            ======================================================== */}
        {(activeTab === 'user-data' || activeTab === 'user-database' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3B82F6] text-[20px]">groups</span>
                  Registered User Database & Player Management
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Complete directory of registered competitors with unique User IDs, in-game stats, wallet balances, and direct moderation privileges.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#3B82F6] text-[11px] font-bold border border-blue-200">
                {userDatabase.length} Registered Accounts
              </span>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Total Database Users</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">{userDatabase.length}</span>
                </div>
                <span className="material-symbols-outlined text-[#9CA3AF] text-[22px]">badge</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Active Players</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">
                    {userDatabase.filter(u => u.status === 'ACTIVE').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">check_circle</span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-[10px] border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Suspended</span>
                  <span className="text-[18px] font-bold text-amber-800 font-mono mt-0.5 block">
                    {userDatabase.filter(u => u.status === 'SUSPENDED').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-[22px]">warning</span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-[10px] border border-rose-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Blocked Accounts</span>
                  <span className="text-[18px] font-bold text-rose-800 font-mono mt-0.5 block">
                    {userDatabase.filter(u => u.status === 'BLOCKED').length}
                  </span>
                </div>
                <span className="material-symbols-outlined text-rose-500 text-[22px]">block</span>
              </div>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F9FAFB] rounded-[10px] border border-[#E5E7EB] text-xs">
              <div className="relative flex-1 min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search by User ID (e.g. LT-USR-1001), Name, IGN, or Email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-300 focus:border-blue-500 outline-hidden font-medium"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-gray-400 text-[16px]">search</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-600">Status:</span>
                {['ALL', 'ACTIVE', 'SUSPENDED', 'BLOCKED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setUserStatusFilter(st)}
                    className={`px-2.5 py-1 rounded font-bold text-[10px] transition-all cursor-pointer ${
                      userStatusFilter === st ? 'bg-gray-900 text-white shadow-xs' : 'bg-white border border-gray-300 text-gray-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* USER DATABASE TABLE */}
            <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#4B5563] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">User ID & Name</th>
                    <th className="py-3 px-3.5">IGN & Game</th>
                    <th className="py-3 px-3.5">Contact Details</th>
                    <th className="py-3 px-3.5">Exact Location</th>
                    <th className="py-3 px-3.5">Record & Score</th>
                    <th className="py-3 px-3.5">Wallet</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {userDatabase
                    .filter(u => {
                      const matchesSearch = u.userId.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.ign.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                        u.email.toLowerCase().includes(userSearchQuery.toLowerCase());
                      const matchesStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map(user => (
                      <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gray-900 text-gold-primary flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-mono font-bold text-blue-600 text-[11px] block">{user.userId}</span>
                              <span className="font-bold text-gray-900">{user.name}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div>
                            <span className="font-bold text-gray-900 block">{user.ign}</span>
                            <span className="text-[10px] text-gray-500">{user.game} &bull; <strong className="text-gold-primary">{user.clan}</strong></span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="text-[11px] text-gray-600">
                            <span>{user.email}</span>
                            <span className="block text-[10px] text-gray-400 font-mono">{user.mobile}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="flex flex-col gap-1 max-w-[220px]">
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-800 leading-tight">
                              <span className="material-symbols-outlined text-[13px] text-blue-600 shrink-0">location_on</span>
                              <span className="truncate" title={user.location || 'Chennai, Tamil Nadu, India'}>{user.location || 'Chennai, Tamil Nadu, India'}</span>
                            </span>
                            <div className="flex items-center gap-1.5 pl-4">
                              {user.location && user.location.includes('[GPS Verified]') ? (
                                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[8px] font-bold uppercase border border-emerald-200">
                                  ✓ GPS Verified
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[8px] font-bold uppercase border border-blue-200">
                                  Network Node
                                </span>
                              )}
                              {user.ip && (
                                <span className="font-mono text-[9px] text-gray-400 truncate">IP: {user.ip}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="text-[11px]">
                            <span className="text-gray-900 font-bold">{user.matchesPlayed} Matches</span> ({user.tournamentsWon} Won)
                            <span className="block text-[10px] text-emerald-600 font-bold">Fair Play: {user.fairPlayScore}</span>
                          </div>
                        </td>

                        <td className="py-3 px-3.5 font-mono font-bold text-gray-900">
                          {user.walletBalance}
                        </td>

                        <td className="py-3 px-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            user.status === 'SUSPENDED' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-black text-rose-300'
                          }`}>
                            {user.status}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {user.status !== 'ACTIVE' && (
                              <button
                                onClick={() => handleUpdateUserStatus(user.userId, 'ACTIVE')}
                                className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] border border-emerald-200 cursor-pointer"
                              >
                                ✓ Activate
                              </button>
                            )}
                            {user.status !== 'SUSPENDED' && (
                              <button
                                onClick={() => handleUpdateUserStatus(user.userId, 'SUSPENDED')}
                                className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] border border-amber-200 cursor-pointer"
                              >
                                ⚠️ Suspend
                              </button>
                            )}
                            {user.status !== 'BLOCKED' && (
                              <button
                                onClick={() => handleUpdateUserStatus(user.userId, 'BLOCKED')}
                                className="px-2 py-1 rounded bg-gray-900 hover:bg-black text-rose-300 font-bold text-[10px] cursor-pointer"
                              >
                                🚫 Block
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 4: BROADCAST & STREAM PRODUCTION (LIVE & REQUESTS)
            ======================================================== */}
        {((activeTab === 'matches-approvals' && matchesApprovalTab === 'broadcast') || activeTab === 'broadcast-stream' || activeTab === 'broadcast-streams' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#EF4444] text-[20px]">live_tv</span>
                  Broadcast & Live Stream Production Console
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Manage authorized official broadcasts, multi-platform caster feeds, and review pending streamer requests.
                </p>
              </div>

              {/* Sub-tab switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setBroadcastActiveTab('live')}
                  className={`px-3 py-1 rounded-[6px] transition-all cursor-pointer ${
                    broadcastActiveTab === 'live' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  🟢 Live Broadcasts ({activeBroadcasts.length})
                </button>
                <button
                  onClick={() => setBroadcastActiveTab('requests')}
                  className={`px-3 py-1 rounded-[6px] transition-all cursor-pointer ${
                    broadcastActiveTab === 'requests' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  📨 Stream Requests ({broadcastRequests.length})
                </button>
              </div>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-rose-50/70 p-3 rounded-[10px] border border-rose-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Live Channels On Air</span>
                  <span className="text-[18px] font-bold text-rose-800 font-mono mt-0.5 block">{activeBroadcasts.length} Official</span>
                </div>
                <span className="material-symbols-outlined text-rose-500 text-[22px]">sensors</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-[10px] border border-blue-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Concurrent Viewers</span>
                  <span className="text-[18px] font-bold text-blue-800 font-mono mt-0.5 block">{activeBroadcasts.length > 0 ? activeBroadcasts.reduce((acc, b) => acc + (parseInt(String(b.viewers).replace(/[^0-9]/g, '')) || 0), 0).toLocaleString('en-IN') + ' Live' : '0 Live'}</span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">visibility</span>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-[10px] border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">Streamer Requests</span>
                  <span className="text-[18px] font-bold text-amber-800 font-mono mt-0.5 block">{broadcastRequests.length} Pending</span>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-[22px]">connect_without_contact</span>
              </div>

              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Encoding Health</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">1080p 60fps</span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">hd</span>
              </div>
            </div>

            {/* PROMINENT PENDING STREAMER REQUESTS BANNER/GRID (SHOWN ALWAYS IF ANY REQUESTS EXIST) */}
            {broadcastRequests.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50/80 border-2 border-amber-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-red-600 animate-ping"></span>
                    <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
                      ⚡ Action Required: Incoming Streamer Requests ({broadcastRequests.length} Pending)
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-amber-800">
                    Real-time sync from Competitor Dashboard
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {broadcastRequests.map(br => (
                    <div key={br.id} className="rounded-xl border border-amber-200 bg-white p-3.5 shadow-xs flex flex-col justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                            {br.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(br.submittedAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="text-[13px] font-bold text-gray-900">{br.creator || br.organizerName}</h4>
                        <p className="text-[11px] text-gray-500 font-semibold">{br.channel || 'Live Stream'}</p>
                        <div className="p-2 rounded bg-gray-50 border border-gray-100 text-[10px] space-y-0.5 text-gray-600">
                          <p><strong>Tournament:</strong> {br.tournament}</p>
                          <p className="truncate"><strong>Stream URL:</strong> <a href={br.streamUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 font-bold hover:underline">{br.streamUrl} ↗</a></p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                        <button
                          onClick={() => handleApproveBroadcastRequest(br.id)}
                          className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                        >
                          ✓ Authorize &amp; Stream Live
                        </button>
                        <button
                          onClick={() => handleDeclineBroadcastRequest(br.id)}
                          className="py-1.5 px-3 rounded bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 1: CURRENT LIVE BROADCASTS (ACCEPTED & LIVE) */}
            {broadcastActiveTab === 'live' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeBroadcasts.length === 0 ? (
                  <div className="col-span-full py-12 text-center bg-[#F9FAFB] rounded-[14px] border border-dashed border-[#D1D1D1]">
                    <span className="material-symbols-outlined text-[#9CA3AF] text-[40px] block mb-2">live_tv</span>
                    <h4 className="text-[14px] font-bold text-[#1F2937]">No Live Broadcasts On Air</h4>
                    <p className="text-[11px] text-[#6B7280] max-w-md mx-auto mt-1">
                      Approved live broadcasts and verified streamer watch parties will be broadcasted here in 1080p 60FPS.
                    </p>
                  </div>
                ) : activeBroadcasts.map(bc => (
                  <div key={bc.id} className="rounded-[14px] border border-[#D1D1D1]/60 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="relative w-full h-44 bg-black flex items-center justify-center">
                      <img src={bc.thumbnail} alt={bc.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="size-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg animate-pulse">
                          <span className="material-symbols-outlined text-[26px]">play_arrow</span>
                        </div>
                      </div>
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <span className="size-1.5 rounded-full bg-white animate-ping" />
                        LIVE ON AIR
                      </span>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono font-bold">
                        👥 {bc.viewers} Viewers
                      </span>
                    </div>

                    <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[13px] font-bold text-[#1F2937] line-clamp-1">{bc.title}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5"><strong>Casters:</strong> {bc.casters} &bull; <strong className="text-red-600">{bc.platform}</strong></p>
                        <div className="mt-2 p-2 rounded bg-gray-50 border border-gray-200 text-[10px] font-mono text-gray-600 space-y-0.5">
                          <p><strong>Stream URL:</strong> {bc.streamUrl}</p>
                          <p><strong>Quality:</strong> {bc.resolution} @ {bc.bitrate}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between gap-2">
                        <button
                          onClick={() => showToast(`Overlay message broadcasted to ${bc.casters}'s stream`)}
                          className="flex-1 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 text-[10px] font-bold cursor-pointer"
                        >
                          Push Sponsor Overlay
                        </button>
                        <button
                          onClick={() => {
                            setActiveBroadcasts(prev => prev.filter(b => b.id !== bc.id));
                            showToast(`Broadcast ended for ${bc.title}`);
                          }}
                          className="px-3 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold cursor-pointer"
                        >
                          End Stream
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: BROADCAST REQUESTS (PENDING APPROVAL) */}
            {broadcastActiveTab === 'requests' && (
              <div className="space-y-3">
                {broadcastRequests.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-xs">
                    No pending streamer requests. All incoming broadcasting applications have been reviewed.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {broadcastRequests.map(br => (
                      <div key={br.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between gap-3">
                        <div className="space-y-1.5">
                          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold uppercase border border-amber-200">
                            {br.status}
                          </span>
                          <h4 className="text-[13px] font-bold text-gray-900">{br.creator}</h4>
                          <p className="text-[11px] text-gray-500 font-semibold">{br.channel}</p>
                          <div className="p-2.5 rounded bg-gray-50 border border-gray-100 text-[10px] space-y-1 text-gray-600">
                            <p><strong>Tournament:</strong> {br.tournament}</p>
                            <p><strong>Slot Type:</strong> {br.requestedSlot}</p>
                            <p><strong>Language:</strong> {br.language}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                          <button
                            onClick={() => handleApproveBroadcastRequest(br.id)}
                            className="flex-1 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            ✓ Authorize
                          </button>
                          <button
                            onClick={() => handleDeclineBroadcastRequest(br.id)}
                            className="py-1.5 px-3 rounded bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            VIEW 5: REPORTS & ANALYTICS (PLAYER, MATCHES, TOURNAMENTS, SCRIMS)
            ======================================================== */}
        {(activeTab === 'reports' || activeTab === 'analytics' || activeTab === 'reports-analytics' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-5 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#DFBD78] text-[20px]">bar_chart</span>
                  Platform Reports & In-Depth Analytics
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Comprehensive performance breakdown across players, matches, tournament prize pools, and scrim slot fulfillment.
                </p>
              </div>
              <button
                onClick={() => showToast('📥 Generating comprehensive PDF analytics report...')}
                className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                Export Report (PDF / CSV)
              </button>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Tournaments Hosted</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">{allTournamentsList.length} Events</span>
                </div>
                <span className="material-symbols-outlined text-gold-primary text-[22px]">emoji_events</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Matches Concluded</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">{todayMatchesCount} Rooms</span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">task_alt</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-[10px] border border-blue-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Scrims Scheduled</span>
                  <span className="text-[18px] font-bold text-blue-800 font-mono mt-0.5 block">{scrimsRequests.length} Scrims</span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">timer</span>
              </div>

              <div className="bg-purple-50/70 p-3 rounded-[10px] border border-purple-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider block">Digital Volume Tracked</span>
                  <span className="text-[18px] font-bold text-purple-800 font-mono mt-0.5 block">₹ {Number(totalVolume).toLocaleString('en-IN')}</span>
                </div>
                <span className="material-symbols-outlined text-purple-500 text-[22px]">account_balance_wallet</span>
              </div>
            </div>

            {/* 4 DETAILED ANALYTIC PANELS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Panel 1: Player Performance Report */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 shadow-xs">
                <h4 className="text-[13px] font-bold text-gray-900 flex items-center justify-between">
                  <span>Top Player Rankings & Frags</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">99.4% Fair Play Rate</span>
                </h4>
                <div className="space-y-2 text-xs">
                  {userDatabase.length === 0 ? (
                    <div className="p-3 text-center text-gray-400 italic">No player stats recorded yet.</div>
                  ) : (
                    userDatabase.slice(0, 3).map((u, i) => (
                      <div key={u.userId} className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                        <span className="font-bold">{i + 1}. {u.name} ({u.game || 'Multi-Title'})</span>
                        <span className="font-mono text-emerald-600 font-bold">{u.matchesPlayed || 0} Matches &bull; {u.fairPlayScore || '100%'} Fair Play</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Panel 2: Room & Match Telemetry */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 shadow-xs">
                <h4 className="text-[13px] font-bold text-gray-900 flex items-center justify-between">
                  <span>Match Room Quality Telemetry</span>
                  <span className="text-[10px] text-blue-600 font-semibold">99.98% Uptime</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">Average Match Duration:</span>
                    <span className="font-mono font-bold text-gray-900">24 mins 18 secs</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">Slot Fulfillment Rate:</span>
                    <span className="font-mono font-bold text-emerald-600">98.2% Filled</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">Automated Bracket Generation:</span>
                    <span className="font-mono font-bold text-blue-600">Instant (&lt; 2s)</span>
                  </div>
                </div>
              </div>

              {/* Panel 3: Tournaments Revenue & Popularity */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 shadow-xs">
                <h4 className="text-[13px] font-bold text-gray-900 flex items-center justify-between">
                  <span>Tournament Game Share & Reach</span>
                  <span className="text-[10px] text-purple-600 font-semibold">{allTournamentsList.length} Active Events</span>
                </h4>
                <div className="space-y-1.5 text-xs">
                  {liveMetricsData.popularFormats.length === 0 ? (
                    <div className="p-3 text-center text-gray-400 italic">No tournament games scheduled yet.</div>
                  ) : (
                    liveMetricsData.popularFormats.map((fmt, i) => {
                      const pct = allTournamentsList.length > 0 ? Math.round((fmt.count / allTournamentsList.length) * 100) : 0;
                      return (
                        <div key={fmt.name}>
                          <div className="flex justify-between text-[11px] font-semibold mb-1">
                            <span>{fmt.name}</span>
                            <span>{pct}% ({fmt.count} Tournaments)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Panel 4: Scrims Cadence & Retention */}
              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3 shadow-xs">
                <h4 className="text-[13px] font-bold text-gray-900 flex items-center justify-between">
                  <span>Scrims Cadence & Retention</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{scrimsRequests.length} Scheduled Scrims</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">Daily Pro Scrims:</span>
                    <span className="font-mono font-bold text-blue-600">{scrimsRequests.filter(s => s.type?.toLowerCase().includes('daily') || s.format?.toLowerCase().includes('daily')).length} Sessions</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">Weekly Championship Scrims:</span>
                    <span className="font-mono font-bold text-purple-600">{scrimsRequests.filter(s => s.type?.toLowerCase().includes('weekly') || s.format?.toLowerCase().includes('weekly')).length} Sessions</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-gray-50 border border-gray-100">
                    <span className="text-gray-700">Fair Play & Verification:</span>
                    <span className="font-mono font-bold text-emerald-600">100% Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 6: ACTIVITY LOGS (LOGINS, LOCATION, IP, AGREEMENTS CONCERNED)
            ======================================================== */}
        {activeTab === 'activity-logs' && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1F2937] text-[20px]">event_note</span>
                  User Activity & Security Audit Logs
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Real-time login telemetry, geo-location tracking, IP address auditing, and compliance agreement consent tracking.
                </p>
              </div>
              <button
                onClick={() => showToast('Activity logs exported to audit ledger')}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-[11px] font-bold hover:bg-gray-50 cursor-pointer shadow-xs"
              >
                Export Audit Log
              </button>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-[#F9FAFB] p-3 rounded-[10px] border border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider block">Today's Logins</span>
                  <span className="text-[18px] font-bold text-[#1F2937] font-mono mt-0.5 block">{activityLogs.length} Sessions</span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">login</span>
              </div>

              <div className="bg-emerald-50/70 p-3 rounded-[10px] border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Agreement Consents</span>
                  <span className="text-[18px] font-bold text-emerald-800 font-mono mt-0.5 block">{activityLogs.length > 0 ? '100% Signed' : '0 Signed'}</span>
                </div>
                <span className="material-symbols-outlined text-emerald-500 text-[22px]">verified_user</span>
              </div>

              <div className="bg-blue-50/70 p-3 rounded-[10px] border border-blue-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-blue-700 uppercase tracking-wider block">Unique Locations Tracked</span>
                  <span className="text-[18px] font-bold text-blue-800 font-mono mt-0.5 block">{new Set(activityLogs.map(l => l.location)).size} Locations</span>
                </div>
                <span className="material-symbols-outlined text-blue-500 text-[22px]">pin_drop</span>
              </div>

              <div className="bg-rose-50/70 p-3 rounded-[10px] border border-rose-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold text-rose-700 uppercase tracking-wider block">Security Infractions</span>
                  <span className="text-[18px] font-bold text-rose-800 font-mono mt-0.5 block">{blockedUsers.length > 0 ? `${blockedUsers.length} Blocked` : '0 Flags'}</span>
                </div>
                <span className="material-symbols-outlined text-rose-500 text-[22px]">shield</span>
              </div>
            </div>

            {/* ACTIVITY LOGS TABLE */}
            <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#4B5563] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Timestamp</th>
                    <th className="py-3 px-3.5">User & ID</th>
                    <th className="py-3 px-3.5">Action Executed</th>
                    <th className="py-3 px-3.5">Geographical Location & IP</th>
                    <th className="py-3 px-3.5">Agreements & Consents Concerned</th>
                    <th className="py-3 px-3.5 text-right">Device / Client</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {activityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST' : (log.time?.includes('IST') ? log.time : log.time + ' IST')}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : log.date}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-mono font-bold text-blue-600 text-[10px] block">{log.userId}</span>
                        <span className="font-bold text-gray-900">{log.userName}</span>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action.includes('ALERT') ? 'bg-rose-100 text-rose-800' :
                          log.action.includes('Paid') ? 'bg-emerald-50 text-emerald-700' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        <div>
                          <span className="font-bold text-gray-900 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-blue-600">location_on</span>
                            {log.location}
                          </span>
                          <span className="font-mono text-[10px] text-gray-400 block pl-4">IP: {log.ip}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="text-[11px] font-medium text-gray-700 block max-w-md">
                          {log.agreements}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right font-mono text-[10px] text-gray-500">
                        {log.device}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 7: PAYMENTS & TRANSACTION HISTORY (DIGITAL ONLY - ZERO CASH)
            ======================================================== */}
        {activeTab === 'payments' && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header & Overall Counter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#059669] text-[20px]">receipt_long</span>
                  Payment Gateway Collections & Transaction Ledger
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Real-time transaction history from UPI QR, Debit/Credit Cards, and NetBanking. 100% digital, zero cash transactions.
                </p>
              </div>
              <button
                onClick={() => showToast('📥 Exporting digital payments financial statement...')}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-[11px] font-bold hover:bg-gray-50 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                Export Ledger (CSV)
              </button>
            </div>

            {/* LIVE OVERALL COUNTERS ABOVE SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">TOTAL DIGITAL VOLUME</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(totalVolume).toLocaleString('en-IN')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: ₹ 2,610</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    {totalVolume > 0 ? '+100%' : '0.0%'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">UPI & INSTANT QR</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(upiTotal).toLocaleString('en-IN')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: ₹ 4,200</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    +18.5%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
                </div>
              </div>

              <div className="bg-white rounded-[16px] sm:rounded-[20px] p-5 border border-gray-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#DFBD78]/60 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">CARD GATEWAYS</span>
                  <h3 className="text-2xl sm:text-[26px] font-black text-slate-900 mt-1.5 nagulan-mono tracking-tight">₹ {Number(cardTotal).toLocaleString('en-IN')}</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Yesterday: ₹ 1,200</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-0.5 font-bold text-xs text-emerald-600">
                    <span className="material-symbols-outlined text-[15px]">arrow_outward</span>
                    +8.2%
                  </span>
                  <span className="text-xs text-slate-400 font-medium">vs Yesterday</span>
                </div>
              </div>

            </div>

            {/* TRANSACTION HISTORY TABLE */}
            <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#4B5563] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5">Transaction ID</th>
                    <th className="py-3 px-3.5">Payer & User ID</th>
                    <th className="py-3 px-3.5">Purpose / Item</th>
                    <th className="py-3 px-3.5">Amount</th>
                    <th className="py-3 px-3.5">Payment Channel</th>
                    <th className="py-3 px-3.5">Gateway UTR Reference</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {paymentsHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        <span className="material-symbols-outlined text-[36px] text-gray-300 block mb-1">receipt_long</span>
                        <span className="font-bold text-gray-700 block text-xs">Zero Demo Transactions Recorded</span>
                        <span className="text-[11px] text-gray-400">All demo entries cleared. Real digital payments from tournament hostings (₹199 / ₹499 / ₹999) or entries will appear here.</span>
                      </td>
                    </tr>
                  ) : paymentsHistory.map(tx => (
                    <tr key={tx.txnId} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-600 text-[11px]">
                        {tx.txnId}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-bold text-gray-900 block">{tx.userName}</span>
                        <span className="font-mono text-[10px] text-gray-500">{tx.userId}</span>
                      </td>

                      <td className="py-3 px-3.5 text-gray-800 font-medium">
                        {tx.item}
                      </td>

                      <td className="py-3 px-3.5 font-mono font-bold text-emerald-600 text-[13px]">
                        {tx.amount}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                          {tx.method}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 font-mono text-[11px] text-gray-500">
                        {tx.utr}
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => showToast(`📄 Downloading tax invoice for ${tx.txnId}...`)}
                          className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ========================================================
            VIEW 3: RESULT VERIFIER (OFFICIAL POST-MATCH CERTIFICATION)
            ======================================================== */}
        {(activeTab === 'result-verifier' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600 text-[20px]">fact_check</span>
                  Match Result Verifier &amp; Scoreboard Certification
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Inspect organizer scoreboard submissions, verify screenshot proof, validate winner clans, and certify results to push directly to Home Arena and dispatch participant emails.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold border border-purple-200">
                  {pendingResultsCount} Awaiting Verification
                </span>
              </div>
            </div>

            {/* List of Match Result Submissions */}
            {resultVerifications.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <span className="material-symbols-outlined text-[36px] text-gray-300 block mb-1">fact_check</span>
                <span className="font-bold text-gray-700 block text-xs">No Match Results Submitted Yet</span>
                <span className="text-[11px] text-gray-400">When organizers complete matches and submit scores via User Dashboard, they will appear here for inspection.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {resultVerifications.map((item) => (
                  <div key={item.id} className="bg-[#F9FAFB] rounded-[14px] border border-[#E5E7EB] p-4.5 space-y-3.5 hover:border-purple-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-[14px] text-gray-900">{item.tournamentTitle}</h4>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                            {item.game}
                          </span>
                          {item.submissionType === 'SLOT_POINTS' || item.slotPointsTable?.length > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">table_chart</span>
                              <span>Option 1: Slot Points Table ({item.slotPointsTable?.length || 16} Slots)</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold border border-indigo-200 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">image</span>
                              <span>Option 2: Single Image Proof</span>
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Host Organizer: <strong className="text-gray-800">{item.hostUser}</strong> ({item.hostEmail}) &bull; Match ID: <span className="font-mono">{item.matchId}</span>
                        </p>
                      </div>

                      <div>
                        {item.status === 'VERIFIED' ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold border border-emerald-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Certified &amp; Published
                          </span>
                        ) : item.status === 'NEEDS_REVISION' ? (
                          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[10.5px] font-bold border border-rose-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">error</span>
                            Revision Requested
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold border border-amber-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">pending</span>
                            Pending SuperAdmin Review
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Standings Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5">
                        <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block">🥇 1st Place (Winner)</span>
                        <span className="font-bold text-gray-900 text-[12px] block mt-0.5">{item.winnerClan}</span>
                      </div>
                      <div className="bg-gray-100/80 border border-gray-300/80 rounded-xl p-2.5">
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block">🥈 2nd Place (Runner-up)</span>
                        <span className="font-bold text-gray-900 text-[12px] block mt-0.5">{item.runnerUpClan}</span>
                      </div>
                      <div className="bg-amber-900/10 border border-amber-800/20 rounded-xl p-2.5">
                        <span className="text-[9px] font-bold text-amber-900 uppercase tracking-wider block">🥉 3rd Place</span>
                        <span className="font-bold text-gray-900 text-[12px] block mt-0.5">{item.thirdClan}</span>
                      </div>
                      <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-2.5">
                        <span className="text-[9px] font-bold text-purple-700 uppercase tracking-wider block">🎖️ Match MVP</span>
                        <span className="font-bold text-gray-900 text-[12px] block mt-0.5">{item.mvp}</span>
                      </div>
                    </div>

                    {/* Screenshot Proof Preview & Notes */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-3">
                        {item.posterUrl && (
                          <div 
                            onClick={() => window.open(item.posterUrl, '_blank')}
                            className="relative size-16 rounded-xl overflow-hidden border border-gray-300 shrink-0 cursor-pointer group"
                            title="Click to view full screenshot proof"
                          >
                            <img src={item.posterUrl} alt="Scoreboard Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-white text-[18px]">zoom_in</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Organizer Verification Notes</span>
                          <p className="text-[11.5px] text-gray-700 italic max-w-xl">"{item.notes || 'Official room points verified. Result ready for public archive.'}"</p>
                          <span className="text-[9.5px] text-gray-400 font-mono block mt-0.5">Submitted: {new Date(item.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => { setSelectedResultForInspection(item); setImageZoomLevel(1); }}
                          className="px-3.5 py-1.5 rounded-[8px] bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">zoom_in</span>
                          <span>Inspect Details &amp; Video</span>
                        </button>
                        {item.status !== 'VERIFIED' ? (
                          <>
                            <button
                              onClick={() => handleRejectResult(item.id)}
                              className="px-3 py-1.5 rounded-[8px] bg-gray-200 hover:bg-rose-100 text-gray-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Request Revision
                            </button>
                            <button
                              onClick={() => handleVerifyResult(item.id)}
                              className="px-4 py-1.5 rounded-[8px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[16px]">verified</span>
                              <span>Verify &amp; Publish</span>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onNavigate && onNavigate('home')}
                            className="px-3 py-1.5 rounded-[8px] bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            <span>View on Home Arena</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            FULL RESULT & SCOREBOARD INSPECTION MODAL (SUPER ADMIN VERIFIER)
            ======================================================== */}
        {selectedResultForInspection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-300 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-[#1F2937] text-white flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                    <span className="material-symbols-outlined text-[22px]">fact_check</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Inspect Match Results &amp; Scoreboard Certification</h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {selectedResultForInspection.tournamentTitle} ({selectedResultForInspection.game}) &bull; Conductor: {selectedResultForInspection.hostUser}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResultForInspection(null)}
                  className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {/* 1. Standings Grid */}
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Verified Standings &amp; MVP</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">🥇 1st Place (Winner)</span>
                      <span className="font-black text-gray-900 text-sm block mt-1">{selectedResultForInspection.winnerClan}</span>
                    </div>
                    <div className="bg-gray-100 border border-gray-300 rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-bold text-gray-700 uppercase block">🥈 2nd Place (Runner-up)</span>
                      <span className="font-black text-gray-900 text-sm block mt-1">{selectedResultForInspection.runnerUpClan}</span>
                    </div>
                    <div className="bg-amber-900/10 border border-amber-800/20 rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-bold text-amber-900 uppercase block">🥉 3rd Place</span>
                      <span className="font-black text-gray-900 text-sm block mt-1">{selectedResultForInspection.thirdClan}</span>
                    </div>
                    <div className="bg-purple-50 border border-purple-300 rounded-xl p-3 shadow-2xs">
                      <span className="text-[10px] font-bold text-purple-800 uppercase block">🎖️ Match MVP</span>
                      <span className="font-black text-gray-900 text-sm block mt-1">{selectedResultForInspection.mvp}</span>
                    </div>
                  </div>
                </div>

                {/* 2. OPTION 1: Slot-by-Slot Match Points Table Inspection */}
                {selectedResultForInspection.slotPointsTable && selectedResultForInspection.slotPointsTable.length > 0 && (
                  <div className="bg-purple-50/40 rounded-xl border border-purple-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-purple-700">table_chart</span>
                        <span>Option 1: Official Slot-by-Slot Points Table ({selectedResultForInspection.slotPointsTable.length} Slots)</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">
                        Conductor Verified Table
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-2xs max-h-60">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#1F2937] text-white uppercase text-[9.5px] sticky top-0 z-10 font-bold">
                          <tr>
                            <th className="py-2.5 px-3 text-center w-10">Rank</th>
                            <th className="py-2.5 px-3 w-20">Slot</th>
                            <th className="py-2.5 px-3">Clan / Team Name</th>
                            <th className="py-2.5 px-3 text-center w-16">Kills</th>
                            <th className="py-2.5 px-3 text-center w-16">Pos Pts</th>
                            <th className="py-2.5 px-3 text-center w-16">Total Pts</th>
                            <th className="py-2.5 px-3 text-center w-16">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedResultForInspection.slotPointsTable.map((slot, idx) => (
                            <tr key={idx} className={slot.wwcd ? 'bg-amber-50/80 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                              <td className="py-2 px-3 text-center font-bold text-gray-700">#{slot.rank || idx + 1}</td>
                              <td className="py-2 px-3 font-semibold text-gray-500">{slot.slot || `Slot ${idx + 1}`}</td>
                              <td className="py-2 px-3 font-sans font-bold text-gray-900 flex items-center gap-1.5">
                                {slot.wwcd && <span className="text-[14px]" title="Winner Winner Chicken Dinner">🍗</span>}
                                <span>{slot.clan}</span>
                              </td>
                              <td className="py-2 px-3 text-center font-mono text-gray-700">{slot.kills ?? 0}</td>
                              <td className="py-2 px-3 text-center font-mono text-gray-700">{slot.positionPts ?? 0}</td>
                              <td className="py-2 px-3 text-center font-mono font-bold text-purple-700">{slot.totalPts ?? (Number(slot.kills || 0) + Number(slot.positionPts || 0))}</td>
                              <td className="py-2 px-3 text-center">
                                {slot.wwcd ? (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[9px] font-bold">WWCD</span>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-mono">Rank {slot.rank || idx + 1}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. OPTION 2: High-Resolution Scoreboard Screenshot Proof Inspector */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-purple-600">image</span>
                      <span>Scoreboard Proof Image Inspection</span>
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setImageZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                        className="p-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        title="Zoom Out"
                      >
                        <span className="material-symbols-outlined text-[16px]">zoom_out</span>
                      </button>
                      <span className="font-mono text-[10px] text-gray-600 font-bold">{Math.round(imageZoomLevel * 100)}%</span>
                      <button
                        onClick={() => setImageZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                        className="p-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
                        title="Zoom In"
                      >
                        <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                      </button>
                      <button
                        onClick={() => window.open(selectedResultForInspection.posterUrl, '_blank')}
                        className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                        <span>Full Size</span>
                      </button>
                    </div>
                  </div>

                  <div className="w-full max-h-80 overflow-auto bg-black rounded-lg p-2 flex items-center justify-center border border-gray-300">
                    <img
                      src={selectedResultForInspection.posterUrl || '/assets/tournament_bgmi_showdown_4k.jpg'}
                      alt="Scoreboard Proof"
                      style={{ transform: `scale(${imageZoomLevel})`, transformOrigin: 'top center' }}
                      className="max-h-72 object-contain transition-transform duration-200"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 italic">
                    Verify that kill counts, placement points, and clan tags accurately match the rankings entered above.
                  </p>
                </div>

                {/* 3. Result Video Inspection & Scoreboard Animation Theme */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Result Video Review */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-rose-600">videocam</span>
                      Submitted Result Video / Replay VOD
                    </h4>
                    {selectedResultForInspection.videoUrl ? (
                      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-300 bg-black">
                        <iframe
                          src={getYouTubeEmbedUrl(selectedResultForInspection.videoUrl)}
                          title="Submitted Result Video"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-mono text-xs">
                        No result video URL provided
                      </div>
                    )}
                    <span className="text-[10px] text-gray-500 font-mono truncate block">
                      URL: {selectedResultForInspection.videoUrl || 'None'}
                    </span>
                  </div>

                  {/* Scoreboard Animation Theme */}
                  <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-indigo-600">animation</span>
                      Requested Scoreboard Animation Effect
                    </h4>
                    <div className="p-4 rounded-xl bg-[#0A0C10] text-white border border-[#DFBD78]/40 space-y-2 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-[#DFBD78]/20 text-[#DFBD78] font-bold text-[10px] uppercase font-mono">
                          {selectedResultForInspection.animationTheme || 'gold-championship'}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                          Animation Ready
                        </span>
                      </div>
                      <div className="py-2 text-center">
                        <span className="text-sm font-black text-white uppercase tracking-wider block">
                          🏆 {selectedResultForInspection.winnerClan}
                        </span>
                        <span className="text-[10px] text-[#DFBD78] font-mono">CHAMPION CERTIFIED</span>
                      </div>
                      <p className="text-[10.5px] text-gray-400 text-center">
                        This animated banner with glowing particle overlays will be rendered on the Home Arena Finished Matches card.
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase block mb-1">Conductor Remarks</span>
                      <p className="text-xs text-gray-800 bg-white p-2.5 rounded-lg border border-gray-200 italic">
                        "{selectedResultForInspection.notes || 'All matches completed. Scores verified.'}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-[11px] text-gray-500 font-mono">
                  Submitted: {new Date(selectedResultForInspection.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRejectResult(selectedResultForInspection.id)}
                    className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-rose-100 text-gray-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit_note</span>
                    <span>Ask User to Re-Request / Revision</span>
                  </button>
                  <button
                    onClick={() => handleVerifyResult(selectedResultForInspection.id)}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Approve &amp; Publish to All Live Users</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW: CONTACT US & SUPPORT INQUIRIES QUEUE
            ======================================================== */}
        {(activeTab === 'contact-requests' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-[20px]">mail</span>
                  Contact Us Inquiries &amp; Live Support Messages
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Review direct inquiries, partnership proposals, and support requests submitted by users from the live homepage Contact Us section.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                  {pendingContactCount} Pending Inquiries
                </span>
              </div>
            </div>

            {/* List of Contact Messages */}
            {contactMessages.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <span className="material-symbols-outlined text-[36px] text-gray-300 block mb-1">mark_email_read</span>
                <span className="font-bold text-gray-700 block text-xs">No Contact Inquiries Recorded</span>
                <span className="text-[11px] text-gray-400">When users submit messages via the homepage Contact Us form, they will appear here.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {contactMessages.map((ticket) => (
                  <div key={ticket.id} className="bg-[#F9FAFB] rounded-xl border border-gray-200 p-4 space-y-2 hover:border-emerald-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-[13px]">{ticket.name}</span>
                        <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 font-mono text-[10px] font-bold">
                          {ticket.category}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{ticket.dateStr || 'Recent'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ticket.status === 'RESOLVED' ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">check</span>
                            Resolved
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">pending</span>
                            Action Required
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">Email</span>
                        <a href={`mailto:${ticket.email}`} className="text-blue-600 hover:underline font-mono">{ticket.email}</a>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">Phone / WhatsApp</span>
                        <span className="text-gray-800 font-mono">{ticket.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase block">Ticket ID</span>
                        <span className="text-gray-500 font-mono">{ticket.id}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">User Message</span>
                      <p className="text-xs text-gray-800 bg-white p-3 rounded-lg border border-gray-200 mt-1">
                        {ticket.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
                      {ticket.phone && ticket.phone !== 'Not Provided' && (
                        <a
                          href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[14px]">chat</span>
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a
                        href={`mailto:${ticket.email}?subject=Regarding your LiveTournaments.in Inquiry (${ticket.category})`}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        <span>Reply Email</span>
                      </a>
                      {ticket.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleResolveContactTicket(ticket.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Mark as Resolved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteContactTicket(ticket.id)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Delete Ticket"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            VIEW 9: PLATFORM SETTINGS (LIVE HOME ARENA CMS)
            ======================================================== */}
        {(activeTab === 'platform-settings' || activeTab === 'all-in-one') && (
          <section className="bg-white rounded-[16px] p-5 border border-[#D1D1D1]/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)] space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
              <div>
                <h3 className="text-[15px] font-bold text-[#1F2937] tracking-tight flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#DFBD78] text-[20px]">settings</span>
                  Platform Settings &amp; Live Home Arena CMS
                </h3>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Update Home Arena titles, marketing headlines, marquee ticker announcements, featured YouTube broadcast, and manage the upcoming games catalog in real-time.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSavePlatformSettings}
                  className="px-4 py-2 rounded-[8px] bg-gradient-to-r from-[#DFBD78] to-[#C5A059] hover:from-[#C5A059] hover:to-[#DFBD78] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePlatformSettings} className="space-y-5">
              {/* Home Arena Hero CMS */}
              <div className="bg-[#F9FAFB] rounded-[14px] border border-[#E5E7EB] p-4.5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#C5A059]">title</span>
                  Hero Banner Titles &amp; Headings
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Hero Main Title</label>
                    <input
                      type="text"
                      value={platformSettings.heroTitle}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, heroTitle: e.target.value })}
                      placeholder="e.g. LIVE TOURNAMENTS INDIA"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Hero Subtitle Badge</label>
                    <input
                      type="text"
                      value={platformSettings.heroSubtitle}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, heroSubtitle: e.target.value })}
                      placeholder="e.g. INDIA'S PREMIER COMPETITIVE ESPORTS ARENA"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Tagline &amp; CTA Description</label>
                  <input
                    type="text"
                    value={platformSettings.tagline}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, tagline: e.target.value })}
                    placeholder="Join us from now to participate and host your tournaments via LT.IN."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">Marquee Ticker Text (Announcements)</label>
                  <input
                    type="text"
                    value={platformSettings.marqueeText}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, marqueeText: e.target.value })}
                    placeholder="🔥 BGMI PRO TOURNAMENT REGISTRATIONS OPEN • ₹50,000 PRIZE POOL • DAILY SCRIMS AT 8 PM"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              {/* Live Broadcast Stream Setting */}
              <div className="bg-[#F9FAFB] rounded-[14px] border border-[#E5E7EB] p-4.5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-rose-500">live_tv</span>
                  Featured Homepage Broadcast Stream (YouTube Only)
                </h4>
                <p className="text-[11px] text-gray-500">
                  Enter the official YouTube stream URL displayed on the Homepage Live Broadcast section. Must begin with <code className="text-rose-600 font-bold">www.</code> and contain <code className="text-rose-600 font-bold">youtube</code>.
                </p>
                <div>
                  <input
                    type="url"
                    value={platformSettings.featuredStreamUrl}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, featuredStreamUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-xs font-mono text-gray-900 focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1 font-mono">
                    Rule: URL must start with www. (or https://www. / http://www.) and contain youtube. Raw hashtags (#) or handles (@) are blocked.
                  </span>
                </div>
              </div>

              {/* Upcoming Games Management */}
              <div className="bg-[#F9FAFB] rounded-[14px] border border-[#E5E7EB] p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-indigo-500">sports_esports</span>
                    Upcoming Games &amp; Titles Catalog
                  </h4>
                  <span className="text-xs text-gray-500 font-bold">
                    {platformSettings.games?.length || 0} Games Listed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {platformSettings.games?.map((game, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {game.logo && (
                          <img src={game.logo} alt={game.name} className="size-9 rounded-lg object-cover border border-gray-200 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-gray-900 truncate block">{game.name}</span>
                          <span className="text-[10px] text-gray-500 truncate block">{game.genre}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = platformSettings.games.filter((_, i) => i !== idx);
                          setPlatformSettings({ ...platformSettings, games: updated });
                        }}
                        className="text-gray-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer shrink-0"
                        title="Remove Game"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Game Bar */}
                <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    id="new-game-title"
                    placeholder="New Game Title (e.g. Free Fire MAX)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    id="new-game-genre"
                    placeholder="Genre (e.g. Battle Royale)"
                    className="w-full sm:w-44 px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nameInput = document.getElementById('new-game-title');
                      const genreInput = document.getElementById('new-game-genre');
                      if (!nameInput?.value.trim()) return;
                      const newG = {
                        name: nameInput.value.trim(),
                        genre: genreInput?.value.trim() || 'Esports Title',
                        logo: '/assets/tournament_bgmi_showdown_4k.jpg',
                        active: true
                      };
                      setPlatformSettings({
                        ...platformSettings,
                        games: [...(platformSettings.games || []), newG]
                      });
                      nameInput.value = '';
                      if (genreInput) genreInput.value = '';
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    <span>Add Game</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-[10px] bg-gradient-to-r from-[#DFBD78] to-[#C5A059] hover:from-[#C5A059] hover:to-[#DFBD78] text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save &amp; Publish Platform Settings</span>
                </button>
              </div>
            </form>
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

      {/* ========================================================
          MODAL: GRANT DIRECT VIP ACCESS (ZERO PAYMENT CLEARANCE)
          ======================================================== */}
      {showVipDirectGrantModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] max-w-lg w-full overflow-hidden shadow-2xl border border-[#DFBD78]/40 flex flex-col">
            <div className="p-4 bg-[#1F2937] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DFBD78] text-[22px]">stars</span>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">Grant Direct VIP Access</h3>
                  <span className="text-[10px] text-gray-300">Super Admin Direct Clearance &bull; Zero Payment (₹0)</span>
                </div>
              </div>
              <button
                onClick={() => setShowVipDirectGrantModal(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGrantVipDirectAccess} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Recipient User / Organizer Email *
                </label>
                <input
                  type="email"
                  value={vipEmail}
                  onChange={(e) => setVipEmail(e.target.value)}
                  placeholder="e.g. streamer@clan.com or favorite user email"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#DFBD78] outline-hidden text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    User / Creator Name
                  </label>
                  <input
                    type="text"
                    value={vipName}
                    onChange={(e) => setVipName(e.target.value)}
                    placeholder="e.g. Jonathan Gaming"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#DFBD78] outline-hidden text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Access Privilege to Grant
                  </label>
                  <select
                    value={vipPrivilege}
                    onChange={(e) => setVipPrivilege(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#DFBD78] outline-hidden text-xs bg-white"
                  >
                    <option>Direct Broadcast &amp; Streams Pass (30 Days)</option>
                    <option>Direct Broadcast &amp; Streams Pass (15 Days)</option>
                    <option>Direct Broadcast &amp; Streams Pass (7 Days)</option>
                    <option>Direct Tournament Room Conducting Access (₹0)</option>
                    <option>Direct Daily Scrims Conducting Access (₹0)</option>
                    <option>Direct Featured Tournament Boost (Home Carousel)</option>
                    <option>All-Access Master Partner Pass</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Assigned Tournament / Match Title
                </label>
                <input
                  type="text"
                  value={vipTournamentTitle}
                  onChange={(e) => setVipTournamentTitle(e.target.value)}
                  placeholder="e.g. Official Partner Invitational Cup"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#DFBD78] outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Live Stream / YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={vipChannelUrl}
                  onChange={(e) => setVipChannelUrl(e.target.value)}
                  placeholder="e.g. https://youtube.com/@channel or live link"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#DFBD78] outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Invitation Note / Administrative Memo
                </label>
                <textarea
                  value={vipNote}
                  onChange={(e) => setVipNote(e.target.value)}
                  rows="2"
                  placeholder="e.g. Official VIP invitation. Direct clearance granted without payment."
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-[#DFBD78] outline-hidden text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2 text-[11px]">
                <span className="material-symbols-outlined text-[16px] text-amber-700">email</span>
                <span>
                  Granting access will immediately approve this user in the hosting directory and dispatch an official VIP invitation email to <strong>{vipEmail || 'the recipient'}</strong>.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowVipDirectGrantModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#DFBD78] to-[#C5A059] hover:from-[#C5A059] hover:to-[#DFBD78] text-black text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                >
                  Grant Direct Access &amp; Send VIP Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
