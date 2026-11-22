import { connectToDatabase } from '../lib/mongodb.js';

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

      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message content is required' });
      }

      const newMsg = {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        roomId: String(roomId),
        roomTitle: String(roomTitle || 'Match Room'),
        sender: String(sender || 'Anonymous Competitor').trim(),
        senderEmail: String(senderEmail || '').trim(),
        senderRole: String(senderRole || 'PLAYER'),
        senderClan: String(senderClan || ''),
        message: String(message).trim().slice(0, 500),
        timestamp: new Date().toISOString(),
        isHost: Boolean(isHost)
      };

      await collection.insertOne(newMsg);

      return res.status(201).json({ success: true, message: newMsg });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (id) {
        await collection.deleteOne({ id });
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
