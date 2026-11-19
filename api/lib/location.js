/**
 * High-precision server-side and client-assisted location resolver for LiveTournaments
 */
export async function resolveExactLocation(req, clientLocation, clientIp) {
  // 1. If client provided a GPS/IP resolved location string, prioritize it
  if (clientLocation && typeof clientLocation === 'string' && clientLocation.trim().length > 3) {
    const cleanIp = clientIp || (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1').split(',')[0].trim();
    return {
      location: clientLocation.trim(),
      ip: cleanIp
    };
  }

  // 2. Extract public IP
  const ip = clientIp || (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1').split(',')[0].trim();

  // 3. Check Vercel edge headers
  const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
  const region = req.headers['x-vercel-ip-country-region'] || '';
  const country = req.headers['x-vercel-ip-country'] || 'India';
  const postal = req.headers['x-vercel-ip-postal-code'] || '';

  if (city) {
    const locParts = [city, region, postal, country].filter(Boolean);
    return {
      location: locParts.join(', '),
      ip
    };
  }

  // 4. If public IP is available and not localhost, query high-accuracy IPWHOIS
  if (ip && !ip.startsWith('127.') && !ip.startsWith('192.168.') && !ip.startsWith('10.') && ip !== '::1') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`https://ipwho.is/${ip}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false) {
          const locParts = [
            data.city,
            data.region,
            data.postal,
            data.country,
            data.connection?.isp ? `(${data.connection.isp})` : ''
          ].filter(Boolean);
          return {
            location: locParts.join(', '),
            ip: data.ip || ip
          };
        }
      }
    } catch (err) {
      console.warn('[Location Resolver] IP lookup timeout/error:', err.message);
    }
  }

  // 5. Fallback
  return {
    location: 'Chennai, Tamil Nadu, India',
    ip: ip || '103.211.54.12'
  };
}
