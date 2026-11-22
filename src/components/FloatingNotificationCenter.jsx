import React, { useState, useEffect, useRef } from 'react';

// Play a pleasant high-tech esports chime using Web Audio API (zero external assets needed)
function playEsportsChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);
  } catch (e) {}
}

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    title: 'BGMI Pro Invitational Grand Finals',
    message: 'Official match room credentials will unlock 15 minutes prior to match schedule.',
    type: 'TOURNAMENT',
    category: 'MATCH',
    time: '10m ago',
    unread: true,
    link: 'tournaments'
  },
  {
    id: 'notif_2',
    title: 'Super Admin: Tournament Approved',
    message: 'Community Tournament Room "Weekend Clan Showdown" is now live on the public portal.',
    type: 'APPROVED',
    category: 'SYSTEM',
    time: '35m ago',
    unread: true,
    link: 'tournaments'
  },
  {
    id: 'notif_3',
    title: 'Live Stream Broadcast On-Air',
    message: 'Madan Conqueror Official Cast has started on Home Arena TV Broadcast Slot #1.',
    type: 'BROADCAST',
    category: 'BROADCAST',
    time: '1h ago',
    unread: true,
    link: 'home'
  },
  {
    id: 'notif_4',
    title: 'Daily Practice Scrims - Tier 1 Squads',
    message: 'Lobby open for registration. Join with your squad and practice with verified esports clans.',
    type: 'SCRIM',
    category: 'SCRIMS',
    time: '2h ago',
    unread: false,
    link: 'tournaments'
  }
];

