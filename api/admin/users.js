import { connectToDatabase } from '../../lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();

    // GET /api/admin/users - Return all registered users from MongoDB
    if (req.method === 'GET') {
      const rawUsers = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();

      const formattedUsers = rawUsers.map((u, idx) => {
        const dateObj = u.createdAt ? new Date(u.createdAt) : new Date();
        const formattedDate = dateObj.toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });

        return {
          userId: u.id || `LT-USR-${1000 + (rawUsers.length - idx)}`,
          name: u.name || u.username || 'Competitor',
          ign: u.username || u.name || 'GamerTag',
          email: u.email,
          mobile: u.mobile || '+91 98765 43210',
          game: u.game || 'Battlegrounds Mobile India',
          clan: u.clan || 'LiveTournaments Competitor',
          matchesPlayed: u.matchesPlayed || 0,
          tournamentsWon: u.tournamentsWon || 0,
          fairPlayScore: u.fairPlayScore || '100%',
          walletBalance: u.walletBalance ? (typeof u.walletBalance === 'number' ? `₹ ${u.walletBalance}` : u.walletBalance) : '₹ 0',
          registeredAt: formattedDate,
          status: u.status || 'ACTIVE',
          location: u.location || 'Chennai, Tamil Nadu, India',
          ip: u.ip || '103.211.54.12',
          role: u.role || 'PLAYER',
          isVip: !!(u.isVip || u.role === 'VIP' || u.hasBroadcastVip),
          hasBroadcastVip: !!u.hasBroadcastVip,
          hasFeaturedApproval: !!u.hasFeaturedApproval,
          hasScrimsApproval: !!u.hasScrimsApproval,
          hasTourneyApproval: !!u.hasTourneyApproval,
          tier: u.tier || (u.isVip ? 'VIP_DIRECT' : 'FREE')
        };
      });

      return res.status(200).json({ success: true, users: formattedUsers });
    }

    // POST/PATCH /api/admin/users - Update user status and VIP clearances in MongoDB
    if (req.method === 'POST' || req.method === 'PATCH') {
      const { userId, email, username, newStatus, vipClearances } = req.body || {};
      if (!newStatus && !vipClearances) {
        return res.status(400).json({ success: false, error: 'newStatus or vipClearances is required' });
      }

      const filter = {};
      if (userId) filter.id = userId;
      else if (email) filter.email = email.toLowerCase().trim();
      else if (username) filter.username = username;

      const setFields = { updatedAt: new Date().toISOString() };
      if (newStatus) setFields.status = newStatus;
      if (vipClearances) {
        if (vipClearances.role) setFields.role = vipClearances.role;
        else setFields.role = 'VIP';
        setFields.isVip = vipClearances.isVip !== undefined ? vipClearances.isVip : true;
        if (vipClearances.broadcast !== undefined) setFields.hasBroadcastVip = vipClearances.broadcast;
        if (vipClearances.featured !== undefined) setFields.hasFeaturedApproval = vipClearances.featured;
        if (vipClearances.scrims !== undefined) setFields.hasScrimsApproval = vipClearances.scrims;
        if (vipClearances.tournaments !== undefined) setFields.hasTourneyApproval = vipClearances.tournaments;
        if (vipClearances.tier) setFields.tier = vipClearances.tier;
        else setFields.tier = 'VIP_DIRECT';
      }

      const result = await db.collection('users').updateOne(
        filter,
        { $set: setFields }
      );

      // Extract client telemetry
      const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '103.211.54.12').split(',')[0].trim();
      const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
      const country = req.headers['x-vercel-ip-country'] || 'IN';
      const locationStr = city ? `${city}, ${country}` : 'Super Admin Command HQ';

      // Record administrative activity log into MongoDB
      await db.collection('activity_logs').insertOne({
        id: 'act_' + Date.now(),
        userId: userId || 'ADMIN',
        userName: email || username || 'Competitor',
        userEmail: email || '',
        action: `Super Admin Changed User Status to [${newStatus}]`,
        ip: clientIp,
        location: locationStr,
        agreements: `Administrative Enforcement Action (${newStatus})`,
        device: 'Super Admin HQ Console',
        time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
        date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
        timestamp: new Date().toISOString()
      });

      return res.status(200).json({
        success: true,
        message: `Status updated to ${newStatus}`,
        modifiedCount: result.modifiedCount
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
