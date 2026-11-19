import crypto from 'node:crypto';
import { connectToDatabase } from '../lib/mongodb.js';

const SUPERADMIN_USERNAME = 'superadmin';
const SUPERADMIN_EMAIL = 'superadmin@lt.in';
const SUPERADMIN_PASS = 'SuperAdmin@21';
const PASSWORD_SALT = 'livetournaments_esports_2026_salt';

function hashPassword(password) {
  return crypto.createHash('sha256').update(password + PASSWORD_SALT).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { usernameOrEmail, password, location } = req.body || {};
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ success: false, error: 'Username/email and password required' });
    }

    const cleanInput = usernameOrEmail.toLowerCase().trim();

    // Extract real client telemetry from Vercel headers
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '103.211.54.12').split(',')[0].trim();
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
    const region = req.headers['x-vercel-ip-country-region'] || '';
    const country = req.headers['x-vercel-ip-country'] || 'IN';
    const locationStr = location || (city ? `${city}, ${region ? region + ', ' : ''}${country}` : 'Chennai, Tamil Nadu, India');
    const userAgent = req.headers['user-agent'] || 'Chrome / Windows';
    const deviceStr = userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop / Windows 11';

    // Super Admin Direct Auth Check
    if ((cleanInput === SUPERADMIN_USERNAME || cleanInput === SUPERADMIN_EMAIL) && password === SUPERADMIN_PASS) {
      const superUser = {
        id: 'LT-USR-1001',
        username: SUPERADMIN_USERNAME,
        email: SUPERADMIN_EMAIL,
        name: 'Super Admin',
        role: 'superadmin',
        displayName: 'Super Admin',
        status: 'ACTIVE',
        location: locationStr
      };

      try {
        const { db } = await connectToDatabase();
        // Record Super Admin Login Activity Log
        await db.collection('activity_logs').insertOne({
          id: 'act_' + Date.now(),
          userId: 'LT-USR-1001',
          userName: 'Super Admin',
          userEmail: SUPERADMIN_EMAIL,
          action: 'Super Admin Portal Authentication',
          ip: clientIp,
          location: locationStr,
          agreements: 'Super Administrator Master Security Protocol Verified',
          device: deviceStr,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn('[Vercel login] Admin log record warning:', e.message);
      }

      return res.status(200).json({
        success: true,
        user: superUser
      });
    }

    // Database check for registered users
    try {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({
        $or: [{ username: cleanInput }, { email: cleanInput }]
      });

      if (user && user.passwordHash === hashPassword(password)) {
        if (user.status === 'BLOCKED') {
          return res.status(403).json({ success: false, error: 'Your account has been blocked by Super Admin due to fair play violations.' });
        }
        if (user.status === 'SUSPENDED') {
          return res.status(403).json({ success: false, error: 'Your account is temporarily suspended. Please contact tournament administration.' });
        }

        const userRole = (user.role === 'superadmin' || user.email === SUPERADMIN_EMAIL) ? 'superadmin' : 'user';

        // Record User Login Activity Log into MongoDB
        const loginLog = {
          id: 'act_' + Date.now(),
          userId: user.id || ('LT-USR-' + (user.username || '1001')),
          userName: user.name || user.username || 'Competitor',
          userEmail: user.email,
          action: 'Competitor Session Login',
          ip: clientIp,
          location: locationStr,
          agreements: 'Session Authentication & Fair Play Compliance Confirmed',
          device: deviceStr,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
          timestamp: new Date().toISOString()
        };
        await db.collection('activity_logs').insertOne(loginLog);

        return res.status(200).json({
          success: true,
          user: {
            id: user.id || ('LT-USR-' + (user.username || '1001')),
            username: user.username,
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            role: userRole,
            status: user.status || 'ACTIVE',
            location: locationStr
          }
        });
      }
    } catch (e) {
      console.warn('DB lookup warning:', e.message);
    }

    return res.status(401).json({ success: false, error: 'Invalid username/email or password' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
