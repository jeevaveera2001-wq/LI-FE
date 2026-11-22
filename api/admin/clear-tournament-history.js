import { connectToDatabase } from '../../lib/mongodb.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email, userId, name } = req.body || req.query || {};

    if (!email && !userId && !name) {
      return res.status(400).json({ success: false, error: 'email, userId, or name is required' });
    }

    const { db } = await connectToDatabase();

    // Find the user first to obtain full details
    const userQuery = {};
    if (email) userQuery.email = { $regex: new RegExp(`^${email.trim()}$`, 'i') };
    else if (userId) userQuery.id = userId;

    const targetUser = await db.collection('users').findOne(userQuery);
    const targetEmail = targetUser?.email || email || '';
    const targetName = targetUser?.name || targetUser?.username || name || '';
    const targetId = targetUser?.id || userId || '';

    const buildRegex = (val) => val ? new RegExp(val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
    const emailRegex = buildRegex(targetEmail);
    const nameRegex = buildRegex(targetName);

    // 1. Delete from hosting_requests
    const hostingOr = [];
    if (emailRegex) {
      hostingOr.push({ email: emailRegex });
      hostingOr.push({ contact: emailRegex });
    }
    if (nameRegex) {
      hostingOr.push({ hostUser: nameRegex });
      hostingOr.push({ organizer: nameRegex });
    }
    let hostingDeleted = 0;
    if (hostingOr.length > 0) {
      const hRes = await db.collection('hosting_requests').deleteMany({ $or: hostingOr });
      hostingDeleted = hRes.deletedCount;
    }

    // 2. Delete from registrations
    const regOr = [];
    if (emailRegex) {
      regOr.push({ email: emailRegex });
      regOr.push({ userEmail: emailRegex });
    }
    if (nameRegex) {
      regOr.push({ playerName: nameRegex });
      regOr.push({ organizer: nameRegex });
    }
    if (targetId) {
      regOr.push({ userId: targetId });
    }
    let regDeleted = 0;
    if (regOr.length > 0) {
      const rRes = await db.collection('registrations').deleteMany({ $or: regOr });
      regDeleted = rRes.deletedCount;
    }

    // 3. Delete from broadcast_requests
    const bcastOr = [];
    if (emailRegex) bcastOr.push({ email: emailRegex });
    if (nameRegex) {
      bcastOr.push({ creator: nameRegex });
      bcastOr.push({ organizerName: nameRegex });
    }
    let bcastDeleted = 0;
    if (bcastOr.length > 0) {
      const bRes = await db.collection('broadcast_requests').deleteMany({ $or: bcastOr });
      bcastDeleted = bRes.deletedCount;
    }

    // 4. Reset card_slots referencing this user
    if (nameRegex || emailRegex) {
      const occupiedSlots = await db.collection('card_slots').find({
        $or: [
          ...(nameRegex ? [{ organizer: nameRegex }] : []),
          ...(emailRegex ? [{ email: emailRegex }] : [])
        ]
      }).toArray();

      for (const slot of occupiedSlots) {
        await db.collection('card_slots').updateOne(
          { slotNumber: slot.slotNumber },
          {
            $set: {
              title: `Live Broadcast Channel Slot ${slot.slotNumber}`,
              url: null,
              isUnavailable: true,
              isDefault: true,
              organizer: '',
              clan: '',
              updatedAt: new Date().toISOString()
            }
          }
        );
      }
    }

    // 5. Reset tournament stats in users collection
    const userUpdateQuery = {};
    if (emailRegex) userUpdateQuery.email = emailRegex;
    else if (targetId) userUpdateQuery.id = targetId;

    if (Object.keys(userUpdateQuery).length > 0) {
      await db.collection('users').updateMany(
        userUpdateQuery,
        {
          $set: {
            matchesPlayed: 0,
            tournamentsWon: 0,
            walletBalance: '₹ 0',
            hostedTournaments: [],
            joinedTournaments: [],
            tournamentHistory: [],
            updatedAt: new Date().toISOString()
          }
        }
      );
    }

    // 6. Record administrative activity log
    const clientIp = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '103.211.54.12').split(',')[0].trim();
    const city = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '';
    const country = req.headers['x-vercel-ip-country'] || 'IN';
    const locationStr = city ? `${city}, ${country}` : 'Super Admin Command HQ';

    await db.collection('activity_logs').insertOne({
      id: 'act_' + Date.now(),
      userId: targetId || 'ADMIN',
      userName: targetName || targetEmail,
      userEmail: targetEmail,
      action: `Super Admin Cleared Tournament History for [${targetEmail || targetName}]`,
      ip: clientIp,
      location: locationStr,
      agreements: 'Tournament and Match History Permanent Purge',
      device: 'Super Admin HQ Console',
      time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true }) + ' IST',
      date: new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Tournament history permanently wiped for ${targetEmail || targetName}`,
      purged: {
        hostingDeleted,
        regDeleted,
        bcastDeleted
      }
    });
  } catch (error) {
    console.error('[API clear-tournament-history error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
