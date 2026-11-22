import { connectToDatabase } from '../mongodb.js';

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
    const collection = db.collection('users');

    // GET /api/auth/profile?email=...
    if (req.method === 'GET') {
      const emailQuery = (req.query.email || '').toLowerCase().trim();
      const userIdQuery = req.query.id || req.query.userId;

      if (!emailQuery && !userIdQuery) {
        return res.status(400).json({ success: false, error: 'email or userId is required' });
      }

      const filter = {};
      if (emailQuery) filter.email = emailQuery;
      else if (userIdQuery) filter.id = userIdQuery;

      const user = await collection.findOne(filter);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      const isVip = !!(user.isVip || user.role === 'VIP' || user.hasBroadcastVip || user.tier === 'VIP_DIRECT');

      return res.status(200).json({
        success: true,
        user: {
          id: user.id || String(user._id),
          email: user.email,
          username: user.username,
          name: user.name || user.username || 'Competitor',
          mobile: user.mobile || '',
          role: user.role || 'PLAYER',
          status: user.status || 'ACTIVE',
          clan: user.clan || '',
          isVip: isVip,
          hasBroadcastVip: !!(user.hasBroadcastVip || isVip),
          hasFeaturedApproval: !!user.hasFeaturedApproval,
          hasScrimsApproval: !!user.hasScrimsApproval,
          hasTourneyApproval: !!user.hasTourneyApproval,
          tier: user.tier || (isVip ? 'VIP_DIRECT' : 'FREE'),
          vipNotificationSeen: !!user.vipNotificationSeen,
          location: user.location || ''
        }
      });
    }

    // POST /api/auth/profile - update flags like vipNotificationSeen
    if (req.method === 'POST') {
      const { email, userId, action } = req.body || {};
      const filter = {};
      if (email) filter.email = email.toLowerCase().trim();
      else if (userId) filter.id = userId;

      if (action === 'DISMISS_VIP_MODAL') {
        await collection.updateOne(filter, { $set: { vipNotificationSeen: true, updatedAt: new Date().toISOString() } });
        return res.status(200).json({ success: true, message: 'VIP notification marked as seen' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API auth/profile error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

