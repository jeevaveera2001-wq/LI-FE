import React, { useState, useEffect, useRef } from 'react';
import { fetchCloudChatMessages, sendCloudChatMessage } from '../services/cloudSync';
import { subscribeRealtimeEvents, emitRealtimeEvent } from '../utils/realtimeSync';

export default function FloatingCommunityChat({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('global'); // 'global' | 'match' | 'host'
  const [selectedMatchRoomId, setSelectedMatchRoomId] = useState('match_bgmi_showdown');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [guestName, setGuestName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lt_chat_guest_name') || 'Gamer_' + Math.floor(100 + Math.random() * 900);
    }
    return 'Gamer_101';
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Active match lobbies discovery (from registered tourneys, scrims, or hosted rooms)
  const [activeMatchLobbies, setActiveMatchLobbies] = useState(() => {
    const list = [
      { id: 'match_bgmi_showdown', title: 'BGMI Masters Championship', type: 'TOURNAMENT', host: 'Jeeva Veeramani (VIP)' },
      { id: 'match_scrims_daily', title: 'Daily Scrims Tier-1 Lobby', type: 'SCRIM', host: 'Admin Host' },
      { id: 'match_masters_clutch', title: 'Masters Clutch Cup', type: 'TOURNAMENT', host: 'Shadow_Sniper' }
    ];

    try {
      const hosted = JSON.parse(localStorage.getItem('lt_user_hosted_tourneys') || '[]');
      if (Array.isArray(hosted) && hosted.length > 0) {
        hosted.forEach(h => {
          if (!list.some(l => l.id === h.id)) {
            list.unshift({
              id: h.id,
              title: h.title,
              type: h.type || 'TOURNAMENT',
              host: h.organizer || h.hostUser || 'Host'
            });
          }
        });
      }
    } catch (e) {}

    return list;
  });

  const currentRoomId = activeChannel === 'global' ? 'global' : selectedMatchRoomId;
  const currentRoomTitle = activeChannel === 'global'
    ? 'Global Arena Chat'
    : (activeMatchLobbies.find(m => m.id === selectedMatchRoomId)?.title || 'Match Group Chat');

  // Load messages from cloud and local cache
  const loadMessages = async () => {
    const cloudMsgs = await fetchCloudChatMessages(currentRoomId);
    if (Array.isArray(cloudMsgs) && cloudMsgs.length > 0) {
      setMessages(cloudMsgs);
    } else {
      // Fallback local storage
      try {
        const local = JSON.parse(localStorage.getItem(`lt_chat_${currentRoomId}`) || '[]');
        if (Array.isArray(local)) setMessages(local);
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [currentRoomId]);

  useEffect(() => {
    const unsub = subscribeRealtimeEvents((event, data) => {
      if (event === 'CHAT_MESSAGE' && data && data.roomId === currentRoomId) {
        setMessages(prev => (prev.some(m => m.id === data.id) ? prev : [...prev, data]));
        if (!isOpen) setUnreadCount(c => c + 1);
      }
    });
    return unsub;
  }, [currentRoomId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim()) return;

    const senderName = currentUser?.name || currentUser?.username || guestName;
    const senderRole = currentUser?.role?.toUpperCase() || (currentUser?.isVip ? 'VIP' : 'PLAYER');
    const senderClan = currentUser?.clan || 'Competitor';
    const isHost = activeMatchLobbies.some(m => m.id === currentRoomId && m.host.includes(senderName));

    const newMsg = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      roomId: currentRoomId,
      roomTitle: currentRoomTitle,
      sender: senderName,
      senderEmail: currentUser?.email || '',
      senderRole,
      senderClan,
      message: inputText.trim(),
      timestamp: new Date().toISOString(),
      isHost
    };

    // Optimistic UI update
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    try {
      const local = JSON.parse(localStorage.getItem(`lt_chat_${currentRoomId}`) || '[]');
      localStorage.setItem(`lt_chat_${currentRoomId}`, JSON.stringify([...local, newMsg]));
    } catch (e) {}

    // Dispatch realtime & cloud sync
    emitRealtimeEvent('CHAT_MESSAGE', newMsg);
    await sendCloudChatMessage(newMsg);
  };

  const handleQuickPreset = (text) => {
    setInputText(text);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none font-sans">
      
      {/* Floating Toggle Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-gray-950 via-[#181920] to-black border border-[#DFBD78]/40 hover:border-[#DFBD78] text-white shadow-2xl shadow-black/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <div className="relative">
            <div className="size-8 rounded-full bg-gradient-to-br from-[#DFBD78] to-[#99793D] flex items-center justify-center text-black shadow-md">
              <span className="material-symbols-outlined text-[18px]">forum</span>
            </div>
            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 border-2 border-black animate-pulse"></span>
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-white">Live Arena Chat</span>
              <span className="size-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[10px] text-[#DFBD78] font-medium leading-none mt-0.5">
              Match Groups &bull; Talk with Hosts
            </p>
          </div>

          {unreadCount > 0 && (
            <span className="ml-1 size-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Expanded Floating Chat Box */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[540px] max-h-[85vh] rounded-3xl bg-[#0F1015] border border-[#DFBD78]/40 shadow-2xl shadow-black/90 flex flex-col overflow-hidden text-white animate-fade-in">
          
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#171821] via-[#121319] to-black border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-gradient-to-br from-[#DFBD78] to-[#99793D] flex items-center justify-center text-black shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>Live Arena Chat</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-bold border border-emerald-500/30">ONLINE</span>
                </h3>
                <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                  {currentRoomTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="size-7 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Minimize"
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
          </div>

          {/* Navigation Channels / Match Groups */}
          <div className="p-2 bg-[#090A0D] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto shrink-0 text-[10.5px]">
            <button
              onClick={() => setActiveChannel('global')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeChannel === 'global'
                  ? 'bg-[#DFBD78] text-black shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">public</span>
              <span>Global Arena</span>
            </button>

            <button
              onClick={() => setActiveChannel('match')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeChannel === 'match'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">groups</span>
              <span>Match Room Groups</span>
            </button>
          </div>

          {/* If Match Groups Active: Select Match Lobby */}
          {activeChannel === 'match' && (
            <div className="px-3 py-2 bg-blue-950/20 border-b border-blue-500/20 flex items-center justify-between gap-2 shrink-0 text-xs">
              <span className="text-[10px] font-bold text-blue-300 uppercase shrink-0">Active Match:</span>
              <select
                value={selectedMatchRoomId}
                onChange={(e) => setSelectedMatchRoomId(e.target.value)}
                className="w-full bg-[#12131A] text-white text-[11px] font-medium py-1 px-2.5 rounded-lg border border-blue-400/30 outline-hidden cursor-pointer"
              >
                {activeMatchLobbies.map(m => (
                  <option key={m.id} value={m.id}>
                    [{m.type}] {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0B0C10]/80">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 text-gray-600">chat_bubble_outline</span>
                <p className="text-xs font-bold text-gray-400">No messages in this room yet.</p>
                <p className="text-[10.5px] mt-1 max-w-[220px]">
                  Be the first to say hi to the match host and fellow registered squads!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = (currentUser?.email && msg.senderEmail === currentUser.email) || msg.sender === guestName;
                const isVip = msg.senderRole === 'VIP' || msg.senderRole === 'SUPERADMIN';
                const isHost = msg.isHost;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-0.5`}
                  >
                    {/* Sender Identity */}
                    <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 px-1">
                      <span className={`font-black ${isMe ? 'text-[#DFBD78]' : 'text-gray-300'}`}>
                        {msg.sender}
                      </span>

                      {isHost && (
                        <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-black uppercase border border-amber-400/30">
                          HOST
                        </span>
                      )}

                      {isVip && !isHost && (
                        <span className="px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[8px] font-bold uppercase border border-purple-400/30">
                          {msg.senderRole}
                        </span>
                      )}

                      {msg.senderClan && (
                        <span className="text-[8.5px] text-gray-500">
                          [{msg.senderClan}]
                        </span>
                      )}

                      <span className="text-[8.5px] text-gray-600 font-mono">
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-[#DFBD78] to-[#C5A059] text-black font-medium rounded-tr-xs'
                          : 'bg-[#181922] text-gray-200 border border-white/10 rounded-tl-xs'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Preset Buttons */}
          <div className="px-2.5 py-1.5 bg-[#090A0D] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto text-[9.5px]">
            <button
              onClick={() => handleQuickPreset('Ready for match! ✅')}
              className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
            >
              Ready for match! ✅
            </button>
            <button
              onClick={() => handleQuickPreset('Room ID & Pass shared? 🔑')}
              className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
            >
              Room ID &amp; Pass? 🔑
            </button>
            <button
              onClick={() => handleQuickPreset('Need 1 assaulter for squad ⚔️')}
              className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
            >
              Need 1 player ⚔️
            </button>
            <button
              onClick={() => handleQuickPreset('GG all! 🏆')}
              className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white whitespace-nowrap cursor-pointer transition-colors"
            >
              GG all! 🏆
            </button>
          </div>

          {/* Sender Input Field */}
          <div className="p-3 bg-[#111218] border-t border-white/10 shrink-0">
            {!currentUser && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] text-gray-400 uppercase font-bold shrink-0">Your Handle:</span>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    setGuestName(e.target.value);
                    if (typeof window !== 'undefined') localStorage.setItem('lt_chat_guest_name', e.target.value);
                  }}
                  className="w-full px-2 py-1 rounded bg-[#090A0E] border border-white/15 text-[11px] text-[#DFBD78] font-bold outline-hidden focus:border-[#DFBD78]"
                />
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={activeChannel === 'match' ? 'Message host & match squads...' : 'Type message in Arena...'}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#090A0E] border border-white/15 text-xs text-white placeholder:text-gray-500 outline-hidden focus:border-[#DFBD78] transition-colors"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="size-9 rounded-xl bg-[#DFBD78] hover:bg-[#C5A059] disabled:opacity-40 text-black flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
