/**
 * Live Stream URL Validator
 * Enforces strict rules:
 * 1. Must start with "www." (or "https://www." / "http://www.")
 * 2. Must contain "youtube" domain
 * 3. Cannot be a raw tag, hashtag, or invalid text
 */

export function validateLiveStreamUrl(url) {
  if (!url || typeof url !== 'string') {
    return {
      isValid: false,
      error: 'Please enter a valid YouTube live stream URL.',
      embedUrl: null
    };
  }

  const trimmed = url.trim();

  // Reject raw tags like #tag, @tag, or plain word
  if (trimmed.startsWith('#') || trimmed.startsWith('@')) {
    return {
      isValid: false,
      error: 'Invalid URL. Tags or handles starting with # or @ are not permitted.',
      embedUrl: null
    };
  }

  // Must start with www. or http://www. or https://www.
  const startsWithWwwPattern = /^(https?:\/\/)?www\./i;
  if (!startsWithWwwPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid link. The stream URL must start with "www." (e.g. www.youtube.com/watch?v=... or https://www.youtube.com/...)',
      embedUrl: null
    };
  }

  // Must contain "youtube"
  if (!/youtube/i.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid domain. The link must be a valid YouTube URL containing "youtube".',
      embedUrl: null
    };
  }

  // Generate safe embed URL
  const embedUrl = getYouTubeEmbedUrl(trimmed);

  return {
    isValid: true,
    error: null,
    normalizedUrl: trimmed.startsWith('http') ? trimmed : `https://${trimmed}`,
    embedUrl
  };
}

/**
 * Extracts YouTube Video ID or returns standard embed URL
 */
export function getYouTubeEmbedUrl(url) {
  if (!url) return 'https://www.youtube.com/embed/jfKfPfyJRdk';
  
  const cleanUrl = url.trim();

  // Match /watch?v=ID or /v/ID
  const watchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&rel=0`;
  }

  // Match /live/ID
  const liveMatch = cleanUrl.match(/\/live\/([a-zA-Z0-9_-]+)/);
  if (liveMatch && liveMatch[1]) {
    return `https://www.youtube.com/embed/${liveMatch[1]}?autoplay=1&mute=1&rel=0`;
  }

  // Match /embed/ID
  const embedMatch = cleanUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return `https://www.youtube.com/embed/${embedMatch[1]}?autoplay=1&mute=1&rel=0`;
  }

  // Match /shorts/ID
  const shortsMatch = cleanUrl.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}?autoplay=1&mute=1&rel=0`;
  }

  // Fallback if video ID isn't 11 chars or channel live:
  return 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&rel=0';
}
