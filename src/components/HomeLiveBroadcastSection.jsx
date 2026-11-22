import React, { useState, useEffect } from 'react';
import { getYouTubeEmbedUrl, validateLiveStreamUrl } from '../utils/urlValidator';
import SuspiciousReportModal from './SuspiciousReportModal';

export default function HomeLiveBroadcastSection({ onNavigate, currentUser }) {
  const [streamData, setStreamData] = useState(() => {
    return loadActiveStream();
  });

  const [viewerCount, setViewerCount] = useState(14820);
  const [reportingStream, setReportingStream] = useState(null);

  function loadActiveStream() {
    if (typeof window === 'undefined') {
      return {
        url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
        title: 'BGMI Pro League Grand Finals 2026 - Live Match Arena',
        organizer: 'GodLike Esports Official',
        clan: 'GODL',
        game: 'BATTLEGROUNDS MOBILE INDIA',
        isApproved: true,
        viewers: 14820
      };
    }

    try {
      // 1. Check Super Admin approved stream
      const adminApproved = localStorage.getItem('lt_approved_live_stream');
      if (adminApproved) {
        const parsed = JSON.parse(adminApproved);
        return {
          url: parsed.url || 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
          title: parsed.title || 'Official Tournament Live Stream',
          organizer: parsed.organizer || 'Tournament Production Hub',
          clan: parsed.clan || 'OFFICIAL',
          game: parsed.game || 'BGMI',
          isApproved: true,
          viewers: parsed.viewers || 18450
        };
      }

      // 2. Check user's hosted tournaments/scrims with liveUrl that is APPROVED
      const hostedList = localStorage.getItem('lt_user_hosted_tourneys');
      if (hostedList) {
        const list = JSON.parse(hostedList);
        const liveMatch = list.find(t => (t.status === 'APPROVED' || t.status === 'LIVE') && (t.channelLink || t.liveUrl));
        if (liveMatch) {
          return {
            url: liveMatch.channelLink || liveMatch.liveUrl,
            title: liveMatch.title || 'Hosted Community Match Broadcast',
            organizer: liveMatch.organizerName || 'Verified Community Clan',
            clan: liveMatch.organizerClan || 'WARRIOR',
            game: liveMatch.game || 'BGMI',
            isApproved: true,
            viewers: 9420
          };
        }
      }

      // 3. Check lt_user_live_stream_url
      const userStream = localStorage.getItem('lt_user_live_stream_url');
      if (userStream) {
        return {
          url: userStream,
          title: 'Live Tournament Arena - Community Broadcast',
          organizer: currentUser ? (currentUser.username || currentUser.email) : 'Verified Host',
          clan: currentUser?.clan || 'HOST',
          game: 'BGMI / ESPORTS',
          isApproved: true,
          viewers: 12350
        };
      }
    } catch (e) {
      console.error('Error loading stream:', e);
    }

    // Default Fallback Live Stream
    return {
      url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
      title: 'BGMI Championship Series 2026 - Grand Finals Match 4',
      organizer: 'Team Soul Esports Arena',
      clan: 'SOUL',
      game: 'BATTLEGROUNDS MOBILE INDIA',
      isApproved: true,
      viewers: 14820
    };
  }

  // Sync with localStorage across tabs and within page
  useEffect(() => {
    const handleSync = () => {
      setStreamData(loadActiveStream());
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('lt_stream_updated', handleSync);

    // Subtle viewer counter pulse
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 4000);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('lt_stream_updated', handleSync);
      clearInterval(interval);
    };
  }, [currentUser]);

  const embedSrc = getYouTubeEmbedUrl(streamData.url);

  const handleHostStreamClick = () => {
    if (!currentUser) {
      if (onNavigate) onNavigate('login');
    } else {
      if (onNavigate) onNavigate('user-dashboard', 'broadcast');
    }
  };

  return (
    <section id="live-broadcast" className="relative w-full bg-[#0B0E14] text-white py-12 px-4 sm:px-6 lg:px-12 border-y border-[#262B35] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE BROADCAST ARENA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
              <span>FEATURED LIVE STREAM</span>
              <span className="text-xs px-2.5 py-1 rounded bg-[#C5A059]/20 text-[#DFBD78] border border-[#C5A059]/40 font-mono font-semibold">
                ADMIN APPROVED
              </span>
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Watch official competitive matches and approved clan broadcasts streaming live from the battle arena.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleHostStreamClick}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#DFBD78] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg shadow-[#C5A059]/20 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">podium</span>
              <span>Host Your Own Stream</span>
            </button>
            <a
              href={streamData.url.startsWith('http') ? streamData.url : `https://${streamData.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all flex items-center gap-1.5"
            >
              <span>Watch on YouTube</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
            <button
              onClick={() => setReportingStream({
                id: 'stream_' + Date.now(),
                title: streamData.title,
                type: 'Live Stream Broadcast',
                organizer: streamData.organizer,
                game: streamData.game,
                link: streamData.url
              })}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs uppercase tracking-wider border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Report suspicious broadcast stream to Admin"
            >
              <span className="material-symbols-outlined text-[15px]">flag</span>
              <span>Report Stream</span>
            </button>
          </div>
        </div>

        {/* Video Player Card */}
        <div className="bg-[#121620] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Top Video Toolbar */}
          <div className="bg-[#161B26] px-4 py-3 border-b border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="uppercase tracking-wider text-[11px]">ON AIR</span>
              </div>
              <span className="text-gray-500">|</span>
              <span className="text-gray-300 font-semibold truncate max-w-xs sm:max-w-md">{streamData.title}</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span className="font-bold">{viewerCount.toLocaleString()}</span>
                <span className="text-[10px] text-gray-400">watching</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 font-bold text-[10px] uppercase">
                1080p 60FPS
              </span>
            </div>
          </div>

          {/* 16:9 Responsive Video Player */}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src={embedSrc}
              title={streamData.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Bottom Broadcast Meta Card */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-[#161B26] to-[#0E1118] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#DFBD78]/10 border border-[#DFBD78]/30 flex items-center justify-center text-[#DFBD78] font-black text-sm uppercase shrink-0">
                {streamData.clan || 'LT'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-white text-base sm:text-lg">{streamData.title}</h3>
                  <span className="material-symbols-outlined text-blue-400 text-sm" title="Verified Creator">verified</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                  <span>Host: <strong className="text-white font-semibold">{streamData.organizer}</strong></span>
                  <span>•</span>
                  <span>Game: <strong className="text-[#DFBD78] font-semibold">{streamData.game}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleHostStreamClick}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-[#DFBD78]">live_tv</span>
                <span>Get Broadcast Pass</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Suspicious Activity Report Modal for Live Stream */}
      <SuspiciousReportModal
        target={reportingStream}
        currentUser={currentUser}
        onClose={() => setReportingStream(null)}
      />
    </section>
  );
}
