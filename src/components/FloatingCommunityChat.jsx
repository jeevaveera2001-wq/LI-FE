import React, { useState, useEffect, useRef } from 'react';
import { fetchCloudChatMessages, sendCloudChatMessage } from '../services/cloudSync';
import { subscribeRealtimeEvents, emitRealtimeEvent } from '../utils/realtimeSync';

export default function FloatingCommunityChat({ currentUser, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('global'); // 'global' | 'match'
  const [selectedMatchRoomId, setSelectedMatchRoomId] = useState('');
  const [userRegisteredGroups, setUserRegisteredGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [guestName, setGuestName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lt_chat_guest_name') || 'Player_' + Math.floor(100 + Math.random() * 900);
    }
    return 'Player_101';
  });
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Discover ONLY the tournaments and matches where the user or their organization is registered
  const syncRegisteredMatchGroups = () => {
    const groups = [];
    const seenIds = new Set();

    // 1. Tournaments the user joined as a player or squad
    try {
      const joinedRaw = localStorage.getItem('lt_user_joined_tourneys');
      if (joinedRaw) {
        const joined = JSON.parse(joinedRaw);
        if (Array.isArray(joined)) {
          joined.forEach(reg => {
            const id = reg.tournamentId || reg.id;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              groups.push({
                id: 'match_' + id,
                tournamentId: id,
                title: reg.tournamentTitle || reg.title || 'Registered Match Tournament',
                game: reg.game || 'Battlegrounds Mobile India',
                organization: reg.teamName || reg.clan || 'My Squad',
                role: 'REGISTERED PLAYER',
                schedule: reg.registeredTimeIST || reg.schedule || 'Scheduled Match'
              });
            }
          });
        }
      }
    } catch (e) {}

    // 2. Pre-registrations from Championship
    try {
      const champRaw = localStorage.getItem('lt_championship_pre_registrations');
      if (champRaw) {
        const champ = JSON.parse(champRaw);
        if (Array.isArray(champ)) {
          champ.forEach(c => {
            const id = c.id || 'championship_main';
            if (!seenIds.has(id)) {
              seenIds.add(id);
              groups.push({
                id: 'match_' + id,
                tournamentId: id,
                title: c.tournamentTitle || 'BGMI National Championship',
                game: 'Battlegrounds Mobile India',
                organization: c.teamName || c.clan || 'Registered Team',
                role: 'REGISTERED SQUAD',
                schedule: 'National Championship'
              });
            }
          });
        }
      }
    } catch (e) {}

    // 3. Tournaments or scrims the user hosts (as organizer)
    try {
      const hostedRaw = localStorage.getItem('lt_user_hosted_tourneys');
      if (hostedRaw) {
        const hosted = JSON.parse(hostedRaw);
        if (Array.isArray(hosted)) {
          hosted.forEach(h => {
            if (!seenIds.has(h.id)) {
              seenIds.add(h.id);
              groups.push({
                id: 'match_' + h.id,
                tournamentId: h.id,
                title: h.title,
                game: h.game || 'Battlegrounds Mobile India',
                organization: h.organizer || h.clan || 'Host Organization',
                role: 'HOST / ORGANIZER',
                schedule: h.timing || 'Custom Lobby'
              });
            }
          });
        }
      }
    } catch (e) {}

    // 4. Super Admin supervisory access to active tournament rooms
    const isSuperAdmin = currentUser?.role === 'SUPERADMIN' || currentUser?.role === 'admin' || currentUser?.email === 'superadmin@lt.in';
    if (isSuperAdmin && groups.length === 0) {
      try {
        const adminRoomsRaw = localStorage.getItem('lt_active_match_rooms');
        if (adminRoomsRaw) {
          const adminRooms = JSON.parse(adminRoomsRaw);
          if (Array.isArray(adminRooms)) {
            adminRooms.forEach(r => {
              if (!seenIds.has(r.id)) {
                seenIds.add(r.id);
                groups.push({
                  id: 'match_' + r.id,
                  tournamentId: r.id,
                  title: r.title,
                  game: r.game || 'Battlegrounds Mobile India',
                  organization: 'Super Admin Oversight',
                  role: 'SUPERVISOR',
                  schedule: r.duration || 'Live Lobby'
                });
              }
            });
          }
        }
      } catch (e) {}
    }

    setUserRegisteredGroups(groups);
    if (groups.length > 0 && (!selectedMatchRoomId || selectedMatchRoomId === 'global')) {
      setSelectedMatchRoomId(groups[0].id);
    }
  };

  useEffect(() => {
    syncRegisteredMatchGroups();
    const handleStorageSync = () => syncRegisteredMatchGroups();
    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('lt_registration_submitted', handleStorageSync);
    window.addEventListener('lt_hosting_approved', handleStorageSync);
    return () => {
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('lt_registration_submitted', handleStorageSync);
      window.removeEventListener('lt_hosting_approved', handleStorageSync);
    };
  }, [currentUser]);

  const currentRoomId = activeChannel === 'global' ? 'global' : (selectedMatchRoomId || 'none');
  const activeSelectedGroup = userRegisteredGroups.find(m => m.id === selectedMatchRoomId);
  const currentRoomTitle = activeChannel === 'global'
    ? 'Global Arena Chat'
    : (activeSelectedGroup ? `${activeSelectedGroup.title} [${activeSelectedGroup.organization}]` : 'Match Group Chat');

  // Load messages from cloud and local storage
  const loadMessages = async () => {
    if (currentRoomId === 'none') {
      setMessages([]);
      return;
    }
    const cloudMsgs = await fetchCloudChatMessages(currentRoomId);
    if (Array.isArray(cloudMsgs) && cloudMsgs.length > 0) {
      setMessages(cloudMsgs);
    } else {
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
    if (!inputText.trim() || currentRoomId === 'none') return;

    const senderName = currentUser?.name || currentUser?.username || guestName;
    const senderRole = currentUser?.role?.toUpperCase() || (currentUser?.isVip ? 'VIP' : 'PLAYER');
    const senderClan = activeSelectedGroup ? activeSelectedGroup.organization : (currentUser?.clan || 'Competitor');
    const isHost = activeSelectedGroup?.role === 'HOST / ORGANIZER';

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

    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    try {
      const local = JSON.parse(localStorage.getItem(`lt_chat_${currentRoomId}`) || '[]');
      localStorage.setItem(`lt_chat_${currentRoomId}`, JSON.stringify([...local, newMsg]));
    } catch (e) {}

    // Cloud sync and realtime broadcast
    sendCloudChatMessage(newMsg).catch(() => {});
    emitRealtimeEvent('CHAT_MESSAGE', newMsg);
  };

  const handleQuickPreset = (presetText) => {
    setInputText(presetText);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none font-sans">
      
      {/* ========================================================
          1. MINIMALIST FLOATING CHAT LOGO ONLY (NO TEXT)
          ======================================================== */}
      {!isOpen && (
        <button
          onClick={() => {
            syncRegisteredMatchGroups();
            setIsOpen(true);
          }}
          className="relative size-14 rounded-full bg-gradient-to-br from-[#1C1E26] via-[#101117] to-black border-2 border-[#DFBD78]/70 hover:border-[#DFBD78] text-[#DFBD78] hover:text-white shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(223,189,120,0.35)] hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer group"
          title="Open Arena & Match Group Chat"
          aria-label="Chat"
        >
          <span className="material-symbols-outlined text-[26px] group-hover:scale-110 transition-transform">
            chat
          </span>

          {/* Green Online Pulsing Indicator */}
          <span className="absolute top-1 right-1 size-3.5 rounded-full bg-emerald-500 border-2 border-[#101117] animate-pulse"></span>

          {/* Unread Message Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 size-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ========================================================
          2. EXPANDED CHAT BOX (PURE WHITE BACKGROUND FOR VISIBILITY)
          ======================================================== */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[550px] max-h-[85vh] rounded-3xl bg-white border-2 border-gray-200 shadow-[0_24px_60px_rgba(0,0,0,0.22),0_0_30px_rgba(223,189,120,0.15)] flex flex-col overflow-hidden text-gray-900 animate-fade-in backdrop-blur-2xl">
          
          {/* Header */}
          <div className="p-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-xl bg-gradient-to-br from-[#DFBD78] to-[#C5A059] flex items-center justify-center text-black shrink-0 shadow-xs font-bold">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5 truncate">
                  <span>{activeChannel === 'global' ? 'Global Arena Chat' : 'Registered Match Groups'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[8px] font-black border border-emerald-200">ONLINE</span>
                </h3>
                <p className="text-[10px] text-gray-500 font-medium truncate max-w-[210px]">
                  {activeChannel === 'global' ? 'Public Community Lounge' : (activeSelectedGroup?.title || 'Private Group')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="size-7 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
          </div>

          {/* Scope Selector: Global Arena OR Registered Match Groups */}
          <div className="p-2 bg-gray-50/90 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto shrink-0 text-[10.5px]">
            <button
              onClick={() => setActiveChannel('global')}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeChannel === 'global'
                  ? 'bg-[#DFBD78] text-black shadow-xs'
                  : 'bg-white text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">public</span>
              <span>Global Arena</span>
            </button>

            <button
              onClick={() => {
                syncRegisteredMatchGroups();
                setActiveChannel('match');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeChannel === 'match'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:text-black hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">groups</span>
              <span>My Match Groups ({userRegisteredGroups.length})</span>
            </button>
          </div>

          {/* If Match Groups Active: Show ONLY Registered Match Tournaments */}
          {activeChannel === 'match' && (
            <div className="p-2.5 bg-blue-50/70 border-b border-blue-100 shrink-0">
              {userRegisteredGroups.length === 0 ? (
                <div className="p-3 rounded-xl bg-white border border-blue-200 text-center space-y-1.5 shadow-2xs">
                  <span className="material-symbols-outlined text-2xl text-blue-600 block">lock</span>
                  <h4 className="text-xs font-bold text-gray-900 uppercase">Only Registered Match Groups</h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed">
                    Tournament group chats are exclusively accessible to participants registered with their squad/organization.
                  </p>
                  {onNavigate && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigate('tournaments');
                      }}
                      className="mt-1 px-3 py-1 rounded-lg bg-[#DFBD78] hover:bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Join a Tournament &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-bold text-blue-900 uppercase shrink-0">Match Group:</span>
                  <select
                    value={selectedMatchRoomId}
                    onChange={(e) => setSelectedMatchRoomId(e.target.value)}
                    className="w-full bg-white text-gray-900 text-[11px] font-bold py-1.5 px-2.5 rounded-lg border border-blue-300 outline-hidden cursor-pointer shadow-2xs"
                  >
                    {userRegisteredGroups.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.title} &bull; Org: {m.organization} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Messages Body (PURE WHITE CANVAS) */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-white">
            {activeChannel === 'match' && userRegisteredGroups.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-2">
                <span className="material-symbols-outlined text-4xl text-gray-300">groups</span>
                <p className="text-xs font-bold text-gray-700">Match Room Locked</p>
                <p className="text-[10.5px] text-gray-500 max-w-[240px]">
                  Register for an upcoming tournament room or scrim to unlock private messaging with your match squads and host!
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-1.5">
                <span className="material-symbols-outlined text-4xl text-gray-300">chat_bubble_outline</span>
                <p className="text-xs font-bold text-gray-700">
                  {activeChannel === 'global' ? 'No messages in Global Arena yet.' : 'No messages in this match group yet.'}
                </p>
                <p className="text-[10.5px] text-gray-500 max-w-[240px]">
                  {activeChannel === 'global'
                    ? 'Say hi to the community in the public lounge!'
                    : `Coordinate strategies with your squad and host in ${activeSelectedGroup?.title || 'this match group'}!`}
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
                    <div className="flex items-center gap-1.5 text-[9.5px] text-gray-500 px-1">
                      <span className={`font-black ${isMe ? 'text-gray-900' : 'text-[#8C6D2D]'}`}>
                        {msg.sender}
                      </span>

                      {isHost && (
                        <span className="px-1 py-0.2 rounded bg-amber-100 text-amber-800 text-[8px] font-black uppercase border border-amber-300">
                          HOST
                        </span>
                      )}

                      {isVip && !isHost && (
                        <span className="px-1 py-0.2 rounded bg-purple-100 text-purple-800 text-[8px] font-bold uppercase border border-purple-300">
                          {msg.senderRole}
                        </span>
                      )}

                      {msg.senderClan && (
                        <span className="text-[8.5px] text-gray-500 font-bold">
                          [{msg.senderClan}]
                        </span>
                      )}

                      <span className="text-[8.5px] text-gray-400 font-mono font-medium">
                        {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Chat Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed break-words shadow-2xs ${
                        isMe
                          ? 'bg-gradient-to-r from-[#DFBD78] to-[#C5A059] text-black font-semibold rounded-tr-xs'
                          : 'bg-gray-100 text-gray-900 border border-gray-200 rounded-tl-xs'
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
          {!(activeChannel === 'match' && userRegisteredGroups.length === 0) && (
            <div className="px-2.5 py-1.5 bg-gray-50 border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[9.5px]">
              <button
                onClick={() => handleQuickPreset('Ready for match! ✅')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs"
              >
                Ready for match! ✅
              </button>
              <button
                onClick={() => handleQuickPreset('Room ID & Pass shared? 🔑')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs"
              >
                Room ID &amp; Pass? 🔑
              </button>
              <button
                onClick={() => handleQuickPreset('Need 1 assaulter for squad ⚔️')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs"
              >
                Need 1 player ⚔️
              </button>
              <button
                onClick={() => handleQuickPreset('GG all! 🏆')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-700 hover:text-black border border-gray-200 whitespace-nowrap cursor-pointer transition-colors font-medium shadow-2xs"
              >
                GG all! 🏆
              </button>
            </div>
          )}

          {/* Sender Input Field */}
          {!(activeChannel === 'match' && userRegisteredGroups.length === 0) && (
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              {!currentUser && (
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[10px] text-gray-600 uppercase font-bold shrink-0">Your Handle:</span>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      if (typeof window !== 'undefined') localStorage.setItem('lt_chat_guest_name', e.target.value);
                    }}
                    className="w-full px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[11px] text-gray-900 font-bold outline-hidden focus:border-[#DFBD78]"
                  />
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeChannel === 'match' ? `Message ${activeSelectedGroup?.title || 'match group'}...` : 'Type message in Global Arena...'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder:text-gray-400 outline-hidden focus:border-[#DFBD78] transition-colors"
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="size-9 rounded-xl bg-[#DFBD78] hover:bg-[#C5A059] disabled:opacity-40 text-black flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
