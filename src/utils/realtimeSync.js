// Real-time Event Bus & Cross-Tab Socket Synchronization Utility for LiveTournaments
// Provides zero-latency real-time bidirectional event dispatching across Competitor and Admin portals

const SYNC_CHANNEL_NAME = 'lt_realtime_socket_channel';
let broadcastChannel = null;

try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  }
} catch (err) {
  console.warn('[RealtimeSync] BroadcastChannel unsupported, falling back to storage pulse:', err);
}

// Sound chime for incoming real-time notifications using Web Audio API
export function playAdminChime(type = 'default') {
  try {
    if (typeof window === 'undefined') return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'broadcast') {
      // High-priority dual chime (880Hz -> 1320Hz)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      // Standard notification ding (660Hz -> 990Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(990, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    }
  } catch (e) {
    // Audio autoplay might be blocked before first user gesture; ignore safely
  }
}

/**
 * Emit a real-time event across all tabs, windows, and local listeners
 * @param {string} eventName - e.g. 'BROADCAST_REQUESTED', 'HOSTING_REQUESTED', 'SCRIM_REQUESTED', etc.
 * @param {object} payload - arbitrary request data
 */
export function emitRealtimeEvent(eventName, payload = {}) {
  const message = {
    eventName,
    payload,
    timestamp: Date.now(),
    sourceId: typeof window !== 'undefined' ? window.name || 'tab_' + Math.random().toString(36).substring(2, 7) : 'root'
  };

  // 1. BroadcastChannel (Instant cross-tab messaging)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(message);
    } catch (e) {
      console.warn('[RealtimeSync] BroadcastChannel postMessage failed:', e);
    }
  }

  // 2. Storage pulse (guaranteed trigger for cross-window and cross-origin-tab storage listeners)
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lt_socket_pulse', JSON.stringify({
        eventName,
        seq: Date.now(),
        payload,
        payloadSummary: payload?.id || payload?.title || eventName
      }));
    }
  } catch (e) {}

  // 3. Same-window custom event dispatch
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('lt_realtime_event', { detail: message }));
      // Also trigger legacy storage event for listeners looking for 'storage'
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {}

  console.log(`[RealtimeSync] 🚀 Emitted ${eventName}:`, payload);
}

/**
 * Subscribe to real-time events across tabs, storage pulses, and local dispatches
 * Includes an active 1000ms polling safety heartbeat
 * @param {Function} callback - (message) => void
 * @returns {Function} unsubscribe function
 */
export function subscribeRealtimeEvents(callback) {
  if (typeof window === 'undefined') return () => {};

  // 1. Handle BroadcastChannel messages
  const handleBcMessage = (event) => {
    if (event && event.data) {
      callback(event.data);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBcMessage);
  }

  // 2. Handle same-window CustomEvent
  const handleLocalEvent = (e) => {
    if (e.detail) {
      callback(e.detail);
    }
  };
  window.addEventListener('lt_realtime_event', handleLocalEvent);

  // 3. Handle window storage event
  const handleStorageEvent = (e) => {
    if (e.key === 'lt_socket_pulse' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        callback({
          eventName: parsed.eventName || 'STORAGE_UPDATE',
          payload: parsed.payload || parsed,
          timestamp: parsed.seq || Date.now()
        });
      } catch (err) {}
    } else if (
      !e.key ||
      e.key.startsWith('lt_') ||
      e.key.includes('broadcast') ||
      e.key.includes('hosting') ||
      e.key.includes('scrim')
    ) {
      callback({
        eventName: 'STORAGE_CHANGE',
        key: e.key,
        timestamp: Date.now()
      });
    }
  };
  window.addEventListener('storage', handleStorageEvent);

  // 4. Reactive polling heartbeat (500ms) to ensure guaranteed updates even in background tabs
  let lastPulseSeq = null;
  const intervalId = setInterval(() => {
    try {
      const raw = localStorage.getItem('lt_socket_pulse');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.seq && parsed.seq !== lastPulseSeq) {
          lastPulseSeq = parsed.seq;
          callback({
            eventName: parsed.eventName || 'HEARTBEAT_PULSE',
            payload: parsed.payload || parsed,
            timestamp: parsed.seq
          });
        }
      }
    } catch (e) {}
  }, 500);

  // Cleanup handler
  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBcMessage);
    }
    window.removeEventListener('lt_realtime_event', handleLocalEvent);
    window.removeEventListener('storage', handleStorageEvent);
    clearInterval(intervalId);
  };
}
