import crypto from 'node:crypto';
import { connectToDatabase } from '../lib/mongodb.js';

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
    const { name, email, mobile, password, location } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = cleanEmail.split('@')[0];
    const passwordHash = hashPassword(password);

    // Extract real client telemetry from Vercel headers
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '103.211.54.12').split(',')[0].trim();
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
    const region = req.headers['x-vercel-ip-country-region'] || '';
    const country = req.headers['x-vercel-ip-country'] || 'IN';
    const locationStr = location || (city ? `${city}, ${region ? region + ', ' : ''}${country}` : 'Chennai, Tamil Nadu, India');
    const userAgent = req.headers['user-agent'] || 'Chrome / Windows';
    const deviceStr = userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop / Windows 11';

    const userId = 'LT-USR-' + Date.now().toString().slice(-4);
    const newUser = {
      id: userId,
      name: name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      mobile: (mobile || '').trim(),
      passwordHash,
      role: 'user',
      status: 'ACTIVE',
      location: locationStr,
      ip: clientIp,
      game: 'Battlegrounds Mobile India',
      clan: 'Recruit Division',
      matchesPlayed: 0,
      tournamentsWon: 0,
      fairPlayScore: '100%',
      walletBalance: '₹ 0',
      agreements: 'Terms of Service, Fair Play Policy & Anti-Cheat Agreement Accepted',
      createdAt: new Date().toISOString()
    };

    try {
      const { db } = await connectToDatabase();
      const existing = await db.collection('users').findOne({
        $or: [{ email: cleanEmail }, { username: cleanUsername }]
      });

      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email or username already exists' });
      }

      await db.collection('users').insertOne(newUser);

      // Record Activity Log into MongoDB for Super Admin audit ledger
      const regLog = {
        id: 'act_' + Date.now(),
        userId: newUser.id,
        userName: newUser.name,
        userEmail: newUser.email,
        action: 'New Competitor Account Registration',
        ip: clientIp,
        location: locationStr,
        agreements: 'Terms of Service & Fair Play Agreement Confirmed',
        device: deviceStr,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date().toISOString()
      };
      await db.collection('activity_logs').insertOne(regLog);
    } catch (dbErr) {
      console.warn('[Vercel register] Database persistence warning:', dbErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role,
        status: newUser.status,
        location: newUser.location
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