export default function FloatingNotificationCenter({ currentUser, onNavigate, standaloneBell = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lt_notifications');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [activeToasts, setActiveToasts] = useState([]);
  const panelRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lt_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Push new notification helper
  const pushNotification = (notif) => {
    const newEntry = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: notif.title || 'Platform Notification',
      message: notif.message || '',
      type: notif.type || 'SYSTEM',
      category: notif.category || 'SYSTEM',
      time: 'Just now',
      unread: true,
      link: notif.link || 'tournaments',
      timestamp: Date.now()
    };

    setNotifications(prev => [newEntry, ...prev.slice(0, 49)]);

    // Trigger Floating Toast (top right)
    setActiveToasts(prev => [newEntry, ...prev.slice(0, 2)]);
    playEsportsChime();
  };

  // Close panel on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Listen to system events across the entire app
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('lt_toggle_notifications', handleToggle);
    window.addEventListener('lt_open_notifications', handleOpen);

    const handleCustomNotify = (e) => {
      if (e?.detail) pushNotification(e.detail);
    };

    const handleHostingApproved = () => {
      pushNotification({
        title: 'Tournament Hosting Approved!',
        message: 'Your tournament room is now live and visible to all competitors on the portal.',
        type: 'APPROVED',
        category: 'TOURNAMENT',
        link: 'tournaments'
      });
    };

    const handleScrimApproved = () => {
      pushNotification({
        title: 'Daily Scrims Authorized!',
        message: 'Your practice lobby has been approved by the Super Admin and scheduled.',
        type: 'APPROVED',
        category: 'SCRIMS',
        link: 'tournaments'
      });
    };

    const handleBroadcastApproved = () => {
      pushNotification({
        title: 'Live Stream Pass Active!',
        message: 'Your broadcast is now scheduled on the Home Arena Live Stream billboard.',
        type: 'BROADCAST',
        category: 'BROADCAST',
        link: 'home'
      });
    };

    const handleRegSubmitted = () => {
      pushNotification({
        title: 'Match Entry Confirmed! 🎟️',
        message: 'Slot reserved. Custom Room ID & Password will unlock in your dashboard 15m before kickoff.',
        type: 'TOURNAMENT',
        category: 'MATCH',
        link: 'tournaments'
      });
    };

    window.addEventListener('lt_notify', handleCustomNotify);
    window.addEventListener('lt_hosting_approved', handleHostingApproved);
    window.addEventListener('lt_scrim_approved', handleScrimApproved);
    window.addEventListener('lt_broadcast_approved', handleBroadcastApproved);
    window.addEventListener('lt_registration_submitted', handleRegSubmitted);

    return () => {
      window.removeEventListener('lt_toggle_notifications', handleToggle);
      window.removeEventListener('lt_open_notifications', handleOpen);
      window.removeEventListener('lt_notify', handleCustomNotify);
      window.removeEventListener('lt_hosting_approved', handleHostingApproved);
      window.removeEventListener('lt_scrim_approved', handleScrimApproved);
      window.removeEventListener('lt_broadcast_approved', handleBroadcastApproved);
      window.removeEventListener('lt_registration_submitted', handleRegSubmitted);
    };
  }, []);

  // Remove toast after 5.5 seconds
  const dismissToast = (id) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'TOURNAMENTS') return n.category === 'TOURNAMENT' || n.category === 'MATCH';
    if (activeFilter === 'SCRIMS') return n.category === 'SCRIMS';
    if (activeFilter === 'BROADCAST') return n.category === 'BROADCAST';
    if (activeFilter === 'SYSTEM') return n.category === 'SYSTEM';
    return true;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'APPROVED':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'BROADCAST':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'SCRIM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      case 'TOURNAMENT':
        return 'bg-[#DFBD78]/20 text-[#DFBD78] border-[#DFBD78]/40';
      default:
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
    }
  };

  return (
    <>
      {/* ========================================================
          1. FLOATING TOAST NOTIFICATION STACK (TOP-RIGHT)
          ======================================================== */}
      <div className="fixed top-20 right-4 sm:right-6 z-[99999] flex flex-col gap-2.5 pointer-events-none max-w-[380px] w-full">
        {activeToasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto relative overflow-hidden rounded-2xl bg-[#0B0E14]/95 border border-[#C5A059]/60 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(197,160,89,0.25)] p-4 text-white transition-all duration-300 animate-in slide-in-from-right fade-in group"
          >
            {/* Glowing Accent Bar on Left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#DFBD78] via-[#C5A059] to-[#9B792A]" />

            <div className="flex items-start gap-3 pl-1">
              <div className="size-8 rounded-xl bg-gradient-to-br from-[#DFBD78] to-[#9B792A] flex items-center justify-center text-black shrink-0 shadow-sm mt-0.5">
                <span className="material-symbols-outlined text-[17px]">notifications_active</span>
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${getBadgeStyle(toast.type)}`}>
                    {toast.type}
                  </span>
                  <span className="text-[10px] text-[#C5A059] font-mono">Just now</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wide truncate">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-gray-300 leading-relaxed mt-0.5 line-clamp-2">
                  {toast.message}
                </p>

                {toast.link && onNavigate && (
                  <button
                    onClick={() => {
                      onNavigate(toast.link);
                      dismissToast(toast.id);
                    }}
                    className="mt-2 text-[10px] font-bold text-gold-light hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View in Arena</span>
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="size-5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>

            {/* Auto-Dismiss Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#DFBD78] to-[#C5A059] animate-[shrink_5s_linear_forwards]" />
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          2. TOP-RIGHT FLOATING NOTIFICATION BELL TRIGGER
          ======================================================== */}
      {standaloneBell && (
        <div
          style={{ position: 'fixed', top: '20px', right: currentUser ? '225px' : '190px', zIndex: 101 }}
          className="select-none hidden sm:block"
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative size-10 rounded-full flex items-center justify-center backdrop-blur-xl transition-all duration-200 shadow-xl cursor-pointer ${
              isOpen
                ? 'bg-neutral-900 border-2 border-[#DFBD78] text-[#DFBD78] shadow-[0_0_20px_rgba(223,189,120,0.4)]'
                : 'bg-neutral-950/85 border border-white/20 text-white hover:border-[#DFBD78]/70 hover:text-[#DFBD78]'
            }`}
            title="Notifications & Match Alerts"
            aria-label="Open Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">
              {unreadCount > 0 ? 'notifications_active' : 'notifications'}
            </span>

            {/* Pulsing Unread Badge Counter */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4.5 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* ========================================================
          3. LUXURY NOTIFICATION CENTER DROPDOWN PANEL
          ======================================================== */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{ position: 'fixed', top: '72px', right: '16px', width: '380px', maxWidth: 'calc(100vw - 32px)', zIndex: 99990 }}
          className="rounded-3xl bg-[#0B0E14]/98 border border-[#C5A059]/50 backdrop-blur-3xl shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(197,160,89,0.2)] flex flex-col overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150"
        >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-[#141722] via-[#0E1119] to-black border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="size-7 rounded-lg bg-gradient-to-br from-[#DFBD78] to-[#9B792A] flex items-center justify-center text-black shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">notifications</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 text-[8.5px] font-bold border border-red-500/30">
                          {unreadCount} NEW
                        </span>
                      )}
                    </h3>
                    <p className="text-[10px] text-gray-400">Live platform alerts &amp; match updates</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#DFBD78] hover:text-white text-[9.5px] font-bold uppercase transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      Read All
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="size-6 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="p-2 bg-[#08090D] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[10px]">
                {['ALL', 'TOURNAMENTS', 'SCRIMS', 'BROADCAST', 'SYSTEM'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-[#DFBD78] text-black shadow-xs'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-white/5 p-2 bg-[#0B0E14]/90 space-y-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 space-y-1.5">
                    <span className="material-symbols-outlined text-3xl text-gray-600 block">notifications_off</span>
                    <p className="text-xs font-bold text-gray-400">No notifications in this category</p>
                    <p className="text-[10px] text-gray-600">Platform updates and match triggers will appear here.</p>
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 rounded-2xl transition-all cursor-pointer relative group flex flex-col gap-1.5 ${
                        n.unread
                          ? 'bg-white/[0.04] border border-[#DFBD78]/30 hover:border-[#DFBD78]/60 hover:bg-white/[0.07]'
                          : 'bg-transparent hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {n.unread && (
                            <span className="size-1.5 rounded-full bg-red-500 shadow-xs shrink-0" />
                          )}
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase border ${getBadgeStyle(n.type)}`}>
                            {n.type}
                          </span>
                          <span className="text-[9.5px] font-mono text-gray-500">{n.time}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(prev => prev.filter(item => item.id !== n.id));
                          }}
                          className="opacity-0 group-hover:opacity-100 size-4 text-gray-500 hover:text-rose-400 flex items-center justify-center transition-all cursor-pointer"
                          title="Delete notification"
                        >
                          <span className="material-symbols-outlined text-[13px]">delete</span>
                        </button>
                      </div>

                      <div>
                        <h4 className="text-[11.5px] font-bold text-white leading-tight">
                          {n.title}
                        </h4>
                        <p className="text-[10.5px] text-gray-300 leading-relaxed mt-0.5">
                          {n.message}
                        </p>
                      </div>

                      {n.link && onNavigate && (
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(false);
                              onNavigate(n.link);
                            }}
                            className="font-bold text-[#DFBD78] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Open in Arena</span>
                            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-3 bg-gradient-to-r from-black via-[#0E1119] to-black border-t border-white/10 flex items-center justify-between text-[10.5px] shrink-0">
                <button
                  onClick={() => {
                    pushNotification({
                      title: '⚡ Test Alert Dispatched',
                      message: 'Real-time floating top-right notification successfully delivered across the platform!',
                      type: 'SYSTEM',
                      category: 'SYSTEM',
                      link: 'tournaments'
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  <span>Test Notification</span>
                </button>

                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-gray-500 hover:text-rose-400 font-bold transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      );
    }

// Global utility helper to trigger top-right notifications from anywhere in the app
export function triggerTopRightNotification({ title, message, type = 'TOURNAMENT', category = 'TOURNAMENT', link = 'tournaments' }) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lt_notify', {
      detail: { title, message, type, category, link }
    }));
  }
}
