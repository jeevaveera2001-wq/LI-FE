import { connectToDatabase } from '../lib/mongodb.js';
import { verifyAdminToken, sanitizeNoSql } from '../lib/security.js';

const DEFAULT_SLOTS = [
  { id: 'slot-1', slotNumber: 1, title: 'Live Broadcast Channel Slot 1', url: null, game: 'BGMI', isUnavailable: true, isDefault: true },
  { id: 'slot-2', slotNumber: 2, title: 'Live Broadcast Channel Slot 2', url: null, game: 'PUBG Mobile', isUnavailable: true, isDefault: true },
  { id: 'slot-3', slotNumber: 3, title: 'Live Broadcast Channel Slot 3', url: null, game: 'Free Fire MAX', isUnavailable: true, isDefault: true },
  { id: 'slot-4', slotNumber: 4, title: 'Live Broadcast Channel Slot 4', url: null, game: 'Valorant', isUnavailable: true, isDefault: true }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vector 14: Sanitize against NoSQL injection
  req.body = sanitizeNoSql(req.body);
  req.query = sanitizeNoSql(req.query);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('card_slots');

    // GET /api/card-slots
    if (req.method === 'GET') {
      const saved = await collection.find({}).sort({ slotNumber: 1 }).toArray();
      if (!saved || saved.length === 0) {
        return res.status(200).json({ success: true, slots: DEFAULT_SLOTS });
      }

      // Merge with default 4 slots
      const merged = DEFAULT_SLOTS.map((def, idx) => {
        const found = saved.find(s => Number(s.slotNumber) === idx + 1);
        return found ? { ...def, ...found } : def;
      });

      return res.status(200).json({ success: true, slots: merged });
    }

    // POST /api/card-slots (Save/Assign slot - Admin only)
    if (req.method === 'POST') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required' });
      }

      const { slotNumber, slotData } = req.body || {};
      const num = Number(slotNumber);
      if (!num || num < 1 || num > 4) {
        return res.status(400).json({ success: false, error: 'slotNumber must be 1, 2, 3, or 4' });
      }

      const slotRecord = {
        slotNumber: num,
        ...slotData,
        isUnavailable: false,
        isDefault: false,
        updatedAt: new Date().toISOString()
      };

      await collection.updateOne(
        { slotNumber: num },
        { $set: slotRecord },
        { upsert: true }
      );

      return res.status(200).json({ success: true, slot: slotRecord });
    }

    // DELETE /api/card-slots (Reset slot to standby - Admin only)
    if (req.method === 'DELETE') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required' });
      }
      const num = Number(req.query.slotNumber || req.body?.slotNumber);
      if (!num || num < 1 || num > 4) {
        return res.status(400).json({ success: false, error: 'slotNumber must be 1, 2, 3, or 4' });
      }

      const resetRecord = {
        slotNumber: num,
        title: `Live Broadcast Channel Slot ${num}`,
        url: null,
        isUnavailable: true,
        isDefault: true,
        updatedAt: new Date().toISOString()
      };

      await collection.updateOne(
        { slotNumber: num },
        { $set: resetRecord },
        { upsert: true }
      );

      return res.status(200).json({ success: true, slot: resetRecord });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API card-slots error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
