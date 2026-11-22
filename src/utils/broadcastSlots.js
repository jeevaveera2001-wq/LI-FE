import { validateLiveStreamUrl, getYouTubeEmbedUrl } from './urlValidator';

export const DEFAULT_CARD_SLOTS = [
  {
    slot: 1,
    id: 'slot_1',
    url: '',
    title: 'Live Arena Stream Slot 1',
    organizer: 'Awaiting Live Caster',
    email: 'admin@livetournaments.in',
    clan: 'OFFICIAL',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    tournamentType: 'Pro Championship League',
    status: 'UNAVAILABLE',
    isUnavailable: true,
    isDefault: true
  },
  {
    slot: 2,
    id: 'slot_2',
    url: '',
    title: 'Daily Scrims Feed Slot 2',
    organizer: 'Awaiting Live Caster',
    email: 'scrims@livetournaments.in',
    clan: 'SCRIMS',
    game: 'BATTLEGROUNDS MOBILE INDIA',
    tournamentType: 'Tier-1 Daily Practice Scrims',
    status: 'UNAVAILABLE',
    isUnavailable: true,
    isDefault: true
  },
  {
    slot: 3,
    id: 'slot_3',
    url: '',
    title: 'Global Battlegrounds Slot 3',
    organizer: 'Awaiting Live Caster',
    email: 'media@livetournaments.in',
    clan: 'ESPORTS',
    game: 'PUBG MOBILE',
    tournamentType: 'Squad Survival Cup',
    status: 'UNAVAILABLE',
    isUnavailable: true,
    isDefault: true
  },
  {
    slot: 4,
    id: 'slot_4',
    url: '',
    title: 'Masters Arena Caster Slot 4',
    organizer: 'Awaiting Live Caster',
    email: 'casters@livetournaments.in',
    clan: 'MASTERS',
    game: 'FREE FIRE MAX',
    tournamentType: 'Clutch Series Masters',
    status: 'UNAVAILABLE',
    isUnavailable: true,
    isDefault: true
  }
];

export function getCardSlotsFromStorage() {
  const slots = [
    { ...DEFAULT_CARD_SLOTS[0] },
    { ...DEFAULT_CARD_SLOTS[1] },
    { ...DEFAULT_CARD_SLOTS[2] },
    { ...DEFAULT_CARD_SLOTS[3] }
  ];

  try {
    const raw = localStorage.getItem('lt_approved_broadcasts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((item, idx) => {
          if (!item) return;
          const targetSlot = (typeof item.slot === 'number' && item.slot >= 1 && item.slot <= 4)
            ? item.slot
            : (idx + 1 <= 4 ? idx + 1 : 1);

          slots[targetSlot - 1] = {
            ...item,
            slot: targetSlot,
            isUnavailable: item.isUnavailable !== undefined ? item.isUnavailable : (!item.url || item.url.trim() === ''),
            isDefault: item.isDefault || false
          };
        });
        return slots;
      }
    }

    const singleRaw = localStorage.getItem('lt_approved_live_stream');
    if (singleRaw) {
      const single = JSON.parse(singleRaw);
      if (single && single.url && single.url.trim()) {
        slots[0] = {
          ...single,
          slot: 1,
          isUnavailable: false,
          isDefault: false
        };
      }
    }
  } catch (e) {
    console.warn('[BroadcastSlots] Storage read warning:', e);
  }

  return slots;
}

export function saveCardSlot(slotNumber, streamData) {
  if (slotNumber < 1 || slotNumber > 4) return;
  const currentSlots = getCardSlotsFromStorage();

  const rawUrl = streamData.url || streamData.streamUrl || streamData.channelLink || '';
  const val = validateLiveStreamUrl(rawUrl);
  const validUrl = val.isValid ? val.normalizedUrl : rawUrl;
  const validEmail = (streamData.email || streamData.userEmail || '').trim() || 'streamer@livetournaments.in';

  const updatedSlotObj = {
    slot: slotNumber,
    id: streamData.id || `bcast_slot_${slotNumber}_${Date.now()}`,
    url: validUrl,
    email: validEmail,
    title: streamData.title || `Live Stream - Slot ${slotNumber}`,
    organizer: streamData.organizer || streamData.creator || streamData.organizerName || 'Verified Host',
    clan: streamData.clan || streamData.organizerClan || 'OFFICIAL',
    game: streamData.game || 'BATTLEGROUNDS MOBILE INDIA',
    tournamentType: streamData.tournamentType || 'Official Live Match Broadcast',
    status: 'LIVE ON AIR',
    isUnavailable: false,
    isDefault: false,
    updatedAt: new Date().toISOString()
  };

  currentSlots[slotNumber - 1] = updatedSlotObj;

  try {
    localStorage.setItem('lt_approved_broadcasts', JSON.stringify(currentSlots));
    if (slotNumber === 1 || !localStorage.getItem('lt_approved_live_stream')) {
      localStorage.setItem('lt_approved_live_stream', JSON.stringify(updatedSlotObj));
      localStorage.setItem('lt_user_live_stream_url', validUrl);
    }
    window.dispatchEvent(new Event('lt_stream_updated'));
    window.dispatchEvent(new Event('lt_broadcast_approved'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('[BroadcastSlots] Storage save warning:', e);
  }

  return currentSlots;
}

export function resetCardSlot(slotNumber) {
  if (slotNumber < 1 || slotNumber > 4) return;
  const currentSlots = getCardSlotsFromStorage();
  currentSlots[slotNumber - 1] = { ...DEFAULT_CARD_SLOTS[slotNumber - 1] };

  try {
    localStorage.setItem('lt_approved_broadcasts', JSON.stringify(currentSlots));
    const activeCustom = currentSlots.find(s => !s.isDefault && !s.isUnavailable && s.url);
    if (activeCustom) {
      localStorage.setItem('lt_approved_live_stream', JSON.stringify(activeCustom));
      localStorage.setItem('lt_user_live_stream_url', activeCustom.url);
    } else {
      localStorage.removeItem('lt_approved_live_stream');
    }
    window.dispatchEvent(new Event('lt_stream_updated'));
    window.dispatchEvent(new Event('lt_broadcast_approved'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('[BroadcastSlots] Reset warning:', e);
  }

  return currentSlots;
}
