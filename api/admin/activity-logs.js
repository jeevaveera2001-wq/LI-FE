import { connectToDatabase } from '../../lib/mongodb.js';

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

  try {
    const { db } = await connectToDatabase();

    // GET /api/admin/activity-logs - Return all activity logs for Super Admin
    if (req.method === 'GET') {
      const rawLogs = await db.collection('activity_logs').find({}).sort({ timestamp: -1 }).limit(100).toArray();

      const formattedLogs = rawLogs.map((l) => ({
        id: l.id || l._id?.toString(),
        userId: l.userId || 'LT-USR-UNKNOWN',
        userName: l.userName || 'Competitor',
        userEmail: l.userEmail || '',
        action: l.action || 'Session Event',
        ip: l.ip || '103.211.54.12',
        location: l.location || 'Chennai, Tamil Nadu, India',
        agreements: l.agreements || 'Terms of Service, Fair Play Policy & Anti-Cheat Agreement Accepted',
        device: l.device || 'Desktop / Chrome',
        time: l.time || new Date(l.timestamp || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: l.date || new Date(l.timestamp || Date.now()).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: l.timestamp || new Date().toISOString()
      }));

      return res.status(200).json({ success: true, logs: formattedLogs });
    }

    // POST /api/admin/activity-logs - Record an activity log
    if (req.method === 'POST') {
      const logData = req.body || {};
      const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '103.211.54.12').split(',')[0].trim();
      const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
      const country = req.headers['x-vercel-ip-country'] || 'IN';
      const locationStr = city ? `${city}, ${country}` : (logData.location || 'Chennai, Tamil Nadu, India');
      const userAgent = req.headers['user-agent'] || 'Chrome / Windows';
      const deviceStr = userAgent.includes('Mobile') ? 'Mobile Client' : 'Desktop / Windows';

      const newLog = {
        id: logData.id || ('act_' + Date.now()),
        userId: logData.userId || 'LT-USR-ANON',
        userName: logData.userName || 'Competitor',
        userEmail: logData.userEmail || '',
        action: logData.action || 'Competitor Action Logged',
        ip: clientIp,
        location: locationStr,
        agreements: logData.agreements || 'Terms of Service, Fair Play Policy & Anti-Cheat Agreement Accepted',
        device: logData.device || deviceStr,
        time: logData.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: logData.date || new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: new Date().toISOString()
      };

      await db.collection('activity_logs').insertOne(newLog);
      return res.status(201).json({ success: true, log: newLog });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
