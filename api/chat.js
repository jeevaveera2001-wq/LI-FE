import { connectToDatabase } from '../lib/mongodb.js';
import { sanitizeAiPrompt, sanitizeText, sanitizeNoSql, verifyAdminToken } from '../lib/security.js';

export const config = {
  runtime: 'nodejs'
};

const SEED_MESSAGES = [
  {
    id: 'msg_seed_1',
    roomId: 'global',
    roomTitle: 'Global Arena',
    sender: 'Jeeva Veeramani',
    senderEmail: 'jeevaveera2001@gmail.com',
    senderRole: 'VIP',
    senderClan: 'Venice kavyaa',
    message: 'Welcome everyone to the Live Tournaments Arena! Registrations are open for the BGMI Masters Championship.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isHost: false
  },
  {
    id: 'msg_seed_2',
    roomId: 'global',
    roomTitle: 'Global Arena',
    sender: 'Super Admin',
    senderEmail: 'superadmin@lt.in',
    senderRole: 'SUPERADMIN',
    senderClan: 'OFFICIAL',
    message: 'Fair play enforcement active across all lobbies. Practice scrims run daily at 7:00 PM and 8:30 PM IST.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    isHost: false
  },
  {
    id: 'msg_seed_3',
    roomId: 'global',
    roomTitle: 'Global Arena',
    sender: 'DevilPlayer',
    senderEmail: 'deviltest2026@gmail.com',
    senderRole: 'PLAYER',
    senderClan: 'Recruit Division',
    message: 'Looking for 1 assaulter for tonight Miramar lobby. Ping me if available!',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    isHost: false
  }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vector 14: Sanitize against NoSQL injection
  req.body = sanitizeNoSql(req.body);
  req.query = sanitizeNoSql(req.query);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('chat_messages');

    if (req.method === 'GET') {
      const roomId = req.query.roomId || 'global';
      const count = await collection.countDocuments();
      if (count === 0) {
        await collection.insertMany(SEED_MESSAGES);
      }

      const query = roomId === 'all' ? {} : { roomId };
      const messages = await collection
        .find(query)
        .sort({ timestamp: 1 })
        .limit(100)
        .toArray();

      return res.status(200).json({ success: true, roomId, messages });
    }

    // POST /api/chat (Hardened with AI Prompt Injection & Stored XSS filter - Vectors 10 & 11)
    if (req.method === 'POST') {
      const {
        roomId = 'global',
        roomTitle = 'Global Arena',
        sender,
        senderEmail,
        senderRole = 'PLAYER',
        senderClan = '',
        message,
        isHost = false
      } = req.body || {};

      if (!message || !String(message).trim()) {
        return res.status(400).json({ success: false, message: 'Message content is required' });
      }

      // Neutralize AI prompt injection delimiters and stored script tags
      const sanitizedMessage = sanitizeAiPrompt(String(message)).slice(0, 500);
      const sanitizedSender = sanitizeText(String(sender || 'Anonymous Competitor')).slice(0, 50);
      const sanitizedClan = sanitizeText(String(senderClan || '')).slice(0, 50);

      const newMsg = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        roomId: String(roomId),
        roomTitle: sanitizeText(String(roomTitle || 'Match Room')),
        sender: sanitizedSender,
        senderEmail: String(senderEmail || '').trim().toLowerCase().slice(0, 100),
        senderRole: String(senderRole || 'PLAYER'),
        senderClan: sanitizedClan,
        message: sanitizedMessage,
        timestamp: new Date().toISOString(),
        isHost: Boolean(isHost)
      };

      await collection.insertOne(newMsg);

      return res.status(201).json({ success: true, message: newMsg });
    }

    // DELETE /api/chat (Administrative SuperAdmin Only - Vector 2 IDOR Protection)
    if (req.method === 'DELETE') {
      const auth = verifyAdminToken(req);
      if (!auth) {
        return res.status(401).json({ success: false, error: 'Unauthorized: Admin privileges required to delete chat messages' });
      }

      const id = typeof req.query?.id === 'string' ? req.query.id : '';
      if (id) {
        await collection.deleteOne({ id });
      }
      return res.status(200).json({ success: true, message: 'Message deleted' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
