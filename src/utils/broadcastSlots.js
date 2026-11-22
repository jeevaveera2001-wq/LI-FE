import { validateLiveStreamUrl, getYouTubeEmbedUrl } from './urlValidator';

export const DEFAULT_CARD_SLOTS = [
  {
    slot: 1,
    id: 'default_slot_1',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    title: 'BGMI Official Pro Championship Stream',
    organizer: 'LiveTournaments Official',
    clan: 'OFFICIAL',
    game: 'BGMI',
    status: 'STANDBY',
    isDefault: true
  },
  {
    slot: 2,
    id: 'default_slot_2',
    url: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    title: 'Daily Scrims Arena - Tier 1 Match Broadcast',
    organizer: 'LiveTournaments Scrims',
    clan: 'ARENA',
    game: 'BGMI',
    status: 'STANDBY',
    isDefault: true
  },
  {
    slot: 3,
    id: 'default_slot_3',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    title: 'Championship Media Studio - Match Highlights',
    organizer: 'LiveTournaments Media',
    clan: 'MEDIA',
    game: 'BGMI',
    status: 'STANDBY',
    isDefault: true
  }
];

export function getCardSlotsFromStorage() {
  const slots = [
    { ...DEFAULT_CARD_SLOTS[0] },
    { ...DEFAULT_CARD_SLOTS[1] },
    { ...DEFAULT_CARD_SLOTS[2] }
  ];

  try {
    const raw = localStorage.getItem('lt_approved_broadcasts');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((item, idx) => {
          if (!item || !item.url) return;
          const targetSlot = (typeof item.slot === 'number' && item.slot >= 1 && item.slot <= 3)
            ? item.slot
            : (idx + 1 <= 3 ? idx + 1 : 1);
          
          slots[targetSlot - 1] = {
            ...item,
            slot: targetSlot,
            isDefault: item.isDefault || false
          };
        });
        return slots;
      }
    }

    const singleRaw = localStorage.getItem('lt_approved_live_stream');
    if (singleRaw) {
      const single = JSON.parse(singleRaw);
      if (single && single.url) {
        slots[0] = {
          ...single,
          slot: 1,
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
  if (slotNumber < 1 || slotNumber > 3) return;
  const currentSlots = getCardSlotsFromStorage();
  
  const rawUrl = streamData.url || streamData.streamUrl || streamData.channelLink || 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
  const val = validateLiveStreamUrl(rawUrl);
  const validUrl = val.isValid ? val.normalizedUrl : rawUrl;

  const updatedSlotObj = {
    slot: slotNumber,
    id: streamData.id || `bcast_slot_${slotNumber}_${Date.now()}`,
    url: validUrl,
    title: streamData.title || `Live Stream - Slot ${slotNumber}`,
    organizer: streamData.organizer || streamData.creator || streamData.organizerName || 'Verified Host',
    clan: streamData.clan || streamData.organizerClan || 'OFFICIAL',
    game: streamData.game || 'BGMI',
    status: 'LIVE ON AIR',
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
  if (slotNumber < 1 || slotNumber > 3) return;
  const currentSlots = getCardSlotsFromStorage();
  currentSlots[slotNumber - 1] = { ...DEFAULT_CARD_SLOTS[slotNumber - 1] };

  try {
    localStorage.setItem('lt_approved_broadcasts', JSON.stringify(currentSlots));
    const activeCustom = currentSlots.find(s => !s.isDefault);
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
